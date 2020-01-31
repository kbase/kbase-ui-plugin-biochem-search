# KBase UI Plugin - biochem Search

[ to be written... ]

## How to Develop

- in a working directory, clone kbase-ui and this repo

    ```bash
    git clone -b develop https://github.com/kbase/kbase-ui
    git clone https://github.com/kbase/kbase-ui-plugin-biochem-search
    ```

- start up the ui with the biochem-search plugin overlaid:

    ```bash
    cd kbase-ui
    make dev-start env=dev build=dev build-image=t plugins="biochem-search"
    ```

- map ci.kbase.us to localhost:

    ```bash
    sudo vi /etc/hosts
    127.0.0.1	ci.kbase.us
    ```

- biochem-search should be on the hamburger menu

- you now should be able to enter the edit / save /refresh loop, edit and save biochem-search, then reload the browser to see your changes.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the `src/react-app` directory, you can run:

### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

