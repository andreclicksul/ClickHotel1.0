import { msgErro } from '../modulos/controler.js';

export const moeda = {

	formatReal(mixed) {
		return mixed.toLocaleString('pt-BR', { minimumFractionDigits: 2});
	},

	getMoney(str) {
		let res;
		str == '' ? res = 0 : res = parseFloat(str.replace(/[^0-9,.]/g, '').replace(/[.]/g, '').replace(',', '.'));
		return res;
	},

	numRound(numero) {
		return +(Math.floor(numero + ('e+' + 2)) + ('e-' + 2));
	}

};

export const fns = {

	editor() {
		$(".editor").wysihtml5({
			"font-styles": true, //Font styling, e.g. h1, h2, etc. Default true
			"emphasis": true, //Italics, bold, etc. Default true
			"lists": true, //(Un)ordered lists, e.g. Bullets, Numbers. Default true
			"html": false, //Button which allows you to edit the generated HTML. Default false
			"link": true, //Button to insert a link. Default true
			"image": false, //Button to insert an image. Default true,
			"color": true, //Button to change color of font  
		});
	},
	
	checkBox() {
		$('input[type="checkbox"].flat-red, input[type="radio"].flat-red').iCheck({
			checkboxClass: 'icheckbox_flat-green',
			radioClass: 'iradio_flat-green'
		});
	},

	dataTable(start, finish, element) {

		let arrayTarget = [];

		for (let x = start; x <= finish; x++) {
			arrayTarget.push({ orderable: false, targets: x });
		}

		element.DataTable({
			//scrollY: window.innerHeight-385,
			language: {
				url: '../res/admin/plugins/datatables/languagePT-BR.json'
			},
			columnDefs: arrayTarget
    });

	},

	isChecked(campo) {
		let retorno = 0;
		if (campo.is(':checked')) retorno = 1;
		return retorno;
	},

	nomeMes(mes) {
		let meses = new Array("Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro");
		return meses[mes];
	},	

	LeftRight(str, n, tp) {
		if (n <= 0) {
			return "";
		} else if (n > String(str).length) {
			return str;
		} else {
			if (tp == 'R') {
				let iLen = String(str).length;
				return String(str).substring(iLen, iLen - n);
			} else {
				return String(str).substring(0, n);
			}
		}
	},

	rotinaExclusao(retorno, opClick) {
		if (retorno != 'ok') {
			msgErro(2, 2);
			$("#botoes-salvar, #botoes-excluir_salvar").toggle();
		} else { 
			$("#botoes-excluir_salvar").hide();
			msgErro(1, 9);
			setTimeout( () => opClick.click(), 3000);
		}		
	},

	verEnter(e, botao) {
		let code;

		if (e.keyCode) {
			code = e.keyCode;
		} else if (e.which) {
			code = e. which;
		}

		if (code == 13) {
			e.preventDefault();
			$("#" + botao).click();
		}
	},

  retiraCorErro(elemento) {
		let campo = elemento.val();
		if (campo.length > 0) elemento.css({ background: '#FFFFFF' });
	},

	retira_cor_erro_permite_vazio(elemento) {
		let campo = elemento.val();
		if (campo.length == 0) elemento.css({ background: '#FFFFFF' });
	},

	trocaTela(tela1, tela2) {
		$("#" + tela1).fadeOut('slow');
		setTimeout( () => $("#" + tela2).fadeIn('slow'), 750);
	},

	verificaErro() {
		let campo, nome_campo;
		let retorno = false;
		$('.ver-erro').each(function() {
			campo = $(this);
			nome_campo = campo.attr("id");
			if (campo.val().length == 0) {
				campo.css({ background: '#FFC1C1' });
				retorno = true;
			}
		});

		return retorno;
	},

	verificaErroSelect() {
		let campo, nome_campo;
		let retorno = false;
		$('.ver-erro-sel').each(function() {
			campo = $(this);
			nome_campo = campo.attr("id");
			if (campo.val() == null || campo.val() == '') {
				campo.css({ background: '#FFC1C1' });
				retorno = true;
			}
		});

		return retorno;
	},

	verificaNumero() {
		let campo, retorno, nome_campo;
		retorno = false;
		$('.ver-erro-num').each(function() {
			campo = $(this);
			nome_campo = campo.attr("id");
			if (campo.val().length == 0 || campo.val() == '0' || campo.val() == '0,00') {
				campo.css({ background: '#FFC1C1' });
				retorno = true;
			}
		});

		return retorno;	
	},

	verificaData() {
		let campo, retorno, dia, mes, ano, resto, itsErro;

		retorno = false;

		$('.ver-erro-data').each(function() {
			campo = $(this);
			if (campo.val().length > 0 && campo.val().length < 10) {
				campo.css({ background: '#FFC1C1' });
				retorno = true;
			} else {
				dia = parseInt(campo.val().substring(0, 2));
				mes = parseInt(campo.val().substring(3, 5));
				ano = parseFloat(campo.val().substring(6, 10));

				itsErro = false;

				if (mes == 2) {
					resto = ano % 4;
					if (resto >  0 && dia > 28) itsErro = true;
					if (resto == 0 && dia > 29) itsErro = true;
				
				} else if (mes > 12 || mes < 1 || dia < 1) {
					itsErro = true;
				
				} else if (dia > 30 && (mes == 4 || mes == 6 || mes == 9 || mes == 11)) {
					itsErro = true;
				
				} else if (dia > 31) {
					itsErro = true
				}

				if (itsErro) {
					retorno = true;
					campo.css({ background: '#FFC1C1' });
				}

			}
		});

		return retorno;	
	},

  verificaCpf() {
    let campo, Soma, cpf, Resto
    let retorno = false;
		$('.ver-erro-cpf').each(function() {
			Soma       = 0;
			campo      = $(this);
			cpf        = campo.val();
		    cpf        = cpf.replace(/[^\d]+/g,'');

		    if (cpf.length > 0) {
				if (cpf.length != 11) {
					campo.css({ background: '#FFC1C1' });
					retorno = true;
				}

			    if (cpf == "00000000000" || 
			        cpf == "11111111111" || 
			        cpf == "22222222222" || 
			        cpf == "33333333333" || 
			        cpf == "44444444444" || 
			        cpf == "55555555555" || 
			        cpf == "66666666666" || 
			        cpf == "77777777777" || 
			        cpf == "88888888888" || 
			        cpf == "99999999999") {
					campo.css({ background: '#FFC1C1' });
					retorno = true;
			    }

				for (let i=1; i<=9; i++) Soma = Soma + parseInt(cpf.substring(i-1, i)) * (11 - i);
				Resto = (Soma * 10) % 11;
				if ((Resto == 10) || (Resto == 11))  Resto = 0;
		    	if (Resto != parseInt(cpf.substring(9, 10)) ) {
					campo.css({ background: '#FFC1C1' });
					retorno = true;
				}

				Soma = 0;
			    for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(cpf.substring(i-1, i)) * (12 - i);
			    Resto = (Soma * 10) % 11;
			    if ((Resto == 10) || (Resto == 11))  Resto = 0;
			    if (Resto != parseInt(cpf.substring(10, 11) ) ) {
					campo.css({ background: '#FFC1C1' });
					retorno = true;
			    }
			}
		});

		return retorno;
	},

	verificaCnpj() {
		let campo, cnpj, tamanho, digitos, soma, numeros, pos, resultado, i;
		let retorno = false;

		$('.ver-erro-cnpj').each(function() {
			campo      = $(this);
			cnpj       = campo.val();
		    cnpj       = cnpj.replace(/[^\d]+/g,'');

		    if (cnpj.length > 0) {
				if (cnpj.length != 14) {
					campo.css({ background: '#FFC1C1' });
					retorno = true;
				}

			    if (cnpj == "00000000000000" || 
			        cnpj == "11111111111111" || 
			        cnpj == "22222222222222" || 
			        cnpj == "33333333333333" || 
			        cnpj == "44444444444444" || 
			        cnpj == "55555555555555" || 
			        cnpj == "66666666666666" || 
			        cnpj == "77777777777777" || 
			        cnpj == "88888888888888" || 
			        cnpj == "99999999999999") {
					campo.css({ background: '#FFC1C1' });
					retorno = true;
			    }

			    // Valida DVs
			    tamanho = cnpj.length - 2
			    numeros = cnpj.substring(0,tamanho);
			    digitos = cnpj.substring(tamanho);
			    soma    = 0;
			    pos     = tamanho - 7;
			    for (i = tamanho; i >= 1; i--) {
			      soma += numeros.charAt(tamanho - i) * pos--;
			      if (pos < 2)
			            pos = 9;
			    }
			    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

			    if (resultado != digitos.charAt(0)) {
					campo.css({ background: '#FFC1C1' });
					retorno = true;
			    }

			    tamanho = tamanho + 1;
			    numeros = cnpj.substring(0,tamanho);
			    soma = 0;
			    pos = tamanho - 7;
			    for (i = tamanho; i >= 1; i--) {
			      soma += numeros.charAt(tamanho - i) * pos--;
			      if (pos < 2)
			            pos = 9;
			    }
			    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

			    if (resultado != digitos.charAt(1)) {
					campo.css({ background: '#FFC1C1' });
					retorno = true;
			    }
			}
		});

		return retorno;
	},

	verificaEmail() {
		let campo, usuario, dominio;
		let retorno = false;
		$('.ver-erro-email').each(function() {	
			campo   = $(this);
			usuario = campo.val().substring(0, campo.val().indexOf("@"));
		    dominio = campo.val().substring(campo.val().indexOf("@")+ 1, campo.val().length);

		    if (campo.val().length > 0) {
				if ((usuario.length >=1) &&
					(dominio.length >=3) && 
					(usuario.search("@")==-1) && 
					(dominio.search("@")==-1) &&
					(usuario.search(" ")==-1) && 
					(dominio.search(" ")==-1) &&
					(dominio.search(".")!=-1) &&      
					(dominio.indexOf(".") >=1)&& 
					(dominio.lastIndexOf(".") < dominio.length - 1)) {
					retorno = false;
				} else {
					campo.css({ background: '#FFC1C1' });
					retorno = true;
				}
			}
		});

		return retorno;
	},

	verificaHora() {
		let hora, minuto, retorno, campo, nome_campo;
		retorno = false;
		$('.ver-erro-hora').each(function() {
			campo      = $(this);
			nome_campo = campo.attr("id");

			hora   = parseInt(campo.val().substring(0, 2));
			minuto = parseInt(campo.val().substring(3, 5));

			if (hora > 23 || minuto > 59 || campo.val().length < 5) {
				campo.css({ background: '#FFC1C1' });
				retorno = true;
			}
		});

		return retorno;
	},

	buscarEnderecoCEP() {
		//remove qualquer coisa q não seja um digito.
		var CEP = $("#descep").val().replace(/\D/g, "");

		if (CEP.length != 8) {
			msgErro(2, 9); 
			$("#descep").focus();

		} else {

			$.getJSON("https://viacep.com.br/ws/"+ CEP +"/json/?callback=?", function(cep) {

				if (!("erro" in cep)) {
					
					$("#desstreet").val(unescape(cep.logradouro.toUpperCase()));
					$("#desdistrict").val(unescape(cep.bairro.toUpperCase()));
					$("#descity").val(unescape(cep.localidade.toUpperCase()));
					$("#desuf").val(unescape(cep.uf.toUpperCase()));

					fns.retiraCorErro($("#desstreet"));
					fns.retiraCorErro($("#desdistrict"));
					fns.retiraCorErro($("#descity"));	

					$("#desnumber").focus();

				} else {

					msgErro(2, 10);
					$("#desstreet").focus();					

				}
			});
		}
	},

    limpaSinais(texto) {
		texto = texto.replaceAll("+", "(SINALMAIS)");
		texto = texto.replaceAll("%", "(PERCENT)");
		texto = texto.replaceAll("&", "(ECOMERCIAL)");
		texto = texto.replaceAll("<", "(SINALMENOR)");
		texto = texto.replaceAll(">", "(SINALMAIOR)");
		texto = texto.replaceAll("'", "(ASPASS)");
		texto = texto.replaceAll('"', '(ASPAS)');
		return texto
	},

	verifcaPagamento(pagamento, valorp, id_banco) {
		let conf_pagamento, conf_valor, conf_banco = false;
		let retorno = false;

		if (id_banco.val() == '' || id_banco.val() == null) conf_banco = true;

		if (pagamento.val() == '' || pagamento.val() == null) conf_pagamento = true;

		if (valorp.val().length  == 0 || valorp.val() == '0' || valorp.val() == '0,00') conf_valor = true;

		if ((conf_valor && conf_pagamento && conf_banco) || (! conf_valor && ! conf_pagamento && ! conf_banco)) {
			retorno = false;
		} else {
			if (conf_pagamento) pagamento.css({ background: '#FFC1C1' });
			if (conf_banco) id_banco.css({ background: '#FFC1C1' });
			if (conf_valor) valorp.css({ background: '#FFC1C1' });
			retorno = true;
		}

		return retorno;
	},

	criaComplete(field, url) {
		var options = {

			/*
  			url: function(phrase) {
			    return url;
			},

			getValue: function(element) {
			    return element.filter
			    ;
			},

			ajaxSettings: {
			    dataType: "json",
			    method: "POST",
			    data: {
			        dataType: "json"
			    }
			},

	  		preparePostData: function(data) {
	    		data.phrase = field.val();
	    		return data;
	  		},
	  		*/
			url: url,

			getValue: "filter",

		    template: {
		        type: "description",
		        fields: {
		            description: "cpf"
		        }
		    },

			list: {
				match: {
					enabled: true
				}
			},	  		

		    requestDelay: 400,

		    theme: "plate-dark"
		};

		field.easyAutocomplete(options);
	}
};

export const convDate = {

	addDays(date, days) {
		return new Date(date.setDate(date.getDate() + days));
	},

	dataJS(date) {
		if (date != '') {
			let dia = date.substring(8, 10);
			let mes = date.substring(5, 7);
			let ano = date.substring(0, 4);
			
			dia = parseInt(dia);
			mes = parseInt(mes);
			ano = parseInt(ano);
			mes--;

			return new Date(ano, mes, dia);
		}		
	},

	dataText(date) {
		if (date != '') {
			let dia = date.getDate();
			let mes = date.getMonth();
			let ano = date.getFullYear();

			mes++;
			
			if (dia < 10) dia = '0' + dia;
			if (mes < 10) mes = '0' + mes;

			return dia + '/' + mes + '/' + ano;
		}		
	},

	verficaPeriodoData(data1, data2) {
		let retorno = false;
		let diarias = convDate.numeroDiarias(data1, data2);

		if (diarias < 0) retorno = true;

		return retorno;
	},

	numberDays(data1, data2) {
		let diarias = convDate.dataJS(data2) - convDate.dataJS(data1);
		return parseInt(diarias/86400000);
	},

	transformDate(data) {

		if (data == '') {
			return data;
		} else {
			data = data.split("/");
			return data[2] + '-' + data[1] + '-' + data[0];
		}
	},

	datePicker(days, element) {

		element.datepicker({
			autoclose: true,
			format: 'dd/mm/yyyy',
			startDate: days,
			monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
			monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
			dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
			dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
			dayNamesMin: ['Do','Se','Te','Qa','Qi','Sx','Sa'],			
		});		
	},

};

String.prototype.replaceAll = function(de, para){
    var str = this;
    var pos = str.indexOf(de);
    while (pos > -1){
		str = str.replace(de, para);
		pos = str.indexOf(de);
	}
    return (str);
}
