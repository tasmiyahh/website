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





// function App() {
//   const {state ,dispatch} = useContext(GlobalContext)
//   useEffect(()=>{
//     let baseUrl = "http://localhost:5000";

//     axios.get(`${baseUrl}/profile`, {

//     }, {withCredentials:true})
//     .then(function (response) {
//       if (response.status === 200) {
//         console.log("response: ", response.data.profile);
//         dispatch({
//           type: "USER_LOGIN",
//           payload: response.data.profile
//         })
//       } else {
//         dispatch({
//           type: "USER_LOGOUT"
//         })
//       }

//     })
//     .catch(function (error) {
//       console.log("error in api call" , error.message);
//       dispatch({
//         type : "USER_LOGOUT"
//       })

//     });
//   },[])


//   return (
//     <>

//      <Router>
//        <NavBar/>

//       <Routes>

//         <Route path='/login' element={<Login/>}/>
//         <Route path='/signup' element={<Signup/>} />
//         <Route path='/profile' element={<Profile/>}/>
//       </Routes>
//      </Router>

//     </>

//   );
// }


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
