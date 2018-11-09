---
title: Learning React Hook
description: Take at a glance of this new feature of React in v16.7.0-alpha, which can be used to function component to setup state. 
tags: React, English, Javascript
image: https://cdn.stocksnap.io/img-thumbs/960w/8V46UZCS0V.jpg
---
# React hooks

Take at a glance of this new feature of React in v16.7.0-alpha, which can be used to function component to setup state. 

## State Hook
A simple example use `useState` api in the React:
```javascript
const INITIAL_LIST = [
  {
    id: '0',
    title: 'React',
    description: 'This is react description'
  },
  {
    id: '1',
    title: 'Java',
    description: 'This is java description'
  }
]

const Example = () => {
  // Declare a new state variable, which we'll call "count"
  const [list, setList] = useState(INITIAL_LIST);

  const onRemoveItem = (id) => {
    const nextList = list.filter(item => item.id !== id);
    setList(nextList)
  }

  return (
    <div>
      {list.map(item => {
        return (
          <li key={item.id}>
            <strong>{item.title}</strong>
            <h2>{item.description}</h2>
            <button type="button" onClick={() => onRemoveItem(item.id)}>
            Remove
            </button>
          </li>
        )
      })}

    </div>
  );
}
```
At is example code, we can conclude that, `useState` can use to add local state to the component (Only functional component, not work inside class). And only argument to `useState` is the initial state (State at here, doesn't have to be the object). And the **array destructuring** of javascript syntax at here, let us give different names to the state variables we declared by calling `useState`. Like `const [name, setName] = useState('alice')`.

## Effect Hook

Before the learning of `uesEffect` api of react, we need introduce this concept first. **Side-effect Logic**: In React class components, side-effects were mostly introduced in life-cycle methods (e.g. componentDidMount, componentDidUpdate, componentWillUnmount). A side-effect could be fetching data in React or interacting with the Browser API. Usually these side-effects came with a setup and clean up phase. 

Example code of `useEffect`:
```javascript
const EffectedButton = () => {
  const [isOn, setIsOn] = useState(true)
  const [timer, setTimer] = useState(0)

  useEffect(()=> {
    // this side-effect setup when mounting the component 
    // and the clean up when unmounting the component
    console.log('effect run')
    
    const interval = setInterval(
      () => isOn && setTimer(timer + 1), 
      1000
    );
    document.title = `You clicked ${timer} times`;
    return () => clearInterval(interval)
  });

  const resetTimer = () => {
    setIsOn(false);
    setTimer(0);
  }

  return (
    <div>
      {timer}
      { isOn ? (
        <button type="button" onClick={() => setIsOn(!isOn)}>
          Start
        </button>
      ) : (
        <button type="button" onClick={() => setIsOn(!isOn)}>
          Stop
        </button>
      ) 
      }
      <button type="button" disabled={timer===0}onClick={resetTimer}>
        Reset
      </button>
    </div>
  )
}
```
By using this Hook, you tell React that your component needs to do something after render. React will remember the function you passed, and call it later after performing the DOM updates. (This hook will runs both after the first render and after every update.) Every effect may return a function that cleans up after it. React performs the cleanup when the component unmounts. 

Every time we re-render, we schedule a different effect, replacing the previous one. In a way, this makes the effects behave more like a part of the render result — each effect “belongs” to a particular render. 

## Tip: Optimizing Performance by Skipping Effects

In some cases, cleaning up or applying the effect after every render might create a performance problem. In class components, we can solve this by writing an extra comparison wih `prevProps` or `prevState` inside `componentDidUpdate`.
```javascript
componentDidUpdate(prevProps, prevState) {
  if (prevState.count !== this.state.count) {
    document.title = `You clicked ${this.state.count} times`;
  }
}
```
This requirement is common enough that it is built into the useEffect Hook API. You can tell React to skip applying an effect if certain values haven’t changed between re-renders. To do so, pass an array as an optional second argument to useEffect:
```javascript
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // Only re-run the effect if count changes
```
Tips: You can pass an empty array [] a second argument. This will tell React that you effect doesn't depend on *any* values from props or state.

# Write custom Hooks

Like official doc said, The advantage of the Hooks is that it offer the flexibility of sharing logic that wasn't possible in React components before.

Here I rewrite a todo app where use a custom `useReduce` function.
```javascript
function todoReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, {
        id: state.length + 1,
        text: action.text,
        completed: false
      }];
    case 'delete':
      return state.filter(item => 
        item.id !== action.id
      )
    default:
      return state;
  }
}
```
This `TodoReducer` function include the some logics where I before use the `Redux` library.
```javascript
function useReducer(reduce, initialState) {
  const [state, setState] = useState(initialState)

  function dispatch(action) {
    const nextState = reduce(state, action)
    setState(nextState)
  }

  return [state, dispatch]
}
```
`useReducer` Hook that lets us manage the localhost state of our component with a reducer. Which is make our logic so simple, what more is that function can be reused at any component where we need to handle local state based on the customer reducer.

Now we could use it in our `Todo` component, and let the reducer drive its state management.

```javascript
const initialTodos = [
  {id: 1, text: "hello world", completed: false}
]

function Todos() {
  const [todos, dispatch] = useReducer(todoReducer, initialTodos);
  const [text, setText] = useState("")

  function handleAddClick(text) {
    dispatch({type: 'add', text })
    setText("")
  }

  function onChange(event) {
    setText(event.target.value)
  }

  function handleDeleteClick(id) {
    dispatch({type: 'delete', id})
  }

  return (
    <div>
      <input onChange={(e) => onChange(e)} value={text}/>
      <button onClick={() => handleAddClick(text)}>
        add
      </button>
      <ul>
      {todos.map( todo => 
        <div key={todo.id}>
          <li>{todo.text} &nbsp;
          <button onClick={() => handleDeleteClick(todo.id)}>
            Delete
          </button>
          </li>
        </div>
      )}
      </ul>
    </div>
  )
}
```


