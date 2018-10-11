---
title: Minimal Node.js with babel setup.
description: Initial minimal Node.js with babel setup.
tags: Webpack, English, Nodejs
image: https://cdn.stocksnap.io/img-thumbs/960w/Y01VDYAX63.jpg
---
# Minimal Node.js with babel setup.

## Node.js Project setup

Create project root directory.
```bash
mkdir my-project-name
cd my-project-name
```
Initialize this folder as npm project. By giving it the `-y` shorthand flag for telling the npm take all the defaults sets.
```bash
npm init -y
```
If you want change the defaults, you can use the following command or change the `package.json` file directly.
```bash
npm config list

npm set init.author.name "<Your Name>"
npm set init.author.email "you@example.com"
npm set init.author.url "example.com"
npm set init.license "MIT"
```
After setting up your npm project configure, create a `./src` folder to store the resource code.
```bash
mkdir src
cd src
touch index.js
```
try the `console.log` statement in the `src/index.js`,
```bash
console.log('hello world')
```
then got to command line run this file with Node.js.
```bash
node index.js
```
The logging of the statement should appear on you command line,after executing the script. Next add this script for into `package.json` file.
```bash
{
  ...
  "main": "index.js",
  "scripts": {
    "start": "node src/index.js"
  },
  "keywords": [],
  ...
}
```
you can run the same script use `npm start`. Install the `nodemon` lib for help you starting the script every time.
```bash
npm install nodemon --save-dev
```
Afterward, exchange `node` with `nodemon` in `package.json`.
```bash
{
  ...
  "main": "index.js",
  "scripts": {
    "start": "nodemon src/index.js"
  },
  "keywords": [],
  ...
}
```
Then when you run your application with `npm start` command, you should see that it keeps running.

## Node.js with Babel

Babel that you can use the new feature of js language. Install `babel-cli` on the command line:
```bash
npm install babel-cli --save-dev
```
Then you can add it to your npm start script:
```bash
{
  ...
  "main": "index.js",
  "scripts": {
    "start": "nodemon --exec babel-node src/index.js"
  },
  "keywords": [],
  ...
}
```
Then under the hood, Babel transpiles your code into vanilla Js. More info your should know is new feature in the js language are introduced in stages. So when looking for a particular feature for the js, you have to check at which stage it appears.

Following will shows you how to introduce all JavaScript features up to stage 2. First, install the necessary dependencies on the command line:
```bash
npm install babel-preset-env babel-preset-stage-2 --save-dev
```
Next you can use these dependencies directly in your npm start script:
```js
{
  ...
  "main": "index.js",
  "scripts": {
    "start": "nodemon --exec babel-node --presets env,stage-2 src/index.js"
  },
  "keywords": [],
  ...
}
```
Choose more simple way of doing it, create a `.babelrc` file.
```bash
touch .babelrc
```
In this config file for Babel, you can include the two recently installed dependencies for unlocking the upcoming JS feature.
```
{
 "presets": ["env", "stage-2"]
}
```