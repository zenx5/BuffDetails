var fWorker = function(){
	addEventListener("message",function(msg){
		
		let items = msg.data.content, index = msg.data.index;
		let tiempo = 0;
		let urlDetail = function(__game__,__id__){
			return "https://buff.163.com/api/market/goods/sell_order?game="+__game__+"&goods_id="+__id__+"&page_num="+1;
		};
		const game = "csgo";
		items.forEach( function(item,indice) {
			let xhr2 = new XMLHttpRequest();
			xhr2.open('GET',urlDetail(game,item.id));
			xhr2.addEventListener("load",function(secondResponse){
				if(secondResponse.target.status !== 200){ return};
				const data2 = JSON.parse(secondResponse.target.response);
				const element = {
					page:index,
					index:indice,
					id:item.id,
					img: data2.data.items[0].asset_info.info.icon_url,
					img_original: data2.data.items[0].asset_info.info.original_icon_url,
					link_inspect: data2.data.items[0].asset_info.info.inspect_en_url,
					stickers: data2.data.items[0].asset_info.info.stickers,
					date_steam:new Date(data2.data.items[0].created_at),
					date_scan:new Date(),
					item : (function(){
						try{
							return (item.name.split("|")[0]==="Sticker")?item.name.split("|")[1]:item.name.split("|")[0];
						}
						catch(err){
							console.log("Error #"+err.code +": "+err.message);
							return item.name;
						}
					})(),
					stattrak : (item.name.toLocaleLowerCase().indexOf('stattrak')!==-1),
					skin : (function(){
						try{
							return (item.name.split("|")[0]==="Sticker")?item.name.split("|")[0]:item.name.split("|")[1].split("(")[0];
						}
						catch(err){
							console.log("Error #"+err.code +": "+err.message);
							return item.name;
						}
					})(),
					condition : (function(){
						try{
							var paintwear = data2.data.items[0].asset_info.paintwear;
							if(paintwear.length>0){
								if("0.00000000000000000"<paintwear?paintwear<"0.07000000000000000":false) return "Factory New";
								else if("0.07000000000000000"<paintwear?paintwear<"0.15000000000000000":false) return "Minimal Wear";
								else if("0.15000000000000000"<paintwear?paintwear<"0.37000000000000000":false) return "Field-Tested";
								else if("0.37000000000000000"<paintwear?paintwear<"0.45000000000000000":false) return "Well-Worn";
								else if("0.45000000000000000"<paintwear?paintwear<"0.99999999999999999":false) return "Battle-Scarred";
								else return "Not Painted";
							}
							else{
								return "Not Painted";	
							}
						}
						catch(err){
							return "Not Painted";
						}
					})(),
					float : data2.data.items[0].asset_info.paintwear,
					pattern : data2.data.items[0].asset_info.info.paintseed,
					paint : data2.data.items[0].asset_info.info.paintindex,
					price : data2.data.items[0].price
				};
				postMessage({page:index,content:element});
			});
			tiempo += 1000;
			setTimeout(function(_xhr2){
				_xhr2.send();
			},tiempo,xhr2);
			
		});
	});
};