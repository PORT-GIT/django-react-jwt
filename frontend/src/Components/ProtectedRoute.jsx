// this file will allow me to get the token 
// it will also be to protect the different routes on the frontend and backend
// this will represent a wrapper for a protected route
// if anything is wrapped here then i need to have an authorization token before accessing the route
import {Navigate} from "react-router-dom"
import {jwtDecode} from "jwt-decode"
import api from "../api"
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants"
import { useEffect, useState } from "react"

// children is what is to be wrapped

// this checks if someone is authorized otherwise the user is redirected to the login page
// DISCLAIMER this can be bypassed because this is frontend code
// but it will stop a user from accessing aroute until they have logged in 
function ProtectedRoute({children}){

    // this means that as soon as a PROTECTEDROUTE is loaded the auth function below will be called
    useEffect(() => {
        // this is in case there is an error then the user is unauthorized
        auth().catch(() => {SetIsAuthorized(false)}) 
    }, [])
    
    const [IsAuthorized, SetIsAuthorized] = useState(null)

    // this function will refresh the access token automatically
    const refreshToken = async () => {

        // gets the REFRESH TOKEN from local storage
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);

        try{
            // sends a request to the backend with the REFRESH TOKEN to get a new ACCESS TOKEN
            // res stands for response
            // the res is being sent to this route "/api/token/refresh/" with the refresh token
            // to give an access token
            // the api will handle theBASEURL as set in api.js file
            const res = await api.post("/api/token/refresh/", {
                // this is the payload
                refresh: refreshToken
            });
            // line below means the try function was successful and i got a new access token
            if(res.status == 200) {
                //the new access token is set as ACCESS_TOKEN in local storage
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                SetIsAuthorized(true)

            }else {
                // this is in case there is an error and the user does not get a new access token
                SetIsAuthorized(false)
            }

        }catch (error) {
            console.log(error)
            SetIsAuthorized(false)

        }
        
    }

    //this function will check if whether we need to refresh the access token or not 
    const auth = async () => {
        // this will check if there is an existing access token and whether it is valid or expired
        // if token is expired or cannot be refreshed i want the system to inform the user they have no access and need to login again

        // this checks if we have a token
        const token = localStorage.getItem(ACCESS_TOKEN)
        if(!token){
            // if we dont have a token initially then we are not authorized
            SetIsAuthorized(false)
            return
        }

        // if there is a token it will be decoded using the JWTDECODE PACKAGE installed to
        // get the expiration period

        // the line below will automatically decode the token and give us the value of expiration
        const decoded = jwtDecode(token)

        // exp is expiration
        // tokenExpiration is the decoded information from the token
        const tokenExpiration = decoded.exp

        // this line below will get the current time using const now
        // dividing by 1000 turns the date to seconds
        const now = Date.now()/1000

        // this means that the token has passed the expiration period
        if (tokenExpiration < now) {
            // it will wait for the access token to be refreshed in the above function
            await refreshToken()

        } else{
            // if the token is not expired then the user is authorized and will not need to log in again
            SetIsAuthorized(true)
        }
        
    }

    // until the useState(ABOVE) HAS SOME STATE that is not null it will show the div
    //  while the system checks the above functions
    if (IsAuthorized == null) {
        return <div>Loading...</div>
    }

    // otherwise if (IsAuthorized ?) is true the user  will  have access children(PROTECTEDROUTE) 
    // but if the user is not authorized they will be redirected/navigated to the login page
    return IsAuthorized ? children: <Navigate to="/login"/>
}

export default ProtectedRoute