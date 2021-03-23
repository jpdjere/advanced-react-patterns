// Control Props
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {Switch} from '../switch'
import warning from 'warning';

const callAll = (...fns) => (...args) => fns.forEach(fn => fn?.(...args))

const actionTypes = {
  toggle: 'toggle',
  reset: 'reset',
}

function toggleReducer(state, {type, initialState}) {
  switch (type) {
    case actionTypes.toggle: {
      return {on: !state.on}
    }
    case actionTypes.reset: {
      return initialState
    }
    default: {
      throw new Error(`Unsupported type: ${type}`)
    }
  }
}

function useToggle({
  initialOn = false,
  reducer = toggleReducer,
  onChange,
  on: controlledOn,
  // Add support for readOnly components
  readOnly = false

} = {}) {
  const {current: initialState} = React.useRef({on: initialOn})
  const [state, dispatch] = React.useReducer(reducer, initialState)

  const onIsControlled = controlledOn != null;
  const on = onIsControlled ? controlledOn : state.on;

  // Create a ref with the initial value of whether the component
  // is control, to compare when the component is upadted. Then use
  // it to compare with the new version of "onIsControlled"
  const { current: onWasControlled } = React.useRef(onIsControlled);
  React.useEffect(() => {
    warning(
      !(onIsControlled && !onWasControlled),
      "use Toggle is changing from uncontrolled to controlled. Components should not switch from uncontrolled to controlled (or vice versa). Decide between using a controlled or uncontrolled useToggle for the lifetime of the component. Check the 'on' prop."
    )
    warning(
      !(!onIsControlled && onWasControlled),
      "use Toggle is changing from uncontrolled to controlled. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled useToggle for the lifetime of the component. Check the 'on' prop."
    )
  })

  // Check if onChange is defined with "hasOnChange" and check if the component
  // is controlled. If the component is controlled, but has no "onChange", display
  // the warning. Also, don't show the warning if the optional "readOnly" prop
  // is set to true.
  const hasOnChange = !!onChange;
  React.useEffect(() => {
    warning(!(!hasOnChange && onIsControlled && !readOnly), "Warning: You provided an on prop to the Toggle but no onChange prop. This will render a read only component.")
  }, [hasOnChange, onIsControlled, readOnly])


  function dispatchWithOnChange(action) {
    if(!onIsControlled) {
      dispatch(action);
    }
    onChange && onChange(reducer({...state, on}, action), action);
  }
 
  // 🦉 "Suggested changes" refers to: the changes we would make if we were
  // managing the state ourselves. This is similar to how a controlled <input />
  // `onChange` callback works. When your handler is called, you get an event
  // which has information about the value input that _would_ be set to if that
  // state were managed internally.
  // So how do we determine our suggested changes? What code do we have to
  // calculate the changes based on the `action` we have here? That's right!
  // The reducer! So if we pass it the current state and the action, then it
  // should return these "suggested changes!"
  //
  // 💰 Sorry if Olivia the Owl is cryptic. Here's what you need to do for that onChange call:
  // `onChange(reducer({...state, on}, action), action)`
  // 💰 Also note that user's don't *have* to pass an `onChange` prop (it's not required)
  // so keep that in mind when you call it! How could you avoid calling it if it's not passed?

  // make these call `dispatchWithOnChange` instead
  const toggle = () => dispatchWithOnChange({type: actionTypes.toggle})
  const reset = () => dispatch({type: actionTypes.reset, initialState})

  function getTogglerProps({onClick, ...props} = {}) {
    return {
      'aria-pressed': on,
      onClick: callAll(onClick, toggle),
      ...props,
    }
  }

  function getResetterProps({onClick, ...props} = {}) {
    return {
      onClick: callAll(onClick, reset),
      ...props,
    }
  }

  return {
    on,
    reset,
    toggle,
    getTogglerProps,
    getResetterProps,
  }
}

function Toggle({on: controlledOn, onChange, readOnly}) {
  const { on, getTogglerProps } = useToggle({on: controlledOn, onChange, readOnly})
  const props = getTogglerProps({ on });
  return <Switch {...props} />
}

function App() {
  const [bothOn, setBothOn] = React.useState(false)
  const [timesClicked, setTimesClicked] = React.useState(0)

  function handleToggleChange(state, action) {
    if (action.type === actionTypes.toggle && timesClicked > 4) {
      return
    }
    setBothOn(state.on)
    setTimesClicked(c => c + 1)
  }

  function handleResetClick() {
    setBothOn(false)
    setTimesClicked(0)
  }

  return (
    <div>
      <div>
        <Toggle on={bothOn} />
        <Toggle on={bothOn} onChange={handleToggleChange} />
      </div>
      {timesClicked > 4 ? (
        <div data-testid="notice">
          Whoa, you clicked too much!
          <br />
        </div>
      ) : (
        <div data-testid="click-count">Click count: {timesClicked}</div>
      )}
      <button onClick={handleResetClick}>Reset</button>
      <hr />
      <div>
        <div>Uncontrolled Toggle:</div>
        <Toggle
          onChange={(...args) =>
            console.info('Uncontrolled Toggle onChange', ...args)
          }
        />
      </div>
    </div>
  )
}

export default App
// we're adding the Toggle export for tests
export {Toggle}

/*
eslint
  no-unused-vars: "off",
*/
