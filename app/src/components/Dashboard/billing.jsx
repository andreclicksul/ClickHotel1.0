import { useContext, useEffect, useState } from "react"
import { BillingContext } from "../../contexts/context"
import ModalBilling from "./modalbilling"

const BillingModule = () => {

  const { databillings, readBilling } = useContext(BillingContext)

  const [ dataform, setDataform ] = useState('')

  const [ readOnly, setReadonly ] = useState(false)
  
  const handleModal = res => {
    setDataform(res)
    $("#modalBilling").modal() 
  }

  useEffect( () => { 
    if (!readOnly) {
      readBilling()
      setReadonly(true)
    }
  })

  return ( 
    <>
      <div className="row">
        <div className="col-md-12">
          <div className="box box-warning">
            <div className="box-header with-border">
              <a href="#" id="divLevy"><h3 className="box-title text-black">Módulo de Cobranças</h3></a>

              <div className="box-tools pull-right">
                <button type="button" id="buttonLevy" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus"></i></button>
              </div>
            </div>
            <div className="box-body no-padding">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th className="width10px">Vencimento</th>
                    <th>Cliente</th>
                    <th>Descrição</th>
                    <th>Status</th>
                    <th>Conclusão</th>
                    <th className="width10px">Usuário</th>
                    <th className="width10px">Parcela</th>
                    <th className="text-right width10px">Valor</th>
                    <th className="width10px">&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  {databillings.map(res => (
                    <tr key={res.id}>
                      <td>{res.dtscheduling}</td>
                      <td className="text-uppercase">{res.desname}</td>
                      <td className="text-uppercase">{res.desdescription}</td>
                      <td className="text-uppercase">{res.desstatus}</td>
                      <td className="text-uppercase">{res.desresult}</td>
                      <td className="text-uppercase">{res.desuser}</td>
                      <td className="text-center">{res.parcel}</td>
                      <td className="text-right">{res.dbvalue}</td>
                      <td>
                        <a href="#" onClick={ () => handleModal(res) }>
                          <span className="badge bg-yellow">IR</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="modalBilling" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          {dataform != '' && <ModalBilling dataform={dataform}/>}
        </div>
      </div>
    </>
  )
}

export default BillingModule