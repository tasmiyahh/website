import React, { createContext, useReducer} from 'react'

import { reducer } from './reducer';

export const GlobalContext = createContext("InitialValue"); //this is reducers intial value
let InitialValue  = { //these value goes to state
  user: {},
  darkTheme: true,
  isLogin: null,
}
function ContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, InitialValue)
  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  )
}

export default ContextProvider;


