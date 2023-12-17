import { useContext, useState } from "react"
import { MainContext, AuthContext, BillingContext } from "../../contexts/context"
import { post } from "../../services/api"


const ModalBilling = ({dataform}) => {

  const { logout } = useContext(MainContext)

  const { user } = useContext(AuthContext)  

  const { updateBillings } = useContext(BillingContext)

  const [data, setData] = useState({
    op: 2,
    id: dataform.id,
    desuser: user.desuser,
    desstatus: dataform.desstatus,
    desresult: dataform.desresult
  })

  const handleChange = (e) => {
    const value = e.target.value
    setData({
      ...data,
      [e.target.name]: value
    })
  }

  const handleSubmit = async (e) => {
    
    e.preventDefault()

    try {

       const response = await post('dashboard.php', data)

      updateBillings(response.billing)

    } catch (e) {
      logout(302)
      return
    }
  }

  return (
    <div className="modal-content">
      <div className="modal-header">
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">×</span></button>
        <h4 className="modal-title">Mudança de Status e Conclusão</h4>
      </div>

      <form className="form-horizontal" onSubmit={handleSubmit}>
        <div className="modal-body">
          <div className="box-body">
            <div className="form-group">
              <label htmlFor="dtscheduling" className="col-sm-2 control-label">Vencimento</label>
              <div className="col-sm-3">
                <input 
                  type="text" 
                  name="dtscheduling" 
                  className="form-control text-center disabled"
                  readOnly
                  value={dataform.dtscheduling || ''} 
                />
              </div>
              <label htmlFor="dbvalue" className="col-sm-1 control-label">Valor</label>
              <div className="col-sm-3">
                <input 
                  type="text" 
                  name="dbvalue" 
                  className="form-control text-right disabled"
                  readOnly
                  value={dataform.dbvalue || ''}
                />
              </div>
              <label htmlFor="parcel" className="col-sm-1 control-label">Parcela</label>
              <div className="col-sm-2">
                <input 
                  type="text" 
                  name="parcel" 
                  className="form-control text-center disabled"
                  readOnly
                  value={dataform.parcel || ''}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="desname" className="col-sm-2 control-label">Cliente</label>
              <div className="col-sm-10">
                <input 
                  type="text" 
                  name="desname" 
                  className="form-control disabled text-uppercase"
                  readOnly                  
                  value={dataform.desname || ''}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="desdescription" className="col-sm-2 control-label">Descrição</label>
              <div className="col-sm-10">
                <input 
                  type="text" 
                  name="desdescription" 
                  className="form-control disabled text-uppercase"
                  readOnly                  
                  value={dataform.desdescription || ''}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="desresponsavel" className="col-sm-2 control-label">Responsável</label>
              <div className="col-sm-10">
                <input 
                  type="text" 
                  name="desresponsavel" 
                  className="form-control disabled text-uppercase"
                  readOnly                  
                  value={dataform.desresponsavel || ''}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="desemail" className="col-sm-2 control-label">E-mail</label>
              <div className="col-sm-10">
                <input 
                  type="text" 
                  name="desemail" 
                  className="form-control disabled"
                  readOnly                  
                  value={dataform.desemail || ''}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="descel" className="col-sm-2 control-label">Celular</label>
              <div className="col-sm-4">
                <input 
                  type="text" 
                  name="descel" 
                  className="form-control disabled text-center"
                  readOnly                  
                  value={dataform.descel || ''}
                />
              </div>
            </div>              

            <div className="form-group">
              <label htmlFor="desstatus" className="col-sm-2 control-label">Status</label>
              <div className="col-sm-10">
                <input 
                  type="text" 
                  name="desstatus" 
                  className="form-control text-uppercase" 
                  maxLength={80}
                  value={data.desstatus}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="desresult" className="col-sm-2 control-label">Conclusão</label>
              <div className="col-sm-10">
                <input 
                  type="text" 
                  name="desresult" 
                  className="form-control text-uppercase" 
                  maxLength={80}
                  value={data.desresult}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" id="closeModal" className="btn btn-default pull-left" data-dismiss="modal">Fechar</button>
          <button className="btn btn-primary" type="submit">Atualizar</button>
        </div>
      </form>
    </div>
  )
}

export default ModalBilling