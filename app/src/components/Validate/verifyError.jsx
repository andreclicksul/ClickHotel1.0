export const verifyNull = () => {
  let campo
  let retorno = false
  $('.verifynull').each(function() {
    campo = $(this)
    if (campo.val().length == 0) {
      campo.css({ background: '#FFC1C1' })
      retorno = true
    }
  })

  return retorno
}

export const removeColor = element => {
  let campo = $(`#${element}`)
  campo.css({ background: '#FFFFFF' })
}

export const verifyCpf = () => {
  let campo, Soma, cpf, Resto
  let retorno = false
  $('.verifycpf').each(function() {
    Soma       = 0
    campo      = $(this)
    cpf        = campo.val()
    cpf        = cpf.replace(/[^\d]+/g,'')

    if (cpf.length > 0) {
      if (cpf.length != 11) {
        campo.css({ background: '#FFC1C1' })
        retorno = true
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
        campo.css({ background: '#FFC1C1' })
        retorno = true
      }

      for (let i=1; i<=9; i++) Soma = Soma + parseInt(cpf.substring(i-1, i)) * (11 - i)
      Resto = (Soma * 10) % 11
      if ((Resto == 10) || (Resto == 11))  Resto = 0
        if (Resto != parseInt(cpf.substring(9, 10)) ) {
        campo.css({ background: '#FFC1C1' })
        retorno = true
      }

      Soma = 0
      for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(cpf.substring(i-1, i)) * (12 - i)
      Resto = (Soma * 10) % 11
      if ((Resto == 10) || (Resto == 11))  Resto = 0
      if (Resto != parseInt(cpf.substring(10, 11) ) ) {
        campo.css({ background: '#FFC1C1' })
        retorno = true
      }
    }
  })

  return retorno
}

export const verifyCnpj =() => {
  let campo, cnpj, tamanho, digitos, soma, numeros, pos, resultado, i
  let retorno = false

  $('.verifycnpj').each(function() {
    campo      = $(this)
    cnpj       = campo.val()
    cnpj       = cnpj.replace(/[^\d]+/g,'')

    if (cnpj.length > 0) {
      if (cnpj.length != 14) {
        campo.css({ background: '#FFC1C1' })
        retorno = true
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
        campo.css({ background: '#FFC1C1' })
        retorno = true
      }

      // Valida DVs
      tamanho = cnpj.length - 2
      numeros = cnpj.substring(0,tamanho)
      digitos = cnpj.substring(tamanho)
      soma    = 0
      pos     = tamanho - 7
      for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--
        if (pos < 2) pos = 9
      }
      resultado = soma % 11 < 2 ? 0 : 11 - soma % 11

      if (resultado != digitos.charAt(0)) {
        campo.css({ background: '#FFC1C1' })
        retorno = true
      }

      tamanho = tamanho + 1
      numeros = cnpj.substring(0,tamanho)
      soma = 0
      pos = tamanho - 7
      for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--
        if (pos < 2) pos = 9
      }
      resultado = soma % 11 < 2 ? 0 : 11 - soma % 11

      if (resultado != digitos.charAt(1)) {
        campo.css({ background: '#FFC1C1' })
        retorno = true
      }
    }
  })

  return retorno
}

export const verifyEmail = () => {
  let campo, usuario, dominio
  let retorno = false
  $('.verifyemail').each(function() {	
    campo   = $(this)
    usuario = campo.val().substring(0, campo.val().indexOf("@"))
    dominio = campo.val().substring(campo.val().indexOf("@")+ 1, campo.val().length)

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
        retorno = false
      } else {
        campo.css({ background: '#FFC1C1' })
        retorno = true
      }
    }
  })

  return retorno
}
