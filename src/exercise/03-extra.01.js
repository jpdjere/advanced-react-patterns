// Flexible Compound Components
// http://localhost:3000/isolated/exercise/03.js

import * as React from 'react'
import {Switch} from '../switch'

// 🐨 create your ToggleContext context here
// 📜 https://reactjs.org/docs/context.html#reactcreatecontext
const ToggleContext = React.createContext();
ToggleContext.displayName = "ToggleContext";

function Toggle({onToggle, children}) {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)

  return (
    <ToggleContext.Provider value={{on, toggle}}>{children}</ToggleContext.Provider>
  )
}

// 🐨 we'll still get the children from props (as it's passed to us by the
// developers using our component), but we'll get `on` implicitly from
// ToggleContext now
// 🦉 You can create a helper method to retrieve the context here. Thanks to that,
// your context won't be exposed to the user
// 💰 `const context = React.useContext(ToggleContext)`
// 📜 https://reactjs.org/docs/hooks-reference.html#usecontext
function useToggleContext() {
  const context = React.useContext(ToggleContext);
  if(!context) {
    throw new Error("useToggleContext should be used within the Toggle component or its children")
  }
}

function ToggleOn({children}) {
  const { on } = useToggleContext();
  return on ? children : null
}

// 🐨 do the same thing to this that you did to the ToggleOn component
function ToggleOff({children}) {
  const { on } = useToggleContext();
  return on ? null : children
}

// 🐨 get `on` and `toggle` from the ToggleContext with `useContext`
function ToggleButton(props) {
  const { on, toggle } = useToggleContext();
  return <Switch on={on} onClick={toggle} {...props} />
}

const App = () => <ToggleButton />;

export default App

/*
eslint
  no-unused-vars: "off",
*/
