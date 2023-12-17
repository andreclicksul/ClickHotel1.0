import { useState, useEffect, useContext } from 'react'
import { MainContext } from '../../contexts/context'
import { get } from '../../services/api';
import GraphicRechart from '../Graphics';

const GraphicsDashboad = () => {

  const { logout } = useContext(MainContext)

  const [ readonly, setReadonly ] = useState(false)

  const [ graph1, setGraph1 ] = useState([])
  
  const [ graph2, setGraph2 ] = useState([])

  const readGraph = async () => {

    try {
      let data1 = []
      let data2 = []

      const response = await get(`dashboard.php?op=3`)

      response.res1.forEach(element => data1.push({mounth: element.textdtpayment, Valor: parseInt(element.valuepay)}))

      setGraph1(data1)

      response.res2.forEach(element => data2.push({mounth: element.textdtpayment, Valor: parseInt(element.valuepay)}))

      setGraph2(data2)

    } catch (e) {
      logout('301')
      return
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
        <div className="box box-primary collapsed-box">
          <div className="box-header with-border">
            <span id="opgraph1" className="ls-display-none">0</span>
            <a href="#" id="divGraph1">
              <h3 className="box-title text-black">Receita</h3>
            </a>
            <div className="box-tools pull-right">
              <button type="button" className="btn btn-box-tool" data-widget="collapse">
                <i id="typeButton1" className="fa fa-plus"></i>
              </button>
            </div>
          </div>
          <div className="box-body chart-responsive">
            <div className="chart" id="chart1" style={{Heigh: '300px'}}>
              <GraphicRechart data={graph1} barcolor={"#3c8dbc"} />
            </div>
          </div>
        </div>
        <div className="box box-danger collapsed-box">
          <div className="box-header with-border">
            <span id="opgraph2" className="ls-display-none">0</span>
            <a href="#" id="divGraph2">
              <h3 className="box-title text-black">Despesas</h3>
            </a>
            <div className="box-tools pull-right">
              <button type="button" className="btn btn-box-tool" data-widget="collapse">
                <i id="typeButton2" className="fa fa-plus"></i>
              </button>
            </div>
          </div>
          <div className="box-body chart-responsive">
            <div className="chart" id="chart2" style={{Heigh: '300px'}}>
              <GraphicRechart data={graph2} barcolor={"#dd4b39"} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default GraphicsDashboad