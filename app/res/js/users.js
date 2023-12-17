import { fns }     from '../modulos/funcoes.js';
import { msgErro } from '../modulos/controler.js';

export const startUser = () => {

	let typeHtml = parseInt($("#typeHtml").text());

	if (typeHtml == 0) { 
	
		fns.dataTable(4, 4, $("#tableUsers"));

	} else if (typeHtml == 1) {

		let msg = $("#msg").text();

		$('.maskCel').mask('(00) 00000-0000');
		$('.maskTime').mask('00:00');

		fns.checkBox();

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

		$("#delete").click( () => $("#modalDelete").modal());

		$("[class*=ver-erro]").change(function() {
			fns.retiraCorErro($(this));
		});		

    if (msg == '301') msgErro(2, 11); //nome repetido
		if (msg == '302') msgErro(2, 8); //impossível excluir
		if (msg == '401') msgErro(0, 3); //create
		if (msg == '402') msgErro(0, 4); //update

	}
}

const save = () => $("#formUser").submit();

