/*
	diff.js
	A simplified diff implementation in JavaScript. (by minimun edit distance dynamic programming)
	Copyright(C) 2013 by PG @ SENSE Lab
	Released under the MIT license.

	
*/
var cs = require("colorplus").enable();
var fs = require("fs");
module.exports = (function()
{
	
	var r =
	{
		text_src: "",
		text_dst: "",
		src_list: [],
		dst_list: [],
		hashed_src: [],
		hashed_dst: [],
		hash_table: [],
		lookup_table: [],

		set:function(src_in, dst_in)
		{
			this.text_src = src_in;
			this.text_dst = dst_in;
			this.src_list = this.text_src.split("\n");
			this.dst_list = this.text_dst.split("\n");
			hashed_stc = [];
			hashed_dst = [];
			hash_table = [];
			lookup_table = [];
		},
		diff:function(src_in, dst_in)
		{
			this.set(src_in, dst_in);
			
			for (var i = 0; i < this.src_list.length; i++)
			{
				this.hash_table[this.src_list[i]] = true;
			}
			for (var i = 0; i < this.dst_list.length; i++)
			{
				this.hash_table[this.dst_list[i]] = true;
			}

			var count = 0;
			for (var key in this.hash_table)
			{
				this.hash_table[key] = ++count;
			}
			
			for (var key in this.hash_table)
			{
				this.lookup_table[this.hash_table[key]] = key;

			}

			for (var i = 0; i < this.src_list.length; i++)
			{
				this.hashed_src[i] = this.hash_table[this.src_list[i]];
			}
			for (var i = 0; i < this.dst_list.length; i++)
			{
				this.hashed_dst[i] = this.hash_table[this.dst_list[i]];
			}


			var result = this.min_edit_distance(this.hashed_dst, this.hashed_src);
			this.show_op_list(result, this.hashed_dst, this.hashed_src, this.lookup_table);
		},
		show_op_list:function(op_list, seq_a, seq_b, lookup_table)
		{
			console.log("==Result==".cyan);
			if (lookup_table === undefined)
			{
				lookup_table = [];
				var tmp_max = seq_a.length + seq_b.length;
				
				for (var i = 0; i <= tmp_max; i++)
				{
					lookup_table[i] = i;

				}
			}

			var last_line_no = -1;
			for (var i = 0; i < op_list.length; i++)
			{
				var line_no;
				if (op_list[i].line_no > last_line_no)
				{
					last_line_no = op_list[i].line_no;
					line_no = op_list[i].line_no + ". ";
				}
				else
				{
					line_no = "  ";
				}
				while (line_no.length < 5) line_no = " " + line_no;

				if (op_list[i].type == "add")
				{
					var str = lookup_table[ seq_a[op_list[i].line_no] ];
					console.log(line_no + "+".green, str);

				}
				else if (op_list[i].type == "del")
				{
					var str = lookup_table[ seq_b[op_list[i].line_no] ];
					console.log(line_no + "-".red,  str);
				}
				else if (op_list[i].type == "nop")
				{
					var str = lookup_table[ seq_a[op_list[i].line_no] ];
					console.log(line_no + " ".cyan, str);
				}
			}
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
			var dp = [], trace = [], op_list = [];

			seq_a.splice(0, 0, -1);
			seq_b.splice(0, 0, -1);
			var debug = function()
			{
				console.log("dp:".red);
				for (var i = 0; i <= n; i++)
				{
					var tmp = "";
					for (var j = 0; j <= m; j++)
					{
						tmp += dp[i][j] + " ";
					}
					console.log(tmp);
				}
				console.log("trace:".red);
				for (var i = 0; i <= n; i++)
				{
					var tmp = "";
					for (var j = 0; j <= m; j++)
					{
						tmp += trace[i][j] + " ";
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
			var sub_cost = 10000;
			for (var i = 1; i <= n; i++)
			{
				for (var j = 1; j <= m; j++)
				{
					dp[i][j] = 999999999;
					trace[i][j] = 0;
					if (dp[i-1][j] + del_cost < dp[i][j])
					{
						dp[i][j] = dp[i-1][j] + del_cost;
						trace[i][j] = 2;
					}
					if (dp[i][j-1] + add_cost < dp[i][j])
					{
						dp[i][j] = dp[i][j-1] + add_cost;
						trace[i][j] = 1;
					}
					var tmp_sub_cost = seq_a[j] == seq_b[i] ? 0:sub_cost; 
					if (dp[i-1][j-1] + tmp_sub_cost < dp[i][j])
					{
						dp[i][j] = dp[i-1][j-1] + tmp_sub_cost;
						if (tmp_sub_cost == 0) trace[i][j] = 4;
						else trace[i][j] = 3;
					}

				}
			}
			
			var push_op_list = function(type, line_no, line_no_2)
			{
				var tmp = {type:type, line_no:line_no, line_no_2:line_no_2};
				op_list.push(tmp);
			}
			var op_list_compare = function(a, b)
			{
				if (a.line_no == b.line_no)
				{
					var a2 = a.type == "nop" ? 1:0;
					var b2 = b.type == "nop" ? 1:0;
					return a2 > b2;
				}
				else return a.line_no - b.line_no;
			}
			for (var i = n,j = m; i > 0 || j > 0;)
			{
				if (trace[i][j] == 1)
				{
					push_op_list("add", j);
					j--;
				}
				else if (trace[i][j] == 2)
				{
					push_op_list("del", i);
					i--;
				}
				else if (trace[i][j] == 3)
				{
					push_op_list("sub", i, j);
					i--; j--;
				}
				else if (trace[i][j] == 4)
				{
					push_op_list("nop", j);
					i--; j--;
				}
			}

			op_list.sort(op_list_compare);
			//this.show_op_list(op_list, seq_a, seq_b);
			return op_list;

		}

	}
	return r;

})();

