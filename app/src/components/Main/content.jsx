import { useContext } from "react"
import { MainContext } from "../../contexts/context"
import { BillingProvider } from "../../contexts/billing"
import DashboardAlerts from "../Dashboard/alerts"
import BillingModule from "../Dashboard/billing"
import RecentClients from "../Dashboard/recentclients"
import GraphicsDashboad from "../Dashboard/graphics"

const Content = () => {
  const { permissions = {} } = useContext(MainContext)
  const billingEnabled = (permissions.billing ?? 0) >= 3
  const financeEnabled = (permissions.financeiro ?? 0) >= 4

  const browserHeight = typeof window !== 'undefined' ? window.innerHeight : 768
  const contentMinHeight = `${browserHeight - 142}px`

  return (
    <section className="content-wrapper">
      <section className="content-header">
        <h1>Dashboard</h1>
      </section>

      <section className="content" style={{ minHeight: contentMinHeight }}>
        <BillingProvider>
          <DashboardAlerts />

          {billingEnabled && <BillingModule />}

          <div className="row">
            {financeEnabled && <GraphicsDashboad />}
            <RecentClients />
          </div>
        </BillingProvider>
      </section>
    </section>
  )
}

export default Content
