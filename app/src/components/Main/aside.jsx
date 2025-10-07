import { useContext } from "react"
import { Link } from "react-router-dom"
import { MainContext } from "../../contexts/context"

const Aside = () => {
  const { data = {}, permissions = {} } = useContext(MainContext)

  const avatarSrc = data.srcAvatar || '/res/admin/avatar/avatar1.png'
  const userName = data.desuser || 'Usuário'

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <Link to="/home" className="brand-link">
        <span className="brand-text font-weight-light">Clicksul</span>
      </Link>

      <div className="sidebar">
        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            <li className="nav-header">MENU DE NAVEGAÇÃO</li>

            <li className="nav-item has-treeview menu-open">
              <a href="#" className="nav-link">
                <i className="nav-icon fas fa-users"></i>
                <p>
                  Cadastro
                  <i className="right fas fa-angle-left"></i>
                </p>
              </a>
              <ul className="nav nav-treeview">
                {permissions.cliente > 0 && (
                  <li className="nav-item">
                    <Link to="/clients" className="nav-link">
                      <i className="far fa-circle nav-icon text-warning"></i>
                      <p>Clientes</p>
                    </Link>
                  </li>
                )}
                {permissions.fornecedor > 0 && (
                  <li className="nav-item">
                    <Link to="/providers" className="nav-link">
                      <i className="far fa-circle nav-icon text-purple"></i>
                      <p>Fornecedores</p>
                    </Link>
                  </li>
                )}
                {permissions.cadusuario > 0 && (
                  <li className="nav-item">
                    <Link to="/users" className="nav-link">
                      <i className="far fa-circle nav-icon text-danger"></i>
                      <p>Usuários</p>
                    </Link>
                  </li>
                )}
              </ul>
            </li>

            {permissions.financeiro > 0 && (
              <li className="nav-item has-treeview">
                <a href="#" className="nav-link">
                  <i className="nav-icon fas fa-dollar-sign"></i>
                  <p>
                    Financeiro
                    <i className="right fas fa-angle-left"></i>
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link to="/accountplain" className="nav-link">
                      <i className="far fa-circle nav-icon text-warning"></i>
                      <p>Plano de Contas</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/banks" className="nav-link">
                      <i className="far fa-circle nav-icon text-purple"></i>
                      <p>Bancos</p>
                    </Link>
                  </li>
                  {permissions.cp > 0 && (
                    <li className="nav-item">
                      <Link to="/pay/0/index" className="nav-link">
                        <i className="far fa-circle nav-icon text-danger"></i>
                        <p>Contas a Pagar</p>
                      </Link>
                    </li>
                  )}
                  {permissions.cr > 0 && (
                    <li className="nav-item">
                      <Link to="/rec/0/index" className="nav-link">
                        <i className="far fa-circle nav-icon text-primary"></i>
                        <p>Contas a Receber</p>
                      </Link>
                    </li>
                  )}
                  <li className="nav-item">
                    <Link to="/financial" className="nav-link">
                      <i className="far fa-circle nav-icon text-success"></i>
                      <p>Fluxo Financeiro</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/accounts" className="nav-link">
                      <i className="far fa-circle nav-icon text-secondary"></i>
                      <p>Baixa Automática</p>
                    </Link>
                  </li>
                </ul>
              </li>
            )}

            <li className="nav-item">
              <Link to="/mydata/0" className="nav-link">
                <i className="nav-icon fas fa-user-secret"></i>
                <p>Meus Dados</p>
              </Link>
            </li>

            {permissions.auditoria > 0 && (
              <li className="nav-item">
                <Link to="/audits/0" className="nav-link">
                  <i className="nav-icon fas fa-stream"></i>
                  <p>Auditoria</p>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </aside>
  )
}

export default Aside
