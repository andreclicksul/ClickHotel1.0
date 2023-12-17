import { useEffect, useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { MainContext, AuthContext } from "./context"
import { post } from "../services/api"

export const MainProvider = ({ children }) => {

  const navigate = useNavigate()

  const [ srcAvatar, setSrcAvatar ] = useState('')

  const [ data, setData ] = useState({
    desip: "",
    descor: "",
    iduser: 0, 
    desuser: "",
    avatar: "",
    desname: "",
    desphone: "",
    yearnow: "",
    dateprevious: "",
    msgfooter: "",
    countavatar: "",
    timenow: ""
  })

  const [ permissions, setPermissions ] = useState({
    cliente: 0,
    cadusuario: 0,
    financeiro: 0,
    billing: 0,
    cp: 0,
    cr: 0,
    fornecedor: 0,
    auditoria: 0
  })

  const { user, logout } = useContext(AuthContext)

  const handleLogout = (staturerr = '') => {
    logout()
    navigate(`/${staturerr}`)
  }  

  const readPermissionUser = async () => {

    const userData = {
      email: user.email
    }      

    try {
      const response = await post('/readpermissionuser', userData)

      if (response.status != 200) {
        logout()
        navigate(`/${response.status}`)
        return
      }
      
      setData({
        desip: response.desip,
        descor: response.descor,
        iduser: response.iduser,
        desuser: response.desuser,
        avatar: response.avatar,
        desname: response.desname,
        desphone: response.desphone,
        yearnow: response.yearnow,
        dateprevious: response.dateprevious,
        msgfooter: response.msgFooter,
        countavatar: response.countAvatar,
        timenow: response.timenow,
        srcAvatar: `/res/admin/avatar/avatar${response.avatar}.png`
      })

      setPermissions({
        cliente: response.cliente,
        cadusuario: response.cadusuario,
        financeiro: response.financeiro,
        billing: response.billing,
        cp: response.cp,
        cr: response.cr,
        fornecedor: response.fornecedor,
        auditoria: response.auditoria
      })
      
     } catch (e) {
      logout()
      navigate('/301')
      return     
    }      
  }
  
  if (data.iduser == 0) readPermissionUser() 

  useEffect( () => {
    setSrcAvatar(`/res/admin/avatar/avatar${data.avatar}.png`)
  },[])  

  return (
    <MainContext.Provider value={{ srcAvatar, data, permissions, logout: handleLogout }}>
      {children}
    </MainContext.Provider>
  )
}