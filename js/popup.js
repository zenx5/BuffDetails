(function(){
	console.log("Popup Corriendo...");
	let port = chrome.runtime.connect({name:"popup"});
	addEventListener("load", function(){
		document.querySelector("#back").addEventListener("click", function() {
			port.postMessage({type:"back"},function(response) {
				console.log( response );
			} )
		} )
	} )

	port.onMessage.addListener( function(response) {
		console.log(response)

	} )

})();


