
import { useContext} from "react";
import { GlobalContext } from '../../context';



let Profile = () => {

    let { state, dispatch } = useContext(GlobalContext); //is pg ka dispatch login pe h qk hmy login ka response chaey wo phir state me jaye ga jo yahn use
    
    console.log(state)
    


    return (
        <div >            
            {(state.user === null) ?
                <div>Loading...</div>
                :
                <div>
                    _id: {state.user?._id}
                    <br />
                    name: {state.user?.name} {state.user?.lastName}
                    <br />
                    email: {state.user?.email}
                    <br />
                    age: {state.user?.age}
                </div>
            }

        </div>
    );
}

export default Profile;
