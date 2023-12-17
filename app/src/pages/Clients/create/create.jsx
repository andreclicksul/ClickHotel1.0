import { useEffect, useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext, MainContext } from "../../../contexts/context"
import { get, getCep, post } from "../../../services/api"
import { InputMask } from 'primereact/inputmask'
import { verifyNull, removeColor, verifyCnpj, verifyCpf, verifyEmail } from "../../../components/Validate/verifyError"
import msgError from "../../../components/Validate/msgError"

const ClientsCreate = () => {

  const { innerHeight: height } = window

  const navigate = useNavigate()

  const { user } = useContext(AuthContext)

  const { logout } = useContext(MainContext)   

  const [ secinsert, setSecinsert] = useState('')
  
  const [ invalidcep, setInvalidcep] = useState(false)

  const [ wrong, setWrong ] = useState('')

  const [ data, setData ] = useState({
    desname: '',
    descorporate: '',
    desphone: '',
    descel: '',
    descep: '',
    desstreet: '',
    desnumber: '',
    descomplement: '',
    desdistrict: '',
    descity: '',
    desuf: '',
    descnpj: '',
    desresponsavel: '',
    descpf: '',
    desemail: '',
    inactive: '',
  })

  const getPermission = async () => {

    try {
      const response = await get(`clients.php?op=2&email=${user.email}&token=${user.token}`)

      if (response.status != 200) {
        logout(response.status)
        return
      }

      setSecinsert(response.secInsert)

    } catch (e) {
      //logout('301')
      console.log(e)
      return     
    }       
  }

  const handleChange = (e) => {
    const value = e.target.value
    setData({
      ...data,
      [e.target.name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    $("#buttons").hide()

    let error = ''

    if (verifyNull()) error = 'Campos obrigatórios em vermelho.'

    if (verifyEmail()) error += ' Email inválido.'

    if (verifyCpf()) error += ' Cpf inválido.'

    if (verifyCnpj()) error += ' Cnpj inválido.'

    if (invalidcep) error += ' Cep inválido.'

    if (error != '') {
      msgError(2, error)
      return
    }

    const clientData = {
      idclient: 0,
      desname: data.desname,
      descorporate: data.descorporate,
      desphone: data.desphone,
      descel: data.descel,
      descep: data.descep,
      desstreet: data.desstreet,
      desnumber: data.desnumber,
      descomplement: data.descomplement,
      desdistrict: data.desdistrict,
      descity: data.descity,
      desuf: data.desuf,
      descnpj: data.descnpj,
      descnpjprevious: '',
      desresponsavel: data.desresponsavel,
      descpf: data.descpf,
      desemail: data.desemail,
      inactive: data.inactive,
      desobscontract: '',
      desobstech: '',
      op: 5,
      email: user.email,
      token: user.token
    }

    try {
      const response = await post('clients.php', clientData)

      if (response.status == 302) {
        msgError(2, 'Cnpj já utilizado.')
        return
      } else if (response.status != 200) {
        logout(response.status)
        return
      }

      msgError(0, 'O registro foi adicionado com sucesso.', '', true)

      setTimeout( () => navigate(`/clients/update/${response.idclient}`), 4300)

    } catch (e) {
      //console.log(e)
      logout('301')
      return         
    }
  }

  const handleLostFocus = (e) => {
    removeColor(e.target.id)    
  }

  const handleCep = async (e) => {

    setInvalidcep(false)

    if (e.target.value != '') {

      const cep = e.target.value.replace(/\D/g, "");
      const response = await getCep(cep)

      if (response.data.erro) {
        $("#descep").css({ background: '#FFC1C1' })
        msgError(2, 'Cep inválido.')
        setInvalidcep(true)
        return
      }

      setData({
        ...data,
        desstreet: response.data.logradouro,
        desdistrict: response.data.bairro,
        descity: response.data.localidade,
        desuf: response.data.uf
      })
    }
  }

  useEffect( () => {
    getPermission()
  }, [])

  return (
    <>
      <section className="content" style={{ minHeight: `${innerHeight-142}px` }}>
        <form role="form" onSubmit={handleSubmit} noValidate>
          <div className="row">
            <div className="col-md-12">
              <div className="box box-primary">
                <div className="box-header">
                  <h3 className="box-title"><span className="fontTitle">Novo Cliente</span></h3>
                  <div className="box-tools pull-right">
                    <div id="msgerro">{wrong}</div>
                    <div id="buttons">
                      <button type="submit" className={`btn btn-success ${secinsert}`}>
                        <i className="fa fa-floppy-o"></i>&nbsp;&nbsp;&nbsp;Salvar
                      </button>
                      &nbsp;
                      <Link to="/clients">
                        <span className="btn btn-default">
                          <i className="fa fa-arrow-left"></i>&nbsp;&nbsp;&nbsp;Retornar
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="box-body">
                  <div className="row">
                  
                    <div className="form-group col-md-4 col-sm-6">
                      <label htmlFor="desname">Nome</label>
                      <div className="input-group">
                        <div className="input-group-addon">
                          <i className="fa fa-user"></i>
                        </div>
                        <input 
                          type="text" 
                          className="form-control fontW text-uppercase verifynull" 
                          name="desname" 
                          id="desname" 
                          maxLength={128} 
                          placeholder="Nome fantasia da empresa ou nome PF"
                          value={data.desname}
                          onChange={handleChange}
                          onFocus={handleLostFocus}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group col-md-4 col-sm-6">
                      <label htmlFor="descorporate">Razão Social</label>
                      <input 
                        type="text" 
                        className="form-control fontW text-uppercase" 
                        name="descorporate"
                        maxLength={128}
                        value={data.descorporate}
                        onChange={handleChange}                        
                      />
                    </div>

                    <div className="form-group col-md-4 col-sm-4">
                      <label>Status</label>
                      <div className="input-group">
                        <label className="padR18">
                          <input 
                            type="radio" 
                            name="inactive" 
                            className="flat-red"
                            checked={ true } 
                            value="0"
                            onChange={handleChange}
                          />
                          Ativo
                        </label>
                        <label>
                          <input 
                            type="radio" 
                            name="inactive" 
                            className="flat-red"
                            checked={ false }
                            value="1"
                            onChange={handleChange}
                          />
                          Inativo
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="form-group col-md-4 col-sm-6">
                      <label htmlFor="desemail">E-mail</label>
                      <div className="input-group">
                        <div className="input-group-addon"><i>@</i>
                        </div>
                        <input 
                          type="email" 
                          className="form-control fontW text-lowercase verifyemail" 
                          name="desemail" 
                          id="desemail" 
                          maxLength={60} 
                          placeholder="Informe o seu e-mail"
                          value={data.desemail}
                          onChange={handleChange}
                          onFocus={handleLostFocus}
                        />
                      </div>
                    </div>

                    <div className="form-group col-md-3 col-sm-4">
                      <label htmlFor="descel">Celular</label>
                      <div className="input-group">
                        <div className="input-group-addon">
                          <i className="fa fa-phone"></i>
                        </div>
                        <InputMask 
                          className="form-control fontW text-center maskCel" 
                          name="descel" 
                          value={data.descel}
                          onChange={handleChange}
                          mask="(99) 99999-9999"
                          slotChar="               "
                        />
                      </div>
                    </div>
                    
                    <div className="form-group col-md-3 col-sm-4">
                      <label htmlFor="desphone">Telefone</label>
                      <div className="input-group">
                        <div className="input-group-addon">
                          <i className="fa fa-phone"></i>
                        </div>
                        <InputMask 
                          className="form-control fontW text-center maskTel" 
                          name="desphone" 
                          value={data.desphone}
                          onChange={handleChange}
                          mask="(99) 9999-9999"
                          slotChar="               "
                        />
                      </div>
                    </div>

                    <div className="form-group col-md-4 col-sm-8">
                      <label htmlFor="desresponsavel">Responsável</label>
                      <input 
                        type="text" 
                        className="form-control fontW text-uppercase" 
                        name="desresponsavel" 
                        maxLength={128}
                        placeholder="Responsável pela PJ"
                        value={data.desresponsavel}
                        onChange={handleChange}
                      />
                    </div> 

                    <div className="form-group col-md-3 col-sm-4">
                      <label htmlFor="descpf">CPF</label>
                      <InputMask
                        className="form-control fontW text-center verifycpf maskCpf" 
                        name="descpf" 
                        id="descpf" 
                        value={data.descpf}
                        onChange={handleChange}
                        onFocus={handleLostFocus}
                        mask="999.999.999-99"
                        slotChar="              "
                      />
                    </div>

                    <div className="form-group col-md-3 col-sm-4">
                      <label htmlFor="descnpj">CNPJ</label>
                      <InputMask
                        className="form-control fontW text-center verifycnpj maskCnpj" 
                        name="descnpj" 
                        id="descnpj" 
                        value={data.descnpj}
                        onChange={handleChange}
                        onFocus={handleLostFocus}
                        mask="99.999.999/9999-99"
                        slotChar="                  "
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="box box-danger">
                <div className="box-header with-border">
                  <h3 className="box-title text-black">Endereço</h3>
                </div>
                <div className="box-body">
                  <div className="col-md-12">

                    <div className="row">
                      <div className="form-group col-md-2 col-sm-3">
                        <label htmlFor="descep">CEP</label>
                        <div className="input-group">
                          <div className="input-group-addon">
                            <i className="fa fa-envelope"></i>
                          </div>
                          <InputMask
                            className="form-control fontW text-center maskCep" 
                            name="descep" 
                            id="descep"
                            value={data.descep}
                            onChange={handleChange}
                            onBlur={handleCep}
                            onFocus={handleLostFocus}
                            mask="99999-999"
                            slotChar="         "
                          />
                        </div>
                      </div>
                    
                      <div className="form-group col-md-4 col-sm-6">
                        <label htmlFor="desstreet">Logradouro</label>
                        <input 
                          type="text" 
                          className="form-control fontW text-uppercase" 
                          name="desstreet" 
                          maxLength={128}
                          value={data.desstreet}
                          onChange={handleChange}
                        />
                      </div>                
                    
                      <div className="form-group col-md-2 col-sm-3">
                        <label htmlFor="desnumber">Número</label>
                        <input 
                          type="text" 
                          className="form-control fontW text-uppercase" 
                          name="desnumber" 
                          maxLength={20}
                          value={data.desnumber}
                          onChange={handleChange}
                        />
                      </div>                 
                    
                      <div className="form-group col-md-2 col-sm-2">
                        <label htmlFor="descomplement">Complemento</label>
                        <input 
                          type="text" 
                          className="form-control fontW text-uppercase" 
                          name="descomplement" 
                          maxLength={20}
                          value={data.descomplement}
                          onChange={handleChange}
                        />
                      </div>                 

                      <div className="form-group col-md-3 col-sm-4">
                        <label htmlFor="desdistrict">Bairro</label>
                        <input 
                          type="text" 
                          className="form-control fontW text-uppercase" 
                          name="desdistrict" 
                          maxLength={45}
                          value={data.desdistrict}
                          onChange={handleChange}
                        />
                      </div>  

                      <div className="form-group col-md-3 col-sm-4">
                        <label htmlFor="descity">Cidade</label>
                        <input 
                          type="text" 
                          className="form-control fontW text-uppercase" 
                          name="descity" 
                          maxLength={45}
                          value={data.descity}
                          onChange={handleChange}
                        />
                      </div>  

                      <div className="form-group col-md-3 col-sm-2">
                        <label htmlFor="desuf">UF</label>
                        <input 
                          type="text" 
                          className="form-control fontW text-uppercase text-center" 
                          name="desuf" 
                          maxLength="2"
                          value={data.desuf}
                          onChange={handleChange}
                        />
                      </div>  
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  )
}

export default ClientsCreate