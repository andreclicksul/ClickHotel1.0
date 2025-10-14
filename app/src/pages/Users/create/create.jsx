import UserForm from "../components/UserForm"
import { post } from "../../../services/api"

const UsersCreate = () => {
  const handleCreate = async (payload) => post("/createuser", payload)

  return <UserForm mode="create" onSubmit={handleCreate} />
}

export default UsersCreate
