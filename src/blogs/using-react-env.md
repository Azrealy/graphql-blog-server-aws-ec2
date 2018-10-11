---
title: Using environment variable for you React project
description: You can pass the `environment variable` to the global process.env Object. That global Object is provided by your environment through NodeJS. And because we don't have NodeJs in the browser, we're going to need webpack.
tags: Deploy, React
image: https://cdn.stocksnap.io/img-thumbs/960w/YQ5HTMOKU3.jpg
---
# Using environment variables in React 

## The problem we're solving::

> How to declare different API url's for your **local development** build and **production** build.

In short: environment variables:
You can pass the `environment variable` to the global process.env Object. 
That global Object is provided by your environment through NodeJS. And because we
don't have NodeJs in the browser, we're going to need webpack.

## Setting using the environment variables

Setting environment variable with using **npm script** and using an `.env` file.
* Using npm scripts:
```bash
npm install -save-dev webpack webpack-cli
```
Modify you `package.json` file:
```javascript
{
  // the rest of your package.json
  scripts: {
    "dev": "webpack --config webpack.config.dev.js",
    "build": "webpack --config webpack.config.build.js"
  }
}
```
use the `--env` flag in scripts
```javascript
{
  // the rest of your package.json
  scripts: {
    "dev": "webpack --env.API_URL=http://localhost:8000 --config webpack.config.dev.js",
    "build": "webpack --env.API_URL=https://www.myapi.com --config webpack.config.build.js"
  }
}
```
Use your setting env in your react component `process.env.API_URL`.
But you need following module to handle the env variable import the Value.
```javascript
module.exports = (env) => {
  // create a nice object from the env variable
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  return {
    plugins: [
      new webpack.DefinePlugin(envKeys)
    ]
  };
};
```
* Using an .env file to set environment variable.

Add the `.env` file name to your `.gitignore` and create a `.env` file to root directory. And the env variable like `API_URL=http://localhost:8000` to your `.env` file.

For handle the `.env` should install the following dependence. 
```bash
npm install --save-dev dotenv
```

## For the app started from `create-react-app`.

We can use the env variable name start like `REACT_APP_` this will automatically handle the `.env` file value to you react app.

For setting variable in script can be like:
```javascript
"scripts": {
  "start": "REACT_APP_SECRET_CODE=123 react-scripts start",
  ...
}
```

* Using values
Imported values are placed in `process.env `automatically. 
They do not need to be imported manually. Imported values can be used in the same way as those defined in your JS files:
```javascript
if (process.env.NODE_ENV === 'production') { ... }
    app.listen(process.env.REACT_APP_PORT);
```
Remember start variable with `REACT_APP_`.

* Create-react-app environment configuration.

See the article here [environments-with-create-react-app](https://medium.com/@tacomanator/environments-with-create-react-app-7b645312c09d)