import { useContext, useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { MainContext } from "../../contexts/context"
import { get } from "../../services/api"

const normalizeTitle = (value) => {
  if (typeof value !== "string") {
    return ""
  }

  const trimmed = value.trim()

  if (!trimmed) {
    return ""
  }

  const [firstChar, ...restChars] = trimmed

  return `${firstChar.toLocaleUpperCase("pt-BR")}${restChars
    .join("")
    .toLocaleLowerCase("pt-BR")}`
}

const UsersList = () => {
  const { logout, permissions = {} } = useContext(MainContext)
  const cadUserLevel = Number(permissions.cadusuario ?? 0)
  const canCreateUsers = cadUserLevel >= 2
  const canEditUsers = cadUserLevel >= 3
  const tableRef = useRef(null)
  const dataTableRef = useRef(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const columnTitles = useMemo(
    () =>
      ["Usuário", "Nome", "Celular", "E-mail", "Inativo", "Ações"].map(normalizeTitle),
    []
  )

  const contentMinHeight = useMemo(() => {
    if (typeof window === "undefined") {
      return "auto"
    }
    const available = window.innerHeight - 142
    const adjusted = Math.max(Math.round(available * 0.7), 220)
    return `${adjusted}px`
  }, [])

  useEffect(() => {
    let isMounted = true

    const fetchUsers = async () => {
      setErrorMessage("")
      setIsLoading(true)

      try {
        const response = await get("/readusers")

        if (!isMounted) {
          return
        }

        if (response.status !== 200) {
          if (response.status === 401) {
            logout("401")
          } else if (response.status === 403) {
            setErrorMessage("Permissão insuficiente para visualizar usuários.")
          } else {
            setErrorMessage("Não foi possível carregar os usuários.")
          }
          setUsers([])
          return
        }

        const dataset = Array.isArray(response.users) ? response.users : []
        setUsers(dataset)
      } catch (error) {
        if (!isMounted) {
          return
        }

        const status = error?.response?.status

        if (status === 401) {
          logout("401")
        } else if (status === 403) {
          setErrorMessage("Permissão insuficiente para visualizar usuários.")
        } else {
          setErrorMessage("Não foi possível carregar os usuários.")
        }

        setUsers([])
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchUsers()

    return () => {
      isMounted = false
    }
  }, [logout])

  useEffect(() => {
    const tableElement = tableRef.current

    if (!tableElement || !window?.$) {
      return
    }

    const $table = window.$(tableElement)

    const rowData = users.map((user) => {
      const inactiveLabel = user.inactive ? "SIM" : "NÃO"
      const editButton = canEditUsers
        ? `<a href="/users/update/${user.id}" class="btn btn-sm" style="background-color:#f39c12;border-color:#e08e0b;color:#ffffff;">
            <i class="fa fa-edit"></i>&nbsp;Editar
          </a>`
        : `<button type="button" class="btn btn-outline-secondary btn-sm" disabled title="Permissão insuficiente" style="color:#6c757d;">
            <i class="fa fa-edit"></i>&nbsp;Editar
          </button>`

      return [
        user.user ?? "",
        user.name ?? "",
        user.phone ?? "-",
        user.email ?? "",
        inactiveLabel,
        editButton,
      ]
    })

    if (dataTableRef.current) {
      dataTableRef.current.clear()
      if (rowData.length) {
        dataTableRef.current.rows.add(rowData)
      }
      dataTableRef.current.draw()
      return
    }

    dataTableRef.current = $table.DataTable({
      language: {
        url: "../res/admin/plugins/datatables/languagePT-BR.json",
      },
      data: rowData,
      columns: columnTitles.map((title) => ({ title })),
      columnDefs: [
        { targets: [0, 1], className: "td-verticalcenter text-uppercase" },
        { targets: 2, className: "td-verticalcenter" },
        { targets: 3, className: "td-verticalcenter text-lowercase" },
        { targets: 4, className: "td-verticalcenter text-center" },
        {
          targets: 5,
          className: "td-verticalcenter text-center",
          orderable: false,
          searchable: false,
          width: "120px",
        },
      ],
      deferRender: true,
    })
  }, [users, canEditUsers, columnTitles])

  useEffect(() => {
    return () => {
      if (dataTableRef.current) {
        try {
          dataTableRef.current.clear()
          dataTableRef.current.destroy(true)
        } catch (error) {
          // ignore destroy errors to prevent console noise
        } finally {
          dataTableRef.current = null
        }
      }
    }
  }, [])

  return (
    <section className="content-wrapper">
      <section className="content pt-0" style={{ minHeight: contentMinHeight }}>
        <div className="row">
          <div className="col-12">
            <div className="card card-outline card-danger">
              <div className="card-header d-flex align-items-center justify-content-between">
                <h1 className="card-title mb-0 h5 d-flex align-items-center text-dark">
                  <i className="nav-icon fas fa-users mr-2 text-dark"></i>
                  Usuários
                </h1>
                {canCreateUsers ? (
                  <Link to="/users/create" className="btn btn-outline-secondary">
                    <i className="fas fa-plus-square"></i>&nbsp;&nbsp;Adicionar
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    disabled
                    title="Permissão insuficiente para adicionar usuários."
                  >
                    <i className="fas fa-plus-square"></i>&nbsp;&nbsp;Adicionar
                  </button>
                )}
              </div>
              <div className="card-body">
                {errorMessage && (
                  <div className="alert alert-warning mb-3" role="alert">
                    {errorMessage}
                  </div>
                )}
                {isLoading && !errorMessage && (
                  <div className="text-center text-muted mb-3">
                    <i className="fa fa-spinner fa-spin mr-2"></i>
                    Carregando usuários...
                  </div>
                )}
                <div className="table-responsive">
                  <table
                    ref={tableRef}
                    id="tableUsers"
                    className="table table-bordered table-striped"
                  ></table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  )
}

export default UsersList
