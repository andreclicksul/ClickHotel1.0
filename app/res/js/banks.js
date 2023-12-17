import { fns }     from '../modulos/funcoes.js';
import { msgErro } from '../modulos/controler.js';

export const startBank = () => {

	let typeHtml = parseInt($("#typeHtml").text());

	if (typeHtml == 0) { 
	
		fns.dataTable(5, 5, $("#tableBanks"));

	} else if (typeHtml == 1) {

		let msg = $("#msg").text();

		$('.maskCel').mask('(00) 00000-0000');
		$('.maskCpf').mask('000.000.000-00');
		$('.maskCnpj').mask('00.000.000/0000-00');

		fns.checkBox();

		$("#save").click( () => {
			if (fns.verificaErro()) {
				msgErro(2, 0);
			} else {
				if (fns.verificaEmail()) {
					msgErro(2, 1);
				} else {
					if (fns.verificaCpf()) {
						msgErro(2, 5);
					} else {
						if (fns.verificaCnpj()) {
							msgErro(2, 6);
						} else {
								save();				
						}
					}
				}
			}
		});		

		$("#delete").click( () => $("#modalDelete").modal());

		$("[class*=ver-erro]").change(function() {
			fns.retiraCorErro($(this));
		});		

		if (msg == '302') msgErro(2, 8); //impossível excluir
		if (msg == '401') msgErro(0, 3); //create
		if (msg == '402') msgErro(0, 4); //update

	}
}

const save = () => $("#formBank").submit();

