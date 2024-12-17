import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

//this form is dynamic in that it will be 
// used both for logging in anf or registering a user

// the dynamism of the form is introduced below in the props:ROUTE and METHOD
// ROUTE sets that the form can be used for the register or login routes
// METHOD is set so that the form can be used for any method whether registering or logging in a user

function Form({route, method}) {
    // these are states
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    // above have empty string useStates
    const [loading, setLoading] = useState(false)
    // below is a hook that will be called
    const navigate = useNavigate()

    // this looks at the method passed as the prop
    // if the method is POST then it is a register form
    // if the method is PUT then it is a login form
    const name = method === "login" ? "Login" : "Register"

    // this METHOD will prevent the form from being submitted and removes the default behaviour
    // so that the page is not reloaded when doing this
    // handleSubmit is a function that controls form behaviour
    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        //this will attempt to send a request to the respective route that the form is
        // representing whether registration or login
        // that is the user/form will be for registration or login
        try {
            // this will send the request
            // the api that has been written will be used to post this user data i.e. username and password
            // to the respective route
            const res = await api.post(route, {username, password})
            // then the user will wait to see what will happen and check for the following below

            // if the request is successfull the system will check if the method was a login request
            if(method === "login") {
                // this means that the access token and refresh token need to be set in the local storage
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/")
                // once user is logged in they will be navigated to the home page view
            }else {
                // this means that if the method was not a login but a register then the user is redirected to 
                // the login page where they will be tokens to access they account

                // meaning a user can only get their tokens during logins and not registrations
                navigate("/login")
            }
            // after the request has been sent and there is an error it will be handled here
        }catch(error) {
            // this will show the error on screen
            alert(error) 
        }finally {
            setLoading(false);
        }
        // this means that the user will try to send a request if there is an error it will be caugth or
        // if it doesn't work the finally will come in to turn off the loading indicator
    }

    // this is a basic form that will call the
    // handleSubmit function
    return <form onSubmit={handleSubmit} className="form-container">
        {/* this will help in determining the title of the form whether a 
        register or login form */}
        <h1>{name}</h1>
        
        {/* these are the input fields of the form */}
        <input className="form-input" type="text" value={username}
         onChange={(e) => setUsername(e.target.value)} placeholder="Enter username"/>
         {/* whenever a change is made onChange means the variable e will be taken that whatever is
        typed (e.target.value) will be saved in the state and can be accessed when we submit the form*/}

        <input className="form-input" type="password" value={password}
         onChange={(e) => setPassword(e.target.value)} placeholder="Enter password"/>
         {/* whenever a change is made onChange means the variable e will be taken that whatever is
        typed (e.target.value) will be saved in the state and can be accessed when we submit the form*/}

        <button className="form-button" type="submit">
            {name}
        </button>



    </form>

}