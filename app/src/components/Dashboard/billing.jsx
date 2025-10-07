import { useContext, useEffect, useState } from "react"
import { BillingContext } from "../../contexts/context"
import ModalBilling from "./modalbilling"

const BillingModule = () => {
  const { databillings = [], readBilling } = useContext(BillingContext)

  const [dataform, setDataform] = useState(null)
  const [initialized, setInitialized] = useState(false)

  const handleModal = (record) => {
    setDataform(record)
    window.$('#modalBilling').modal('show')
  }

  useEffect(() => {
    if (!initialized && typeof readBilling === 'function') {
      readBilling()
      setInitialized(true)
    }
  }, [initialized, readBilling])

  return (
    <div className="row">
      <div className="col-12">
        <div className="card card-warning">
          <div className="card-header">
            <h3 className="card-title text-black">Módulo de Cobranças</h3>
            <div className="card-tools">
              <button type="button" className="btn btn-tool" data-card-widget="collapse">
                <i className="fas fa-minus"></i>
              </button>
            </div>
          </div>

          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-warning">
                  <tr>
                    <th>Vencimento</th>
                    <th>Cliente</th>
                    <th>Descrição</th>
                    <th>Status</th>
                    <th>Conclusão</th>
                    <th>Usuário</th>
                    <th className="text-center">Parcela</th>
                    <th className="text-right">Valor</th>
                    <th className="text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {databillings.map((record) => (
                    <tr key={record.id}>
                      <td>{record.dtscheduling}</td>
                      <td className="text-uppercase">{record.desname}</td>
                      <td className="text-uppercase">{record.desdescription}</td>
                      <td className="text-uppercase">{record.desstatus}</td>
                      <td className="text-uppercase">{record.desresult}</td>
                      <td className="text-uppercase">{record.desuser}</td>
                      <td className="text-center">{record.parcel}</td>
                      <td className="text-right">{record.dbvalue}</td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => handleModal(record)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
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
          {dataform && <ModalBilling dataform={dataform} />}
        </div>
      </div>
    </div>
  )
}

export default BillingModule
