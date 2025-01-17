# STAT - Frontend

This application is a web application utilizing the Statistical Timeseries Analysis Toolkit (STAT) python library. STAT
helps researchers and analysts to test out different data preparation pipelines interactively. A link to the library 
can be found [here](https://github.com/Darnol/mp_backend_draft).

## User Guide

- Refer to the USERGUIDE.md

## Developers Guide

This section aims to provide an overview of the project structure, design decisions, run instructions and details about
extendability.

### Project Structure

- `assets/` - Contains all the images and other assets used in the project. To improve customizability and integration with React, SVGs are used.
- `components/` - Contains all the React components used in the project. Each component is a separate folder containing the component file and its styles.
    - `buttons/` - Configurable buttons used throughout the project.
      - `MinusButton` - A button with a '-' SVG. Expects a function to call as a parameter.
      - `PlusButton` - A button with a '+' SVG. Expects a function to call as a parameter.
      - `PrimaryButton` - The primary button used throughout the application. Expected parameters are:
        - **text** - The text displayed in the button.
        - **action** - The function that should be called when the button is clicked.
        - **size** - The size of the button in pixels. Height is 1/4 of the provided number and the text size also changes dynamically. The default is 200.
        - **disabled** - A boolean value which controls the disabled property of the button.
    - `charts/` - Contains not only the charts the application supports, but also other views that display the data in the selected block.
      - `CSVVeiwer` - This component displays the first 20 rows of the uploaded data in a tabular format. Expected parameters:
        - **blockId** - The id of a block. When the id is provided, the block data is selected by the component from the redux store.
        - **small** - This boolean value controls the size of the displayed table.
      - `LineChart` - This component utilizes the D3 React library to create a line chart. It calculates min/max values from the provided list of data points and dynamically changes the size of the chart based on window and component resize events. The expected parameter is:
        - **block** -  A Block model which contains output data which then can be displayed.
      - `DescriptiveStatistics` - This component lists various descriptive statistic values for each feature of the input (mean, median, Standard Deviation, Data Coverage)
      - `BoxPlot` - This component creates a visual representation of descriptive statistics in the form of block plots for each feature of the initial dataset. It's a deprecated visual component, substituted by `ViolinPlot`.
      - `ViolinPlot` - This component creates a visual representation of descritive statistics (IQR 0,25 - 0,75, median, distribution of observations and confidence interval assuming a normal distribution ) in the form of ViolinPlon for each feature of the input dataset.

    - `controls/` - This folder holds all the configuration components that are used to configure the different steps in the data pre-processing pipeline. Filters, knobs, sliders, etc. are all found here. The components are based on [primereact](https://primereact.org/) components.
      - `ControlTitle` - This is the title component used in the different control components. It's attributes are:
        - **title** - The title of the control.
        - **margin** - The margin of the title. This is an optional parameter. If not provided, then ***auto*** margin is used.
      - `DropdownControl` - This component is used to create a dropdown control. The expected parameters are:
        - **title** - The title of the control.
        - **options** - The options that can be selected in the dropdown.
        - **placeHolder** - The placeholder which is displayed when no option is selected.
        - **columnSpan**/**rowSpan** - Defines the size of the dropdown based on the grid system of the `ControlSection`.
        - **defaultValue** - The default value of the dropdown.
      - `FilterControl` - This component is used to create a filter control for boolean values. The expected parameters are:
        - **title** - The title of the control.
        - **value** - The value of the filter, true or false.
        - **onLabel** - The label displayed when the filter is true.
        - **offLabel** - The label displayed when the filter is false.
        - **columnSpan**/**rowSpan** - Defines the size of the filter based on the grid system of the `ControlSection`.
        - `InputControl` - This component is used to create an input control used to directly input values. The expected parameters are:
          - **title** - The title of the control.
          - **unit** - The unit of the input.
          - **columnSpan**/**rowSpan** - Defines the size of the dropdown based on the grid system of the `ControlSection`.
      - `KnobControl` - This component is used to create a knob control which can be used to tweak a numeric value. The expected parameters are:
        - **title** - The title of the control.
        - **min** - The minimum value of the knob.
        - **max** - The maximum value of the knob.
        - **step** - The step of the knob.
        - **start** - The value at which the knob starts at.
        - **columnSpan**/**rowSpan** - Defines the size of the dropdown based on the grid system of the `ControlSection`.
      - `MultiSelectControl` - Similar to the `DropdownControl`, but allows multiple selections.
      - `RangeSelectionControl` - This control is used to select a range of numbers. The expected parameters are:
        - **title** - The title of the control.
        - **range** - Is a list of two number (min/max).
        - **start** - The value at which the range starts at.
        - **columnSpan**/**rowSpan** - Defines the size of the dropdown based on the grid system of the `ControlSection`.
        - `SliderControl` - This component is used to create a slider control and manipulate a numeric value. Differs from the `KnobControl`only visually. The expected parameters are:
          - **title** - The title of the control.
          - **min** - The minimum value of the knob.
          - **max** - The maximum value of the knob.
          - **step** - The step of the knob.
          - **start** - The value at which the knob starts at.
          - **columnSpan**/**rowSpan** - Defines the size of the dropdown based on the grid system of the `ControlSection`.
    - `customReactFlow/` - Here customized ReactFlow elements are stored. Custom nodes and edges which support the functionality of the STAT-library.
      - `CustomEdge` - This component is used to create a custom edge between two nodes. It extends the **BaseEdge** from ReactNode while adding the delete functionality. The expected parameters are:
        - **id** - The id of the edge which is the combination of the source and target nodes id. <sourceNodeId>-<targetNodeId>.
        - **sourceX, sourceY, targetXm  targetY** - ReactNode properties defining the position of the edge.
      - `CustomNode` - This node component uses **Handle** and **Position** from ReactFlow to create a custom node. Apart from the custom styling, the added functionality is the ability to delete a node from the pipeline by calling a function in the pipelineSlice.
      - `CustomStartNode` - Is similar to `CustomNode`, but has no starting **Handle** as it is the start of the pipeline. 
    - `pageElements/` - Contains all the components that are used in the different pages of the application and are not related to a specific page. This includes loading and popup components.
      - `Loading` - This component is used to blur the page and indicate the loading state of the application. It is used throughout the application in various components.
      - `Popup` - This a generic component is used to display a popup with a title and any content. The expected parameters are:
        - **title** - The title of the popup.
        - **children** - The content which should be displayed in the popup.
      - `ErrorPopup` - Specialized instance of Pop-up, displays error messages registered in pipeline.
    - `pages/` - The pages to which one can navigate to are stored here. 
      - `HomePage` is the main entry point of the application. A welcome message is displayed stating the functionality of the application as well as a button with which the user can upload a CSV file to start the data exploration. If the user visited and interacted with the application before, the resume button enables the user to continue where she/he left off. 
      - `MainPage` is where the uploaded data can be processed, configured and visualized using blocks, controls and other visual elements.
    - `sections/` - Contains the different sections within the application. These sections are shown in the `MainPage` and are separated to improve the readability and maintainability of the code.
      - `ControlSection` - The control section is located at the bottom right corner of the application. It dynamically renders different controls based on the configuration of the selected block. Thanks to its grid layout system, the controls can be configured to take up more than one grid-cell if required.
      - `PipelineHistory` - This section is the ribbon above the main visualization. It takes all the blocks in the pipeline and creates a small visualization for each one of them in a compact and scrollable view. Each small section can be clicked to select the respective block in the pipeline.
      - `StepsSection` - This section is located to the right of the main visualization. It displays the whole pipeline with its blocks and edges. It utilizes ReactFlow to create a Directed Acyclic Graph (DAG). It fetches the nodes and edges, tries to sort them and. The logic to connect two blocks is also located in this component.
      - `VizSection` - The main part of this section is the chart which displays the data in the selected block. As an addition, this section controls the display of the `ControlSection`and `PipelineHistory`. They can be displayed/hidden and expanded/minimized.
      - `DataLoaderSection` - The DataLoader Section combines the charts of `DescriptiveStatistics`, `ViolinPlot` and `CSVViewer`. It's only displayed above the `LineChart` when the `DataLoader` block is selected.
    - `tables/` - This folder contains all tables not related to a block directly.
      - `PreviewTable`displays the data to the user before it is uploaded and added to the pipeline.
- `fonts/` - Contains the fonts used in the project.
  - `gaoel-1/` - This is the folder that contains all font files.
- `redux/` - Contains the different Redux slices that are used in the project. Each slice is a separate file and contains the actions, reducers and selectors for a specific part of the application (data & pipeline).
  - `dataSlice` - Contains the actions, reducers and selectors for the data part of the application. This includes the uploaded raw data as well as the filtered data.
  - `pipelineSlice` - Contains the actions, reducers and selectors for the pipeline part of the application. This includes the pipeline, blocks and edges. The API requests to the backend are sent via AsyncThunks to persist the state of the Redux store.
- `service/` - All the API calls made by the application are stored here. Each entity has its own file with the respective CRUD calls.
  - `blockService` - Contains the CRUD calls for the blocks.
  - `edgeService` - Contains the CRUD calls for the edges.
  - `pipelineService` - Contains the CRUD calls for the pipeline.
  - `dataService` - Contains requests related to the uploaded data.
- `types/` - Contains the types used throughout the project.
  - `dataTypes` - Contains the most important types used throughout the project. **PipelineModel** and **DataPoint** are the most important ones.
  - `nodeTypes` - Contains the custom ReactFlow-Node types.
  - `responseTypes` - Contains the return types of the backend-API calls.
- `util/` - A collection of utility functions used throughout the project.
  - `util` - All utility functions used in the project are stored here. This includes functions for data processing, data visualization, etc.
- `App.css` - The global styles and font config of the application can be found here.
- `App.tsx` - The entry point of the application. The routing and the main structure of the application are defined here.
- `hooks.ts` - Contains the ***useAppDispatch*** and ***useAppSelector*** hooks which are used to access the Redux store.
- `index.tsx` - The root of the application. The mother of all components.
- `store.ts` - The Redux store is created here. The store is configured with the different slices and a persistor to keep application data even after a page has been reloaded.

### Design Decisions

- **TypeScript** - TypeScript was chosen as the language for the project due to its static typing, which helps to catch errors early in the development process. This is especially important in a project with a lot of data processing and visualization, as it helps to prevent errors in the data pipeline.
- **ReactFlow** - As the STAT python library uses the concept of a Directed Acyclic Graph (DAG) to represents the pipeline, a React library which supports this needed to be chosen. After looking at multiple options, the choice fell on ReactFlow due to its simplicity, extensive out-of-the-box functionality and high customizability. Here is a link to the [ReactFlow documentation](https://reactflow.dev/).
- **Redux** - Already at the beginning of the project, it was evident that the application would need a global state management solution. Redux was chosen due to its popularity, extensive documentation and the fact that it is widely used in the React community. Another supporting factor is that Redux has been used by the developers in different projects before. Here is a link to the [Redux documentation](https://redux.js.org/).
- **PrimeReact** - The application uses PrimeReact components for the controls. There are many other libraries that could have been used, but as the controls are heavily customized, the first option that provides the basic functionality which we could build on was chosen. Here is a link to the [PrimeReact documentation](https://primereact.org/).
- **D3** - D3 is used to create the charts in the application. D3 is a powerful library that provides a lot of functionality to create different types of charts. The choice fell on D3 as it is widely used in the data visualization community and provides a lot of flexibility and customizability. Here is a link to the [D3 documentation](https://d3js.org/).
- **styled-components** - To improve the maintainability and readability of the code, styled-components were used to style the components. This allows for the separation of concerns and the creation of reusable and configurable components. Here is a link to the [styled-components documentation](https://styled-components.com/).
- **React-DOM** - The navigation from page-to-page is done using React-DOM. This was chosen as it is a simple and widely used solution to navigate between different pages in a React application. Here is a link to the [React-DOM documentation](https://reactrouter.com/).

### Run Instructions

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### Docker instruction

Built docker container

`docker build -t stat:0.1.0 .`

Run docker container
`docker run -p 3000:3000 stat:0.1.0`

> If you get an error like "data not defined" when starting the Docker container for the first time and trying to open the application: Try to clear all localStorage from your browser.

### Extendability

The application is designed to be easily extendable. Adding different visualization types, controls or other elements should be straightforward.

#### Add a new control
To add a new control follow these steps:
1. Create a new file in the `controls/` folder and copy the contents of the most similar control. 
2. Use and modify an existing control from the [PrimeReact](https://primereact.org/installation/) website by expanding the ***Components*** pane on the left or create a new one from scratch.
3. Edit the required functional parameters.
4. Make sure to update the ***action*** function by dispatching the ***updateControl*** action from the `pipelineSlice`.

> Tip: Try to use the already existing Styled Components to keep the design consistent.


#### Add a new chart
The charts visualize data in a block. To add a new chart follow these steps:
1. Select a chart library that fits the requirements of the new chart. D3 is recommended for custom charts.
2. Create a new file in the `charts/` folder with the name of your chart.
3. Fetch the block data from the Redux store using the blockId provided as a parameter.
4. Convert the outputs of the block to the required format of the chart library. 
    > You can use the ***convertToDataPoints*** function from `util.ts` to convert the output into a list of x and y values, or create your own function to convert the data into the desired format
5. Make sure the chart supports multiple data points (lines) and can be resized dynamically.
6. Configure the `VizSection` to display the new chart when the desired condition is met.

> Tip: Use the `LineChart` as a template for the new chart.

#### Add a new custom node or edge
To add a new custom node or edge similar to the ones found in the `customReactFlow/` folder follow these steps:
1. Create a new file in the `customReactFlow/` folder with the name of your node or edge.
2. Copy the contents of the most similar node or edge.
3. Modify the design or functionality to meet your needs.
4. Export the new node or edge.
5. Add it to the **NodeTypes** or **edgeTypes** defined in the `StepsSection` component.

```ts
// Add custom node example
const NodeTypes = {
    customNode: CustomNode, 
    customStartNode: CustomStartNode
};
// Add custom edge example
const edgeTypes = {
    'custom-edge': CustomEdge
}
// ...
// Add the custom nodes and edges to the ReactFlow component
<ReactFlow
//...
nodeTypes={NodeTypes}
edgeTypes={edgeTypes}
//...
/>
```