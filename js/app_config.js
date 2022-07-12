$(document).ready(function(){
	$('[data-toggle="tooltip"]').tooltip({html:true})
})

angular.module("app_config",["ngStorage","ui.bootstrap"])
	.component("twinsRange",{
		templateUrl:"../html/twin-range.html",
		controller:function(){
			let link = document.createElement('link')
			link.rel = "stylesheet";
			link.href = "twins-range.css";
			document.querySelector('head').append(link);
		}
	})
	.component("selectColor",{
		templateUrl:"../html/select-color.html",
		controller: function() {
			let link = document.createElement('link')
			link.rel = "stylesheet";
			link.href = "select-color.css";
			document.querySelector('head').append(link);
			this.click = _ => {
				document.querySelector('#color'+this.id).click();
			}
			this.change = _ => {
				document.querySelector('#color'+this.id).parentElement.style.backgroundColor = this.color;
			}
			this.$postLink = () => {
				this.id = Date.now();
			}
		},
		bindings:{
			color:"=",
			width:"<",
			height:"<"
		}
	})
	.component("inputToggle",{
		templateUrl:"../html/input-toggle.html",
		controller:function(){
			let link = document.createElement('link')
			link.rel = "stylesheet";
			link.href = "input-toggle.css";
			document.querySelector('head').append(link);
			this.toggle = () => {
				if( this.label === this.labelon ) {
					this.label = this.labeloff;
				}
				else {
					this.label = this.labelon;
				}
			}
			this.$postLink = () => {
				if(this.labelon === undefined) this.labelon = "On";
				if(this.labeloff === undefined) this.labeloff = "Off";
				if(this.styleon === undefined) this.styleon = "green";
				if(this.styleoff === undefined) this.styleoff = "gray";
				if(this.round === undefined) this.round = false;
				if(this.default === 'on'){
					this.label = this.labelon;
				}
				else{
					this.label = this.labeloff;
				}
			}
		},
		bindings:{
			labelon:"@",
			labeloff:"@",
			styleon:"@",
			styleoff:"@",
			default:"@",
			round:"@",
			required:"<",
			state:"="
		}
	})
	.component("inputTag",{
		templateUrl:"../html/input-tag.html",
		controller:function(){

			let link = document.createElement('link')
			link.rel = "stylesheet";
			link.href = "input-tag.css";
			document.querySelector('head').append(link);
			this.keypress = event => {
				if(event.key === "Enter"){
					const data = event.target.value;
					if(this.tags.indexOf(data)===-1){
						this.tags.push( data );
					}
					event.target.value = "";
				}
				
			};
			this.del = event => {
				data = event.target.parentNode.childNodes[0].data;
				this.tags = this.tags.filter( tag => {
					if(tag !== data.substr(0,data.length - 1)) return tag;
				})
			};
			this.$postLink = ()=>{
				if(this.tags === undefined) this.tags = [];
			}
		},
		bindings:{
			tags:"=",
			disabled:"<"
		}
	})
	.component("money",{
		templateUrl:"../html/money.html",
		controller:function(){
			let link = document.createElement('link')
			link.rel = "stylesheet";
			link.href = "money.css";
			document.querySelector('head').append(link);
			this.$postLink = () => {
				if(this.label===undefined) this.label ="";
			}
		},
		bindings:{
			label:"@",
			value:"=",
			unid:"=",
			min:"<",
			max:"<",
			step:"<",

		}
	})
	.component("changeCoin",{
		templateUrl:"../html/change-coin.html",
		controller:function(){
			this.active = false;
			let link = document.createElement('link')
			link.rel = "stylesheet";
			link.href = "change-coin.css";
			document.querySelector('head').append(link);
			this.$postLink = () => {
				if(this.filter === undefined){
					this.filter = "";
				}
			}
		},
		bindings:{
			symbol:"@",
			value:"<",
			change:"<",
			filter:"@"
		}
	})
	.component("stickerView",{
		templateUrl: "../html/sticker-view.html",
		controller: function(){
			this.selected = undefined;
			this.$postLink = ()=>{
				//console.log(this.stickers)
				//console.log(this.other);
			}
		},
		bindings:{
			stickers:"<"
		}
	})
	.component("progressFloat",{
		templateUrl: "../html/progress-float.html",
		controller: function(){
			this.selected = undefined;
			this.$postLink = ()=>{
				//console.log(this.stickers)
				//console.log(this.other);
			}
		},
		bindings:{
			float:"<"
		}
	})
	//factory para usar la API de comunicacion 'connect' de Chrome.
	.factory("$connectChrome",function(){
		let $connectChrome = {};
		$connectChrome.port = null;
		$connectChrome.$apply = null;
		$connectChrome.onMessage = function(listener){
			this.port.onMessage.addListener(listener);
		}
		$connectChrome.connect = function(obj){
			this.port = chrome.runtime.connect(obj);
		}
		$connectChrome.postMessage = function(msj){
			this.port.postMessage(msj)
		}	
		return $connectChrome;
	})
	//controlador de la pagina de configuracion
	.controller("control",["$scope","$connectChrome","$localStorage","$sce",function($scope,$connectChrome,$localStorage,$sce){
		chrome.storage.local.get(null,function(data){
			if(data.wish === undefined){
				$scope.wishList = [];		//Lista de Deseos o Busquedas Realizadas
			}
			else{
				$scope.wishList = data.wish;		//Lista de Deseos o Busquedas Realizadas
			}
			if(data.self === undefined){
				$scope.dataSelf = [];		//Lista de Articulos que le interesan al Usuario
			}
			else{
				$scope.dataSelf = data.self;		//Lista de Deseos o Busquedas Realizadas
			}
			if(data.currentPage === undefined){
				$scope.currentPage = 1;		//Lista de Articulos que le interesan al Usuario
			}
			else{
				$scope.currentPage = data.currentPage;		//Lista de Deseos o Busquedas Realizadas
			}
			if(data.skinsPred  === undefined){
				$scope.skinsPred  = [];		//Lista de Articulos que le interesan al Usuario
			}
			else{
				$scope.skinsPred  = data.skinsPred;		//Lista de Deseos o Busquedas Realizadas
			}
			$scope.$apply();
		})
		/*
			VARIABLES
		*/
		$scope.money = {
			value : 1.14,
			unid : "$"
		};

		$scope.pagination = [{
			key:"<",
			order:"BACK"
		},{
			key:1,
			order:"GO"
		},{
			key:2,
			order:"GO"
		},{
			key:3,
			order:"GO"
		},{
			key:4,
			order:"GO"
		},{
			key:5,
			order:"GO"
		},{
			key:6,
			order:"GO"
		},{
			key:7,
			order:"GO"
		},{
			key:8,
			order:"GO"
		},{
			key:9,
			order:"GO"
		},{
			key:10,
			order:"GO"
		},{
			key:">",
			order:"FORWARD"
		}]
	
		/*$scope.skinsPred = [{
			name: "AK-47",
			item: "AK-47",
			id:"custom-001",
			color:"rgba(255,0,0,0.2)",
			active:false
		},{
			name:"Asiimov AWP",
			skin:"Asiimov",
			item:"AWP",
			id:"custom-002",
			color:"rgba(255,0,0,0.2)",
			active:false
		},{
			name:"Asiimov Not StatTrak",
			skin:"Asiimov",
			stattrak:false,
			id:"custom-003",
			color:"rgba(255,0,0,0.2)",
			active:false
		},{
			name:"Case Hardened StatTrak",
			skin:"Case Hardened",
			stattrak:true,
			id:"custom-004",
			color:"rgba(255,0,0,0.2)",
			active:false
		}];*/
		$scope.search = ""
		$scope.$url = undefined
		$scope.busqueda = {}
		$scope.dataSteam = [];		//Lista de Articulos obtenidos del Servidor
		$scope.sortType = sessionStorage.getItem('sort');		//Variable para Ordenamiento, 1:Ascendente,-1:Descendente
		if( $scope.sortType === null ) {
			$scope.sortType = 1;
		}
		resetBusqueda();
		
		if($localStorage.dataSelf !== undefined){
			$scope.dataSelf = $localStorage.dataSelf;
		}
		if($localStorage.wishList !== undefined){
			$scope.wishList = $localStorage.wishList;
		}

		/*
			FUNCIONES
		*/
		$scope.eval = eval;

		$scope.addPred = function() {
			const name = prompt("Define un Nombre para la nueva Busqueda");
			$scope.busqueda.id = name+Date.now();
			$scope.busqueda = $scope.newBusqueda($scope.busqueda)
			$scope.busqueda.name = name;
			$scope.skinsPred.push($scope.busqueda)
			resetBusqueda();
			$scope.checkWishList();
			chrome.storage.local.set({skinsPred:$scope.skinsPred})
		}
		$scope.delPred = function(id) {
			$scope.skinsPred = $scope.skinsPred.filter( skin => {
				if(skin.id !== id) return skin;
			})
			chrome.storage.local.set({skinsPred:$scope.skinsPred})
		}

		$scope.page = function(order, key) {
			switch(order){
				case 'BACK':
					if($scope.currentPage !== 1) {
						$scope.currentPage--;
					}
						key = $scope.currentPage;
					break;
				case 'FORWARD':
					if($scope.currentPage !== 3) {
						$scope.currentPage++;
					}
					key = $scope.currentPage;
					break;
				case 'GO':
					$scope.currentPage = key;
					break;
			}
			chrome.storage.local.set({currentPage:$scope.currentPage})
			//$connectChrome.postMessage({type:"control",command:"change_page",content:key});
		}

		$scope.show = function( id ){
			return $scope.wishList.filter( wish => { 
				return wish.find.element.filter( element => { 
					return id===element.id
				}).length>0; 
			} ).length === 0;
		}
		//funcion para inicializar el objeto 'busqueda' a sus valores por defecto
		function resetBusqueda(){
			$scope.busqueda = {
				id:0,
				hidden:false,
				color:"rgba(255,0,0,0.2)",
				find:{
					status:false,
					element:[]
				},
				item:"",
				enableitem:false,
				stattrak:false,
				enablestattrak:false,
				skin:"",
				enableskin:false,
				sticker:"",
				enablesticker:false,
				slot0:true,
				slot1:true,
				slot2:true,
				slot3:true,
				condition:"All",
				enablecondition:false,
				floatmin:"",
				floatmax:"",
				enablefloat:false,
				pattern:[],
				enablepattern:false,
				paint:[],
				enablepaint:false,
				pricemin:0,
				pricemax:1000,
				enableprice:false
			}
		};
		//Funcion para actualizar los campos 'floatmin' y 'floatmax' 
		//cuando se cambia el valor del campo 'condition' 
		$scope.active = function(){
			const key = prompt("Ingresar Key: ");
			//$connectChrome.postMessage({type:"control",command:"licencia_key",content:{key:key}});
		}
		$scope.adjustFloat = function(){
			const rangeFloat = {
				"All":["0.00000000000000000","0.99999999999999999"],
				"Factory New":["0.00000000000000000","0.07000000000000000"],
				"Minimal Wear":["0.07000000000000000","0.15000000000000000"],
				"Field-Tested":["0.15000000000000000","0.37000000000000000"],
				"Well-Worn":["0.37000000000000000","0.45000000000000000"],
				"Battle-Scarred":["0.45000000000000000","0.99999999999999999"],
				"Not Painted":["0.00000000000000000","0.99999999999999999"]
			}[$scope.busqueda.condition];
			$scope.busqueda.floatmin = rangeFloat[0]
			$scope.busqueda.floatmax = rangeFloat[1];
		};
		//Funcion para actualizar el campo 'condition'  
		//cuando se cambia el valor de los campos 'floatmin' y 'floatmax' 
		$scope.adjustCondition = function(){
			function testCondition(min,max,tag){
				if($scope.busqueda.floatmin >= (min)&&
				$scope.busqueda.floatmin <= (max)&&
				$scope.busqueda.floatmax >= (min)&&
				$scope.busqueda.floatmax <= (max)) $scope.busqueda.condition = tag; 
			}
			testCondition("0.00000000000000000","0.99999999999999999","All");
			testCondition("0.00000000000000000","0.07000000000000000","Factory New");
			testCondition("0.07000000000000000","0.15000000000000000","Minimal Wear");
			testCondition("0.15000000000000000","0.37000000000000000","Field-Tested");
			testCondition("0.37000000000000000","0.45000000000000000","Well-Worn");
			testCondition("0.45000000000000000","0.99999999999999999","Battle-Scarred");
			testCondition("0.00000000000000000","0.99999999999999999","Not Painted");
		};

		$scope.checkSkins = () =>{
			$scope.skinsPred.forEach( item => {
				if(item.active){$scope.addWishList($scope.newBusqueda( item ));}
				else{$scope.delWish( item.id )}
			})
		}

		//funcion para borrar elementos del array wishList
		$scope.delWish = function(id){
			$scope.wishList = $scope.wishList.filter( elem => {
				if(elem.id != id) return elem;
			});
			$scope.checkWishList();
			resetBusqueda();
			chrome.storage.local.set({wish:$scope.wishList})
		}
		
		$scope.newBusqueda = function(obj) {
			return {
				id:(obj.id === undefined)?Date.now():obj.id,
				find:{
					status:false,
					element:[]
				},
				hidden:false,
				item:obj.item?obj.item:"",
				color:obj.color?obj.color:"rgba(255,0,0,0.2)",
				enableitem:!!obj.enableitem||obj.item?true:false,
				stattrak:obj.stattrak?obj.stattrak:false,
				enablestattrak:!!obj.enablestattrak||obj.stattrak?true:false,
				skin:obj.skin?obj.skin:"",
				enableskin:!!obj.enableskin||obj.skin?true:false,
				sticker:obj.sticker?obj.sticker:"",
				enablesticker:!!obj.enablesticker||obj.sticker?true:false,
				slot0:!!obj.slot0||obj.sticker?true:false,
				slot1:!!obj.slot1||obj.sticker?true:false,
				slot2:!!obj.slot2||obj.sticker?true:false,
				slot3:!!obj.slot3||obj.sticker?true:false,
				condition:obj.condition?obj.condition:"All",
				enablecondition:(!!obj.enablecondition),
				floatmin:obj.floatmin?obj.floatmin:"",
				floatmax:obj.floatmax?obj.floatmax:"",
				enablefloat:!!obj.enablefloat||obj.floatmin?true:false,
				pattern:obj.pattern?obj.pattern:[],
				enablepattern:!!obj.enablepattern||(function(){
					if(obj.pattern === undefined) return false;
					else if(obj.pattern.length === 0 ) return false;
					else return true;
				})(),
				paint:obj.paint?obj.paint:[],
				enablepaint:!!obj.enablepaint||(function(){
					if(obj.paint === undefined) return false;
					else if(obj.paint.length === 0 ) return false;
					else return true;
				})(),
				pricemin:obj.pricemin?obj.pricemin:0,
				pricemax:obj.pricemax?obj.pricemax:1000,
				enableprice:!!obj.enableprice||obj.pricemin?true:false
			}
		}

		//funcion para agregar elementos al array wishList
		$scope.addWishList = function(data){
			if(data === undefined){
				$scope.busqueda.id = Date.now()
				$scope.wishList.push($scope.newBusqueda($scope.busqueda));
			}
			else{
				if($scope.wishList.filter( elem => {
					if(elem.id === data.id) return elem
				} ).length === 0){
					$scope.wishList.push($scope.newBusqueda(data));
				}
			}
			$scope.checkWishList();
			resetBusqueda();
			chrome.storage.local.set({wish:$scope.wishList})
			
		}

		$scope.checkWishList = function(){
			$scope.wishList.forEach( wish => {
				callBackCompare = (elem, index) => {
					if((wish.enableitem?elem.item.toLocaleLowerCase().indexOf(wish.item.toLocaleLowerCase()) !== -1:true)&&
					(wish.enablestattrak?elem.stattrak:true)&&
					(wish.enableskin?elem.skin.toLocaleLowerCase().indexOf(wish.skin.toLocaleLowerCase()) !== -1:true)&&
					(wish.enablesticker?(elem.stickers.findIndex((sticker,$index)=>{
						if(sticker.name.toLocaleLowerCase().indexOf(wish.sticker.toLocaleLowerCase())!==-1){
							if(wish.slot0&&($index===0)||wish.slot1&&($index===1)||wish.slot2&&($index===2)||wish.slot1&&($index===3)) return sticker;
						}
					})!==-1):true)&&
					(wish.enablecondition?elem.condition.toLocaleLowerCase().indexOf(wish.condition.toLocaleLowerCase()) !==-1:true)&&
					(wish.enablefloat?wish.floatmin<=elem.float&&elem.float<=wish.floatmax:true)&&
					(wish.enablepattern?wish.pattern.indexOf(''+elem.pattern)!==-1:true)&&
					(wish.enablepaint?wish.paint.indexOf(''+elem.paint)!==-1:true)&&
					(wish.enableprice?wish.pricemin<=elem.price&&elem.price<=wish.pricemax:true)){
						wish.find.status = true;
						if(wish.find.element.filter( newElement => {
							if(newElement.id === elem.id) return newElement;
						}).length === 0){
							wish.find.element.push(elem);
							document.querySelector('#sonido').play();
						}
					}
				};
				$scope.dataSteam.forEach( dataSteam => {
					dataSteam.forEach( callBackCompare )
				})
				$scope.dataSelf.forEach( callBackCompare  )
			})
		}
		//funcion para ordenar los array 
		$scope.sort = function(key){
			if(key === 'price'||key === 'float'||key === 'pattern'){
				eval2 = eval;		
			}
			else{
				eval2 =function(valor){return valor};
			}
			$scope.dataSteam[$scope.currentPage].sort( (elem1, elem2) => {
				if(eval2(elem1[key]) < eval2(elem2[key])) return $scope.sortType;
				else return -$scope.sortType
			})
			
			$scope.dataSelf.sort( (elem1, elem2) => {
				if(eval2(elem1[key]) < eval2(elem2[key])) return $scope.sortType;
				else return -$scope.sortType
			})
			$scope.wishList.forEach( wish => {
				wish.find.element.sort( (elem1, elem2) => {
					if(eval2(elem1[key]) < eval2(elem2[key])) return $scope.sortType;
					else return -$scope.sortType
				})
			})

			$scope.sortType = -$scope.sortType;
			sessionStorage.setItem('sort',$scope.sortType);
		};
		//funcion para fijar los items en la parte superior de la lista
		$scope.fixed = function(item,page){
			if(page === -1){
				$scope.dataSelf = $scope.dataSelf.filter( elem => {
					if(elem.index !== item.index) return elem;
				})	
				$localStorage.dataSelf = $scope.dataSelf
				chrome.storage.local.set({self:$scope.dataSelf})
				return;
			}
			else{
				$scope.dataSelf.push(item)
				$localStorage.dataSelf = $scope.dataSelf
				$scope.dataSteam = $scope.dataSteam.filter( elem => {
					if(elem.index !== item.index) return elem;
				})
				chrome.storage.local.set({self:$scope.dataSelf})
			}
		}
		chrome.storage.local.onChanged.addListener( solveData )

		chrome.storage.local.get('items',solveData)

		function solveData(data){
			
				if(data.items !== undefined ){
					if(data.items.newValue !== undefined){
						data.items = data.items.newValue;
					}
			

					data.items.forEach( (elem,index) => {
						if(elem !== null){
							elem.sort(_=>{return -1;})
							if((elem === null)&&($scope.dataSteam[index].length === undefined)){
								$scope.dataSteam[index] = []	
							}
							if(elem !== null){
								$scope.dataSteam[index] = elem;
							}				
						}
						
					})
					$scope.dataSteam = $scope.dataSteam.filter( elem => {
						if($scope.dataSelf.filter( elem2 => {
							if((elem2.item === elem.item)&&(elem2.skin === elem.skin)){
								return elem2;
							}
						}).length === 0){
							return elem
						}
					});
				}
				$scope.checkWishList();
				$scope.$apply();	
		}
		/*$connectChrome.connect({name:"options"});
		$connectChrome.onMessage( function(data){
			console.log(data);
			//data.content.page[0] = {"type":"data","command":"save","content":[[{"condition":"Field-Tested","float":"","id":769428,"img":"https://g.fp.ps.netease.com/market/file/5c8a1ec93fdcc00d0d63c274IjuJfMvw02","img_original":"https://g.fp.ps.netease.com/market/file/5c8a1ec9a824c03c22a7603b5gC0zVf102","index":0,"item":"StatTrak™ MP5-SD ","price":"5.95","skin":" Gauss ","stickers":[],"$$hashKey":"object:7"},{"condition":"Factory New","float":"0.06954775750637054","id":36453,"img":"https://g.fp.ps.netease.com/market/file/5aa09f3a02c9a13f26f80da9EcfV5CfB","img_original":"https://g.fp.ps.netease.com/market/file/5a7abf007f9d2acfb24c71dbbDrN4Tor","index":5,"item":"SG 553 ","pattern":722,"price":"535","skin":" Bulldozer ","stickers":[{"img_url":"https://g.fp.ps.netease.com/market/file/5d5493fa2786fd5cc83dc7fbPuJALZtx02","name":"CR4ZY | 2019年柏林锦标赛","slot":0,"sticker_id":4095,"wear":0},{"img_url":"https://g.fp.ps.netease.com/market/file/5d5493fa2786fd5cc83dc7fbPuJALZtx02","name":"CR4ZY | 2019年柏林锦标赛","slot":1,"sticker_id":4095,"wear":0},{"img_url":"https://g.fp.ps.netease.com/market/file/5d5493fa2786fd5cc83dc7fbPuJALZtx02","name":"CR4ZY | 2019年柏林锦标赛","slot":2,"sticker_id":4095,"wear":0},{"img_url":"https://g.fp.ps.netease.com/market/file/5d5493fa2786fd5cc83dc7fbPuJALZtx02","name":"CR4ZY | 2019年柏林锦标赛","slot":3,"sticker_id":4095,"wear":0}]},{"condition":"Field-Tested","float":"0.37028127908706665","id":34907,"img":"https://g.fp.ps.netease.com/market/file/5aa0273d7f9d2a7ca8913afeqwoSTiUq","img_original":"https://g.fp.ps.netease.com/market/file/5a7ac33d6f0494b903358c94Pli8Qf3K","index":2,"item":"Galil AR ","pattern":4,"price":"167.5","skin":" Chatterbox ","stickers":[],"$$hashKey":"object:8"},{"condition":"Minimal Wear","float":"0.1187298372387886","id":37699,"img":"https://g.fp.ps.netease.com/market/file/5a9fc61f143cfa6804848d3dr7XJosvA","img_original":"https://g.fp.ps.netease.com/market/file/5a7ac7e4aa49f162f6a08a72kIuqzeyZ","index":1,"item":"Souvenir Glock-18 ","pattern":797,"price":"115","skin":" Reactor ","stickers":[{"img_url":"https://g.fp.ps.netease.com/market/file/5c7327ba6f04941fcf2fe8f3XIuJUqa202","name":"RpK（金色）| 2019年卡托维兹锦标赛","slot":0,"sticker_id":3926,"wear":0},{"img_url":"https://g.fp.ps.netease.com/market/file/5c7311796f0494585ad01a74kzPEs3jG02","name":"IEM（金色）| 2019年卡托维兹锦标赛","slot":1,"sticker_id":3559,"wear":0},{"img_url":"https://g.fp.ps.netease.com/market/file/5c7313d52786fd27288d1b9ddJilA3F802","name":"Renegades（金色）| 2019年卡托维兹锦标赛","slot":2,"sticker_id":3527,"wear":0},{"img_url":"https://g.fp.ps.netease.com/market/file/5c731d5c6f04941fcf2fe8b7bdoyYzH902","name":"Vitality（金色）| 2019年卡托维兹锦标赛","slot":3,"sticker_id":3551,"wear":0}],"$$hashKey":"object:9"},{"condition":"Factory New","float":"0.03498874232172966","id":762075,"img":"https://g.fp.ps.netease.com/market/file/5b8ff835a7f2523ac3c7fb87Yat5qPoq","img_original":"https://g.fp.ps.netease.com/market/file/5b8ff8348b74275143fbf5bbRPYMSJdi","index":4,"item":"Glock-18 ","pattern":22,"price":"1.9","skin":" High Beam ","stickers":[],"$$hashKey":"object:10"},{"condition":"Factory New","float":"0.05958174541592598","id":762133,"img":"https://g.fp.ps.netease.com/market/file/5b906b8a6f0494bfe984884b7biewD9C","img_original":"https://g.fp.ps.netease.com/market/file/5b90f2887f9d2a79819ebfa8IG4Cv3mr","index":3,"item":"MP7 ","link_inspect":"https://g.fp.ps.netease.com/market/file/5e3197e65e6027b4a312146e94Jl7pq102","pattern":105,"price":"104.8","skin":" Fade ","stickers":[],"$$hashKey":"object:11"},{"condition":"Minimal Wear","float":"0.11978954076766968","id":33870,"img":"https://g.fp.ps.netease.com/market/file/5aa0c29a20e3db746eb9153bVTu67Bg7","img_original":"https://g.fp.ps.netease.com/market/file/5a7abf1046072b588ad1ea7cImQXZ2oE","index":6,"item":"AK-47 ","pattern":460,"price":"263","skin":" Bloodsport ","stickers":[],"$$hashKey":"object:12"},{"condition":"Minimal Wear","float":"0.10258880257606506","id":38645,"img":"https://g.fp.ps.netease.com/market/file/5aa025dea7f252e4b518ab81HiG6m4Th","img_original":"https://g.fp.ps.netease.com/market/file/5a7ac26046072b5d7713c06d2U7sF0tR","index":8,"item":"StatTrak™ Galil AR ","pattern":731,"price":"5.32","skin":" Black Sand ","stickers":[],"$$hashKey":"object:13"},{"condition":"Factory New","float":"0.0699181780219078","id":776054,"img":"https://g.fp.ps.netease.com/market/file/5dd34abc6f04947248b62773Gbb07UkE02","img_original":"https://g.fp.ps.netease.com/market/file/5dd34ab7143cfa43122a15d4u3KOXXbh02","index":11,"item":"MAC-10 ","link_inspect":"https://g.fp.ps.netease.com/market/file/5e2826ab5e6027e8a8264b82NLcOuEN302","pattern":282,"price":"293","skin":" Stalker ","stickers":[],"$$hashKey":"object:14"},{"condition":"Field-Tested","float":"0.21258430182933807","id":45346,"img":"https://g.fp.ps.netease.com/market/file/5a86533f5e60271e243e018cApFB19JX","img_original":"https://g.fp.ps.netease.com/market/file/5a86533f20e3dbfa6e93a95dRI3PwYpj","index":7,"item":"StatTrak™ USP-S ","pattern":537,"price":"82.9","skin":" Cortex ","stickers":[],"$$hashKey":"object:15"},{"condition":"Field-Tested","float":"0.2780625820159912","id":776691,"img":"https://g.fp.ps.netease.com/market/file/5dd380748b742733ec9e2e66MKMkFYQ602","img_original":"https://g.fp.ps.netease.com/market/file/5dd380735e6027c31fd43731ECfy0A7W02","index":13,"item":"★ Paracord Knife ","pattern":255,"price":"680","skin":" Safari Mesh ","stickers":[],"$$hashKey":"object:16"},{"condition":"Holo","float":"","id":774690,"img":"https://g.fp.ps.netease.com/market/file/5dd32b5f6f04946bb95bfe66idDWuaGr02","img_original":"https://g.fp.ps.netease.com/market/file/5dd32b5e143cfad5285205d4E6HSq52A02","index":9,"item":"Sticker ","price":"3.47","skin":" Web Stuck ","stickers":[],"$$hashKey":"object:17"},{"condition":"Sticker | Jack","float":"","id":40364,"img":"https://g.fp.ps.netease.com/market/file/5a7ae3f669b21a0ba715177f2T3Qdptf","img_original":"https://g.fp.ps.netease.com/market/file/5a7ae3f5a7f2520651c1d0ccFOAQ2rZc","index":10,"item":"Sticker ","price":"4.29","skin":" Jack","stickers":[],"$$hashKey":"object:18"},{"condition":"Field-Tested","float":"0.1560075581073761","id":773631,"img":"https://g.fp.ps.netease.com/market/file/5daa1fe72786fd6b79d194c4aFuoUii102","img_original":"https://g.fp.ps.netease.com/market/file/5daa1fe76f0494433461a2e5KFcptKTT02","index":12,"item":"M249 ","pattern":428,"price":"14","skin":" Aztec ","stickers":[],"$$hashKey":"object:19"},{"condition":"Factory New","float":"0.03171675279736519","id":769230,"img":"https://g.fp.ps.netease.com/market/file/5c89aef37f9d2ab4f67e11c76HyAUlNl02","img_original":"https://g.fp.ps.netease.com/market/file/5c89aef13fdcc0e6af19e9b2kUb2hzSJ02","index":19,"item":"MAC-10 ","pattern":999,"price":"3.16","skin":" Whitefish ","stickers":[],"$$hashKey":"object:20"},{"condition":"Factory New","float":"0.0512595996260643","id":36138,"img":"https://g.fp.ps.netease.com/market/file/5aa0a5f516b6d49aec0a50e22Ef1hViC","img_original":"https://g.fp.ps.netease.com/market/file/5a7ac52420e3db5068798c94UkI0tXIg","index":15,"item":"P90 ","pattern":501,"price":"9.66","skin":" Desert Warfare ","stickers":[],"$$hashKey":"object:21"},{"condition":"Factory New","float":"0.06123393028974533","id":773668,"img":"https://g.fp.ps.netease.com/market/file/5daa28978b7427f688269440lICk0AOo02","img_original":"https://g.fp.ps.netease.com/market/file/5daa28976f04948dcf34493csWU60ftS02","index":17,"item":"FAMAS ","link_inspect":"https://g.fp.ps.netease.com/market/file/5e305183143cfacf98759d28zLBzqEPz02","pattern":609,"price":"119.9","skin":" Commemoration ","stickers":[],"$$hashKey":"object:22"},{"condition":"Field-Tested","float":"0.24002805352210999","id":45278,"img":"https://g.fp.ps.netease.com/market/file/5aa02bebadce5f2976eb3e2bLv0izL0Q","img_original":"https://g.fp.ps.netease.com/market/file/5a864f21fb758a1952b3cd74ftl0uOEs","index":18,"item":"Negev ","pattern":390,"price":"2.89","skin":" Lionfish ","stickers":[],"$$hashKey":"object:23"}],[{"condition":"Minimal Wear","float":"0.12613990902900696","id":42093,"img":"https://g.fp.ps.netease.com/market/file/5aa0990402c9a11bdf1a6606K2W8xtB2","img_original":"https://g.fp.ps.netease.com/market/file/5a7ac6a65e60271ad99b9d74opdXlJtJ","index":1,"item":"UMP-45 ","link_inspect":"https://g.fp.ps.netease.com/market/file/5e318a7c8b742757bc11239c6Q4Xjpxy02","pattern":683,"price":"4.98","skin":" Exposure ","stickers":[],"$$hashKey":"object:24"},{"condition":"Minimal Wear","float":"0.10492770373821259","id":34329,"img":"https://g.fp.ps.netease.com/market/file/5aa0c185a750143c70b6b6a6hy9Qut6f","img_original":"https://g.fp.ps.netease.com/market/file/5a7ac0dbaa49f1540b5be8a3VzNtxoZt","index":2,"item":"CZ75-Auto ","pattern":270,"price":"4.2","skin":" Tacticat ","stickers":[],"$$hashKey":"object:25"},{"condition":"Minimal Wear","float":"0.1451166421175003","id":759236,"img":"https://g.fp.ps.netease.com/market/file/5b6420025e6027c1b5e14f04ywBJjYlK","img_original":"https://g.fp.ps.netease.com/market/file/5b6420015e6027c1bcdaa3e77JlRsqeW","index":5,"item":"AUG ","pattern":366,"price":"5","skin":" Amber Slipstream ","stickers":[],"$$hashKey":"object:26"},{"condition":"Field-Tested","float":"0.33728906512260437","id":34050,"img":"https://g.fp.ps.netease.com/market/file/5aa0c26c16b6d4d6399dfce3tHmjKD6i","img_original":"https://g.fp.ps.netease.com/market/file/5a7ac8f66f0494b9033590a9db1vfdTM","index":8,"item":"AUG ","pattern":858,"price":"12.98","skin":" Syd Mead ","stickers":[],"$$hashKey":"object:27"},{"condition":"Factory New","float":"0.03873443976044655","id":762101,"img":"https://g.fp.ps.netease.com/market/file/5bb5bed07f9d2ab01098f934vzOmCjSV","img_original":"https://g.fp.ps.netease.com/market/file/5bb5bed06f049490a40f456fVXkLRXYj","index":14,"item":"MAC-10 ","pattern":926,"price":"4.8","skin":" Calf Skin ","stickers":[],"$$hashKey":"object:28"},{"condition":"Minimal Wear","float":"0.12056232988834381","id":34960,"img":"https://g.fp.ps.netease.com/market/file/5aa0275820e3db29141caf33FiKhQjJf","img_original":"https://g.fp.ps.netease.com/market/file/5a7ac2e002c9a1631cbca0f4AD6PVMjH","index":13,"item":"Galil AR ","pattern":549,"price":"16","skin":" Stone Cold ","stickers":[],"$$hashKey":"object:29"},{"condition":"Minimal Wear","float":"0.13469140231609344","id":33961,"img":"https://g.fp.ps.netease.com/market/file/5aa0c2f820e3db746eb9156cfLYRZTKi","img_original":"https://g.fp.ps.netease.com/market/file/5a7ac28b143cfafcab8f0cc7fQ2E9mZQ","index":11,"item":"AK-47 ","link_inspect":"https://g.fp.ps.netease.com/market/file/5e318a8e143cfaae32a2d473h6C7kSNh02","pattern":821,"price":"240","skin":" Redline ","stickers":[{"img_url":"https://g.fp.ps.netease.com/market/file/5a996ac0a750146d49f6b8adc3dpGM29","name":"Gambit Gaming | 2017年亚特兰大锦标赛","slot":0,"sticker_id":1762,"wear":0},{"img_url":"https://g.fp.ps.netease.com/market/file/5a996ac0a750146d49f6b8adc3dpGM29","name":"Gambit Gaming | 2017年亚特兰大锦标赛","slot":1,"sticker_id":1762,"wear":0},{"img_url":"https://g.fp.ps.netease.com/market/file/5a996ac0a750146d49f6b8adc3dpGM29","name":"Gambit Gaming | 2017年亚特兰大锦标赛","slot":2,"sticker_id":1762,"wear":0},{"img_url":"https://g.fp.ps.netease.com/market/file/5c5c033f6f0494e837db642fJ5xvmJBm02","name":"DickStacy | 2019年卡托维兹锦标赛","slot":3,"sticker_id":3747,"wear":1}],"$$hashKey":"object:30"},{"condition":"Minimal Wear","float":"0.13064725697040558","id":35416,"img":"https://g.fp.ps.netease.com/market/file/5aa0b1e069b21aa53b96b445Nzkdi9Xh","img_original":"https://g.fp.ps.netease.com/market/file/5a7ac4c67f9d2acfac33b1a9D1Elyue4","index":17,"item":"MAC-10 ","link_inspect":"https://g.fp.ps.netease.com/market/file/5e317f0e2786fdc973c3b14bFcYxCGtZ02","pattern":575,"price":"47","skin":" Neon Rider ","stickers":[],"$$hashKey":"object:31"},{"condition":"Minimal Wear","float":"0.12975859642028809","id":38484,"img":"https://g.fp.ps.netease.com/market/file/5a9fe49ca7f25267ec6929acb7iiyBOf","img_original":"https://g.fp.ps.netease.com/market/file/5a7ac8d76f0494b90166aa371C6rZbSq","index":15,"item":"StatTrak™ Dual Berettas ","pattern":677,"price":"12","skin":" Royal Consorts ","stickers":[],"$$hashKey":"object:32"},{"condition":"Well-Worn","float":"0.4392462968826294","id":34673,"img":"https://g.fp.ps.netease.com/market/file/5a9fc3fdfb758a77ba8d67beefKPr0xq","img_original":"https://g.fp.ps.netease.com/market/file/5a7ac1e846072b5d84c0ab9esP6djHZB","index":16,"item":"FAMAS ","pattern":313,"price":"25","skin":" Roll Cage ","stickers":[],"$$hashKey":"object:33"},{"condition":"Minimal Wear","float":"0.12415029108524323","id":769125,"img":"https://g.fp.ps.netease.com/market/file/5c89ac9a2786fd80aebd14a5K805yLp502","img_original":"https://g.fp.ps.netease.com/market/file/5c89ac972786fd8534c105f46Us2lieM02","index":19,"item":"AWP ","link_inspect":"https://g.fp.ps.netease.com/market/file/5e312e6c2786fdf6250ce5456yQJ2cpU02","pattern":616,"price":"37.99","skin":" Atheris ","stickers":[],"$$hashKey":"object:34"}]]};
			if(data.type === "data"){
				console.log($scope.dataSteam)

				data.content.page.forEach( (elem,index) => {
					if(elem !== null){
						elem.sort(_=>{return -1;})
						if((elem === null)&&($scope.dataSteam[index].length === undefined)){
							$scope.dataSteam[index] = []	
						}
						if(elem !== null){
							$scope.dataSteam[index] = elem;
						}				
					}
					
				})
				$scope.dataSteam = $scope.dataSteam.filter( elem => {
					if($scope.dataSelf.filter( elem2 => {
						if((elem2.item === elem.item)&&(elem2.skin === elem.skin)){
							return elem2;
						}
					}).length === 0){
						return elem
					}
				});
			}
			else if(data.type == "control"){
				$scope.tiempo_refresh = data.content.tiempo_refresh;
			}
			$scope.checkWishList();
			$scope.$apply();
		})*/
		//$connectChrome.postMessage({type:"control",command:"load",content:null})
		
		setInterval( function() {
			//$connectChrome.postMessage({type:"control",command:"load",content:null});
			//$scope.$apply();
		}, 500000 )


		setTimeout( _ => {
			$scope.checkSkins();		
		},1000);
	}])