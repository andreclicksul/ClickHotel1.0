const elementoP  = '#msgerro';
const buttonsP   = "#buttons";
const targetP    = '#main-header';
const check      = ["fa-check", "fa-bell-o", "fa-times-circle-o"];
const classeP    = ["has-success", "has-warning", "has-error"];

const msgError = (tipo, msg, element = '', functiondelete = false) => {

	let elemento  = (element == '') ? $(elementoP) : $(`#${element}`)
	let target    = $(targetP)
	let buttons   = $(buttonsP)

	let _html = `<div class="form-group ${classeP[tipo]}">
								<label class="control-label">
									<i class="fa ${check[tipo]}"></i>&nbsp;&nbsp;&nbsp;${msg}
								</label>
							</div>`

	elemento.hide();
	buttons.hide()

	$('html, body').animate({
		scrollTop: target.offset().top 
	}, 750)
 
	elemento
		.html(_html)
		.fadeIn('slow')

	setTimeout( () => elemento.fadeOut('slow'), 4000)

	if (!functiondelete) setTimeout( () => buttons.fadeIn('slow'), 5300)
}

export default msgError


