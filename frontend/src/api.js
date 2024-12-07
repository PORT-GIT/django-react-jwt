//in this file i am creating an interceptor
import axios from "axios"
// axios sends network requests
import { ACCESS_TOKEN } from "./constants"

// this will intercept all requests that will be sent
//and automatically add the correct headers to avoid writing multiple times in the code

// using AXIOS the interceptor will check if the request has an access token
// if it does it will automatically add to the token to the request

const api = axios.create({
    // i am passing an object that will specify the base url
    // this will allow me to import anything specified in the .ENV file
    // TO IMPORT ANYTHING FROM AN .ENV FILE TO JAVASCRIPT CODE IT NEEDS TO BEGIN
    // WITH A VITE like below
    baseURL: import.meta.env.VITE_API_URL
    // now when i use the api(const) i will not have to specify the url just the path 
    // e.g. http://localhost:8000/api/notes/
})

api.interceptors.request.use(
    // below is an arrow function
    (config) => {
        // this function will check for an access token in the local storage
        // if i do it will add an authorization header to the request
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            // if the local storage has a token below is how a JWT ACCESS TOKEN is passed
            config.headers.Authorization = `Bearer ${token}`
            // these will add authoriztion header to all requests
            return config
        }
        (error) => {
            return Promise.reject(error)
        }

    }
)

export default api
// this means i can call on api object rather than use axios to add authorization tokens to the requests
