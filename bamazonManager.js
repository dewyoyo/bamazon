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
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
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
            case "Exit":
                console.log('Bye!');
                connection.end();
        }
    });
}

//views all inventory
function viewProducts() {
    connection.query('SELECT * FROM Products;', function(err, res){
        if(err) throw err;
        console.log("=========================================================================================================================");
        console.log("   ID   |                              Product                               |        Department        |  Price  |  QTY  ");
        console.log("=========================================================================================================================");
        for(var i = 0; i<res.length;i++){
          console.log(`${res[i].item_id.toString().padEnd(7," ")} | ${res[i].product_name.padEnd(66," ")} | ${res[i].department_name.padEnd(24," ")} | ${res[i].price.toString().padEnd(7," ")} | ${res[i].stock_quantity.toString().padEnd(7," ")}`);
          console.log('-----------------------------------------------------------------------------------------------------------------------')
        }
      
        start();
        });
}

//views inventory lower than 5
function viewLowInventory(pNum) {
    connection.query('SELECT * FROM Products WHERE stock_quantity < ?;', pNum ,function(err, res){
        if(err) throw err;
        console.log("=========================================================================================================================");
        console.log("   ID   |                              Product                               |        Department        |  Price  |  QTY  ");
        console.log("=========================================================================================================================");
        for(var i = 0; i<res.length;i++){
            console.log(`${res[i].item_id.toString().padEnd(7," ")} | ${res[i].product_name.padEnd(66," ")} | ${res[i].department_name.padEnd(24," ")} | ${res[i].price.toString().padEnd(7," ")} | ${res[i].stock_quantity.toString().padEnd(7," ")}`);
            console.log('-----------------------------------------------------------------------------------------------------------------------')
        }
    
    start();
    });
}

//displays prompt to add more of an item to the store and asks how much
function addToInventory(){

    connection.query('SELECT * FROM Products', function(err, response) {
        if(err) throw err;
        var itemArray = [];
        //pushes each item into an itemArray
        for(var i=0; i<response.length; i++){
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
            validate: function(value){
                if (isNaN(value) === false) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }]).then(function(ans){
          // console.log(ans);
          // console.log(ans.product.split(":")[0]);
          var currentQty = ans.product.split("=")[1];
          currentQty = parseInt(currentQty.split(")")[0]);

            connection.query('UPDATE Products SET ? WHERE ?', [
                {stock_quantity: currentQty + parseInt(ans.qty)},
                {item_id: ans.product.split(":")[0]}
            ], function(err, res){
                  if(err) throw err;
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
        validate: function(value){
          if(value){return true;}
          else{return false;}
        }
    }, {
        type: "input",
        name: "department",
        message: "Department: "
    }, {
        type: "input",
        name: "price",
        message: "Price: ",
        validate: function(value){
          if(isNaN(value) === false){return true;}
          else{return false;}
        }
    }, {
        type: "input",
        name: "quantity",
        message: "Quantity: ",
        validate: function(value){
          if(isNaN(value) == false){return true;}
          else{return false;}
        }
    }]).then(function(ans) {

      // INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES 
        connection.query('INSERT INTO Products SET ?',{
            product_name: ans.product,
            department_name: ans.department,
            price: ans.price,
            stock_quantity: ans.quantity
        }, function(err, res){
            if(err) throw err;
            console.log('Successfully item is added.');
        })
        start();
    });
}

start();