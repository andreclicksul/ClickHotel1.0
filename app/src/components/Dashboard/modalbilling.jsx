import { useContext, useState } from "react"
import ReactDatePicker from 'react-datepicker'
import ptBR from 'date-fns/locale/pt-BR'
import { MainContext, AuthContext, BillingContext } from "../../contexts/context"
import { post } from "../../services/api"

const parseDate = (value) => {
  if (!value || typeof value !== 'string') return null
  const parts = value.split(/[\/\-]/)
  if (parts.length < 3) return null
  const [day, month, year] = parts.map((part) => parseInt(part, 10))
  if (!day || !month || !year) return null
  const parsed = new Date(year, month - 1, day)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const formatDate = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return ''
  const day = `${date.getDate()}`.padStart(2, '0')
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

const ModalBilling = ({ dataform }) => {
  const { logout } = useContext(MainContext)
  const { user } = useContext(AuthContext)
  const { updateBillings } = useContext(BillingContext)

  const [dueDate, setDueDate] = useState(() => parseDate(dataform?.dtscheduling))
  const [data, setData] = useState({
    op: 2,
    id: dataform?.id,
    desuser: user?.desuser ?? '',
    desstatus: dataform?.desstatus ?? '',
    desresult: dataform?.desresult ?? '',
    dtscheduling: dataform?.dtscheduling ?? '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleDateChange = (date) => {
    setDueDate(date)
    setData((current) => ({ ...current, dtscheduling: formatDate(date) }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      // const response = await post('dashboard.php', data)
      // updateBillings(response.billing)
      updateBillings([])
    } catch (error) {
      logout?.(302)
    }
  }

  return (
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Mudança de Status e Conclusão</h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">×</span>
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          <div className="form-row">
            <div className="form-group col-md-4">
              <label htmlFor="dtscheduling">Vencimento</label>
              <ReactDatePicker
                selected={dueDate}
                onChange={handleDateChange}
                locale={ptBR}
                dateFormat="dd/MM/yyyy"
                className="form-control text-center"
                name="dtscheduling"
                placeholderText="Selecione a data"
                showPopperArrow={false}
                calendarStartDay={1}
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="dbvalue">Valor</label>
              <input
                type="text"
                name="dbvalue"
                className="form-control text-right"
                readOnly
                value={dataform?.dbvalue ?? ''}
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="parcel">Parcela</label>
              <input
                type="text"
                name="parcel"
                className="form-control text-center"
                readOnly
                value={dataform?.parcel ?? ''}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="desname">Cliente</label>
            <input
              type="text"
              name="desname"
              className="form-control text-uppercase"
              readOnly
              value={dataform?.desname ?? ''}
            />
          </div>

          <div className="form-group">
            <label htmlFor="desdescription">Descrição</label>
            <input
              type="text"
              name="desdescription"
              className="form-control text-uppercase"
              readOnly
              value={dataform?.desdescription ?? ''}
            />
          </div>

          <div className="form-group">
            <label htmlFor="desresponsavel">Responsável</label>
            <input
              type="text"
              name="desresponsavel"
              className="form-control text-uppercase"
              readOnly
              value={dataform?.desresponsavel ?? ''}
            />
          </div>

          <div className="form-group">
            <label htmlFor="desemail">E-mail</label>
            <input
              type="text"
              name="desemail"
              className="form-control"
              readOnly
              value={dataform?.desemail ?? ''}
            />
          </div>

          <div className="form-group">
            <label htmlFor="descel">Celular</label>
            <input
              type="text"
              name="descel"
              className="form-control text-center"
              readOnly
              value={dataform?.descel ?? ''}
            />
          </div>

          <div className="form-group">
            <label htmlFor="desstatus">Status</label>
            <input
              type="text"
              name="desstatus"
              className="form-control text-uppercase"
              maxLength={80}
              value={data.desstatus}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="desresult">Conclusão</label>
            <input
              type="text"
              name="desresult"
              className="form-control text-uppercase"
              maxLength={80}
              value={data.desresult}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="modal-footer justify-content-between">
          <button type="button" className="btn btn-secondary" data-dismiss="modal">Fechar</button>
          <button type="submit" className="btn btn-primary">Atualizar</button>
        </div>
      </form>
    </div>
  )
}

export default ModalBilling
