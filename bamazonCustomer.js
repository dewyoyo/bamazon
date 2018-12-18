var inquirer = require("inquirer");
var mysql = require("mysql");

//create connection to db
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	// Your username
	user: "root",
	// Your password
	password: "root",
	database: "bamazon"
});

function startPurchase() {
	var dataQuery = "SELECT * FROM products "
		+ "WHERE stock_quantity >0 AND item_id < 100;";

	connection.query(
		dataQuery,
		"",
		function (err, response) {
			if (err) throw err;
			// console.log(response);
			var dataChoices = [];
			for (var i = 0; i < response.length; i++) {
				// console.log(response[0].item_id);
				// console.log(response[0].product_name);
				// console.log(response[0].price);
				dataChoices.push(response[i].item_id + ":" + response[i].product_name + "(" + response[i].department_name + ")(Qty=" + response[i].stock_quantity + ")");

			}

			dataChoices.push({
				name:
					'===================================================',
				value: 'foo',
				short: 'The long option'
			});

			inquirerQ(dataChoices);
		}
	);
};


function updateQuantity(funcBuyQty, funcBuyItemID, funcBuyTotal) {
// funcBuyItemID = parseInt(funcBuyTotal);
// console.log("funcBuyItemID: " + funcBuyItemID);
	var updateQuery = "UPDATE products SET stock_quantity = stock_quantity - ? , "
		+ "product_sales = product_sales + ? "
		+ "WHERE item_id = ?";

	connection.query(
		updateQuery,
		[funcBuyQty, funcBuyTotal, funcBuyItemID],
	// connection.query('UPDATE Products SET ??, ?? WHERE ?', 
	// 	[{stock_quantity: stock_quantity + funcBuyQty},{product_sales: product_sales + funcBuyTotal}, {item_id: funcBuyItemID} ],
		function (err, response) {
			if (err) throw err;
			console.log("=================================================================================================================");
			console.log(`Your order is accepted! Your total is $ ${funcBuyTotal.toFixed(2)}. Your item(s) will be shipped to you in 3-5 business days.`);
			console.log("=================================================================================================================");

			reprompt();

		});


}

function checkQuantity(buyItemID, buyQty) {

	var buyPrice = 0;
	var buyTotal = 0;
	var remainingQty = 0;

	// nested SQL --> can call stored procedure
	var selectQuery = "SELECT price, stock_quantity FROM products "
		+ "WHERE item_id = ?;";

	connection.query(
		selectQuery,
		buyItemID,
		function (err, response) {
			if (err) throw err;
			// console.log(response);
			// console.log(response[0].price);
			buyPrice = response[0].price;

			remainingQty = response[0].stock_quantity;

			if (remainingQty < buyQty) {
				console.log(`=================================================`);
				console.log(`Insufficient quantity! Only ${remainingQty} left.`);
				console.log(`=================================================`);

				var quantityQ = [
					{
						type: 'input',
						name: 'quantity',
						message: `How many would you like to purchase?(Less than ${remainingQty})`,
						validate: function (value) {
							var valid = !isNaN(parseFloat(value));
							return valid || 'Please enter a number';
						},
						filter: Number
					}
				];
				inquirer.prompt(quantityQ).then(res => {
					// console.log(res);
					reUserQty = res.quantity;
					// console.log("reUserQty: " + reUserQty + " remainingQty: " + remainingQty);
					if (remainingQty < reUserQty) {
						checkQuantity(buyItemID, reUserQty);
					}
					else {
						buyTotal = buyPrice * reUserQty;
						updateQuantity(reUserQty, buyItemID, buyTotal);
					}

				});
			}
			else {
				buyTotal = buyPrice * buyQty;
				updateQuantity(buyQty, buyItemID, buyTotal);
			}
		});
}


function inquirerQ(parameter) {
	// console.log(parameter);

	var startQ = [
		{
			type: 'list',
			name: 'items',
			message: 'Select the id that you want to buy.',
			paginated: true,
			choices: parameter
		},
		{
			type: 'input',
			name: 'quantity',
			message: 'How many would you like to purchase?',
			validate: function (value) {
				var valid = !isNaN(parseFloat(value));
				return valid || 'Please enter a number';
			},
			filter: Number
		}
	];
	inquirer.prompt(startQ).then(res => {
		// console.log(res);
		// console.log(res.items.split(":")[0]);
		// console.log(res.quantity);

		var userItemID = res.items.split(":")[0];
		var userQty = res.quantity;
// console.log(userItemID);
		checkQuantity(userItemID, userQty);
	});
};


//asks if they would like to purchase another item
function reprompt() {
	inquirer.prompt([{
		type: "confirm",
		name: "reply",
		message: "Would you like to purchase another item?"
	}]).then(function (ans) {
		if (ans.reply) {
			startPurchase();
		}
		else {
			console.log("Thank you!! See you soon!");
			connection.end();
		}
	});
}

function start() {
	connection.connect(function (err) {
		if (err) throw err;
		// console.log("connected as id " + connection.threadId);

		console.log("=================================================================================================================");
		console.log("==================================   Welcome to beta Amazon!!!   ================================================");
		console.log("=================================================================================================================");
		startPurchase();

	});
}

start();