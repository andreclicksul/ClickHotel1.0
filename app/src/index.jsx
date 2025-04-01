import { createRoot } from 'react-dom/client'
import App from './App'

import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'ionicons/dist/css/ionicons.min.css'
import 'admin-lte/dist/css/adminlte.min.css'
import '/res/admin/css/general.css'
 
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'admin-lte/dist/js/adminlte.min.js'


const root = createRoot(document.querySelector("#root"))

root.render(<App />)
