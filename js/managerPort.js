var managerPort=function(){console.log("managerPort");self.ManagerPort=function(){this.ports=[]};self.ManagerPort.prototype={add:function(b){0===this.ports.filter(function(a){return a.name===b.name}).length&&this.ports.push(b)},sendMessage:function(b,a){try{this.get(b).sendMessage(a)}catch(c){console.log(c)}},get:function(b){try{return this.ports.filter(function(a){return a.name===b})[0]}catch(a){return console.log(a),null}}};return new ManagerPort}();