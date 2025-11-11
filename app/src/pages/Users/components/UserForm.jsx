import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { InputMask } from "primereact/inputmask"
import { AuthContext, MainContext } from "../../../contexts/context"

const DEFAULT_FORM_VALUES = {
  user: "",
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  sunday: true,
  monday: true,
  tuesday: true,
  wednesday: true,
  thursday: true,
  friday: true,
  saturday: true,
  client: 0,
  caduser: 0,
  checklist: 0,
  provider: 0,
  uh: 0,
  audit: 0,
  accountpay: 0,
  accountreceive: 0,
  cashflow: 0,
  financial: 0,
  product: 0,
  occupationmap: 0,
  restaurant: 0,
  inactive: false,
  starthour: "08",
  startminute: "00",
  finishhour: "18",
  finishminute: "00",
}

const permissionOptions = [
  { value: 0, label: "0 - Acesso negado" },
  { value: 1, label: "1 - Somente leitura" },
  { value: 2, label: "2 - Leitura + Inclusão" },
  { value: 3, label: "3 - Leitura + Inclusão + Edição" },
  { value: 4, label: "4 - Acesso total" },
]

const dayFields = [
  { name: "sunday", label: "Domingo" },
  { name: "monday", label: "Segunda" },
  { name: "tuesday", label: "Terça" },
  { name: "wednesday", label: "Quarta" },
  { name: "thursday", label: "Quinta" },
  { name: "friday", label: "Sexta" },
  { name: "saturday", label: "Sábado" },
]

const permissionFieldNames = new Set([
  "client",
  "caduser",
  "checklist",
  "provider",
  "uh",
  "audit",
  "accountpay",
  "accountreceive",
  "cashflow",
  "financial",
  "product",
  "occupationmap",
  "restaurant",
])

const PASSWORD_PLACEHOLDER = "********"
const unicodeLetterRegex = /\p{L}/u
const unicodeNumberRegex = /\p{N}/u
const FEEDBACK_DURATION_MS = 7000

const normalizePasswordValue = (value = "") => {
  if (typeof value !== "string") {
    return ""
  }

  return typeof value.normalize === "function" ? value.normalize("NFKC") : value
}

const UserForm = ({
  mode = "create",
  initialData = null,
  onSubmit,
  onDelete,
  loading = false,
  title = "Usuários",
  submitLabel = "Salvar",
  cancelLabel = "Retornar",
  redirectTo = "/users",
  initialFeedback = null,
}) => {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const { permissions = {}, logout } = useContext(MainContext)

  const [formData, setFormData] = useState(DEFAULT_FORM_VALUES)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleteCountdown, setDeleteCountdown] = useState(20)
  const deleteTimerRef = useRef(null)
  const [feedback, setFeedback] = useState({ type: "", message: "" })
  const feedbackTimeoutRef = useRef(null)

  const contentMinHeight = useMemo(() => {
    if (typeof window === "undefined") {
      return "auto"
    }
    const availableHeight = window.innerHeight - 142
    return `${availableHeight > 0 ? availableHeight : 220}px`
  }, [])

  useEffect(() => {
    if (!initialData) {
      setFormData(DEFAULT_FORM_VALUES)
      return
    }

    setFormData((prev) => {
      const nextValues = Object.entries(DEFAULT_FORM_VALUES).reduce(
        (acc, [key, defaultValue]) => {
          const incoming = initialData[key]

          if (incoming === undefined || incoming === null || incoming === "") {
            acc[key] = defaultValue
            return acc
          }

          if (typeof defaultValue === "boolean") {
            acc[key] = Boolean(incoming)
            return acc
          }

          if (typeof defaultValue === "number") {
            const parsed = Number(incoming)
            acc[key] = Number.isNaN(parsed) ? defaultValue : parsed
            return acc
          }

          acc[key] = String(incoming)
          return acc
        },
        {}
      )

      if (mode === "update") {
        nextValues.password = PASSWORD_PLACEHOLDER
        nextValues.confirmPassword = PASSWORD_PLACEHOLDER
      }

      return {
        ...prev,
        ...nextValues,
      }
    })
  }, [initialData, mode])

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current)
      }
      if (deleteTimerRef.current) {
        clearInterval(deleteTimerRef.current)
      }
    }
  }, [])

  const clearFeedback = () => {
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current)
      feedbackTimeoutRef.current = null
    }
    setFeedback({ type: "", message: "" })
  }

  const showFeedback = useCallback((type, message) => {
    setFeedback({ type, message })

    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current)
    }

    if (typeof window !== "undefined") {
      feedbackTimeoutRef.current = window.setTimeout(() => {
        setFeedback({ type: "", message: "" })
        feedbackTimeoutRef.current = null
      }, FEEDBACK_DURATION_MS)
    }
  }, [])

  useEffect(() => {
    if (initialFeedback?.message) {
      showFeedback(initialFeedback.type ?? "success", initialFeedback.message)
    }
  }, [initialFeedback, showFeedback])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }))
      return
    }

    setFormData((prev) => ({
      ...prev,
      [name]: permissionFieldNames.has(name) ? Number(value) : value,
    }))
  }

  const formatTime = (value) => String(value ?? "").padStart(2, "0")

  const feedbackClassName = (type = "") => {
    if (type === "success") {
      return "text-success"
    }
    if (type === "warning") {
      return "text-warning"
    }
    return "text-danger"
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (submitting) {
      return
    }

    if (confirmingDelete) {
      return
    }

    clearFeedback()

    const isUpdate = mode === "update"
    const passwordChanged = !isUpdate || formData.password !== PASSWORD_PLACEHOLDER
    let passwordForSubmission = formData.password

    if (!formData.user.trim() || !formData.name.trim() || !formData.email.trim()) {
      showFeedback("error", "Preencha os campos Usuário, Nome e E-mail.")
      return
    }

    if (passwordChanged) {
      const normalizedPassword = normalizePasswordValue(formData.password)
      const normalizedConfirmPassword = normalizePasswordValue(formData.confirmPassword)

      if (!normalizedPassword.trim()) {
        showFeedback("error", "Informe uma senha válida.")
        return
      }

      const hasMinLength = normalizedPassword.length >= 8
      const hasLetter = unicodeLetterRegex.test(normalizedPassword)
      const hasNumber = unicodeNumberRegex.test(normalizedPassword)

      if (!hasMinLength || !hasLetter || !hasNumber) {
        showFeedback(
          "error",
          "A senha deve possuir ao menos 8 caracteres, contendo letras e números."
        )
        return
      }

      if (normalizedPassword !== normalizedConfirmPassword) {
        showFeedback("error", "A confirmação de senha não confere.")
        return
      }

      passwordForSubmission = normalizedPassword
    }

    const payload = {
      user: formData.user.trim(),
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone?.trim(),
      sunday: formData.sunday,
      monday: formData.monday,
      tuesday: formData.tuesday,
      wednesday: formData.wednesday,
      thursday: formData.thursday,
      friday: formData.friday,
      saturday: formData.saturday,
      client: formData.client,
      caduser: formData.caduser,
      checklist: formData.checklist,
      provider: formData.provider,
      uh: formData.uh,
      audit: formData.audit,
      accountpay: formData.accountpay,
      accountreceive: formData.accountreceive,
      cashflow: formData.cashflow,
      financial: formData.financial,
      product: formData.product,
      occupationmap: formData.occupationmap,
      restaurant: formData.restaurant,
      inactive: formData.inactive,
      lastchange: (user?.user ?? user?.name ?? "").toUpperCase() || "SISTEMA",
      color:
        typeof initialData?.color === "string" && initialData.color.trim() !== ""
          ? initialData.color
          : "skin-blue",
      avatar:
        typeof initialData?.avatar === "number"
          ? initialData.avatar
          : Number.isNaN(Number(initialData?.avatar))
            ? 0
            : Number(initialData?.avatar ?? 0),
      starthour: formatTime(formData.starthour),
      startminute: formatTime(formData.startminute),
      finishhour: formatTime(formData.finishhour),
      finishminute: formatTime(formData.finishminute),
    }

    if (passwordChanged) {
      payload.password = passwordForSubmission
    }

    setSubmitting(true)

    try {
      const response = await onSubmit?.(payload)

      const status = response?.status ?? response?.data?.status ?? 200
      const messageFromResponse =
        response?.msg ??
        response?.message ??
        response?.data?.msg ??
        response?.data?.message

      if (status === 401) {
        logout("401")
        return
      }

      if (status === 403) {
        showFeedback("error", messageFromResponse ?? "Permissão insuficiente.")
        return
      }

      if (status >= 400) {
        showFeedback("error", messageFromResponse ?? "Não foi possível salvar o usuário.")
        return
      }

      const successMessage =
        messageFromResponse ??
        (mode === "create" ? "Usuário criado com sucesso." : "Usuário atualizado com sucesso.")

      if (mode === "create") {
        const normalizedResponse = response?.data ?? response
        const createdUserId =
          normalizedResponse?.data?.id ?? normalizedResponse?.id ?? null

        if (!createdUserId) {
          showFeedback("success", successMessage)
          return
        }

        navigate(`/users/update/${createdUserId}`, {
          state: {
            feedback: {
              type: "success",
              message: successMessage,
            },
          },
        })
      } else {
        showFeedback("success", successMessage)
      }
    } catch (error) {
      const status = error?.response?.status
      const message =
        error?.response?.data?.msg ??
        error?.response?.data?.message ??
        error?.message ??
        "Não foi possível salvar o usuário."

      if (status === 401) {
        logout("401")
        return
      }

      if (status === 409) {
        showFeedback("error", "Usuário já existente.")
        return
      }

      showFeedback("error", message)
    } finally {
      setSubmitting(false)
    }
  }

  const cadUserLevel = Number(permissions.cadusuario ?? 0)
  const requiredLevel = mode === "create" ? 2 : 3
  const canModify = cadUserLevel >= requiredLevel

  return (
    <section className="content-wrapper">
      <section className="content pt-0" style={{ minHeight: contentMinHeight }}>
        <form onSubmit={handleSubmit} noValidate>
          <div className="row">
            <div className="col-12">
              <div className="card card-outline card-danger">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h1 className="card-title h5 mb-0 d-flex align-items-center text-dark">
                    <i className="nav-icon fas fa-users mr-2 text-dark"></i>
                    {title}
                  </h1>
                  <div className="card-tools d-flex align-items-center ml-auto">
                    {feedback.message ? (
                      <span className={`mr-3 ${feedbackClassName(feedback.type)}`}>
                        {feedback.message}
                      </span>
                    ) : !confirmingDelete ? (
                      <>
                        <button
                          type="submit"
                          className="btn btn-success mr-2"
                          disabled={submitting || loading || deleting || !canModify}
                        >
                          <i className="fa fa-save mr-1"></i>
                          {submitLabel}
                        </button>
                        {mode === "update" && typeof onDelete === "function" && (
                          <button
                            type="button"
                            className="btn btn-danger mr-2"
                            disabled={deleting || submitting || loading || !canModify}
                            onClick={() => {
                              if (!canModify || deleting) {
                                return
                              }

                              setConfirmingDelete(true)
                              setDeleteCountdown(20)

                              if (deleteTimerRef.current) {
                                clearInterval(deleteTimerRef.current)
                              }

                              deleteTimerRef.current = window.setInterval(() => {
                                setDeleteCountdown((prev) => {
                                  if (prev <= 1) {
                                    if (deleteTimerRef.current) {
                                      clearInterval(deleteTimerRef.current)
                                      deleteTimerRef.current = null
                                    }
                                    setConfirmingDelete(false)
                                    setDeleteCountdown(20)
                                    return 20
                                  }
                                  return prev - 1
                                })
                              }, 1000)
                            }}
                          >
                            <i className="fa fa-trash mr-1"></i>
                            Excluir
                          </button>
                        )}
                        <Link to={redirectTo} className="btn btn-outline-secondary">
                          <i className="fa fa-arrow-left mr-1"></i>
                          {cancelLabel}
                        </Link>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-danger"
                        disabled={deleting}
                        onClick={async () => {
                          if (deleting) {
                            return
                          }

                          if (deleteTimerRef.current) {
                            clearInterval(deleteTimerRef.current)
                            deleteTimerRef.current = null
                          }

                          try {
                            setDeleting(true)
                            const response = await onDelete?.()
                            const status = response?.status ?? response?.data?.status ?? 200
                            const message =
                              response?.msg ??
                              response?.message ??
                              response?.data?.msg ??
                              response?.data?.message

                            if (status === 401) {
                              logout("401")
                              return
                            }

                            if (status >= 400) {
                              showFeedback(
                                "error",
                                message ?? "Não foi possível excluir o usuário."
                              )
                              setConfirmingDelete(false)
                              return
                            }

                            showFeedback(
                              "success",
                              message ?? "Usuário excluído com sucesso."
                            )

                            window.setTimeout(() => navigate(redirectTo), 1200)
                          } catch (error) {
                            const status = error?.response?.status
                            const message =
                              error?.response?.data?.msg ??
                              error?.response?.data?.message ??
                              error?.message ??
                              "Não foi possível excluir o usuário."

                            if (status === 401) {
                              logout("401")
                              return
                            }

                            showFeedback("error", message)
                          } finally {
                            setDeleting(false)
                            setConfirmingDelete(false)
                            setDeleteCountdown(20)
                          }
                        }}
                      >
                        Confirmar exclusão ({deleteCountdown}s)
                      </button>
                    )}
                  </div>
                </div>

                <div className="card-body">
                  {loading ? (
                    <div className="text-center text-muted my-5">
                      <i className="fa fa-spinner fa-spin mr-2"></i>
                      Carregando informações do usuário...
                    </div>
                  ) : (
                    <>
                      <div className="row">
                        <div className="form-group col-md-4 col-sm-6">
                          <label htmlFor="user">Usuário</label>
                          <input
                            id="user"
                            name="user"
                            type="text"
                            className="form-control text-uppercase"
                            value={formData.user}
                            maxLength={30}
                            onChange={handleChange}
                            placeholder="Login de acesso"
                            disabled={!canModify}
                          />
                        </div>
                        <div className="form-group col-md-4 col-sm-6">
                          <label htmlFor="name">Nome</label>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            className="form-control text-uppercase"
                            value={formData.name}
                            maxLength={120}
                            onChange={handleChange}
                            placeholder="Nome completo"
                            disabled={!canModify}
                          />
                        </div>
                        <div className="form-group col-md-4 col-sm-6">
                          <label htmlFor="email">E-mail</label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            className="form-control text-lowercase"
                            value={formData.email}
                            maxLength={120}
                            onChange={handleChange}
                            placeholder="email@dominio.com"
                            disabled={!canModify}
                          />
                        </div>
                        <div className="form-group col-md-4 col-sm-6">
                          <label htmlFor="phone">Celular</label>
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text bg-light text-secondary">
                                <i className="fa fa-phone"></i>
                              </span>
                            </div>
                            <InputMask
                              id="phone"
                              name="phone"
                              mask="(99) 9 9999-9999"
                              slotChar="               "
                              className="form-control text-center"
                              value={formData.phone}
                              onChange={handleChange}
                              disabled={!canModify}
                            />
                          </div>
                        </div>
                        <div className="form-group col-md-4 col-sm-6">
                          <label htmlFor="password">Senha</label>
                          <input
                            id="password"
                            name="password"
                            type="password"
                            className="form-control"
                            value={formData.password}
                            maxLength={50}
                            onChange={handleChange}
                            placeholder="Senha de acesso"
                            disabled={!canModify}
                          />
                        </div>
                        <div className="form-group col-md-4 col-sm-6">
                          <label htmlFor="confirmPassword">Confirmar senha</label>
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            className="form-control"
                            value={formData.confirmPassword}
                            maxLength={50}
                            onChange={handleChange}
                            placeholder="Repita a senha"
                            disabled={!canModify}
                          />
                        </div>
                      </div>

                      <hr />

                      <h5 className="text-bold mb-3">Permissões de acesso</h5>
                      <div className="row">
                        {[
                          { name: "caduser", label: "Usuários" },
                          { name: "client", label: "Clientes" },
                          { name: "provider", label: "Fornecedores" },
                          { name: "uh", label: "UH" },
                          { name: "checklist", label: "Checklist" },
                          { name: "product", label: "Produtos" },
                          { name: "occupationmap", label: "Mapa de Ocupação" },
                          { name: "restaurant", label: "Restaurante" },
                          { name: "financial", label: "Financeiro" },
                          { name: "accountpay", label: "Contas a Pagar" },
                          { name: "accountreceive", label: "Contas a Receber" },
                          { name: "cashflow", label: "Fluxo de Caixa" },
                          { name: "audit", label: "Auditoria" },
                        ].map((field) => (
                          <div className="form-group col-md-3 col-sm-6" key={field.name}>
                            <label htmlFor={field.name}>{field.label}</label>
                            <select
                              id={field.name}
                              name={field.name}
                              className="form-control"
                              value={formData[field.name]}
                              onChange={handleChange}
                              disabled={!canModify}
                            >
                              {permissionOptions.map((opt) => (
                                <option value={opt.value} key={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>

                      <hr />

                      <h5 className="text-bold mb-3">Disponibilidade semanal</h5>
                      <div className="row">
                        {dayFields.map((day) => (
                          <div className="form-group col-md-3 col-sm-4" key={day.name}>
                            <div className="form-check">
                              <input
                                id={day.name}
                                name={day.name}
                                type="checkbox"
                                className="form-check-input"
                                checked={formData[day.name]}
                                onChange={handleChange}
                                disabled={!canModify}
                              />
                              <label className="form-check-label" htmlFor={day.name}>
                                {day.label}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>

                      <hr />

                      <h5 className="text-bold mb-3">Detalhes adicionais</h5>
                      <div className="row">
                        <div className="form-group col-md-3 col-sm-6">
                          <label htmlFor="inactive">Usuário inativo</label>
                          <div className="form-check">
                            <input
                              id="inactive"
                              name="inactive"
                              type="checkbox"
                              className="form-check-input"
                              checked={formData.inactive}
                              onChange={handleChange}
                              disabled={!canModify}
                            />
                            <label className="form-check-label" htmlFor="inactive">
                              Bloquear acesso
                            </label>
                          </div>

                          <div className="mt-3">
                            <label htmlFor="starthour">Início da jornada</label>
                            <div className="d-flex">
                              <select
                                id="starthour"
                                name="starthour"
                                className="form-control mr-2"
                                value={formData.starthour}
                                onChange={handleChange}
                                disabled={!canModify}
                              >
                                {Array.from({ length: 24 }, (_, idx) =>
                                  idx.toString().padStart(2, "0")
                                ).map((hour) => (
                                  <option value={hour} key={hour}>
                                    {hour}
                                  </option>
                                ))}
                              </select>
                              <select
                                id="startminute"
                                name="startminute"
                                className="form-control"
                                value={formData.startminute}
                                onChange={handleChange}
                                disabled={!canModify}
                              >
                                {Array.from({ length: 60 }, (_, idx) =>
                                  idx.toString().padStart(2, "0")
                                ).map((minute) => (
                                  <option value={minute} key={minute}>
                                    {minute}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="mt-3">
                            <label htmlFor="finishhour">Fim da jornada</label>
                            <div className="d-flex">
                              <select
                                id="finishhour"
                                name="finishhour"
                                className="form-control mr-2"
                                value={formData.finishhour}
                                onChange={handleChange}
                                disabled={!canModify}
                              >
                                {Array.from({ length: 24 }, (_, idx) =>
                                  idx.toString().padStart(2, "0")
                                ).map((hour) => (
                                  <option value={hour} key={hour}>
                                    {hour}
                                  </option>
                                ))}
                              </select>
                              <select
                                id="finishminute"
                                name="finishminute"
                                className="form-control"
                                value={formData.finishminute}
                                onChange={handleChange}
                                disabled={!canModify}
                              >
                                {Array.from({ length: 60 }, (_, idx) =>
                                  idx.toString().padStart(2, "0")
                                ).map((minute) => (
                                  <option value={minute} key={minute}>
                                    {minute}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </section>
  )
}

export default UserForm
