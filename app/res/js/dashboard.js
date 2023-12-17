import { POST, readGraph } from '../modulos/controler.js';

export const startDash = () => {

	$("#divGraph1").click( () => $("#buttonGraph1").click());

	$("#divGraph2").click( () => $("#buttonGraph2").click());

	$("[id*=openModal]").click(function() {
		
		openModalDash($(this).attr('op-id'));
		
	});	

	$("#updateBilling").click( () => $("#formDash").submit());

	$("#desstatus").focus();

	$("#buttonGraph1").click( () => createGraph(1, '#3c8dbc', 'bar-chart'));
	$("#buttonGraph2").click( () => createGraph(2, '#dd4b39', 'bar-chart'));

}

const openModalDash = id => {

	let desname        = $(`#tbdesname${id}`).text();
	let dtscheduling   = $(`#tbdtscheduling${id}`).text();
	let dbvalue        = $(`#tbdbvalue${id}`).text();
	let desdescription = $(`#tbdesdescription${id}`).text();
	let desresponsavel = $(`#tbdesresponsavel${id}`).text();
	let desemail       = $(`#tbdesemail${id}`).text();
	let descel         = $(`#tbdescel${id}`).text();
	let parcel         = $(`#tbdesparcel${id}`).text();
	let desstatus      = $(`#tbdesstatus${id}`).text();
	let desresult      = $(`#tbdesresult${id}`).text();

	$(".disabled").prop('disabled', false);

	$("#idcrparc").val(id);
	$("#dtscheduling").val(dtscheduling);
	$("#dbvalue").val(dbvalue);
	$("#desname").val(desname);
	$("#desdescription").val(desdescription);
	$("#desresponsavel").val(desresponsavel);
	$("#desemail").val(desemail);
	$("#descel").val(descel);
	$("#parcel").val(parcel);
	$("#desstatus").val(desstatus);
	$("#desresult").val(desresult);

	$(".disabled").prop('disabled', true);

	$("#modalBilling").modal();

}

const createGraph = (op, background, typeGraph) => {
	
	let opgraph = $(`#opgraph${op}`).text();

	if (opgraph == 0) {
		$(`#opgraph${op}`).text('1');
		POST(`/datagraph${op}`, makeGraph, null, op, background, typeGraph);
	} else {
		$(`#opgraph${op}`).text('0');
	}
}

const makeGraph = (result, numberGraph, background, typeGraph) => {

	let data = [];

	if (result.status == 400) {

		let aux;
		let res = result.res;
		
		res.forEach(element => {
			
			aux = {x: element.textdtpayment, a: element.valuepay};

			data.push(aux);

		});

		readGraph(`chart${numberGraph}`, data, background, typeGraph);

	}

}