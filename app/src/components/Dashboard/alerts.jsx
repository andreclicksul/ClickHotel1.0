import { useContext, useEffect, useState } from "react"
import { MainContext, BillingContext } from "../../contexts/context"

const DashboardAlerts = () => {
  
  const font70 = {
    fontSize: "70px"
  }
  const font80 = {
    fontSize: "70px"
  }

  const { datadash, readDash } = useContext(BillingContext)

  const { permissions } = useContext(MainContext)

  const [ readonly, setReadonly ] = useState(false)

  useEffect( () => {
    if (!readonly) {
      setReadonly(true)
      readDash()
    }
  })

  return (
    <div className="row">
      <div className="col-lg-3 col-xs-6">
        <div className="small-box bg-aqua">
          <div className="inner"> 
            <h3>
              { permissions.cr >= 1 ?
                ( 
                  datadash.vcr
                )
                :
                (
                  <span>---</span>
                )
              }
            </h3>
            <h4>Contas a Receber Hoje</h4>
          </div>  
          <div className="icon">
            <i className="glyphicon glyphicon-piggy-bank" style={font70}></i>
          </div>
        </div>
      </div>

      <div className="col-lg-3 col-xs-6">
        <div className="small-box bg-red">
          <div className="inner">
            <h3>
              { permissions.billing >= 1 ?
                ( 
                  datadash.vcratr
                )
                :
                (
                  <span>---</span>
                )
              }              
            </h3>
            <h4>Contas a Receber em Atraso</h4>
          </div>
          <div className="icon">
            <i className="ion ion-nuclear" style={font70}></i>
          </div>
        </div>
      </div>

      <div className="col-lg-3 col-xs-6">
        <div className="small-box bg-green">
          <div className="inner">
            <h3>
              { permissions.cp >= 1 ?
                ( 
                  datadash.vcp
                )
                :
                (
                  <span>---</span>
                )
              }   
            </h3>           
            <h4>Contas a Pagar Hoje</h4>
          </div>
          <div className="icon">
            <i className="ion ion-ios-cart" style={font80}></i>
          </div>
        </div>
      </div>

      <div className="col-lg-3 col-xs-6">
        <div className="small-box bg-yellow">
          <div className="inner">
            <h3>
              { permissions.cp >= 1 ?
                ( 
                  datadash.vcpatr
                )
                :
                (
                  <span>---</span>
                )
              }              
            </h3>
            <h4>Contas a Pagar em Atraso</h4>
          </div>
          <div className="icon">
            <i className="fa fa-bomb" style={font70}></i>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardAlerts