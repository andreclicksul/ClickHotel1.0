import { fns, convDate } from '../modulos/funcoes.js';
import { msgErro }       from '../modulos/controler.js';

export const startAudit = () => {

	let typeHtml = parseInt($("#typeHtml").text());
	let msg      = $("#msg").text();

  $("#btn-send").click( () => {
			if (fns.verificaErro()) {
			msgErro(2, 0);
		} else {
			if (convDate.numberDays($("#startDate").val(), $("#finishDate").val()) > 60 ) {
				msgErro(2, 13);
			} else { 	
    		report(); 
    	}
    }
  });
	
	$("[class*=ver-erro]").change(function() {
		fns.retiraCorErro($(this));
	});

	if (typeHtml == 1) {

		fns.dataTable(4, 5, $("#tableAudits"));

		let fdate1 = $("#startDate").val();
		let fdate2 = $("#finishDate").val();

		$(".readReport").change( () => {
			if (fdate1 != '' && fdate2 != '') $("#btn-send").click();
		});
	}

	if (msg == '301') msgErro(2, 12); 

}

const report = () => $("#formAudit").submit();
