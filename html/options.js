//(function(){
	console.log("Options esta Corriendo...");
	/**
	let port = chrome.runtime.connect({name:"options"});

	port.onMessage.addListener( function(response) {
		console.log(response)
		dataSteam = response;
	} )

	port.postMessage({type:"control",command:"load",content:null})
**/

//})()

	$('#myModal').on('shown.bs.modal', function () {
  			console.log("hola")
		})