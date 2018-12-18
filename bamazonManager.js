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

function start() {
    var lowQ = 5;

    inquirer.prompt([{
        type: "list",
        name: "managerMenu",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "End Session"]
    }]).then(function (ans) {
        switch (ans.managerMenu) {
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                viewLowInventory(lowQ);
                break;
            case "Add to Inventory":
                addToInventory();
                break;
            case "Add New Product":
                addNewProduct();
                break;
            case "End Session":
                console.log('Bye!');
                connection.end();
        }
    });
}

//views all inventory
function viewProducts() {
    connection.query('SELECT * FROM Products;', function (err, res) {
        if (err) throw err;
        console.log("=========================================================================================================================");
        console.log("   ID   |                              Product                               |        Department        |  Price  |  QTY  ");
        console.log("=========================================================================================================================");
        for (var i = 0; i < res.length; i++) {
            console.log(`${res[i].item_id.toString().padEnd(7, " ")} | ${res[i].product_name.padEnd(66, " ")} | ${res[i].department_name.padEnd(24, " ")} | ${res[i].price.toString().padEnd(7, " ")} | ${res[i].stock_quantity.toString().padEnd(7, " ")}`);
            console.log('-----------------------------------------------------------------------------------------------------------------------')
        }

        start();
    });
}

//views inventory lower than 5
function viewLowInventory(pNum) {
    connection.query('SELECT * FROM Products WHERE stock_quantity < ?;', pNum, function (err, res) {
        if (err) throw err;
        console.log("=========================================================================================================================");
        console.log("   ID   |                              Product                               |        Department        |  Price  |  QTY  ");
        console.log("=========================================================================================================================");
        for (var i = 0; i < res.length; i++) {
            console.log(`${res[i].item_id.toString().padEnd(7, " ")} | ${res[i].product_name.padEnd(66, " ")} | ${res[i].department_name.padEnd(24, " ")} | ${res[i].price.toString().padEnd(7, " ")} | ${res[i].stock_quantity.toString().padEnd(7, " ")}`);
            console.log('-----------------------------------------------------------------------------------------------------------------------')
        }

        start();
    });
}

//displays prompt to add more of an item to the store and asks how much
function addToInventory() {

    connection.query('SELECT * FROM Products', function (err, response) {
        if (err) throw err;
        var itemArray = [];
        //pushes each item into an itemArray
        for (var i = 0; i < response.length; i++) {
            itemArray.push(response[i].item_id + ":" + response[i].product_name + "(" + response[i].department_name + ")(Qty=" + response[i].stock_quantity + ")");

        }

        // console.log(itemArray);
        inquirer.prompt([{
            type: "list",
            name: "product",
            choices: itemArray,
            message: "Which item would you like to add inventory?"
        },
        {
            type: "input",
            name: "qty",
            message: "How much would you like to add?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }]).then(function (ans) {
            // console.log(ans);
            // console.log(ans.product.split(":")[0]);
            var currentQty = ans.product.split("=")[1];
            currentQty = parseInt(currentQty.split(")")[0]);

            connection.query(
                'UPDATE Products SET ? WHERE ?',
                [{ stock_quantity: currentQty + parseInt(ans.qty) }, { item_id: ans.product.split(":")[0] }]
                , function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " products updated!\n");
                    start();
                });
        })
    });
}


function addNewProduct() {
    inquirer.prompt([{
        type: "input",
        name: "product",
        message: "Product: ",
        validate: function(value) {
            var notPass = value.match(
                /[:]/i
              );
              if (notPass) {
                return "':' is not allowed for product name.";
              }
              else {
                  return true;
              }
        }
    }, {
        type: "input",
        name: "department",
        message: "Department: ",
        // validate: function(value) {
        //     var pass = value.match(
        //       /[abcdefghijklmnopqrstuvwxyz1234567890]/i
        //     );
        //     if (pass) {
        //       return true;
        //     }
      
        //     return 'Please enter valid alphabet';
        // }
        validate: function (value) {
            if (value) {
                return true;
            }
            else {
                return false;
            }
        }
    }, {
        type: "input",
        name: "price",
        message: "Price: ",
        validate: function(value) {
            var valid = !isNaN(parseFloat(value));
            return valid || 'Please enter a number';
        },
        filter: Number
    }, {
        type: "input",
        name: "quantity",
        message: "Quantity: ",
        validate: function(value) {
            var valid = !isNaN(parseInt(value));
            return valid || 'Please enter a number';
        },
        filter: Number
    }]).then(function (ans) {


        connection.query("SELECT count(*) name_exist FROM products WHERE product_name = ? ; ",
            ans.product
            , function (err, res) {
                if (err) throw err;
                // console.log(res);
                // console.log(res[0].name_exist);
                // if it does not exist, add this new department to departments table
                if (res[0].name_exist == 0) {
                    // console.log("New item!");


                    // if new product has new department add it to the dapartments table and add it to products table also.
                    // check if this new department_name is in departments table

                    // connection.query("SELECT * FROM departments WHERE department_name LIKE ?% ; ", 
                    connection.query("SELECT * FROM departments WHERE department_name = ? ; ",
                        ans.department
                        , function (err_dep, res_dep) {
                            if (err_dep) throw err;
                            // console.log(res_dep[0]);
                            // if it does not exist, add this new department to departments table
                            if (!res_dep[0]) {
                                // console.log("No such department!");

                                connection.query('INSERT INTO Departments SET ?', {
                                    department_name: ans.department,
                                    over_head_costs: 0
                                }, function (err, response) {
                                    if (err) throw err;
                                    console.log('New department is added.');
                                })

                                // INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES 
                                connection.query('INSERT INTO Products SET ?', {
                                    product_name: ans.product,
                                    department_name: ans.department,
                                    price: ans.price,
                                    stock_quantity: ans.quantity
                                }, function (err, response) {
                                    if (err) throw err;

                                    console.log('New item is added.');
                                    start();
                                })
                            }
                            else {
                                // console.log("It has department!");
                                // INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES 
                                connection.query('INSERT INTO Products SET ?', {
                                    product_name: ans.product,
                                    department_name: ans.department,
                                    price: ans.price,
                                    stock_quantity: ans.quantity
                                }, function (err, response) {
                                    if (err) throw err;

                                    console.log('New item is added.');
                                    start();
                                })
                            };
                        });
                }
                else {
                    console.log("The item alreay exists in database! Please use 'Add to Inventory' option.\n");
                    start();
                };
            });
    });
}

start();