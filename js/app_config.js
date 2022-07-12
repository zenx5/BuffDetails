$(document).ready(function(){
	$('[data-toggle="tooltip"]').tooltip({html:true})
});

angular.module("app_config")
	//controlador de la pagina de configuracion
	.controller("control",["$scope","$localStorage","$sce",function($scope,$localStorage,$sce){
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
		if(localStorage.getItem("money")){
			$scope.money = JSON.parse(localStorage.getItem("money"));
		}else{
			$scope.money ={
				value : 1.14,
				unid : "$"
			}
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
			key:">",
			order:"FORWARD"
		}]
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

		setInterval(function(ev){
			localStorage.setItem("money",JSON.stringify($scope.money));	
		},1000)

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
		$scope.checkWishList = function(datos){
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
				if(datos !== undefined){
					datos.forEach( callBackCompare );
				}
				else{
					$scope.dataSteam.forEach( dataSteam => {
						dataSteam.forEach( callBackCompare )
					})
					$scope.dataSelf.forEach( callBackCompare  )
				}
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
						$scope.checkWishList(
							(function(list1, list2, comp, cond){

							})( data.items, (function(){
								if(sessionStorage.getItem("lastItem")){
									return JSON.parse(sessionStorage.getItem("lastItem"));
								}
								else{
									return [];
								}
							})() , function(a,b){return a.id === b.id;}  , false )
						);
						sessionStorage.setItem("lastItem",JSON.stringify(data.items));
					}
					data.items.forEach( (elem,index) => {
						if(elem !== null){
							elem.sort(_=>{return -1;})
							if((elem === null)&&($scope.dataSteam[index].length === undefined)){
								console.log("linea 374, es necesaria esta condicion")
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
				//$scope.checkSkins();
				//$scope.checkWishList();
				$scope.$apply();	
		}
		setTimeout( _ => {
			$scope.checkSkins();
		},1000);
	}])