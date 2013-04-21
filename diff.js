var cs = require("colorplus").enable;
var fs = require("fs");
var text_old = fs.readFileSync("./oldtext.txt", "utf-8");
var text_new = fs.readFileSync("./newtext.txt", "utf-8");

var diff = function()
{
	var r =
	{
		text_old: "",
		text_new: "",
		set:function(old_in, new_in)
		{
			this.text_old = old_in;
			this.text_new = new_in;
			console.log(this.text_old.split("\n"));
			console.log(this.text_new.split("\n"));
		},

	}
	return r;

}

var PG = new diff;
PG.set(text_old, text_new);