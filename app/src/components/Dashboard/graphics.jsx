import { useState, useEffect, useContext } from 'react'
import { MainContext } from '../../contexts/context'
import { get } from '../../services/api';
import GraphicRechart from '../Graphics';

const DEFAULT_LABELS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
const SAMPLE_REVENUE = [10, 20, 15, 16, 23, 54]
const SAMPLE_EXPENSE = [3, 8, 25, 12, 13, 21]

const ensureChartData = (entries = []) => {
  return entries.map((entry, index) => {
    if (entry == null) {
      return {
        mounth: DEFAULT_LABELS[index] ?? `Item ${index + 1}`,
        Valor: 0,
      }
    }

    if (typeof entry === 'number') {
      return {
        mounth: DEFAULT_LABELS[index] ?? `Item ${index + 1}`,
        Valor: entry,
      }
    }

    const label = entry.mounth ?? entry.textdtpayment ?? entry.label ?? DEFAULT_LABELS[index] ?? `Item ${index + 1}`
    const value = Number(entry.Valor ?? entry.value ?? entry.valuepay ?? entry.total ?? entry.amount ?? 0)

    return {
      mounth: label,
      Valor: Number.isFinite(value) ? value : 0,
    }
  })
}

const GraphicsDashboad = () => {

  const { logout } = useContext(MainContext)

  const [ readonly, setReadonly ] = useState(false)

  const [ graph1, setGraph1 ] = useState(() => ensureChartData(SAMPLE_REVENUE))

  const [ graph2, setGraph2 ] = useState(() => ensureChartData(SAMPLE_EXPENSE))

  const readGraph = async () => {

    try {
      const response = await get('dashboard.php?op=3')
      const income = ensureChartData(response?.res1 ?? [])
      const expenses = ensureChartData(response?.res2 ?? [])

      setGraph1(income.length ? income : ensureChartData(SAMPLE_REVENUE))
      setGraph2(expenses.length ? expenses : ensureChartData(SAMPLE_EXPENSE))

    } catch (e) {
      setGraph1(ensureChartData(SAMPLE_REVENUE))
      setGraph2(ensureChartData(SAMPLE_EXPENSE))
      logout('301')
    }
  }

  useEffect( () => {
    if (!readonly) {
      readGraph()
      setReadonly(true)
    }
  }, [])

  return (
    <>
      <div className="col-md-7">
        <div className="card card-primary collapsed-card">
          <div className="card-header">
            <span id="opgraph1" className="ls-display-none">0</span>
            <a href="#" id="divGraph1">
              <h3 className="card-title text-black">Receita</h3>
            </a>
            <div className="card-tools">
              <button type="button" className="btn btn-tool" data-card-widget="collapse">
                <i id="typeButton1" className="fas fa-plus"></i>
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="chart" id="chart1" style={{ height: '300px' }}>
              <GraphicRechart data={graph1} barcolor={"#3c8dbc"} />
            </div>
          </div>
        </div>
        <div className="card card-danger collapsed-card">
          <div className="card-header">
            <span id="opgraph2" className="ls-display-none">0</span>
            <a href="#" id="divGraph2">
              <h3 className="card-title text-black">Despesas</h3>
            </a>
            <div className="card-tools">
              <button type="button" className="btn btn-tool" data-card-widget="collapse">
                <i id="typeButton2" className="fas fa-plus"></i>
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="chart" id="chart2" style={{ height: '300px' }}>
              <GraphicRechart data={graph2} barcolor={"#dd4b39"} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default GraphicsDashboad
