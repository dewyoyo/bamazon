# Node.js & MySQL

## Overview

This app is Amazon-like storefront with the MySQL and node.js. The app will take in orders from customers and deplete stock from the store's inventory. 

1. `BamazonCustomer.js`

    * This application will first display all of the items available for sales.

    * The app should then prompt users with two messages.

        * The first should ask them the ID of the product they would like to buy.
        * The second message should ask how many units of the product they would like to buy.

    * Asks for the quantity.

      * If there is a sufficient amount of the product in stock, it will return the total for that purchase.
      * However, if there is not enough of the product in stock, it will tell the user that there isn't enough of the product.
      * If the purchase goes through, it updates the stock quantity to reflect the purchase.

-----------------------

2. `BamazonManager.js`

    * Starts with a menu:
        * View Products for Sale

        * View Low Inventory

        * Add to Inventory

        * Add New Product

        * End Session

    * If a manager selects `View Products for Sale`, the app shows list every available item: the item IDs, names, prices, and quantities.

    * If a manager selects `View Low Inventory`, then it shows list all items with an inventory count lower than five.

    * If a manager selects `Add to Inventory`, the app shows display a prompt that will let the manager "add more" of any item currently in the store.

    * If a manager selects `Add New Product`, it shows allow the manager to add a completely new product to the store.

-----------------------

3. `BamazonExecutive.js`

    * Starts with a menu:
        * View Product Sales by Department

        * Create New Department

        * End Session

    * If the manager selects `View Product Sales by Department`, it lists the department_id, department_name, over_head_costs, product_sales, total_profit.

    * If the manager selects `Create New Department`, it allows the manager to create a new department and input current overhead costs and product sales. If there are none, by default it will set at 0.

    * If the manager selects `End Session`, it ends the session and doesn't go back to the menu.

    ## Demo Videos
    * (https://drive.google.com/file/d/1aLl5AjqLi7BqSd95nDm9DbvnvuXNXx7S/view)

    ## Demo Videos for restriction
    * (https://drive.google.com/file/d/1E4ox7c6e0OkB3rzdk3jWjeiT_dBXp8Ru/view)
