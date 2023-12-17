import { fns, convDate } from '../modulos/funcoes.js';
import { msgErro }       from '../modulos/controler.js';

export const startPay = () => {

	let typeHtml = parseInt($("#typeHtml").text());
	let msg      = $("#msg").text();

	if (typeHtml == 0) {

    startFilter(msg);

	} else if (typeHtml == 1) {

    createPay();

  } else if (typeHtml == 2) {

		fns.dataTable(2, 6, $("#tablePays"));

  } else {

    updatePay(msg);

  }

}

const submitForm = () => $("#formPay").submit();

const startFilter = msg => {

  $("#btn-send").click( () => {
    if (fns.verificaErro()) {
      msgErro(2, 0);
    } else {
      if (convDate.numberDays($("#startDate").val(), $("#finishDate").val()) > 120 ) {
        msgErro(2, 15);
      } else { 	
        submitForm(); 
      }
    }
  });

  $("[class*=ver-erro]").change(function() {
    fns.retiraCorErro($(this));
  });

  if (msg == 1) msgErro(2, 12);
  if (msg == 2) msgErro(0, 3);
  if (msg == 3) msgErro(0, 17);
  if (msg == 4) msgErro(0, 16);

}

const createPay = () => {

  modelsPost();

  $("#save").click( () => {
    if (fns.verificaErro()) {
      msgErro(2, 0);
    } else {
      if ($("#numberparcel").val() == '0') $("#numberparcel").val('1');
      $("#numberparcel, #interval").prop('disabled', false);
      $("#desprovider").val($("#idprovider option:selected").text());
      $("#dessubgroup").val($("#idsubgroup option:selected").text());
      submitForm(); 
    }
  });

}

const updatePay = msg => {

  modelsPost();

  $("#recurrence, #dbfees, #nparcel").prop('disabled', true)

  $("#save").click( () => {
    let erroPag = fns.verifcaPagamento($("#dtpayment"), $("#dbvaluepay"), $("#idbank"));
    if (fns.verificaErro() || erroPag) {
      msgErro(2, 0);
    } else {
      if ($("#numberparcel").val() == '0') $("#numberparcel").val('1');
      if ($("#dbvaluepay").val() == '0,00' || $("#dbvaluepay").val() == '') $("#dbvaluepay").val('0');
      $("#desprovider").val($("#idprovider option:selected").text());
      $("#dessubgroup").val($("#idsubgroup option:selected").text());
      $("#desbank").val($("#idbank option:selected").text());
      submitForm(); 
    }
  });

  $("#delete").click( () => {
    $("#modalTitle").text("Exclusão de Registro");
    $("#bodyModal").text("excluir mesmo o registro");  
    $("#buttonReverse").hide();
    $("#buttonDelete").show();
    $("#modalDelete").modal();
  });

  $("#reverse").click( () => {
    $("#modalTitle").text("Estorno de Conta");
    $("#bodyModal").text("estornar mesmo a conta");  
    $("#buttonDelete").hide();
    $("#buttonReverse").show();
    $("#modalDelete").modal();
  });

  if (msg == 1) msgErro(0, 4);
}

const modelsPost = ()=> {

  $(".select2").select2();

  $('.maskInt').mask('000', {reverse: true});
  $(".maskDbl").mask("000.000,00", {reverse: true});

  $("[class*=ver-erro]").change(function() {
    fns.retiraCorErro($(this));
  });

  $("#desrecurrence").change(function() {
    if ($(this).val() == 'S') {
      $("#numberparcel").prop('disabled', true).val('1');
      $("#interval").prop('disabled', true).val('0');
    } else {
      $("#numberparcel, #interval").prop('disabled', false);
    }
  });
}