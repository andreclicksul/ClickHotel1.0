import { useContext } from "react"
import { Link } from "react-router-dom"
import { MainContext } from "../../contexts/context"

const Aside = () => {

  const { data, permissions } = useContext(MainContext)

  return (
    <aside className="main-sidebar">
      <section className="sidebar">
        <div className="user-panel">
          <div className="pull-left image">
            <img src={data.srcAvatar} className="img-circle" alt="User Image" />
          </div>
          <div className="pull-left info">
            <p>{data.desuser}</p>
            <a href="#"><i className="fa fa-circle text-success"></i> Online</a>
          </div>
        </div>

        <ul className="sidebar-menu">
          <li className="header">MENU DE NAVEGAÇÃO</li>
          <li className="treeview">
            <a href="#">
              <i className="fa fa-users"></i>
              <span>Cadastro</span>
              <span className="pull-right-container">
                <i className="fa fa-angle-left pull-right"></i>
              </span>
            </a>
            <ul className="treeview-menu menu-open">
              {permissions.cliente > 0 &&
                <li><Link to="/clients"><i className="fa fa-circle-o text-yellow"></i> Clientes</Link></li>
              }
              {permissions.fornecedor > 0 &&
                <li><Link to="/providers"><i className="fa fa-circle-o text-purple"></i> Fornecedores</Link></li>
              }
              {permissions.cadusuario > 0 &&
                <li><Link to="/users"><i className="fa fa-circle-o text-red"></i> Usuários</Link></li>
              }
            </ul>
          </li>

          {permissions.financeiro > 0 &&
            <li className="treeview">
              <a href="#">
                <i className="fa fa-dollar"></i>
                <span>Financeiro</span>
                <span className="pull-right-container">
                  <i className="fa fa-angle-left pull-right"></i>
                </span>
              </a>
              <ul className="treeview-menu menu-open">
                <li><Link to="/accountplain"><i className="fa fa-circle-o text-yellow"></i> Plano de Contas</Link></li>
                <li><Link to="/banks"><i className="fa fa-circle-o text-purple"></i> Bancos</Link></li>
                {permissions.cp > 0 &&
                  <li><Link to="/pay/0/index"><i className="fa fa-circle-o text-red"></i> Contas a Pagar</Link></li>
                }
                {permissions.cr > 0 &&
                  <li><Link to="/rec/0/index"><i className="fa fa-circle-o text-blue"></i> Contas a Receber</Link></li>
                }
                <li><Link to="/financial"><i className="fa fa-circle-o text-green"></i> Fluxo Financeiro</Link></li>
                <li><Link to="/accounts"><i className="fa fa-circle-o text-gray"></i> Baixa Automática</Link></li>
              </ul>
            </li>
          }

          <li><Link to="/mydata/0"><i className="fa fa-user-secret"></i> <span>Meus Dados</span></Link></li>

          {permissions.auditoria > 0 &&
            <li><Link to="/audits/0"><i className="fa fa-spinner"></i> <span>Auditoria</span></Link></li>
          }
          
        </ul>
      </section>
    </aside>     
  )


}

export default Aside