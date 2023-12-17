import { Link } from "react-router-dom"

const ForgotResetSuccess = () => {

  const fullYear = new Date().getFullYear(); 
  
  return (
    <>
      <div className="hold-transition lockscreen">
        <div className="lockscreen-wrapper">
          <div className="login-logo">
            <b>Sistema Clicksul</b>
          </div>
          <div className="help-block text-center">
            <div className="callout callout-success">
              <h4>Senha Alterada!</h4>
              <p>Tente fazer o login com sua nova senha.</p>
              <p><Link to="/">Clique aqui</Link> para fazer o login.</p>
            </div>
          </div>
          <div className="lockscreen-footer text-center">
            <p>Copyright &copy; 1999-{fullYear} <Link to="https://clicksul.com.br"><span className="text-black"><b>Clicksul Soluções Digitais</b></span></Link></p>
            <p>All rights reserved</p>
          </div>
        </div>
      </div>
    </>
  )
}
 
export default ForgotResetSuccess