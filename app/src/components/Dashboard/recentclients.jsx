import { useContext, useEffect, useState } from "react"
import { BillingContext } from "../../contexts/context"
import { Link } from "react-router-dom"

const RecentClients = () => {

  const { dataclients } = useContext(BillingContext)

  const [ data, setData ] = useState([])

  useEffect( () => {
    if (data == '' && dataclients != undefined && dataclients != '') {
      setData(dataclients)
    }
  }, [dataclients])

  return ( 
    <div className="col-md-5">
      <div className="box box-success">
        <div className="box-header with-border">
          <a href="#" id="divClient"><h3 className="box-title text-black">Clientes Adicionados Recentemente</h3></a>

          <div className="box-tools pull-right">
            <button type="button" id="buttonClient" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus"></i></button>
          </div>
        </div>
        <div className="box-body no-padding">
          <table className="table table-striped">
            <thead>
              <tr>
                <th className="width10px">ID</th>
                <th>Cliente</th>
                <th className="width10px">Registro</th>
                <th className="width10px">&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {data.map(res => (
                <tr key={res.idclient}>
                  <td>{res.idclient}</td>
                  <td className="text-uppercase">{res.desname}</td>
                  <td>{res.dtregister}</td>
                  <td>
                    <Link to={`/clients/update/${res.idclient}`}>
                      <span className="badge bg-green">IR</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default RecentClients