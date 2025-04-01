import { useState, useContext } from "react"
import { BillingContext, AuthContext, MainContext } from "./context"
import { get } from "../services/api"

export const BillingProvider = ({ children }) => {

  const { user } = useContext(AuthContext)

  const { logout } = useContext(MainContext)

  const [ databillings, setDatabillings ] = useState([])  

  const [ datadash, setDatadash ] = useState([])

  const readBilling = async () => {

    //try {
      //const response = await get(`dashboard.php?op=1&email=${user.email}&token=${user.token}`)
      //setDatabillings(response.billing)
      const response = []
      setDatabillings(response)


    //} catch (e) {
    //  logout('301')
    //  return     
    //} 
  }

  const readDash = async () => {

    //try {
      /*
      const response = await get(`dashboard.php?op=0&email=${user.email}&token=${user.token}`)
      if (response.status != 200) {
        logout(response.status)
        return
      }

      setDatadash(response.dash)
      */
      const response = []
      setDatadash(response)

    //} catch (e) {
    //  logout('301')
    //  return     
    //} 
  }  

  return (
    <BillingContext.Provider value={
      { 
        databillings, 
        datadash, 
        //dataclients: datadash.clients, 
        dataclients: datadash, 
        updateBillings: setDatabillings, 
        readBilling, 
        readDash
      }}
    >
      {children}
    </BillingContext.Provider>
  )
}