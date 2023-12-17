import { useContext } from "react"
import { MainContext } from "../../contexts/context"
import { BillingProvider } from "../../contexts/billing"
import DashboardAlerts from "../Dashboard/alerts"
import BillingModule from "../Dashboard/billing"
import RecentClients from "../Dashboard/recentclients"
import GraphicsDashboad from "../Dashboard/graphics"

const Content = () => {

  const { innerHeight: height } = window

  const { permissions } = useContext(MainContext)  

  return (
    <> 
      <section className="content-header">
        <h1>
          Dashboard
        </h1>
      </section>

      <section className="content" style={{minHeight: `${innerHeight-142}px` }}>
        <span id="typeForm" className="ls-display-none">dashboard</span>
        <section className="content">
          <BillingProvider>
            <DashboardAlerts />
            { permissions.billing >= 3 &&
              <BillingModule />
            }
            <div className="row">
              { permissions.financeiro == 4 &&
                <GraphicsDashboad />
              }
              <RecentClients />
            </div>
          </BillingProvider>            
        </section>
      </section>
    </>
  )

}

export default Content