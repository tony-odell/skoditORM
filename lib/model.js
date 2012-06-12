var model = function(model,opts){
	this.schema = model;
	if(!opts.c){
		throw "Connection not given";
	}
	if(opts.autocheck === undefined){
		opts.autocheck = 1;
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

model.prototype.check = function(cb,schema,data){
	var checker = schema || this.parent.schema;
	var data = data || this.data;
	var output = {};
	var col = {};
	for(var s in schema){
		col = {};
		if(schema[s].required && !data[s]){
			return cb("Field \"" + s + "\" undefined.",null);
		}
	}
}

module.exports = model;
