console.log("steam");
let steamScan = (function(){
	let urlPage = function(__game__,__page_num__){
		return "https://buff.163.com/api/market/goods?game="+__game__+"&page_num="+__page_num__+"&_="+Date.now();
	};
	return function( pageArray, handdler ){
		let tiempo = 0;
		pageArray.forEach( index => {
			let xhr = new XMLHttpRequest();
			const game = "csgo";
			const page_num = eval(index)+1;
			xhr.open('GET',urlPage(game,page_num));
			xhr.addEventListener("load", function(response) {
				if(response.target.status !== 200) return;
				const data = JSON.parse(response.target.response)
				if(data.code === "Login Required") {
					handdler({page:-1});
					return;
				}
				try{
					let items = (function(A,B,comp,mode) {
							aux1 = [], aux2 =  [];
							A.forEach( a => {
								band = false;
								B.forEach( b => {
									if(comp(a,b)){
										aux1.push(a);
										band = true;
									}
								})
								if(!band){
									aux2.push(a);
								}
							})
							if(mode){
								return aux1;
							}
							else{
								return aux2;
							}
						})(data.data.items,
						(function(){
							let lastItems = sessionStorage.getItem("lastItems");
							if(lastItems){
								return JSON.parse(lastItems);
							}
							else{
								return [];
							}
						})() ,function(item1,item2){
							return item1.id === item2.id;
						},false);
					sessionStorage.setItem("lastItems",JSON.stringify(data.data.items));
					let script;
					console.log(items.length)
					if(document.querySelector("#js-worker") === null){
						script = document.createElement('script');
						script.id ="js-worker";
						script.type ="text/js-worker";
						script.innerText = "("+fWorker.toString()+")();";
						document.head.append(script);	
					}
					let blob = new Blob(Array.prototype.map.call(
						document.querySelectorAll("script[type=\"text\/js-worker\"]"),
						function (oScript) { 
							return oScript.textContent; 
						}),
						{type: "text/javascript"});

					let details = new Worker( window.URL.createObjectURL(blob) );
					details.addEventListener("message",function(dataDetails){
						console.log("details: ", dataDetails.data);
						handdler(dataDetails.data);
						details.terminate();
						details = undefined;
					})
					details.postMessage({index:index,content:items});

				}catch(err){
					console.log("Error #"+err.code)
					console.log( err.name+": "+err.message )
				}
			})
			xhr.send();
			console.log("peticion de pagina "+index);
		})
	}
})(); 