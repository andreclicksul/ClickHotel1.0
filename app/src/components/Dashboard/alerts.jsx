import { useContext, useEffect, useState } from "react"
import { MainContext, BillingContext } from "../../contexts/context"

const DashboardAlerts = () => {
  const { datadash, readDash } = useContext(BillingContext)

  const { permissions } = useContext(MainContext)

  const displayValue = key => permissions[key] >= 1 ? datadash[key] : '---'

  useEffect(readDash, [readDash])

  return (
    <div className="row">
      {[ 'vcr', 'vcratr', 'vcp', 'vcpatr' ].map(key => (
        <div className="col-6 col-lg-3" key={key}>
          <div className={`small-box bg-${key === 'vcr' ? 'aqua' : key === 'vcratr' ? 'red' : key === 'vcp' ? 'green' : 'yellow'}`}>
            <div className="inner"> 
              <h3>{displayValue(key)}</h3>
              <h4>{key === 'vcr' ? 'Contas a Receber Hoje' : 
                   key === 'vcratr' ? 'Contas a Receber em Atraso' : 
                   key === 'vcp' ? 'Contas a Pagar Hoje' : 'Contas a Pagar em Atraso'}
              </h4>
            </div>  
            <div className="icon">
              <i className={`${key === 'vcr' ? 'glyphicon glyphicon-piggy-bank' : 
                               key === 'vcratr' ? 'ion ion-nuclear' : 
                               key === 'vcp' ? 'ion ion-ios-cart' : 'fa fa-bomb'}`} style={{ fontSize: '70px' }}>
              </i>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DashboardAlerts
