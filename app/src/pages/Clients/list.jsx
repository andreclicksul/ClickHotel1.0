import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { AuthContext, MainContext } from "../../contexts/context"
import { get } from "../../services/api"

const ListAll = () => {

  const { innerHeight: height } = window

  const { user } = useContext(AuthContext)

  const { logout } = useContext(MainContext)  

  const [ secread, setSecread] = useState('')
  
  const [ secinsert, setSecinsert] = useState('')

  const list = async () => {

    try {
      const response = await get(`clients.php?op=0&email=${user.email}&token=${user.token}`)

      if (response.status != 200) {
        logout(response.status)
        return
      }

      let arrayTarget = [
        { 
          targets: 0,
          orderable: false,
          visible: false,
          searchable: false
        },
        { 
          targets: [1, 5],
          className: 'td-verticalcenter text-uppercase'
        },
        { 
          targets: [2, 3],
          className: 'td-verticalcenter'
        },
        { 
          targets: 4,
          className: 'td-verticalcenter text-lowercase'
        },
        { 
          targets: 6,
          orderable: false,
          className: 'col-md-1 text-center'
        }
      ]

      let arrayData = response.clients.map(item => 
        [
          item.idclient,
          item.desname, 
          item.desphone, 
          item.descel, 
          item.desemail, 
          item.desresponsavel, 
          `<a href="/clients/update/${item.idclient}" class="btn btn-warning btn-sm ${secread}">
            <i class="fa fa-pencil-square"></i>&nbsp;&nbsp;&nbsp;Editar
           </a>`
        ]
      )
  
      $("#tableClients").DataTable({
        language: {
          url: '../res/admin/plugins/datatables/languagePT-BR.json'
        },
        columns: [
         { id: 'ID'},
         { title: 'Cliente'}, 
         { title: 'Telefone'}, 
         { title: 'Celular'}, 
         { title: 'E-mail'}, 
         { title: 'Responsável'}, 
         { title: ''}
        ],
        data: arrayData,
        columnDefs: arrayTarget,
        deferRender: true
      })

      setSecread(response.secRead)

      setSecinsert(response.secInsert)

    } catch (e) {
      logout('301')
      return     
    }     
  }

  useEffect( () => {
    list()
  }, [])

  return (
      <>
        <section className="content" style={{minHeight: `${innerHeight-142}px` }}>  
          <div className="row">
            <div className="col-md-12">
              <div className="card card-warning">
                <div className="card-header d-flex align-items-center">
                  <h3 className="card-title mb-0"><span className="fontTitle">Clientes</span></h3>
                  <div className="card-tools">
                    <Link to={`${secinsert == 'nok' ? '/clients/create' : '#'}`}>
                      <span className={`btn btn-outline-secondary ${secinsert}`}>
                        <i className="fas fa-plus-square"></i>&nbsp;&nbsp;&nbsp;Adicionar
                      </span>
                    </Link>
                  </div>
                </div>
                <div className="card-body">
                  <table id="tableClients" className="table table-bordered table-striped">
                  </table>                  
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
  )
}

export default ListAll
