export const reducer = (state, action) => {
  
    switch (action.type) {
      case "USER_LOGIN": {
        return { ...state, user: action.payload  ,isLogin: true}
      }
      case "USER_LOGOUT": {
        return { ...state, user: null  , isLogin :false} 
      }
      case "cartGet": {
        return { ...state, cart :action.payload , isLogin: true }
      }
      case "total": {
        return { ...state, bill :action.payload , isLogin: true }
      }
      case "CHANGE_THEME": {
        return { ...state, darkTheme: !state.darkTheme }
      }
     
      default: {
       return state
      }
    }
  }