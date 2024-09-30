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

> [!NOTE]
> If you get an error like "data not defined" when starting the Docker container for the first time and trying to open the application: Try to clear all localStorage from your browser.
