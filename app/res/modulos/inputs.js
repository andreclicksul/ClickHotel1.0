export const input = {

  makeSelect(array, id, descricao, fieldId) {

		let newArray = array.filter( obj => obj.id != id );

		let firstOption = (id == 0)
			? `<option value='' hidden selected>Selecione...</option>`
			: `<option value='${id}'>${descricao}</option>`;

		return `<select id="${fieldId}" class="ver-erro-sel ls-select">
				  		${firstOption}
							${newArray.map(n => `
								<option value='${n.id}'>${n.descricao}</option>
							`).join('')}
						</select>`;
	},

  makeInput(id, iMax, iValue = '', iClass = '', iplaceHolder = '', ireadonly = '') {

    return `<input type="text" id="${id}" class="${iClass}" maxlength="${iMax}" placeholder="${iplaceHolder}" value="${iValue}" ${ireadonly}>`;

  },

	makeSelectChosen(array, id, iplaceHolder = '') {

		return `<select id="${id}" data-placeholder="${iplaceHolder}" class="chosen-select">
							<option value></option>
							${array.map(n => `
								<option value='${n.id}'>${n.descricao}</option>
							`).join('')}
						</select>`;
	}

};
