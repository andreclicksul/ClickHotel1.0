import { useState, useContext, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../../contexts/context"
import { getUserLocalStorage } from "../../services/api"

const Login = () => {

  const navigate = useNavigate()

  const code = useParams()

  const { authenticate } = useContext(AuthContext)

  const [data, setData] = useState({
    email: "",
    password: ""
  })

  const [wronguser, setWronguser] = useState("")
  const [wrongpass, setWrongpass] = useState("")
  const [invalidAccess, setInvalidaccess] = useState("")

  useEffect( () => {
    if (JSON.stringify(code) === '{}') return

    if (code.errcode == 300) setInvalidaccess('Sessão Encerrada')
    if (code.errcode == 301) setInvalidaccess('Você não tem permissão de acesso')
    if (code.errcode == 302) setInvalidaccess('Falha na comunicação, tente mais tarde')

    setTimeout( () => setInvalidaccess(''), 4000) 
  }, [])

  const handleChange = (e) => {
    const value = e.target.value
    setData({
      ...data,
      [e.target.name]: value
    })
  }

  const handleSubmit = async (form) => {

    form.preventDefault()

    const userData = {
      email: data.email,
      password: data.password
    }

    if (data.email == '') {
      setWronguser('Favor digitar o email')
      setTimeout( () => setWronguser(''), 4000)
      return
    }

    if (data.password == '') {
      setWrongpass('Favor digitar a senha')
      setTimeout( () => setWrongpass(''), 4000);     
      return
    }

    try {
      const response = await authenticate(data.email, userData)
      console.log(response)
      if (response) {
        console.log(getUserLocalStorage('u'))
        navigate('/home')
      } else {
        setInvalidaccess('Você não tem permissão de acesso')
        setTimeout( () => setInvalidaccess(''), 4000)      
      }
    } catch (e) {
      console.log(e)
      setInvalidaccess('Falha na comunicação, tente mais tarde')
      setTimeout( () => setInvalidaccess(''), 4000)      
    }
  }
  
  return (
    <div>
      <div className="login-box">
        <div className="login-logo">
          <b>Sistema Clicksul</b>
        </div>
        <div className="login-box-body">
          <p className="login-box-msg">
            <b><span>Faça o login para iniciar sua sessão</span></b><br />
            <b><span id="wrong-msg" className="label label-danger font12">{invalidAccess}</span></b>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group has-feedback has-error">
              <input 
                type="text" 
                className="form-control" 
                placeholder="E-mail" 
                name="email" 
                onChange={handleChange}
              />
              <span className="glyphicon glyphicon-user form-control-feedback"></span>
              <span id="wrong-user" className="help-block">{wronguser}</span>
            </div>
            <div className="form-group has-feedback has-error">
              <input 
                type="password" 
                id="password" 
                className="form-control" 
                placeholder="Password" 
                name="password" 
                onChange={handleChange}
              />
              <span className="glyphicon glyphicon-lock form-control-feedback"></span>
              <span id="wrong-pass" className="help-block">{wrongpass}</span>
            </div>
            <div className="row">
              <div className="col-xs-8">
                <div className="checkbox icheck">
                  <label>
                    <Link to="/forgot">Esqueci minha senha</Link>
                  </label>
                </div>
              </div>
              <div className="col-xs-4">
                <button className="btn btn-primary btn-block btn-flat" type="submit">Sign In</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login