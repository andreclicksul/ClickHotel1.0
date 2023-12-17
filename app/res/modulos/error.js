import { retornaErro } from './msg_erro.js';

const elementoP  = '#msgerro';
const buttonsP   = "#buttons";
const targetP    = '#main-header';
const check      = ["fa-check", "fa-bell-o", "fa-times-circle-o"];
const classeP    = ["has-success", "has-warning", "has-error"];

export const formaErro = (tipo, op, element = '') => {

	let elemento  = (element == '') ? $(elementoP) : $(`#${element}`);
	let target    = $(targetP);
	let buttons   = $(buttonsP);

	let _html = `<div class="form-group ${classeP[tipo]}">
								<label class="control-label">
									<i class="fa ${check[tipo]}"></i>&nbsp;&nbsp;&nbsp;${retornaErro(op)}
								</label>
							</div>`;

	elemento.hide();
	buttons.hide();

	$('html, body').animate({
		scrollTop: target.offset().top 
	}, 750);
 
	elemento
		.html(_html)
		.fadeIn('slow');

	setTimeout( () => elemento.fadeOut('slow'), 4000);
	setTimeout( () => buttons.fadeIn('slow'), 5300);
}



