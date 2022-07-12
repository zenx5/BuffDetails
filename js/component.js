angular.module("app_config")
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
				if((typeof(this.tags)==="string")||(this.tags.length === undefined)) this.tags = [];
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
		},
		bindings:{
			label:"@",
			value:"=",
			unid:"=",
			min:"<",
			max:"<",
			step:"<"
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