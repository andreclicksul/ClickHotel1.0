import { useContext, useEffect, useState } from "react"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import UserForm from "../components/UserForm"
import { get, put, patch } from "../../../services/api"
import { MainContext } from "../../../contexts/context"

const UsersUpdate = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const locationFeedback = location.state?.feedback
  const { logout } = useContext(MainContext)
  const [initialData, setInitialData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState("")
  const [initialFeedback, setInitialFeedback] = useState(locationFeedback ?? null)

  const normalizeUserData = (data = {}) => {
    const ensureTime = (value) => {
      if (typeof value !== "string") {
        return "00"
      }
      const trimmed = value.trim()
      if (trimmed.length >= 2) {
        return trimmed.slice(0, 2)
      }
      if (trimmed.length === 1) {
        return `0${trimmed}`
      }
      return "00"
    }

    return {
      ...data,
      phone: data.phone ?? "",
      starthour: ensureTime(data.starthour ?? "08"),
      startminute: ensureTime(data.startminute ?? "00"),
      finishhour: ensureTime(data.finishhour ?? "18"),
      finishminute: ensureTime(data.finishminute ?? "00"),
      color:
        typeof data.color === "string" && data.color.trim() !== ""
          ? data.color
          : "skin-blue",
      avatar:
        typeof data.avatar === "number"
          ? data.avatar
          : Number.isNaN(Number(data.avatar))
            ? 0
            : Number(data.avatar ?? 0),
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      setLoadError("")

      try {
        const response = await get(`/readuser/${id}`)

        if (response.status !== 200) {
          if (response.status === 401) {
            logout("401")
          } else if (response.status === 403) {
            setLoadError("Permissão insuficiente para editar usuários.")
          } else {
            setLoadError("Não foi possível carregar os dados do usuário.")
          }
          return
        }

        setInitialData(normalizeUserData(response.data ?? {}))
      } catch (error) {
        const status = error?.response?.status

        if (status === 401) {
          logout("401")
        } else if (status === 403) {
          setLoadError("Permissão insuficiente para editar usuários.")
        } else if (status === 404) {
          setLoadError("Usuário não encontrado.")
        } else {
          setLoadError("Não foi possível carregar os dados do usuário.")
        }
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchUser()
    } else {
      setLoadError("Identificador do usuário inválido.")
      setLoading(false)
    }
  }, [id, logout])

  useEffect(() => {
    if (locationFeedback) {
      setInitialFeedback(locationFeedback)
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [locationFeedback, location.pathname, navigate])

  const handleUpdate = async (payload) => put(`/updateuser/${id}`, payload)
  const handleDelete = async () => patch(`/deleteuser/${id}`, {})

  if (loadError) {
    return (
      <section className="content-wrapper">
        <section className="content pt-0">
          <div className="row">
            <div className="col-12">
              <div className="alert alert-warning mt-4">
                {loadError}
                <div className="mt-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm mr-2"
                    onClick={() => navigate("/users")}
                  >
                    <i className="fa fa-arrow-left mr-1"></i>
                    Retornar
                  </button>
                  <Link to="/users" className="btn btn-link btn-sm">
                    Ver lista de usuários
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    )
  }

  return (
    <UserForm
      mode="update"
      initialData={initialData}
      initialFeedback={initialFeedback}
      loading={loading}
      onSubmit={handleUpdate}
      onDelete={handleDelete}
      title="Editar Usuário"
      submitLabel="Atualizar"
    />
  )
}

export default UsersUpdate
