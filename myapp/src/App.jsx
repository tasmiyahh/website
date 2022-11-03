import Login from './components/login';
import Signup from './components/signup';
import Profile from './components/profile';
import Home from  './components/home'
import NavBar from './components/navbar';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,

} from "react-router-dom";
import { useContext, useEffect } from 'react';
import { GlobalContext } from './context';
import axios from "axios"
import Product from './components/products';
import Shop from './components/shop';
import Cart from './components/cart';







function App() {

  let { state, dispatch } = useContext(GlobalContext);


  useEffect(() => {  //pg load hoty he profile ajaye chahy refresh kre issliye ye app ki file me dala h

    const getProfile = async () => {
      let baseUrl = "http://localhost:5000";
      try {
        let response = await axios({
          url: `${baseUrl}/profile`,
          method: "get",
          withCredentials: true
        })
        if (response.status === 200) {
          console.log("response: ", response.data);
          dispatch({  //ye relaod ya refresh pe pe data show profile ka isliye use is me nav bar kch nh aya coz hum ne route pe null likhha h 
            type: "USER_LOGIN",
            payload: response.data
          })
        } else {
          dispatch({
            type: "USER_LOGOUT"
          })
        }
      } catch (e) {
        console.log("Error in api call: ", e);
        dispatch({
          type: "USER_LOGOUT"
        })
      }
    }
    getProfile();
  }, [])
  return (
    <>

      <Router>
        <NavBar />

        <Routes>
          {(state.isLogin === true) ?
            <>
              <Route path='/profile' element={<Profile />} />
              <Route path='/products' element={<Product/>} />
              <Route path='/shop' element={<Shop/>} />
              <Route path='/cart' element={<Cart/>} />
              <Route path="/" element={<Home/>} />
              <Route path='*' element={<Navigate to ="/" />}></Route> //agr pg pe kch na dikhy tw home pe lejao

            </> : null}

          {(state.isLogin === false) ?
            <>
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<Signup />} />

            </> : null}

          {(state.isLogin === null) ?
            <>
              <Route path="*" element={<h1>loading</h1>}></Route>
            </> :
            null}

        </Routes>
      </Router>

    </>

  );
}


export default App;
