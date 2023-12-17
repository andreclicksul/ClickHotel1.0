import { createRoot } from 'react-dom/client'
import App from './App'

import '/res/admin/bootstrap/css/bootstrap.min.css'
import '/res/admin/dist/css/font-awesome.min.css'
import '/res/admin/dist/css/ionicons.min.css'
import '/res/admin/plugins/datatables/dataTables.bootstrap.css'
//import '/res/admin/plugins/iCheck/all.css'
import '/res/admin/plugins/select2/select2.min.css'
import '/res/admin/dist/css/AdminLTE.min.css'
import '/res/admin/css/general.css'

import '/res/admin/plugins/jQuery/jquery-2.2.3.min.js'
import '/res/admin/bootstrap/js/bootstrap.min.js'
import '/res/admin/plugins/datatables/jquery.dataTables.min.js'
import '/res/admin/plugins/datatables/dataTables.bootstrap.min.js'
import '/res/admin/plugins/select2/select2.full.min.js'
//import '/res/admin/plugins/iCheck/icheck.min.js'
import '/res/admin/plugins/datepicker/bootstrap-datepicker.js'
//import '/res/admin/plugins/ckeditor/ckeditor.js'
import '/res/admin/dist/js/app.min.js'


const root = createRoot(document.querySelector("#root"))

root.render(<App />)
