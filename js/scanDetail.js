(function(){
	console.log("Content Script Corriendo...");
	let interval;
	let tiempo_refresh = 2000;
	let port = chrome.runtime.connect({name:"main"});
	let datos = [];
	function question(){
		return confirm("Activar Scanner en Esta Pestaña?");
		if(sessionStorage.getItem('reload_system')==1){
			sessionStorage.setItem('reload_system',0);
			return true;
		}else{
			return confirm("Activar Scanner en Esta Pestaña?");
		}
	}
	port.onMessage.addListener( function(data) {
		switch(data.code){
			case "000":
				alert(data.msg);
				break;
			case "001":
				alert(data.msg);
				document.location.reload();
				break;
			case "100": 
				let key = prompt("Licencia Expirada. Por Favor Ingrese su Codigo de Licencia para continuar...");
				port.postMessage({type:"control",command:"licencia_key",content:{key:key}});
				break;
			case "200":
				localStorage.setItem('currentPage',eval(data.data-1));
				break;
			case "201":
				let register;
				if(sessionStorage.getItem("register")===null){
					register = [];
				}
				else{
					register = JSON.parse(sessionStorage.getItem("register"));
				}
				register = register.filter( reg => {
					if((reg.id !== data.content.id)&&(reg.page !== data.content.page)) return reg;
				})
				sessionStorage.setItem("register", JSON.stringify(register));
				break;
			case "900":
				if(interval === null){
					document.location.reload();
				}
				clearInterval(interval);
				interval = null;
				break;
		}
	} )
	addEventListener("load",function(){
		
		if(question()){
			chrome.storage.local.get("licencia", function(data) {
				if((data.active)||(Date.now()<Date.UTC(2020,4,29))) {
					interval = setInterval(function(){
						port.postMessage({type:"control",command:"page",content:null});
						let currentPage = 0;
						if(localStorage.getItem('currentPage')!==null){
							currentPage = localStorage.getItem('currentPage')
						}
						steamScan([0],function(result){
							if(result.page === -1) {
								clearInterval(interval);
								alert('No has iniciado Session! La Extension no esta Escaneando');
							}
							else{
								try{
									port.postMessage({type:"data",command:"save",content:result})	
								}
								catch(err){
									port = chrome.runtime.connect({name:"main"});
									port.postMessage({type:"data",command:"save",content:result})	
								}
							}
						});
					},tiempo_refresh);
				}
				else{
					const key = prompt("Ingresar Key: ");
					port.postMessage({type:"control",command:"licencia_key",content:{key:key}});
				}
			});
		}
		else{
			alert('La Extension no esta Escaneando');
		}
	})
})();