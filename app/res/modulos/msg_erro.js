const msg =  [
	"Campos obrigatórios em vermelho.", //0
	"O e-mail digitado não está correto.", //1
	"Este usuário já existe em seu banco de dados!!", //2
	"O registro foi adicionado com sucesso.", //3
	"O registro foi alterado com sucesso.", //4
	"CPF incorreto. Por favor verifique !!", //5
	"CNPJ incorreto. Por favor verifique !!", //6
	"O CNPJ digitado já existe em seu banco de dados !!", //7
	"Este registro não pode ser excluído, já foi utilizado como vínculo em outros registros !!", //8
	"O CEP digitado não está correto. Por favor verifique !!", //9
	"O CEP não foi encontrado na base de dados dos Correios. Por favor verifique !!", //10
	"O nome escolhido para o cadastro já existe em seu banco de dados !!", // 11
	"Não há registro para o filtro que você escolheu !!", //12
	"Período máximo permitido: 60 dias !!",  //13
	"Este grupo já existe em seu banco de dados !!", //14
	"Período máximo permitido: 120 dias !!",  //15
	"O registro foi estornado com sucesso.", //16
	"O registro foi excluído com sucesso.", //17

	"Esta singular já existe em seu banco de dados !!",
	"O CPF digitado já existe em seu banco de dados !!",

	

	"O arquivo está sendo gerado, após alguns instantes o botão de download será exibido.",

	"Verifique o horário digitado !! A hora máxima digitada deverá ser '23:59' e deverá estar no formato '99:99'.",
	"Este produto já existe em seu banco de dados !!",



	"Este CPF já está compartilhado com o CNPJ !!",
	"Este CNPJ já está compartilhado com o CPF !!",
	"O número da proposta já existe para este cliente !!", //22
	"O número da apólice já existe para este cliente !!", //23	
	"A Cobertura escolhida já existe nesta Apólice / Proposta !!", //24
	"O nome escolhido para o grupo já existe em seu banco de dados !!", //25
	"O nome escolhido para o subgrupo já existe neste grupo !!", //26

	"A Data que você digitou não é válida !!", //28
	"Por favor selecione os registros para baixa clicando na data de vencimento ou digitando o valor a pagar !!", //29
	"Os registros selecionados foram baixados com sucesso !!", //30

	"A vigência final não pode ser posterior a vigência final da apólice !!",   //32
	"A vigência final não pode ser anterior a vigência inicial da apólice !!",  //33
	"Arquivo enviado com sucesso !!" //34
];

export const retornaErro = op => msg[op];

/*
0 - msg
1 - att
2 - erro
o último = 19
*/