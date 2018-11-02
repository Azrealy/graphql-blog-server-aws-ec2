---
title: React component pattern.
description: This tutorial is to introduce some react component pattern which used a lot in our project code. And show the use case of the different react component pattern.
tags: React, English, Javascript
image: https://cdn.stocksnap.io/img-thumbs/960w/58W79YWLRL.jpg
---
# React component pattern

This tutorial is to introduce some react component pattern which used a lot in our project code. And show the use case of the different react component pattern.

# React components

In the `React`, you can write a `class` components and `functional` components. (Sometimes the `functional` component also be called as the stateless component) The following code snippet shows a example of `Navigator` component defined as a `class` component and a `functional` component.
```javascript
import React
// class component
class Navigator extends React.Component {
  render () {
    return (
      <header>
        <ul>
          <li> React {this.props.version || 16 } </li>
          <li> Redux </li>
        </ul>
      </header>
    )
  }
}

// functional component
const Navigator = ({ version }) => {
  return (
    <header>
      <ul>
        <li> React {version || 16 } </li>
        <li> Redux </li>
      </ul>
    </header>
  )
}
```
Both `functional` component and `class` component can render the DOM, but the use case of those components are different.

* When your React component will have to store the state or need to use a life-cycle hook, you should use the `class` component. Like you want fetch the data from the API server and render it. Or like login UI which alway need to handle the input state of password and username.

* Use the ES5 arrow functions to define the `functional` component, the syntax will like much simple, and you can skip use the `return` and `function` keywords by use a pair of curly brackets.

* No matter which pattern of react component you used, the `import react` statement is required.

# Pure components

Based on the concept of purity in functional programming paradigms, a function is said to be pure if:

* its return value is only determined by its input values.
* its return value is always the same for the same input values.

A React component can be considered pure if it renders the same output for the same state and props. For class components like this, React provides the `PureComponent` base class. Class components that extend the `React.PureComponent` class are treated as pure components.

As the documentation of [`React.PureComponent`](https://reactjs.org/docs/react-api.html#reactpurecomponent) said, `PureComponent` is implement the `shouldComponentUpdate()` hooks, which can be use fo a performance boost in some cases. That why sometimes use `pureComponent` to optimize React applications because it reduces the number of render operation in the application.

Let's look at the performance aspect of `PureComponent` and `functional` component.

```javascript
import React from 'react';

class Welcome extends React.PureComponent {  
  render() {
    return <h1>Welcome</h1>
  }
}

Hello = () => {
  return <h1>Hello</h1>;
}
```
When you use these two in your Parent Component, you will see `Hello` component will re-render whenever Parent Component will re-render but `Welcome` Component will not.

This is because PureComponent changes the life-cycle method `shouldComponentUpdate()` and adds some logic to automatically check whether a re-render is required for the component. This allows a `PureComponent` to call method render only if it detects changes in `state` or `props`.

The use case of Pure Component:
* Which is use to avoid the re-rendering the same props or state, like use case of rendering **user info** component, the props and state not need often re-rendering when the parent component change the state or props.

# Higher-order component (HOC)

Concretely, **a higher-order component is a function that takes a component and returns a new component**.

These components can be used for multiple use cases. Here I want to pick out one use case, the conditional rendering with HOC to introduce the HOC.

Look at the code snippet of the conditional rendering of the `functional` component `TodoList`:
```javascript
const TodoList = ({ todos }) => {

  if (!todos) {
    return null;
  }

  if (!todos.length) {
    return (
      <div>
        <p>You have no Todos.</p>
      </div>
    );
  }

  return (
    <div>
      {todos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
    </div>
  );
}
```
First, try to create a HOC to remove the case from the `TodoList` where the `todos` are null. HOC often come with the naming prefix `with`, but it is not mandatory. In the end, it makes it easier to distinguish a React component from a HOC.
```javascript
function withTodosNull(Component) {
  return function (props) {
    return !props.todos
      ? null
      : <Component { ...props } />
  }
}
```
At here `withTodosNull` is a HOC, which takes a Component as the input and base the condition return `null` or `Component`. All the props are passed - further down the component tree - to the input component. For instance, if you would use the `withTodosNull` HOC to enhance the `TodoList`, the latter would get all the props passed through the HOC as input with the [JavaScript spread operator.](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Spread_syntax).

Also we can make the HOC more concisely, use the [JavaScript ES6 arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions):
```javascript
const withTodosNull = (Component) => (props) =>
  !props.todos
    ? null
    : <Component { ...props } />
```
Finally let use the HOC to help `TodoList` remove the Null condition.
```javascript
const withTodosNull = (Component) => (props) =>
  ...

const TodoList = ({ todos }) => {
  // Removed conditional rendering with null check
  if (!todos.length) {
    return (
      <div>
        <p>You have no Todos.</p>
      </div>
    );
  }

  return (
    <div>
      {todos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
    </div>
  );
}

const TodoListWithNull = withTodosNull(TodoList);

function App(props) {
  return (
    <TodoListWithNull todos={props.todos} />
  );
}
```
That’s it. As you can see, you can use it whenever you need it. Higher order components are reusable.

Then let's implement the other HOC for the condition of `todo.length` is zero.
```javascript
const withTodosEmpty = (Component) => (props) =>
  !props.todos.length
    ? <div><p>You have no Todos.</p></div>
    : <Component { ...props } />
```
Let’s use all HOCs for our `TodoList` component.
```javascript
const withTodosNull = (Component) => (props) =>
  ...

const withTodosEmpty = (Component) => (props) =>
  ...

function TodoList({ todos }) {
  ...
}

const TodoListWithConditionalRendering = withTodosNull(withTodosEmpty(TodoList));

function App(props) {
  return (
    <TodoListThree
      todos={props.todos}
      isLoadingTodos={props.isLoadingTodos}
    />
  );
}
```
HOC has been used in a lot of react libs, like the `connect` HOC in the Redux, `withRouter` HOC in the Router and `withStyles` HOC in the material-ui. The use case of HOC is versatile, like you can make a HOC to authenticate JWT, then this HOC can be used to render the private component of the user like `UserHomePage` component. Also there are some considerations of HOC:
* A HOC should be a pure function with no side-effects. It should not make any modifications and just compose the original component by wrapping it in another component.
* Do not use HOC’s in the **render method of a component**. Access the HOC outside the component definition.
* Refs are not passed through.

# Presentational and Container Components

The presentational components use case:
* Are concerned with how things look. Like the styled component.
* Alway use as the `functional` components, it just focus on the render DOM markup and styles.
* Don’t specify how the data is loaded or mutated.
* Take the actions passed from the Container Components.
* Example: MenuBar, UserInfo, Table

The Container Components use case:
* Are concerned with how things work. Like fetch data to render.
* It don’t have any DOM markup of their own except for some wrapping divs, and never have any styles.
* Are often stateful and write as `class` component, they tend to serve as data sources.
* Provide the data and behavior to presentational or other container components.
* Are usually generated using higher order components such as `connect()` from React Redux, 
* Examples: UserPage, FollowersSidebar, StoryContainer.