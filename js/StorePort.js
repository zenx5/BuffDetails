(function(){

	self.StorePort = function( ports ) {
		this.ports = [];
		if( ports !== undefined ){
			ports.forEach( port => {
				this.ports.push( port );
			});
		};
		
	}

	self.StorePort.prototype = {
		add : function( port ) {
			if(!this.is( port )){
				this.ports.push( port );
			}
		},
		remove : function( port ){

		},
		is : function( port ) {
			return (this.ports.filter( elem => {
				return elem.name === port.name;	
			}).length === 1)
		},
		get : function( name ){
			try{
				return this.ports.filter( port => {
					return port.name === name;
				} )[0];
			}catch(e){
				console.log(e);
				return null;
			}
		},
		addListener : function( name , type , fun ){
			switch(type){
				case "message":
					this.get(name).onMessage(function(request){
						fun(request);
					})
					break;
			}
		}
	}

})();