import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"
import { get, post } from "../../services/api";

const ForgotReset = () => {

  const navigate = useNavigate()

  const { code } = useParams()

  const [data, setData] = useState({
    password: ""
  })  

  const [desname, setName] = useState('')
  const [iduser, setIduser] = useState(0)
  const [codeid, setCodeid] = useState(code)
  const [classbutton, setClassbutton] = useState('glyphicon glyphicon-arrow-right text-muted')
  const [wronguser, setWronguser] = useState('')  

  const fullYear = new Date().getFullYear(); 

  useEffect( () => {

    const confirmCode = async () => {

      if (iduser == 0) {

        if (codeid == undefined || codeid == '') {
          setCodeid(0)
          return
        }

        try {
          const response = await get(`login.php?op=2&code=${codeid}`)
          if (response.status == 300) {
            setCodeid(0)
            return
          }
          setName(response.desname)
          setIduser(response.iduser)
        } catch (e) {
          setCodeid(0)
          return     
        }      
      }
    }

    confirmCode() 
  }, [])

  const handleChange = (e) => {
    const value = e.target.value
    setData({
      ...data,
      [e.target.name]: value
    })
  }

  const errStatus = errtext => {
    setWronguser(errtext)
    setTimeout( () => setWronguser(''), 4000)
  }

  const handleSubmit = async (form) => {

    form.preventDefault()

    const userData = {
      code: codeid,
      iduser: iduser,
      password: data.password,
      op: 3
    }

    if (data.password == '') {
      errStatus('Favor digitar a senha')
      return
    }

    if (data.password.length < 6) {
      errStatus('A senha deverá ter no mínimo 6 caracteres')
      return
    }

    setClassbutton('fa fa-refresh fa-spin') 

    try {
      const response = await post('login.php', userData)
      console.log(response)
      if (response.status == 200) {
        navigate('/forgotresetsuccess') 
      } else {
        errStatus('Você não tem permissão de acesso')
        setTimeout( () => navigate('/'), 4000)      
      }      
    } catch (e) {
      errStatus('Falha na comunicação, tente mais tarde')
      setTimeout( () => navigate('/'), 4000)      
    }    
  }

  return (
    <>
      <div className="hold-transition lockscreen">
        <div className="lockscreen-wrapper">
          <div className="login-logo">
            <b>Sistema Clicksul</b>
          </div>
          { codeid == 0 ? 
            (
              <>
                <div className="help-block text-center">
                  <div className="callout callout-danger">
                    <h4>Sessão Expirada!</h4>
                    <p>Solicite a atualização da senha novamente.</p>
                    <p><Link to="/forgot">Clicando aqui</Link></p>
                  </div>
                </div>
              </>
            )
            :
            (
              <>
                <div className="help-block text-center">
                  <span>Olá {desname}, digite uma nova senha:</span>
                  <p><span className="label label-danger font12">{wronguser}</span></p>
                </div>
                <div className="lockscreen-item">
                  <form onSubmit={handleSubmit}>
                    <div className="input-group">
                      <input 
                        type="password" 
                        id="password" 
                        className="form-control" 
                        name="password" 
                        onChange={handleChange}
                      />
                      <div className="input-group-btn">
                        <button className="btn" type="submit"><i className={classbutton}></i></button>
                      </div>
                    </div>
                  </form>
                </div>            
              </>
            )
          }
          <div className="lockscreen-footer text-center">
            <p>Copyright &copy; 1999-{fullYear} <Link to="https://clicksul.com.br"><span className="text-black"><b>Clicksul Soluções Digitais</b></span></Link></p>
            <p>All rights reserved</p>
          </div> 
        </div>         
      </div>
    </>
  )
}
 
export default ForgotReset