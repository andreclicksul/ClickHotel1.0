import { useState, useContext, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../../contexts/context"
import { getUserLocalStorage } from "../../services/api"

const Login = () => {
  const navigate = useNavigate()
  const { errcode } = useParams()
  const errorCode = parseInt(errcode, 10)
  const { authenticate } = useContext(AuthContext)

  const [data, setData] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [wronguser, setWronguser] = useState("")
  const [wrongpass, setWrongpass] = useState("")
  const [invalidAccess, setInvalidaccess] = useState("")

  useEffect(() => {
    if (!errorCode) return

    const messages = {
      300: 'Sessão Encerrada',
      301: 'Você não tem permissão de acesso',
      302: 'Falha na comunicação, tente mais tarde',
    }

    setInvalidaccess(messages[errorCode] || '')
    const timer = setTimeout(() => setInvalidaccess(''), 4000)
    return () => clearTimeout(timer)
  }, [errorCode])

  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = async (form) => {
    form.preventDefault()
    if (loading) return

    setLoading(true)
    const { email, password } = data

    if (!email || !password) {
      if (!email) setWronguser('Favor digitar o email')
      if (!password) setWrongpass('Favor digitar a senha')
      setTimeout(() => {
        setWronguser('')
        setWrongpass('')
      }, 4000)
      setLoading(false)
      return
    }

    try {
      const response = await authenticate(email, data)
      if (response) {
        setInvalidaccess('Autenticado com sucesso')
        navigate('/home')
      } else {
        setInvalidaccess('Você não tem permissão de acesso')
        setTimeout(() => setInvalidaccess(''), 4000)
      }
    } catch {
      setInvalidaccess('Falha na comunicação, tente mais tarde')
      setTimeout(() => setInvalidaccess(''), 4000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="login-box">
        <div className="login-logo"><b>Sistema Clicksul</b></div>
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
                  <label><Link to="/forgot">Esqueci minha senha</Link></label>
                </div>
              </div>
              <div className="col-xs-4">
                <button className="btn btn-primary btn-block btn-flat" type="submit" disabled={loading}>
                  {loading ? "Carregando..." : "Sign In"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login