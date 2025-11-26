import { useContext, useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { MainContext } from "../../contexts/context"

const Aside = () => {
  const { permissions = {} } = useContext(MainContext)
  const location = useLocation()
  const cadastroRoutes = ['/clients', '/providers', '/users']
  const isCadastroRouteActive = cadastroRoutes.some(route => location.pathname.startsWith(route))
  const [isCadastroOpen, setIsCadastroOpen] = useState(() => isCadastroRouteActive)

  useEffect(() => {
    if (isCadastroRouteActive) {
      setIsCadastroOpen(true)
    }
  }, [isCadastroRouteActive])

  const handleCadastroToggle = (event) => {
    event.preventDefault()
    setIsCadastroOpen((prev) => !prev)
  }

  const isClientsActive = location.pathname.startsWith('/clients')
  const isProvidersActive = location.pathname.startsWith('/providers')
  const isUsersActive = location.pathname.startsWith('/users')

  const hasCadastroPermission =
    (permissions.client ?? 0) > 0 ||
    (permissions.provider ?? 0) > 0 ||
    (permissions.caduser ?? 0) > 0

  const hasOccupationPermission = 
    (permissions.uh ?? 0) > 0 || 
    (permissions.occupationmap ?? 0) > 0 || 
    (permissions.checklist ?? 0) > 0

  return (
    <aside className="main-sidebar sidebar-dark-primary">
      <Link
        to="/home"
        className="brand-link text-center bg-info"
        style={{ padding: '0.873rem 0.5rem', borderBottom: 'none', borderRight: 'none', boxShadow: 'none' }}
      >
        <span className="brand-text font-weight-light d-block" style={{ fontSize: "1.15rem", color: '#fff' }}>
          Pousada Visconde de Mauá
        </span>
      </Link>

      <div className="sidebar">
        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            <li className="nav-header">MENU DE NAVEGAÇÃO</li>

            {hasCadastroPermission && (
              <li className={`nav-item has-treeview ${isCadastroOpen ? 'menu-open' : ''}`}>
                <a href="#" className={`nav-link ${isCadastroOpen ? 'active' : ''}`} onClick={handleCadastroToggle}>
                  <i className="nav-icon fas fa-users"></i>
                  <p>
                    Cadastro
                    <i className="right fas fa-angle-left"></i>
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  {permissions.client > 0 && (
                    <li className="nav-item">
                      <Link to="/clients" className={`nav-link ${isClientsActive ? 'active' : ''}`}>
                        <i className="far fa-circle nav-icon text-warning"></i>
                        <p>Clientes</p>
                      </Link>
                    </li>
                  )}
                  {permissions.provider > 0 && (
                    <li className="nav-item">
                      <Link to="/providers" className={`nav-link ${isProvidersActive ? 'active' : ''}`}>
                        <i className="far fa-circle nav-icon text-purple"></i>
                        <p>Fornecedores</p>
                      </Link>
                    </li>
                  )}
                  {permissions.caduser > 0 && (
                    <li className="nav-item">
                      <Link to="/users" className={`nav-link ${isUsersActive ? 'active' : ''}`}>
                        <i className="far fa-circle nav-icon text-danger"></i>
                        <p>Usuários</p>
                      </Link>
                    </li>
                  )}
                </ul>
              </li>
            )}

            {(permissions.financial ?? 0) > 0 && (
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
                    <Link to="/cashflowday" className="nav-link">
                      <i className="far fa-circle nav-icon text-success"></i>
                      <p>Caixa Diário</p>
                    </Link>
                  </li>
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
                  {permissions.accountpay > 0 && (
                    <li className="nav-item">
                      <Link to="/pay/0/index" className="nav-link">
                        <i className="far fa-circle nav-icon text-danger"></i>
                        <p>Contas a Pagar</p>
                      </Link>
                    </li>
                  )}
                  {permissions.accountreceive > 0 && (
                    <li className="nav-item">
                      <Link to="/rec/0/index" className="nav-link">
                        <i className="far fa-circle nav-icon text-primary"></i>
                        <p>Contas a Receber</p>
                      </Link>
                    </li>
                  )}
                  <li className="nav-item">
                    <Link to="/salescommission" className="nav-link">
                      <i className="far fa-circle nav-icon text-info"></i>
                      <p>Comissão de Vendas</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/financial" className="nav-link">
                      <i className="far fa-circle nav-icon text-secondary"></i>
                      <p>Fluxo Financeiro</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/result" className="nav-link">
                      <i className="far fa-circle nav-icon text-danger"></i>
                      <p>Resultado Estatístico</p>
                    </Link>
                  </li>
                </ul>
              </li>
            )}

            {(permissions.product ?? 0) > 0 && (
              <li className="nav-item has-treeview">
                <a href="#" className="nav-link">
                  <i className="nav-icon fas fa-box-open"></i>
                  <p>
                    Produtos
                    <i className="right fas fa-angle-left"></i>
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link to="/categories" className="nav-link">
                      <i className="far fa-circle nav-icon text-warning"></i>
                      <p>Categorias</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/products" className="nav-link">
                      <i className="far fa-circle nav-icon text-success"></i>
                      <p>Controle de Estoque</p>
                    </Link>
                  </li>
                </ul>
              </li>
            )}

            {(permissions.restaurant ?? 0) > 0 && (
              <li className="nav-item has-treeview">
                <a href="#" className="nav-link">
                  <i className="nav-icon fas fa-utensils"></i>
                  <p>
                    Restaurante
                    <i className="right fas fa-angle-left"></i>
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link to="/tableadjustments" className="nav-link">
                      <i className="far fa-circle nav-icon text-info"></i>
                      <p>Ajuste de Mesas</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/salescontrol" className="nav-link">
                      <i className="far fa-circle nav-icon text-danger"></i>
                      <p>Controle de Vendas</p>
                    </Link>
                  </li>
                </ul>
              </li>
            )}

            {hasOccupationPermission && (
              <li className="nav-item has-treeview">
                <a href="#" className="nav-link">
                  <i className="nav-icon fas fa-hotel"></i>
                  <p>
                    Hospedagem
                    <i className="right fas fa-angle-left"></i>
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  {permissions.uh > 0 && (
                    <>
                      <li className="nav-item">
                        <Link to="/uhtypes" className="nav-link">
                          <i className="far fa-circle nav-icon text-primary"></i>
                          <p>Tipos de UH</p>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/uh" className="nav-link">
                          <i className="far fa-circle nav-icon text-info"></i>
                          <p>UH</p>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/packages" className="nav-link">
                          <i className="far fa-circle nav-icon text-success"></i>
                          <p>Pacotes</p>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/taxservice" className="nav-link">
                          <i className="far fa-circle nav-icon text-warning"></i>
                          <p>Taxa de Serviços</p>
                        </Link>
                      </li>
                    </>
                  )}
                  {permissions.occupationmap > 0 && (
                    <li className="nav-item">
                      <Link to="/occupationmap" className="nav-link">
                        <i className="far fa-circle nav-icon text-danger"></i>
                        <p>Mapa de Ocupação</p>
                      </Link>
                    </li>
                  )}
                  {permissions.checklist > 0 && (
                    <li className="nav-item">
                      <Link to="/checklist" className="nav-link">
                        <i className="far fa-circle nav-icon text-secondary"></i>
                        <p>Checklist</p>
                      </Link>
                    </li>
                  )}
                </ul>
              </li>
            )}

            <li className="nav-item">
              <Link to="/mydata/0" className="nav-link">
                <i className="nav-icon fas fa-user-secret"></i>
                <p>Meus Dados</p>
              </Link>
            </li>

            {(permissions.audit ?? 0) > 0 && (
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
