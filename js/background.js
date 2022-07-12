
(function(managerPort,managerOnMessage) {
	console.log("background");
	//clousure para mantener el aislamiento de las variables 
	//y evitar problemas de choques entre las variables de la extension
	chrome.runtime.onInstalled.addListener( function(){
		chrome.storage.local.get('items',function(data){
			if((data.items === undefined)||(data.items === null)){
				chrome.storage.local.set({items:[[],[],[],[],[],[],[],[],[],[]]})
			}
		})
		chrome.storage.local.get('active',function(data){
			if(data.active === undefined){
				chrome.storage.local.set({active:false})
			}
		})
	})

	chrome.runtime.onConnect.addListener( function(port) {
		managerPort.add( port );
		port.onMessage.addListener(function(request){
			//console.log(request);
			managerOnMessage(request,port);
		})
		port.onDisconnect.addListener(function(){
			console.log(port)
		})
	} )

	

	
})(managerPort,managerOnMessage);
