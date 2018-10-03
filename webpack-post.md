# Webpack 4 tutorial

Webpack 4 has **a massive performance improvement** as zero configure module bundler.

# Getting quick started with zero conf of webpack 4

```sh
# Initialize package.json by running.
% npm init -y
# pull webpack 4
% npm i webpack --save-dev
# Install webpack-cli
% npm install webpack-cli --save-dev
```
Now open up package.json add a build script
```js
"scripts": {
    "build": "webpack"
}
```
Try to run command `npm run build` you will get Error, as the webpack4 is looking for **entry point** in `./src`. Starting from webpack4 there is no need to define the default a entry point. it will take `./src/index.js` as the default.

Add a file at `./src/index,js`. and run npm build again. Then you can get a bundled file in `./dist/main.js`. In **webpack 4 there is no need to define neither the entry point, nor the output file.**

# production and development mode

Having 2 configuration files is a common pattern in webpack.
A typical project may have.
- a **configuration file for dev**.
- a **configuration file for production**.

Change the package.json file like the following to setup two model of webpack.
```js
"scripts": {
  "dev": "webpack --mode development",
  "build": "webpack --mode production"
}
```
Run the command `npm run dev` and `npm run build` you will see the different between dev model and production model. Which at **Production model** will enables all sorts of optimizations out of box. Including minification, scope hoisting, tree-shaking and more.

# Example of overriding the default entry point/output.
```js
"scripts": {
  "dev": "webpack --mode development ./foo/src/js/index.js --output ./foo/main.js",
  "build": "webpack --mode production ./foo/src/js/index.js --output ./foo/main.js"
}
```
# Transpilling Js ES6 with Babel 7

Babel is a transformation tool that old version browser can understand the ES6. Use **babel-loader** is the webpack loader for transpiling ES6 to ES5.

Instal a bunch of dependencies.
```sh
% npm i @babel/core babel-loader @babel/preset-env --save-dev
```
Next up configure Babel by creating new file name as `.babelrc`. with following set
```js
{
    "presets": [
        "@babel/preset-env"
    ]
}
```
you have two way of configuration babel-loader to webpack.
- using creating a `webpacke.configure.js` file.
- using a option `--module-bind` in your npm script.

# Using babel-loader with a configure file.

Here we choice using webpack configure file to loader babel-loader.

Creating a new file named `webpack.config.js` and configure the loader:
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
```
There is no need to specify the entry point unless you want to customize it.
At `./src/index.js` write some ES6:
```js
const arr = [1, 2, 3];
const iAmJavascriptES6 = () => console.log(...arr);
window.iAmJavascriptES6 = iAmJavascriptES6;
```
Run npm build see the transpiliing.

# Using babel-loader without configure file.
overriding the package.json.
```js
"scripts": {
    "dev": "webpack --mode development --module-bind js=babel-loader",
    "build": "webpack --mode production --module-bind js=babel-loader"
  }
```
Run npm build the transpiling will be same.

# Setting up webpack 4 with React
Install React with:
```sh
% npm i react react-dom --save-dev
```
Add `babel-present-react`:
```sh
% npm i @babel/preset-react --save-dev
```
Configure the preset in `.babelrc`.
```js
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```
Add some react component in `./src/App.js`:
```js
import React from "react";
import ReactDOM from "react-dom";
const App = () => {
  return (
    <div>
      <p>React here!</p>
    </div>
  );
};
export default App;
ReactDOM.render(<App />, document.getElementById("app"));
```

# The HTML webpack plugin

Add the dependencies with:
```sh
% npm i html-webpack-plugin html-loader --save-dev
```
Update the webpack configure.
```js
const HtmlWebPackPlugin = require("html-webpack-plugin");
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/public/index.html",
      filename: "./index.html"
    })
  ]
};
```
Create an HTML file into `./src/public/index.html`.
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>webpack 4 quickstart</title>
</head>
<body>
    <div id="app">
    </div>
</body>
</html>
```
Run the build with:
```sh
% npm run build
```
And you can see the resulting HTML in the `./dist` folder. Open up `./dist/index.html` in your browser, you can see the react component working.

# extracting CSS to file

Install the plugin and css-loader with:
```sh
% npm i mini-css-extract-plugin css-loader --save-dev
```
Crete a CSS file for testing things out:
```js
/* */
/* CREATE THIS FILE IN ./src/main.css */
/* */
body {
    line-height: 2;
}
```
Configure both plugin and the loader:
```js
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
};
```
Finally import the CSS in the entry point:
```js
//
// PATH OF THIS FILE: ./src/index.js
//
import style from "./main.css";
```
run the build command of npm. Then you can see the CSS file created in `./dist` folder.
We should use **mini-css-extract-plugin** as the webpack 4 of css loader.

# The webpack dev server

Once you configure webpack dev server that will launch your application inside browser. And it will automagically refresh the browser's window, every time you change you file code.

To setup webpack dev server install the package with.
```sh
% npm i webpack-dev-server --save-dev
```
Open `package.json` and adjust the script like the following:
```js
"scripts": {
  "start": "webpack-dev-server --mode development --open",
  "build": "webpack --mode production"
}
```
Now run the `npm run start` command. Then you can see your application is running in the browser. 