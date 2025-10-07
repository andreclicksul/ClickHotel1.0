import { useContext, useEffect, useState } from "react"
import { BillingContext } from "../../contexts/context"
import { Link } from "react-router-dom"

const RecentClients = () => {
  const { dataclients = [] } = useContext(BillingContext)
  const [clients, setClients] = useState([])

  useEffect(() => {
    if (Array.isArray(dataclients) && dataclients.length) {
      setClients(dataclients)
    } else {
      setClients([])
    }
  }, [dataclients])

  return (
    <div className="col-12 col-lg-5">
      <div className="card card-success">
        <div className="card-header">
          <h3 className="card-title text-black">Clientes Adicionados Recentemente</h3>
          <div className="card-tools">
            <button type="button" className="btn btn-tool" data-card-widget="collapse">
              <i className="fas fa-minus"></i>
            </button>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-success">
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Registro</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.idclient}>
                    <td>{client.idclient}</td>
                    <td className="text-uppercase">{client.desname}</td>
                    <td>{client.dtregister}</td>
                    <td className="text-center">
                      <Link to={`/clients/update/${client.idclient}`} className="btn btn-sm btn-outline-success">
                        <i className="fas fa-arrow-right"></i>
                      </Link>
                    </td>
                  </tr>
                ))}
                {!clients.length && (
                  <tr>
                    <td colSpan={4} className="text-center text-muted">
                      Nenhum cliente recente encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecentClients
