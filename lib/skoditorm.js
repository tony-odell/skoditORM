var model = require("./model.js");

var skodit = function(opts){
	if(!opts.db){
		throw "DB must be specified";
	}
	if(!opts.host){
		opts.host = "localhost";
	}
	this.opts = opts;
	this.mongous = require("mongous").Mongous;
	this.models = {};
}

skodit.prototype.createSchema = function(collection,schema){
	if(this.models[collection]){
		this.models[collection] = new model(schema,{"c":this.mongous});
	}else{
		this.models[collection].update(schema);
	}
	return this.models[collection];
};

module.exports = skodit;

