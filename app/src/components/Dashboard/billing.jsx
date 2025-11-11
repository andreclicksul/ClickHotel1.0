import { useContext, useEffect, useState } from "react"
import { BillingContext } from "../../contexts/context"

const BillingModule = () => {
  const { databillings = [], readBilling } = useContext(BillingContext)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!initialized && typeof readBilling === 'function') {
      readBilling()
      setInitialized(true)
    }
  }, [initialized, readBilling])

  return (
    <div className="row">
      <div className="col-12">
        <div className="card card-outline card-danger shadow-none" style={{ borderColor: '#dc3545' }}>
          <div className="card-header border-0" style={{ backgroundColor: '#ffffff', padding: '20px 24px' }}>
            <h3 className="card-title" style={{ color: '#000', fontSize: '18px', margin: 0 }}>
              Hóspedes Entrando Hoje
            </h3>
          </div>

          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table mb-0" style={{ border: 'none' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9f9f9', color: '#000', fontWeight: 700, fontSize: '14px' }}>
                    {['Nome', 'Observação', 'E-mail', 'Celular'].map((header) => (
                      <th key={header} style={{ padding: '8px', border: 'none' }}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {databillings.map((record, index) => (
                    <tr
                      key={`${record.desemail}-${index}`}
                      style={{
                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9',
                        color: '#000',
                        fontSize: '14px',
                      }}
                    >
                      {['desname', 'desobs', 'desemail', 'descel'].map((field) => (
                        <td
                          key={field}
                          className="text-uppercase"
                          style={{ padding: '8px', border: 'none', fontWeight: 400 }}
                        >
                          {record[field]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BillingModule
