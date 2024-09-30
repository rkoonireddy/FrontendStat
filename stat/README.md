# STAT - Frontend

This application is a web application utilizing the Statistical Timeseries Analysis Toolkit (STAT) python library. STAT
helps researchers and analysts to test out different data preparation pipelines interactively. A link to the library 
can be found [here](https://github.com/Darnol/mp_backend_draft).

## User Guide

- TODO: George

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
    - `pageElements/` - Contains all the components that are used in the different pages of the application and are not related to a specific page. This includes loading and popup components.
    - `pages/` - The pages to which one can navigate to are stored here. The `HomePage` is the main entry point of the application, while the `MainPage` is where the uploaded data can be processed, configured and visualized.
    - `sections/` - Contains the different sections within the application. These sections are shown in the `MainPage` and are separated to improve the readability and maintainability of the code.
    - `tables/` - The `PreviewTable`component is stored here as well as any other tables that will be added to the application in the future.
- `fonts/` - Contains the fonts used in the project.
- `redux/` - Contains the different Redux slices that are used in the project. Each slice is a separate file and contains the actions, reducers and selectors for a specific part of the application (data & pipeline).
- `sercice/` - All the API calls made by the application are stored here. Each entity has its own file with the respective CRUD calls.
- `types/` - Contains the types used throughout the project.
- `util/` - All utility functions used in the project are stored here. This includes functions for data processing, data visualization, etc.

### Design Decisions


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