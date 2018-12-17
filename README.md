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

