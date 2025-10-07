import { useContext, useEffect } from "react"
import { MainContext, BillingContext } from "../../contexts/context"

const ALERT_CONFIG = [
  {
    key: 'vcr',
    label: 'Contas a Receber Hoje',
    bgClass: 'bg-info',
    iconClass: 'fas fa-piggy-bank',
    permissionKey: 'cliente',
  },
  {
    key: 'vcratr',
    label: 'Contas a Receber em Atraso',
    bgClass: 'bg-danger',
    iconClass: 'fas fa-exclamation-triangle',
    permissionKey: 'cliente',
  },
  {
    key: 'vcp',
    label: 'Contas a Pagar Hoje',
    bgClass: 'bg-success',
    iconClass: 'fas fa-shopping-cart',
    permissionKey: 'financeiro',
  },
  {
    key: 'vcpatr',
    label: 'Contas a Pagar em Atraso',
    bgClass: 'bg-warning',
    iconClass: 'fas fa-bomb',
    permissionKey: 'financeiro',
  },
]

const DashboardAlerts = () => {
  const { datadash = {}, readDash } = useContext(BillingContext)
  const { permissions = {} } = useContext(MainContext)

  useEffect(() => {
    if (typeof readDash === 'function') {
      readDash()
    }
  }, [readDash])

  const hasPermission = (config) => (permissions?.[config.permissionKey] ?? 0) >= 1
  const displayValue = (key) => datadash?.[key] ?? 0

  return (
    <div className="row">
      {ALERT_CONFIG.filter(hasPermission).map((config) => (
        <div className="col-sm-6 col-lg-3" key={config.key}>
          <div className={`small-box ${config.bgClass}`}>
            <div className="inner">
              <h3>{displayValue(config.key)}</h3>
              <p>{config.label}</p>
            </div>
            <div className="icon">
              <i className={config.iconClass}></i>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DashboardAlerts
