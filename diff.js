var cs = require("colorplus").enable();
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
		min_edit_distance:function(seq_a, seq_b)
		{
			/*
				trace:
				1: array left (add)
				2: array top (delete)
				3: array left&top (substitute)
			*/

			var m = seq_a.length;
			var n = seq_b.length;
			var dp = [], trace = [];
			console.log(seq_a, seq_b);
			var debug = function()
			{
				for (var i = 0; i <= n; i++)
				{
					var tmp = "";
					for (var j = 0; j <= m; j++)
					{
						tmp += dp[i][j] + " ";
					}
					console.log(tmp);
				}
			}
			for (var i = 0; i <= n; i++)
			{
				dp[i] = [];
				trace[i] = [];
			}
			for (var i = 0; i <= n; i++)
			{
				dp[i][0] = i;
				trace[i][0] = 2;
			}
			for (var i = 0; i <= m; i++)
			{
				dp[0][i] = i;
				trace[0][i] = 1;
			}
			var add_cost = 1;
			var del_cost = 1;
			var sub_cost = 1;
			for (var i = 1; i <= n; i++)
			{
				for (var j = 1; j <= m; j++)
				{
					dp[i][j] = 999999999;
					trace[i][j] = 0;
					if (dp[i][j-1] + add_cost < dp[i][j])
					{
						dp[i][j] = dp[i][j-1] + add_cost;
						trace[i][j] = 1;
					}
					if (dp[i-1][j] + del_cost < dp[i][j])
					{
						dp[i][j] = dp[i-1][j] + del_cost;
						trace[i][j] = 2;
					}
					var tmp_sub_cost = seq_a[j] == seq_b[i] ? 0:sub_cost; 
					if (dp[i-1][j-1] + tmp_sub_cost < dp[i][j])
					{
						dp[i][j] = dp[i-1][j-1] + tmp_sub_cost;
						trace[i][j] = 3;
					}

				}
			}
			debug();
			console.log("Ans: ".yellow, dp[n][m]);


		}

	}
	return r;

}

var PG = new diff;
//PG.set(text_old, text_new);
PG.min_edit_distance([1,2,4,5], [3,5,1]);
//PG.min_edit_distance([1,2,3,4], [1,3,4]);
//PG.min_edit_distance([1,3,4], [1,4]);