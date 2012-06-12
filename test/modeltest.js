var skodit = new (require("../lib/skoditorm"))({db:"philly"});
console.log(skodit);
var tuntaverns = skodit.createSchema("tuntavern",{
	name:{
		type:"string"
		,validate:/^.+$/
	}
	,year:{
		type:"date"
	}
	,recruited:{
		type:"int"
		,validate:function(val){
			if(val>10 || val<5){
				return "5 < x < 10";
			}
			return null;
		}
	}
	,subobj:{
		sfield:{
			obj1:{type:"string"}
			,obj2:{type:"date"}
		}
	}
},{
	ignoreOptionalFieldErrors:true
});

var s = tuntaverns.create({
	name:"Test str"
	,year:"1775-11-10"
	,subobj:{
		sfield:{
			obj1:"Captain Nicholas"
			,obj2:"1775-11-10"
		}
	}
});

console.log(s.check());
