var mySql = require("mySql");
var inquirer = require("inquirer");

var connection = mySql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "root",
	database: "bamazon"
});

function start() {
	inquirer.prompt([{
		type: "list",
		name: "ExecMenu",
		message: "What would you like to do?",
		choices: ["View Product Sales by Department", "Create New Department", "End Session"]
	}]).then(function (response) {
		switch (response.ExecMenu) {
			case "View Product Sales by Department":
				viewSalesByDept();
				break;
			case "Create New Department":
				createNewDept();
				break;
			case "End Session":
				console.log('Bye!');
				connection.end();
		}
	});
};

//view product sales by department
function viewSalesByDept() {
	//prints the items for sale and their details
	var dataQuery = 'SELECT a.department_id, a.department_name, a.over_head_costs, IFNULL(SUM(b.product_sales), 0) product_sum '
		+ 'FROM departments a LEFT JOIN products b '
		+ 'ON a.department_name = b.department_name '
		+ 'GROUP BY a.department_name '
		+ 'ORDER BY a.department_id';

	connection.query(dataQuery, function (err, res) {
		if (err) throw err;
		// console.log(res);

		console.log("====================================================================================");
		console.log("| department_id | department_name | over_head_costs | product_sales | total_profit |");
		console.log("====================================================================================");
		for (var i = 0; i < res.length; i++) {
			var total_profit = res[i].product_sum - res[i].over_head_costs;
			console.log(`| ${res[i].department_id.toString().padEnd(13, " ")} | ${res[i].department_name.padEnd(15, " ")} | ${res[i].over_head_costs.toFixed(2).toString().padEnd(15, " ")} | ${res[i].product_sum.toFixed(2).toString().padEnd(13, " ")} | ${total_profit.toFixed(2).toString().padEnd(12, " ")} |`);
			console.log('------------------------------------------------------------------------------------')
		};

		start();
	});
};

//create a new department
function createNewDept() {

	inquirer.prompt([
		{
			type: "input",
			name: "deptName",
			message: "Department Name: "
		}, {
			type: "input",
			name: "overHeadCost",
			message: "Over Head Cost: ",
			default: 0,
			validate: function (val) {
				if (isNaN(val) === false) { 
					return true;
				}
				else { 
					return false;
				}
			}
		}
	]).then(function (ans) {
		connection.query('INSERT INTO Departments SET ?', {
			department_name: ans.deptName,
			over_head_costs: ans.overHeadCost
		}, function (err, res) {
			if (err) throw err;
			console.log('New department is added.');
			start();
		})
		
	});
}


start();