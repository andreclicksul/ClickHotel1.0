import { fns }     from '../modulos/funcoes.js';
import { msgErro } from '../modulos/controler.js';

$(document).ready(function () {

	let typeHtml = parseInt($("#typeHtml").text());
	let msg      = $("#msg").text();

	if (typeHtml == 0) {
	
		$("#filterUser").focus().keypress( () => fns.verEnter(event, 'btn-usu-enviar'));
		$("#btn-usu-enviar").click( () => $("#form_usuarios").submit());
		$("#filterUser").focus();

		if (msg == '401') msgErro(0, 9);		

	} else if (typeHtml == 1) {

		$("#save").click( () => {
			if (fns.verificaErro()) {
				msgErro(2, 0);
			} else {
				if (fns.verificaEmail()) {
					msgErro(2, 1);
				} else {
					if (fns.verificaHora()) {
						msgErro(2, 15);
					} else {
						save();					
					}
				}
			}
		});		

		$(".timeHM").mask("00:00");
		$(".phone_with_ddd").mask("(00) 0000-0000");
		$(".celul_with_ddd").mask("(00) 00000-0000");	

		$("#deleteButtons").hide();	
		$("#saveButtons").show();

		$("[class~=ver-erro]").change(function() {
			fns.retiraCorErro($(this));
		});

		$("#delete, #cancelDelete").click( () => $("#deleteButtons, #saveButtons").toggle());

		if (msg == '201') msgErro(2, 2);
		if (msg == '301') msgErro(2, 14);
		if (msg == '401') msgErro(0, 5);		
	}
});

const save = () => $("#form_usuario").submit();