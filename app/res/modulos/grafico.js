export const barChart = (elemento, dados, background) => {

	var bar = new Morris.Bar({
		element: elemento,
		resize: true,
		data: dados,
		barColors: [background],
		xkey: 'x',
		ykeys: ['a'],
		labels: ['R$'],
		hideHover: 'auto'
	});
	
}

export const lineChart = (elemento, dados, background) => {

	var bar = new Morris.Line({
		element: elemento,
		resize: true,
		data: dados,
		lineColors: [background],
		xkey: 'x',
		ykeys: ['a'],
		labels: ['R$'],
		hideHover: 'auto'
	});
	
}
