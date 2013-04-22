var fs = require("fs");
var text_old = fs.readFileSync("./oldtext.txt", "utf-8");
var text_new = fs.readFileSync("./newtext.txt", "utf-8");
var text_old2 = fs.readFileSync("./oldtext2.txt", "utf-8");
var text_new2 = fs.readFileSync("./newtext2.txt", "utf-8");

var diff = require("./diff.js");
console.log(diff);
diff.diff(text_old, text_new);
diff.diff(text_old2, text_new2);