import { useState, useContext, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../../contexts/context"
import { FaUser, FaLock } from 'react-icons/fa';
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
    <div className="login-box">
      <div className="login-logo"><b>Sistema</b> Clicksul</div>

      <div className="card">
        <div className="card-body login-card-body">
          <p className="login-box-msg">Faça o login para iniciar sua sessão</p>
          <div
            className={`alert alert-info text-center py-2 login-alert ${invalidAccess ? 'login-alert--visible' : ''}`}
            role="alert"
          >
            {invalidAccess}
          </div>

          <form onSubmit={handleSubmit}>
            <div className={`input-group ${wronguser ? 'mb-1' : 'mb-3'}`}>
              <input
                type="text"
                className={`form-control ${wronguser ? 'is-invalid' : ''}`}
                placeholder="E-mail"
                name="email"
                onChange={handleChange}
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <FaUser className="text-muted" />
                </div>
              </div>
            </div>
            {wronguser && <div className="invalid-feedback d-block mt-0 mb-2">{wronguser}</div>}

            <div className={`input-group ${wrongpass ? 'mb-1' : 'mb-3'}`}>
              <input
                type="password"
                id="password"
                className={`form-control ${wrongpass ? 'is-invalid' : ''}`}
                placeholder="Senha"
                name="password"
                onChange={handleChange}
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <FaLock className="text-muted" />
                </div>
              </div>
            </div>
            {wrongpass && <div className="invalid-feedback d-block mt-0 mb-2">{wrongpass}</div>}

            <div className="row align-items-center">
              <div className="col-8">
                <p className="mb-0"><Link className="text-primary" to="/forgot">Esqueci minha senha</Link></p>
              </div>
              <div className="col-4">
                <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
                  {loading ? "Carregando..." : "Entrar"}
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
