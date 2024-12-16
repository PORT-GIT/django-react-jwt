import { BrowserRouter, Route, Routes, Navigate} from "react-router-dom"
import Login from "./Pages/Login"
import Home from "./Pages/Home"
import Register from "./Pages/Register"
import NotFound from "./Pages/NotFound"
import ProtectedRoute from "./Components/ProtectedRoute"
// this is where the navigation is written

//this is a logout function
function LogOut(){
  // this means that as soon as the user logs out the refresh and access token is cleared
  localStorage.clear()
  return <Navigate to= "/login"/>
}

// this function is for whn a new user is registering
// this will first clear the local storage to prevent giving older access tokens
function RegisterandLogout() {
  localStorage.clear()
  return <Register />
  // this will return the register component
}

function App() {
 // this is to navigate bewtween different pages
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* this is where i will place the different routes i
          want to navigate to */}
          <Route path = "/" element={ <ProtectedRoute>
            {/* this means that the home page cannot be accessed without the required tokens */}
            <Home />
          </ProtectedRoute> } />

          <Route path="/login" element= { <Login/> }/>

          <Route path="/register" element= { <RegisterandLogout/> }/>

          <Route path="*" element= { <NotFound/> }/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
