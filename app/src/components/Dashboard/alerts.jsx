import { useContext, useEffect } from "react"
import { MainContext, BillingContext } from "../../contexts/context"

const ALERT_CONFIG = [
  {
    key: 'v_entry',
    label: 'Entrando Hoje',
    bgClass: 'bg-success',
    iconClass: 'fas fa-bed',
    permissionKey: 'occupationmap',
  },
  {
    key: 'v_exit',
    label: 'Saindo Hoje',
    bgClass: 'bg-cyan',
    iconClass: 'fas fa-suitcase',
    permissionKey: 'occupationmap',
  },
  {
    key: 'v_nextweek',
    label: 'Próxima Semana',
    bgClass: 'bg-purple',
    iconClass: 'fas fa-calendar-alt',
    permissionKey: 'occupationmap',
  },
  {
    key: 'v_prebook',
    label: 'Pré Reservas',
    bgClass: 'bg-yellow',
    iconClass: 'fas fa-arrow-circle-right',
    textClass: 'text-white',
    permissionKey: 'occupationmap',
  },
  {
    key: 'v_cptoday',
    label: 'Contas a Pagar',
    bgClass: 'bg-red',
    iconClass: 'fas fa-radiation',
    textClass: 'text-white',
    permissionKey: 'cp',
  },  
  {
    key: 'v_cpdelay',
    label: 'Contas Vencidas',
    bgClass: 'bg-pink',
    iconClass: 'fas fa-bomb',
    textClass: 'text-white',
    permissionKey: 'cp',
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

  const hasAnyOccupationMap = (permissions?.occupationmap ?? 0) >= 1
  const hasAnyCp = (permissions?.cp ?? 0) >= 1

  const filteredConfigs = ALERT_CONFIG.filter(hasPermission)

  if (!filteredConfigs.length) {
    return null
  }

  const columnClass = (() => {
    if (hasAnyOccupationMap && hasAnyCp) return 'col-sm-6 col-lg-2'
    if (hasAnyOccupationMap) return 'col-sm-6 col-lg-3'
    if (hasAnyCp) return 'col-sm-6 col-lg-6'
    return 'col-sm-6 col-lg-6'
  })()

  return (
    <div className="row">
      {filteredConfigs.map((config) => (
        <div className={columnClass} key={config.key}>
          <div className={`small-box ${config.bgClass}`}>
            <div className={`inner ${config.textClass ?? ''}`}>
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
