import { useState, useEffect } from 'react'
import GraphicRechart from '../Graphics'

const MOCK_REVENUE = [
  { mounth: 'Jan', Valor: 120 },
  { mounth: 'Fev', Valor: 95 },
  { mounth: 'Mar', Valor: 132 },
  { mounth: 'Abr', Valor: 101 },
  { mounth: 'Mai', Valor: 160 },
  { mounth: 'Jun', Valor: 142 },
  { mounth: 'Jul', Valor: 185 },
  { mounth: 'Ago', Valor: 172 },
  { mounth: 'Set', Valor: 155 },
  { mounth: 'Out', Valor: 198 },
  { mounth: 'Nov', Valor: 210 },
  { mounth: 'Dez', Valor: 230 },
  { mounth: 'Jan', Valor: 120 },
  { mounth: 'Fev', Valor: 95 },
  { mounth: 'Mar', Valor: 132 },
  { mounth: 'Abr', Valor: 101 },
  { mounth: 'Mai', Valor: 160 },
  { mounth: 'Jun', Valor: 142 },
  { mounth: 'Jul', Valor: 185 },
  { mounth: 'Ago', Valor: 172 },
  { mounth: 'Set', Valor: 155 },
  { mounth: 'Out', Valor: 198 },
  { mounth: 'Nov', Valor: 210 },
  { mounth: 'Dez', Valor: 230 },
]

const MOCK_EXPENSE = [
  { mounth: 'Jan', Valor: 80 },
  { mounth: 'Fev', Valor: 110 },
  { mounth: 'Mar', Valor: 90 },
  { mounth: 'Abr', Valor: 75 },
  { mounth: 'Mai', Valor: 105 },
  { mounth: 'Jun', Valor: 98 },
  { mounth: 'Jul', Valor: 120 },
  { mounth: 'Ago', Valor: 130 },
  { mounth: 'Set', Valor: 115 },
  { mounth: 'Out', Valor: 125 },
  { mounth: 'Nov', Valor: 140 },
  { mounth: 'Dez', Valor: 150 },
  { mounth: 'Jan', Valor: 80 },
  { mounth: 'Fev', Valor: 110 },
  { mounth: 'Mar', Valor: 90 },
  { mounth: 'Abr', Valor: 75 },
  { mounth: 'Mai', Valor: 105 },
  { mounth: 'Jun', Valor: 98 },
  { mounth: 'Jul', Valor: 120 },
  { mounth: 'Ago', Valor: 130 },
  { mounth: 'Set', Valor: 115 },
  { mounth: 'Out', Valor: 125 },
  { mounth: 'Nov', Valor: 140 },
  { mounth: 'Dez', Valor: 150 },
]

const GraphicsDashboad = () => {
  const [initialized, setInitialized] = useState(false)
  const [graphRevenue, setGraphRevenue] = useState(MOCK_REVENUE)
  const [graphExpense, setGraphExpense] = useState(MOCK_EXPENSE)

  useEffect(() => {
    if (!initialized) {
      setGraphRevenue(MOCK_REVENUE)
      setGraphExpense(MOCK_EXPENSE)
      setInitialized(true)
    }
  }, [initialized])

  return (
    <>
      <div className="col-12 col-lg-6 mb-4">
        <div className="card card-primary">
          <div className="card-header">
            <h3 className="card-title text-black">Receita</h3>
            <div className="card-tools">
              <button type="button" className="btn btn-tool" data-card-widget="collapse">
                <i className="fas fa-minus"></i>
              </button>
            </div>
          </div>
          <div className="card-body">
            <div style={{ height: 320 }}>
              <GraphicRechart data={graphRevenue} barcolor="#3c8dbc" />
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-6 mb-4">
        <div className="card card-danger">
          <div className="card-header">
            <h3 className="card-title text-black">Despesas</h3>
            <div className="card-tools">
              <button type="button" className="btn btn-tool" data-card-widget="collapse">
                <i className="fas fa-minus"></i>
              </button>
            </div>
          </div>
          <div className="card-body">
            <div style={{ height: 320 }}>
              <GraphicRechart data={graphExpense} barcolor="#dd4b39" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default GraphicsDashboad
