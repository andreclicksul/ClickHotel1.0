import { formaErro } from './error.js';
import { barChart, lineChart } from './grafico.js';
import { postJSON} from './HttpService.js';

export const msgErro = (tipo, op, element) => formaErro(tipo, op, element);

export const readGraph = (elemento, dados, background, typeGraph) => {

    if (typeGraph == "bar-chart") barChart(elemento, dados, background);
    if (typeGraph == "line-chart") lineChart(elemento, dados, background);

}

export const POST = (url, fn, body, ...props) => {

    if (fn == undefined || fn == "") {
        postJSON(url, body).catch(erro => console.log(erro));
    } else {    
        postJSON(url, body)
            .then(res => fn(res, ...props))
            .catch(erro => console.log(erro));
    }
}

