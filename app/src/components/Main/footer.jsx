import { useContext } from "react"
import { Link } from "react-router-dom"
import { MainContext } from "../../contexts/context";

const Footer = () => {

  const { data } = useContext(MainContext)

  return (
    <>
      <footer className="main-footer">
        <div className="pull-right hidden-xs">
          Copyright © 1999-{data.yearnow} <Link to="https://clicksul.com.br">Clicksul Soluções Digitais</Link> 
        </div>
        {data.msgfooter}<strong>{data.dateprevious}</strong>&nbsp;&nbsp;&nbsp;&nbsp;IP:<strong>{data.desip}</strong>
      </footer>
  
      <div className="control-sidebar-bg"></div>
    </>
  )

}

export default Footer