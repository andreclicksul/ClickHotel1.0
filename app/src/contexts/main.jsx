import { useEffect, useState, useContext, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { MainContext, AuthContext } from "./context"
import { get } from "../services/api"

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
    checklist: 0,
    fornecedor: 0,
    auditoria: 0,
    financeiro: 0,
    billing: 0,
    cp: 0,
    cr: 0,
    accountpay: 0,
    accountreceive: 0,
    product: 0,
    occupationmap: 0,
    cashflow: 0,
    restaurant: 0,
    uh: 0,
  })

  const { user, logout } = useContext(AuthContext)

  const handleLogout = (staturerr = '') => {
    logout()
    navigate(`/${staturerr}`)
  }  

  const readPermissionUser = useCallback(async () => {

    if (!user?.iduser) {
      return
    }

    try {
      const response = await get(`/readpermissionuser/${user.iduser}`)
 
      if (response.status != 200) {
        logout()
        navigate(`/${response.status}`)
        return
      }
      
      setData({
        desip: response.desip,
        descor: response.descor,
        iduser: user.iduser,
        desuser: response.desuser,
        avatar: response.avatar,
        desname: response.desname,
        desphone: response.desphone,
        yearnow: response.yearnow,
        dateprevious: response.dateprevious,
        msgfooter: response.msgFooter,
        countavatar: response.countAvatar,
        timenow: response.timenow,
        startTime: response.startTime,
        finishTime: response.finishTime,
        srcAvatar: `/res/admin/avatar/avatar${response.avatar}.png`
      })

      setPermissions({
        cliente: response.cliente ?? 0,
        cadusuario: response.cadusuario ?? 0,
        checklist: response.checklist ?? response.billing ?? 0,
        fornecedor: response.fornecedor ?? 0,
        auditoria: response.auditoria ?? 0,
        financeiro: response.financeiro ?? 0,
        billing: response.billing ?? response.checklist ?? 0,
        cp: response.cp ?? response.accountpay ?? 0,
        cr: response.cr ?? response.accountreceive ?? 0,
        accountpay: response.accountpay ?? response.cp ?? 0,
        accountreceive: response.accountreceive ?? response.cr ?? 0,
        product: response.produto ?? response.product ?? 0,
        occupationmap: response.occupationmap ?? 0,
        cashflow: response.cashflow ?? 0,
        restaurant: response.restaurant ?? 0,
        uh: response.uh ?? 0,
      })
      
     } catch (e) {
      logout()
      navigate('/301')
      return     
    }      
  }, [logout, navigate, user])
  
  useEffect(() => {
    if (user && !data.iduser) {
      readPermissionUser()
    }
  }, [user, data.iduser, readPermissionUser])

  useEffect(() => {
    setSrcAvatar(`/res/admin/avatar/avatar${data.avatar}.png`)
  }, [data.avatar])

  return (
    <MainContext.Provider value={{ srcAvatar, data, permissions, logout: handleLogout }}>
      {children}
    </MainContext.Provider>
  )
}
