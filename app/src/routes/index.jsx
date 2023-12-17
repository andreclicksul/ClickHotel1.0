import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

import Login from "../pages/Login"
import Main from "../pages/Main"
import Clients from "../pages/Clients"
import ClientsUpdate from "../pages/Clients/update"
import ClientsCreate from "../pages/Clients/create"
import Forgot from "../pages/Login/forgot"
import ForgotSend from "../pages/Login/forgot-send"
import ForgotReset from "../pages/Login/forgot-reset"
import ForgotResetSuccess from "../pages/Login/forgot-reset-sucecess"

import { AuthProvider } from "../contexts/auth"
import { Private } from "../components/ProtectedLayout"
import { PrivateEmail } from "../components/ProtectedSendEmail"

const RoutesApp = () => {

  return (
    
    <AuthProvider>
      <Router>
          <Routes>
            <Route path="/home" element={<Private><Main /></Private>} />
            <Route path="/clients" element={<Private><Clients /></Private>} />
            <Route path="/clients/create" element={<Private><ClientsCreate /></Private>} />
            <Route path="/clients/update/:code" element={<Private><ClientsUpdate /></Private>} />
            <Route path="/forgot" element={<Forgot />} />
            <Route path="/forgotsend" element={<PrivateEmail><ForgotSend /></PrivateEmail>} />
            <Route path="/forgotreset/:code" element={<ForgotReset />} />
            <Route path="/forgotresetsuccess" element={<ForgotResetSuccess />} />
            <Route path="/:errcode" element={<Login />} />
            <Route path="/" element={<Login />} />
          </Routes>
      </Router>
    </AuthProvider>

    )
}

export default RoutesApp