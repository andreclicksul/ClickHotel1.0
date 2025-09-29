import { createRoot } from 'react-dom/client'
import App from './App'

// Importações de estilos
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'ionicons/dist/css/ionicons.min.css'
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css'
import 'icheck-bootstrap/icheck-bootstrap.min.css'
import 'select2/dist/css/select2.min.css'
import 'react-datepicker/dist/react-datepicker.css'
import 'admin-lte/dist/css/adminlte.min.css'
import '/res/admin/css/general.css' // Caso este arquivo seja específico do projeto

// Importações de scripts
import $ from './setup/jquery-global'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'datatables.net'
import 'datatables.net-bs4'
import 'select2/dist/js/select2.full.min.js'
import Inputmask from 'inputmask'
import 'inputmask/dist/jquery.inputmask.js'
import 'inputmask/dist/bindings/inputmask.binding.js'
import 'admin-lte/dist/js/adminlte.min.js'
import 'ckeditor4'

window.Inputmask = Inputmask
window.$ = window.jQuery = $

const root = createRoot(document.querySelector("#root"))

root.render(<App />)
