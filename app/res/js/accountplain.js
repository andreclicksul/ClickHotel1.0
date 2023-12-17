import { fns }           from '../modulos/funcoes.js';
import { msgErro, POST } from '../modulos/controler.js';

export const startPlain = () => {

	let typeHtml = parseInt($("#typeHtml").text());

	if (typeHtml == 0) { 
	
		$("#divSubGroup").hide();

		$(".editsubgroup").click(function () {
		
			let body = {
				idgroup: $(this).attr('op-id')
			};
		
			makeSubgroup($(this).attr('op-id'), $(this).attr('group'), body);

		});

	} else if (typeHtml == 1) {

		let msg = $("#msg").text();

		fns.checkBox();

		$("#save").click( () => {
			if (fns.verificaErro()) {
				msgErro(2, 0);
			} else {
				save();				
			}
		});		

		$("#delete").click( () => $("#modalDelete").modal());

		$("[class*=ver-erro]").change(function() {
			fns.retiraCorErro($(this));
		});		

		if (msg == '301') msgErro(2, 14); //grupo repetido
		if (msg == '302') msgErro(2, 8); //impossível excluir
		if (msg == '401') msgErro(0, 3); //create
		if (msg == '402') msgErro(0, 4); //update

	}
}

const save = () => $("#formPlain").submit();

const makeSubgroup = (idgroup, desgroup, body) => 
	POST(`/accountplain/makesubgroup`, returnSubgroup, body, idgroup, desgroup);

const returnSubgroup = (res, idgroup, desgroup) => {

	$("#divSubGroup").html(templateSubgroup(res.listsubgroup, res.security, desgroup));

	$("#divSubGroup").show();

	fns.checkBox();

	$("#insertsubgroup").click( () => {

		let arrayInput = {
			"idsubgroup": 0,
			"dessubgroup": "",
			"destypesub": "F",
			"inactive": 0
		};

		editsubGroup(arrayInput, 0, idgroup, res.security, desgroup);

	});

	$(".editsubgroup2").click(function() {

		let body = {
			idsubgroup: $(this).attr('op-id')
		};
	
		getSubgroup($(this).attr('op-id'), body, idgroup, res.security, desgroup);		

	});

}

const templateSubgroup = (res, security, desgroup) => {

	let body = `${res.map( n => `
								<tr>
									<td class="td-verticalcenter text-uppercase">${n.dessubgroup}</td>
									<td class="col-md-2 text-center">${n.textType}</td>
									<td class="col-md-1 text-center td-verticalcenter">
										<a href="#" class="btn btn-warning btn-sm {$security.secEdit} editsubgroup2" op-id="${n.idsubgroup}">
										<i class="fa fa-pencil-square"></i>&nbsp;&nbsp;&nbsp;Editar
										</a>
									</td>
								</tr>
							`).join('')}`;

	return `<div class="box box-success">
						<div class="box-header">
							<h3 class="box-title"><span id="spandesgroup" class="fontTitle">${desgroup}</span></h3>
							<div class="box-tools pull-right">
								<a href="#" id="insertsubgroup" class="btn btn-default ${security.secInsert}"><i class="fa fa-plus-square"></i>&nbsp;&nbsp;&nbsp;Adicionar</a>
							</div>
						</div>
						<div id="bodySubgroup" class="box-body">
							<div class="box-body">
								<table id="tableSubgroup" class="table table-bordered table-striped">
									<thead>
										<tr>
											<th>Sub Grupo</th>
											<th class="col-md-2 text-center">Tipo</th>
											<th class="col-md-1">&nbsp;</th>
										</tr>
									</thead>
									<tbody>
										${body}
									</tbody>
								</table>
							</div>
						</div>
					</div>`;
}

const getSubgroup = (idsubgroup, body, idgroup, security, desgroup) => 
	POST(`/accountplain/getsubgroup`, editsubGroup, body, idsubgroup, idgroup, security, desgroup);

const editsubGroup = (res, idsubgroup, idgroup, security, desgroup) => {

	$("#divSubGroup").html(templatEditsubgroup(res, idsubgroup, security, desgroup));

	fns.checkBox();

	$("#returnsubgroup").click( () => btnreturnSubgroup('', idgroup, desgroup));

	$("#savesubgroup").click( () => {
		if (fns.verificaErro()) {
			msgErro(2, 0, 'msgerrosub');
		} else {
			saveSubgroup(idsubgroup, idgroup, desgroup);				
		}
	});

	$("[class*=ver-erro]").change(function() {
		fns.retiraCorErro($(this));
	});	

	$("#deletesubgroup").click( () => $("#modalDeleteSub").modal());

	$("#confirmdeletesubgroup").click( () => deleteSubgroup(idsubgroup, idgroup, desgroup));
}

const templatEditsubgroup = (res, idsubgroup, security, desgroup) => {

	let headerEdit = (idsubgroup == 0)
		
		?  `<div class="box-header">
					<h3 class="box-title"><span class="fontTitle">${desgroup}</span></h3>
					<div class="box-tools pull-right">
						<div id="msgerrosub"></div>
						<div id="buttons">                
							<a href="#" id="savesubgroup" class="btn btn-success ${security.secInsert}"><i class="fa fa-floppy-o"></i>&nbsp;&nbsp;&nbsp;Salvar</a>
							&nbsp;
							<a href="#" id="returnsubgroup" class="btn btn-default"><i class="fa fa-arrow-left"></i>&nbsp;&nbsp;&nbsp;Retornar</a>
						</div>
					</div>
				</div>`
		
		:  `<div class="box-header">
					<h3 class="box-title"><span class="fontTitle">${desgroup}</span></h3>
					<div class="box-tools pull-right">
						<div id="msgerrosub"></div>
						<div id="buttons">                
							<a href="#" id="savesubgroup" class="btn btn-success ${security.secEdit}"><i class="fa fa-floppy-o"></i>&nbsp;&nbsp;&nbsp;Salvar</a>
							&nbsp;
							<a href="#" id="deletesubgroup" class="btn btn-danger ${security.secDelete}"><i class="fa fa-floppy-o"></i>&nbsp;&nbsp;&nbsp;Excluir</a>
							&nbsp;
							<a href="#" id="returnsubgroup" class="btn btn-default"><i class="fa fa-arrow-left"></i>&nbsp;&nbsp;&nbsp;Retornar</a>
						</div>

						<div id="modalDeleteSub" class="modal modal-danger">
							<div class="modal-dialog">
								<div class="modal-content">
									<div class="modal-header">
										<button type="button" class="close" data-dismiss="modal" aria-label="Close">
											<span aria-hidden="true">×</span></button>
										<h4 class="modal-title">Exclusão de Registro</h4>
									</div>
									<div class="modal-body">
										<p>Atenção! Esta é uma ação sem volta, caso deseje excluir mesmo o registro basta apenas 'Confirmar'.</p>
									</div>
									<div class="modal-footer">
										<button id="closeModalSub" type="button" class="btn btn-outline pull-left" data-dismiss="modal">Fechar</button>
										<a href="#" id="confirmdeletesubgroup" class="btn btn-outline">Confirmar</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>`;

	let destypesubF = (res.destypesub == 'F') ? 'checked' : '';
	let destypesubV = (res.destypesub == 'V') ? 'checked' : '';
	
	let inactive21 = (res.inactive == 0) ? 'checked' : '';
	let inactive22 = (res.inactive == 1) ? 'checked' : '';

	return `<div class="box box-success">
						${headerEdit}
						<div class="box-body">
							<div class="row">
								<div class="form-group col-md-8 col-xs-12">
									<label for="desgroup">Sub Grupo</label>
									<div class="input-group">
										<div class="input-group-addon">
											<i class="fa fa-file"></i>
										</div>
										<input type="text" 
													class="form-control fontW text-uppercase ver-erro" 
													id="dessubgroup" 
													name="dessubgroup" 
													maxlength="40" 
													placeholder="Nome do subgrupo"
													value="${res.dessubgroup}">
									</div>
								</div>

								<div class="form-group col-md-12">
									<label>Tipo</label>
									<div class="input-group">
										<label style="padding-right: 20px;">
											<input type="radio" id="destypesubf" name="destypesub" class="flat-red" ${destypesubF} value="F">
											Fixo
										</label>
										<label>
											<input type="radio" id="destypesubv" name="destypesub" class="flat-red" ${destypesubV} value="V">
											Variável
										</label>
									</div>
								</div>

								<div class="form-group col-md-12">
									<label>Status</label>
									<div class="input-group">
										<label style="padding-right: 20px;">
											<input type="radio" id="inactive21" name="inactive2" class="flat-red" ${inactive21} value="0">
											Ativo
										</label>
										<label>
											<input type="radio" id="inactive22" name="inactive2" class="flat-red" ${inactive22} value="1">
											Inativo
										</label>
									</div>
								</div>
							</div>
						</div>
					</div>`;
}

const btnreturnSubgroup = (res, idgroup, desgroup) => {

	let body = {
		idgroup: idgroup
	};

	makeSubgroup(idgroup, desgroup, body);

}

const saveSubgroup = (idsubgroup, idgroup, desgroup) => {

	let body = {
		idgroup: idgroup,
		idsubgroup: idsubgroup,
		desgroup: desgroup,
		dessubgroup: $("#dessubgroup").val(),
		destypesub: $("input[name='destypesub']:checked").val(),
		inactive: $("input[name='inactive2']:checked").val()
	};

	let url = idsubgroup == 0 ? '/accountplain/subgroup/create' : '/accountplain/subgroup/update';

	POST(url, btnreturnSubgroup, body, idgroup, desgroup);	

}

const deleteSubgroup = (idsubgroup, idgroup, desgroup) => {

	let body = {
		idgroup: idgroup,
		idsubgroup: idsubgroup,
		desgroup: desgroup,
		dessubgroup: $("#dessubgroup").val(),
		destypesub: $("input[name='destypesub']:checked").val(),
		inactive: $("input[name='inactive2']:checked").val()
	};

	$("#closeModalSub").click();

	let url = '/accountplain/subgroup/delete';

	POST(url, returndeleteSubgroup, body, idgroup, desgroup);	

}

const returndeleteSubgroup = (res, idgroup, desgroup) => 
	(res.status == 300) 
		? msgErro(2, 8, 'msgerrosub')
		: btnreturnSubgroup('', idgroup, desgroup);