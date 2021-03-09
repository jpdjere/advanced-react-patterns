// Prop Collections and Getters
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {Switch} from '../switch'

function callAll(...fns) {
  // Return a function that takes any number of arguments
  return (...args) => {
    fns.forEach(fn => {
      // If the function exists, call it passing down all its arguments
      fn && fn(...args)
    })
  }
}

function useToggle() {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)

  return {on, toggle, getTogglerProps: ({onClick, ...props}) => ({
    ...props,
    onClick: () => {
      toggle();
      onClick && onClick()
    }
    // Instead of composing like in the previous line, 
    // now with callAll we can do:
    // onClick: callAll(onClick, toggle)
    // And callAll will only call the functions if they exist.  
  })}
}

function App() {
  const {on, getTogglerProps} = useToggle()
  return (
    <div>
      <Switch on={on} {...getTogglerProps({on})} />
      <hr />
      <button 
        
        {...getTogglerProps({
          'aria-label': "custom-button",
          onClick: () => console.info('onButtonClick')
        })}
      >
        {on ? 'on' : 'off'}
      </button>
    </div>
  )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/
