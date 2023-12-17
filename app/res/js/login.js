const user = $("#login"); 
const pass = $("#password");
const sbm  = $("#btn-submit");
const form = $("#form-login");
const cod  = $("#cod-msg").text();

$(document).ready(function() {  
	
	clearWrongs();

	if (cod == 1)
	{
		$("#wrong-msg").show();
		timeWrongs();
	}

	sbm.click( () => {

		let wrong = false;

		if (user.val() == '')
		{
			$("#wrong-user").show();
			wrong = true;
		}

		if (pass.val() == '')
		{
			$("#wrong-pass").show();
			wrong = true;
		}

		if (!wrong)
		{
			form.submit();
		}
		else
		{
			timeWrongs();
		}

	})

});

const clearWrongs = () => $("[id*=wrong]").hide();

const timeWrongs = () => setTimeout( () => $("[id*=wrong]").fadeOut('slow'), 4000);