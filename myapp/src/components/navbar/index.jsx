
import React, { useContext } from "react"
import { GlobalContext } from "../../context"
import { Link } from "react-router-dom"
import "./index.css"
import axios from "axios"


const NavBar = () => {


  let { state, dispatch } = useContext(GlobalContext);
  const logoutHandler = async () => {
    let baseUrl = "http://localhost:5000";
 //  let baseUrl = "https://jwt-authentication-production.up.railway.app"
    try {
      let response = await axios.post(`${baseUrl}/logout`, {},
        {
          withCredentials: true
        })
      console.log("response: ", response.data);

      dispatch({ type: "USER_LOGOUT" })

    } catch (e) {
      console.log("Error in api call: ", e);
    }
  }


  return (
    <>
      <nav className='nav'>
        <div className="userName">{state?.user?.name} {state?.user?.lastName}

        </div>


        
          {(state.isLogin === true) ? 
          <>
          <ul>
              <li>
            <Link to="/profile">profile</Link> </li>
            <li><Link  className="logout" onClick={logoutHandler}>logout</Link></li>
            <li><Link to ="/">home</Link></li>
          
          </ul>
          </> 
          : null
          }
         

         {(state.isLogin === false)? 
         <>
         <ul>
          <li><Link to="/signup">Signup</Link></li>
          <li><Link to="/login">Login</Link></li>

         </ul>
         </>
         :
         null
         }
         
         

        
        
      </nav>
    </>
  )
}

export default NavBar;