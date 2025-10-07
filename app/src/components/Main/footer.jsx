import { useContext } from "react"
import { Link } from "react-router-dom"
import { MainContext } from "../../contexts/context"

const Footer = () => {
  const { data } = useContext(MainContext)

  const yearNow = data?.yearnow || new Date().getFullYear()
  const message = data?.msgfooter || ''
  const datePrevious = data?.dateprevious || ''
  const userIp = data?.desip || ''

  return (
    <footer className="main-footer text-sm">
      <div className="float-right d-none d-sm-inline">
        Copyright © 1999-{yearNow}{' '}
        <Link to="https://clicksul.com.br">Clicksul Soluções Digitais</Link>
      </div>
      <div>
        {message && <strong>{message}</strong>}
        {datePrevious && <span className="ml-2">{datePrevious}</span>}
        {userIp && (
          <span className="ml-3">
            IP:<strong className="ml-1">{userIp}</strong>
          </span>
        )}
      </div>
    </footer>
  )
}

export default Footer
