import { fns }     from '../modulos/funcoes.js';
import { msgErro } from '../modulos/controler.js';

export const startMydata = () => {

	let msg        = $("#msg").text();
	let markOption = $("#markOption").text();
	let select     = document.querySelector("#descor");

	$('.maskCel').mask('(00) 00000-0000');

	$("#msgerro").hide();

	$("#divColors").click( () => $("#buttonColors").click());
	$("#divAvatar").click( () => $("#buttonAvatar").click());

	$("#saveMydata").click( () => {
		if (fns.verificaErro()) {
			msgErro(2, 0);
		} else {
			if (fns.verificaEmail()) {
				msgErro(2, 1);
			} else {
				save();				
			}
		}
	});

	$("[class~=ver-erro]").change(function() {
		fns.retiraCorErro($(this));
	});

	if (msg == '301') msgErro(2, 2);
	if (msg == '401') msgErro(0, 4);

	select.selectedIndex = parseInt(markOption);

}

const save = () => $("#formMydata").submit();
