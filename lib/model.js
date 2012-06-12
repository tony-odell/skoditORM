var model = function(model,opts){
	this.schema = model;
	if(!opts.c){
		throw "Connection not given";
	}
	if(opts.autocheck === undefined){
		opts.autocheck = 1;
	}
	if(opts.ignoreOptionalFieldErrors === undefined){
		opts.ignoreOptionalFieldErrors = 0;
	}
	this.opts = opts;
};

model.prototype.model = model;
model.prototype.update = function(schema){
	var toupdate = {};
	this.schema = schema;
};

model.prototype.create = function(data){
	var m = function(d){this.data = data;}
	m.prototype.save = this.save;
	m.prototype.check = this.check;
	m.prototype.parent = this;
	return new m(data);
};

model.prototype.check = function(cb,schema,data,path){
	schema = schema || this.parent.schema;
	data = data || this.data;
	cb = (typeof cb == "function")?cb:function(e,f){console.log("E: " + e);};
	var output = {};
	var col = {};
	path = path || "";
	console.log(path);
	console.log(this.parent.opts);
	for(var s in schema){
		col = {};
		console.log("checking " + path + s + " : \"" + data[s] + "\"");
		if(schema[s].required && !data[s]){
			cb("Field \"" + path + s + "\" is required but undefined",null);
			return null;
		}
		if(typeof schema[s].validate == "function"){
			var r = schema[s].validate(data[s]);
			r && cb(r,null);
			return null;

		}
		if(schema[s].validate instanceof RegExp && data[s].match(schema[s].validate) !== null){
			console.log(path + s + ": invalid.");
			if(this.parent.opts.ignoreOptionalFieldErrors){ continue; }
			cb(schema[s].validationMsg || ("Field \"" + path + s + "\" does not match: " + schema[s].validate), null);
			return null;
		}
		if(schema[s].min && data[s]){
			if(data[s].length < schema[s].min){
				console.log(path + s + ": invalid.");
				cb("Field \"" + path + s + "\" is too short", null);
				return null;
			}
		}
		if(schema[s].max && data[s]){
			if(data[s].length > schema[s].max){
				cb("Field \"" + path + s + "\" is too long", null);
				return null;
			}
		}
		if(typeof schema[s] == "object" && typeof data[s] == "object"){
			var q = this.check(cb,schema[s],data[s],path + s + ".");
			if(q == null){
				return null;
			}
			output[s] = q;
		}else{
			if(schema[s].type == "int"){
				if(isNaN(parseInt(data[s])) && schema[s].required && !this.parent.opts.ignoreOptionalFieldErrors){
					cb("\"" + path + s + "\" expected integer, received: " + data[s],null);
					return null;
				}else if(!isNaN(parseInt(data[s]))){
					output[s] = parseInt(data[s]);
				}
			}
			if(schema[s].type == "float" || schema[s].type == "number"){
				if(isNaN(parseFloat(data[s])) && schema[s].required && !this.parent.opts.ignoreOptionalFieldErrors){
					cb("\"" + path + s + "\" expected float, received: " + data[s],null);
					return null;
				}else if(!isNaN(parseFloat(data[s]))){
					output[s] = parseFloat(data[s]);
				}
			}
			if(schema[s].type == "string"){
				if(typeof data[s] != "string" && !data[s].toString && !this.parent.opts.ignoreOptionalFieldErrors){
					cb("\"" + path + s + "\" expected string, received: " + data[s],null);
					return null;
				}else if(typeof data[s] == "string" || data[s].toString){
					output[s] = (typeof data[s] == "string")?data[s]:data[s].toString();
				}
			}
			if(schema[s].type == "date"){
				if(new Date(data[s]) == "Invalid Date" && this.parent.opts.ignoreOptionalFieldErrors){
					cb("\"" + path + s + "\" expected date, received: " + data[s],null);
					return null;					
				}else if(new Date(data[s]) != "Invalid Date"){
					output[s] = new Date(data[s]);
				}
			}
		}		
	}
	console.log(path + " : " + output);
	return output;
}

module.exports = model;
