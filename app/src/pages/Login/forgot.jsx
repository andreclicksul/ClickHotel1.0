import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { post } from "../../services/api";
import { AuthContext } from "../../contexts/context";

const Forgot = () => {

  const navigate = useNavigate()

  const { updateForgotsend } = useContext(AuthContext)

  const fullYear = new Date().getFullYear();

  const classbuttonText = 'glyphicon glyphicon-arrow-right text-muted'

  const [wronguser, setWronguser] = useState('')

  const [classbutton, setClassbutton] = useState(classbuttonText)

  const [data, setData] = useState({
    email: ""
  })
  
  const handleChange = (e) => {
    const value = e.target.value
    setData({
      ...data,
      [e.target.name]: value
    })
  }

  const errStatus = destext => {
    setWronguser(destext)
    setTimeout( () => {
      setWronguser('')
      setClassbutton(classbuttonText)
    }, 4000)      
    return false
  }

  const handleSubmit = async (form) => {

    form.preventDefault()

    const userData = {
      email: data.email,
      op: 1
    }

    if (data.email == '') return 

    setClassbutton('fa fa-refresh fa-spin')

    try {
      const response = await post('login.php', userData)

      if (response.status == 300) {
        return errStatus('E-mail não encontrado')
      }

      updateForgotsend(true)
      navigate('/forgotsend') 

    } catch (e) {
      return errStatus('Falha na comunicação, tente mais tarde')
    }    
  }

  return (  
    <>
      <div className="hold-transition lockscreen">
        <div className="lockscreen-wrapper">
          <div className="login-logo">
            <b>Sistema Clicksul</b>
            <p><b><span id="wrong-msg" className="label label-danger font12">{wronguser}</span></b></p>
          </div>
          <div className="lockscreen-item">
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input 
                  type="email" 
                  id="email"
                  className="form-control" 
                  placeholder="Digite o e-mail" 
                  name="email"
                  onChange={handleChange}
                />
                <div className="input-group-btn">
                  <button type="submit" className="btn">
                    <i className={classbutton}></i>
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="help-block text-center">
            <span>Digite seu e-mail e receba as instruções para redefinir a sua senha.</span>
          </div>
          <div className="text-center">
            <Link to="/">Ou entre com um usuário diferente</Link>
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

export default Forgot