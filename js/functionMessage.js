let functionMessage = (function(){
	console.log("functionMessage");
	let fMessage = {};
	let $CANT_ITEMS = 60;
	fMessage['main'] = function(request,port){
		//console.log(port)
		chrome.storage.local.onChanged.addListener(  data => {
			if(data.currentPage !== undefined){
				let send = data.currentPage.newValue;
				managerPort.get('main').postMessage({code:"200",data:send,msg:null});
			}
		})
		switch(request.type){
			case "data":
				switch(request.command){
					case "ids":
						return;
						let ids = request.content;
						chrome.storage.local.get("items", function(data){
							if(data.items !== undefined){
								data.items.forEach( (page,k) => {
									if(page === null){
										page = [];
									}
									page = page.filter( item => {
										if(ids[k].indexOf(item.id) !== -1) return item;
									})
									
								});
							}
							
							chrome.storage.local.set(data);
						})
						break;
					case "save":
						chrome.storage.local.get(null,function(data){
							if((data.items === undefined)||(data.items === null)){
								data.items = [[],[],[]];
							}
							if((data.items[request.content.page] === undefined)||(data.items[request.content.page] === null)){
								data.items[request.content.page] = [];
							}			
							if(data.items[request.content.page].findIndex( item => {
								return (item.id === request.content.content.id);
							}) === -1){
								data.items[request.content.page].push(request.content.content);	
								if(data.items[request.content.page].length > $CANT_ITEMS ){
									for(let k = request.content.page ; k <= 4 ; k++) {
										if(data.items[k].length > $CANT_ITEMS){
											aux = data.items[ k ].shift();
											aux.page = k + 2;
											if(k<4) {
												data.items[ k + 1 ].push( aux );
											}
										}
									}
									//port.postMessage({code:"201",content:data.items[request.content.page].shift(),msg:""});
								}
								chrome.storage.local.set({items:data.items})
								try{
								//	managerPort.get("options").postMessage({type:"data",command:"save",content:{page:data.items}})							
								}
								catch(err){
								//	console.log("La pagina de opciones no esta abierta");
								}
							}
						
							
						});
						break;
					
				}
			case "control":
				if(request.command === "licencia_key") {
					const keydata = request.content.key.split("WC")
					if(Date.now()<Date.UTC(keydata[0],keydata[1],keydata[2])){
						chrome.storage.local.set({ licencia: request.content.key })
						port.postMessage({code:"001",data:request.content.key, msg:"key: "+request.content.key+" is Success!"});
						chrome.storage.local.set({active:true})
					}
					else{
						port.postMessage({code:"001",data:null, msg:"key: "+request.content.key+" is Fail!"})
						chrome.storage.local.set({active:false})
					}
					
				}
				else if(request.command === 'page'){
					chrome.storage.local.get(null, function(data){
						if(data.currentPage !=null){
							port.postMessage({code:"200",data:data.currentPage,msg:null});
						}
					})
				}
				break;

		}
		
	};


	fMessage['options'] = function(request,port){
		//console.log(port)
		switch(request.type){
			case "data":
				switch(request.command){
					case "save":
						//console.log(request.content.tiempo_refresh)
						chrome.storage.local.set({tiempo_refresh:request.content.tiempo_refresh})
						chrome.storage.local.get(null,function(data){
							try{
								//managerPort.get("options").postMessage({type:"control",command:"save",content:{page:data.items}})
							}
							catch(err){
								//console.log("La pagina de opciones no esta abierta");
							}
						});
						break;
				}
			case "control":
				switch(request.command){
					case "load":
						chrome.storage.local.get(null,function(data){
							try{
								//managerPort.get("options").postMessage({type:"data",command:"save",content:{page:data.items}})
							}
							catch(err){
								//console.log("La pagina de opciones no esta abierta")
							}
						});

						break;
					case "licencia_key":
						const keydata = request.content.key.split("WC")
						if(Date.now()<Date.UTC(keydata[0],keydata[1],keydata[2])){
							chrome.storage.local.set({ licencia: request.content.key })
							managerPort.get("main").postMessage({code:"001",data:request.content.key, msg:"key: "+request.content.key+" is Success!"});
							chrome.storage.local.set({active:true})
						}
						else{
							managerPort.get("main").postMessage({code:"001",data:null, msg:"key: "+request.content.key+" is Fail!"})
							chrome.storage.local.set({active:false})
						}
					
						break;
					case 'change_page':
						try{
							managerPort.get('main').postMessage({code:"200",data:request.content,msg:null});
						}
						catch(err){
							console.log("No esta Activo el Scanner")
						}
						chrome.storage.local.set({currentPage:request.content});
						break;
				}
				break;
				
		}
		
	}
	return fMessage;
})();