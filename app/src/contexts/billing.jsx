import { useState } from "react"
import { BillingContext } from "./context"

const mockClients = [
  { desname: 'Cliente 1', desobs: 'Observação 1', desemail: 'cliente1@example.com', descel: '(21) 90000-0001' },
  { desname: 'Cliente 2', desobs: 'Observação 2', desemail: 'cliente2@example.com', descel: '(21) 90000-0002' },
  { desname: 'Cliente 3', desobs: 'Observação 3', desemail: 'cliente3@example.com', descel: '(21) 90000-0003' },
  { desname: 'Cliente 4', desobs: 'Observação 4', desemail: 'cliente4@example.com', descel: '(21) 90000-0004' },
  { desname: 'Cliente 5', desobs: 'Observação 5', desemail: 'cliente5@example.com', descel: '(21) 90000-0005' },
  { desname: 'Cliente 6', desobs: 'Observação 6', desemail: 'cliente6@example.com', descel: '(21) 90000-0006' },
  { desname: 'Cliente 7', desobs: 'Observação 7', desemail: 'cliente7@example.com', descel: '(21) 90000-0007' },
  { desname: 'Cliente 8', desobs: 'Observação 8', desemail: 'cliente8@example.com', descel: '(21) 90000-0008' },
  { desname: 'Cliente 9', desobs: 'Observação 9', desemail: 'cliente9@example.com', descel: '(21) 90000-0009' },
  { desname: 'Cliente 10', desobs: 'Observação 10', desemail: 'cliente10@example.com', descel: '(21) 90000-0010' },
]

export const BillingProvider = ({ children }) => {

  const [ databillings, setDatabillings ] = useState(mockClients)  

  const [ datadash, setDatadash ] = useState({})

  const readBilling = async () => {

    //try {
      //const response = await get(`dashboard.php?op=1&email=${user.email}&token=${user.token}`)
      //setDatabillings(response.billing)
      //const response = []
      setDatabillings(mockClients)


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
      const response = {}
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
        dataclients: Array.isArray(datadash?.clients) ? datadash.clients : mockClients,
        updateBillings: setDatabillings, 
        readBilling, 
        readDash
      }}
    >
      {children}
    </BillingContext.Provider>
  )
}
