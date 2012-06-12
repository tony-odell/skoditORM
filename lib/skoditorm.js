var model = require("./model.js");

var skodit = function(opts){
	var self = this;
	if(!opts.db){
		throw "DB must be specified";
	}
	if(!opts.host){
		opts.host = "localhost";
	}
	self.opts = opts;
	self.mongous = require("mongous").Mongous;
	self.models = {};
	self.createSchema = function(collection,schema,modelopts){
		if(!self.models[collection]){
			console.log(modelopts);
			modelopts.c = self.mongous;
			self.models[collection] = new model(schema,modelopts);
		}else{
			self.models[collection].update(schema);
		}
		return self.models[collection];
	}
};

module.exports = skodit;
