import { startMydata }   from './mydata.js';
import { startClient }   from './clients.js';
import { startProvider } from './providers.js';
import { startUser }     from './users.js';
import { startAudit }    from './audits.js';
import { startDash }     from './dashboard.js';
import { startBank }     from './banks.js';
import { startPlain }    from './accountplain.js';
import { startPay }      from './pay.js';
import { startRec }      from './rec.js';

$(document).ready(function () {

	let typeForm = $("#typeForm").text();

	if (typeForm == 'mydata' )      startMydata();
	if (typeForm == 'clients')      startClient();
	if (typeForm == 'providers')    startProvider();
	if (typeForm == 'users')        startUser();
	if (typeForm == 'audits')       startAudit();
	if (typeForm == 'dashboard')    startDash();
	if (typeForm == 'banks')        startBank();
	if (typeForm == 'accountplain') startPlain();
	if (typeForm == 'pay')          startPay();
	if (typeForm == 'rec')          startRec();

});



