import { useParams } from "react-router-dom"
import { useEffect, useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext, MainContext } from "../../../contexts/context"
import { get, getCep, post } from "../../../services/api"
import { InputMask } from 'primereact/inputmask'
import { Editor } from 'primereact/editor'
import { verifyNull, removeColor, verifyCnpj, verifyCpf, verifyEmail } from "../../../components/Validate/verifyError"
import msgError from "../../../components/Validate/msgError"

const ClientsUpdate = () => {

  const { innerHeight: height } = window

  const navigate = useNavigate()

  const { code } = useParams()

  const { user } = useContext(AuthContext)

  const { logout } = useContext(MainContext)   

  const [ idclient, setIdclient ] = useState(code)

  const [ secedit, setSecedit] = useState('')
  
  const [ secdelete, setSecdelete] = useState('')

  const [ invalidcep, setInvalidcep] = useState(false)

  const [ wrong, setWrong ] = useState('')

  const [ obscontract, setObscontract ] = useState('')

  const [ obstech, setObstec ] = useState('')
  
  const [ cnpjprevious, setCnpjprevious ] = useState('')

  const [ data, setData ] = useState({
    idclient: '',
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
    lastchange: '',
    inactive: '',
    dtregister: '',
    desobscontract: '',
    desobstech: ''
  })

  const getIdclient = async () => {

    if (idclient == undefined) {
      logout('301')
      return
    }

    try {
      const response = await get(`clients.php?op=1&idclient=${idclient}&email=${user.email}&token=${user.token}`)

      if (response.status != 200) {
        logout(response.status)
        return
      }

      setData(response.input)

      setCnpjprevious(response.input.descnpj)

      setSecedit(response.secEdit)

      setSecdelete(response.secDelete)

      //console.log(data)

    } catch (e) {
      logout('301')
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
      idclient: idclient,
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
      descnpjprevious: cnpjprevious,
      desresponsavel: data.desresponsavel,
      descpf: data.descpf,
      desemail: data.desemail,
      inactive: data.inactive,
      desobscontract: obscontract,
      desobstech: obstech,
      op: 3,
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

      msgError(0, 'O registro foi alterado com sucesso.')

    } catch (e) {
      //console.log(e)
      logout('301')
      return         
    }
  }

  const handleLostFocus = (e) => {
    removeColor(e.target.id)    
  }

  const handleOpenModalDelete = () => $("#modalDelete").modal()

  const handleDelete = async () => {

    const clientData = {
      idclient: idclient,
      op: 4,
      email: user.email,
      token: user.token
    }

    try {
      const response = await post('clients.php', clientData)

      if (response.status == 302) {
        msgError(2, 'Este registro não pode ser excluído, já foi utilizado como vínculo em outros registros !!')
        return
      }

      if (response.status != 200) {
        logout(response.status)
        return
      }

      $("#modalDelete").modal('hide')

      msgError(0, 'O registro foi excluído com sucesso.', '', true)

      setTimeout( () => navigate('/clients'), 4300)

    } catch (e) {
      logout('301')
      return         
    }
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
    getIdclient()
  }, [])

  return (
    <>
      <section className="content" style={{ minHeight: `${innerHeight-142}px` }}>
        <form role="form" onSubmit={handleSubmit} noValidate>
          <div className="row">
            <div className="col-md-12">
              <div className="box box-primary">
                <div className="box-header">
                  <h3 className="box-title"><span className="fontTitle">Cliente Id {data.idclient}</span></h3>
                  <div className="box-tools pull-right">
                    <div id="msgerro">{wrong}</div>
                    <div id="buttons">
                      <button type="submit" className={`btn btn-success ${secedit}`}>
                        <i className="fa fa-floppy-o"></i>&nbsp;&nbsp;&nbsp;Salvar
                      </button>
                      &nbsp;
                      <button type="button" className={`btn btn-danger ${secdelete}`} onClick={handleOpenModalDelete}>
                        <i className="fa fa-times"></i>&nbsp;&nbsp;&nbsp;Excluir
                      </button>
                      &nbsp;
                      <Link to="/clients">
                        <span className="btn btn-default">
                          <i className="fa fa-arrow-left"></i>&nbsp;&nbsp;&nbsp;Retornar
                        </span>
                      </Link>
                    </div>

                    <div id="modalDelete" className="modal modal-danger">
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">×</span></button>
                            <h4 className="modal-title">Exclusão de Registro</h4>
                          </div>
                          <div className="modal-body">
                            <p>Atenção! Esta é uma ação sem volta, caso deseje excluir mesmo o registro basta apenas 'Confirmar'.</p>
                          </div>
                          <div className="modal-footer">
                            <button type="button" className="btn btn-outline pull-left" data-dismiss="modal">Fechar</button>
                            <button type="button" className="btn btn-outline" onClick={handleDelete}>Confirmar</button>
                          </div>
                        </div>
                      </div>
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
                            checked={ data.inactive == 0 ? true : false } 
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
                            checked={ data.inactive == 1 ? true : false }
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

                  <div className="row">
                    <div className="col-md-12 padT20">
                      <small>
                        <p>Registro criado em <strong>{data.dtregister}</strong></p>
                        <p>Última alteração realizada em <strong className="text-uppercase">{data.lastchange}</strong></p>
                      </small>
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
        
          <div className="row">
            <div className="col-md-12">
              <div className="box box-warning">
                <div className="box-header with-border">
                  <h3 className="box-title text-black">Observações</h3>
                </div>            
                <div className="box-body">
                  <div className="col-md-12">
                    <div className="nav-tabs-custom">
                      <ul className="nav nav-tabs">
                        <li><a href="#tab_1" data-toggle="tab" aria-expanded="false">Comerciais</a></li>
                        <li><a href="#tab_2" data-toggle="tab" aria-expanded="false">Técnicas</a></li>
                      </ul>
                      <div className="tab-content">
                        <div className="tab-pane" id="tab_1">
                          <Editor 
                            name="desobscontract" 
                            value={data.desobscontract == null ? '' : data.desobscontract}
                            onTextChange={(e) => setObscontract(e.htmlValue)} 
                          />
                        </div>
                        <div className="tab-pane" id="tab_2">
                          <Editor
                            name="desobstech" 
                            value={data.desobstech == null ? '' : data.desobstech} 
                            onTextChange={(e) => setObstec(e.htmlValue)}  
                          />
                        </div>
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

export default ClientsUpdate