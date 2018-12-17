DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

DROP TABLE products;

CREATE TABLE products
(
  item_id INT NOT NULL  AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price FLOAT(10,2),
  stock_quantity INTEGER, 
  PRIMARY KEY (item_id)
);


  INSERT INTO products
    (product_name, department_name, price, stock_quantity)
  VALUES
    ("Ocean Meets Sky", "Books", 14.53, 25),
    ("Willa of the Wood", "Books", 7.44, 12),
    ("The Burning Maze", "Books", 13.13, 21),
    -- ("Children of Blood and Bone (Legacy of Orisha)", "Books", 14.24, 14), 
    -- ("The Assassination of Brangwain Spurge", "Books", 16.50, 30), 
    -- ("Mary Poppins (illustrated gift edition)", "Books", 18.81, 40), 
    -- ("Harry Potter Books 1-7 Special Edition Boxed Set", "Books", 61.27, 18), 
    -- ("The Greatest Showman (Original Motion Picture Soundtrack)", "Music", 9.49, 10), 
    ("Socks", "Music", 9.49, 14),
    ("Christmas Is Here!", "Music", 9.99, 35),
    ("Face My Fears", "Music", 3.99, 19),
    -- ("Everythangs Corrupt [Explicit]", "Music", 9.49, 42), 
    ("The Platinum Collection", "Music", 18.99, 31),
    ("Head Above Water", "Music", 10.49, 44),
    ("Grease", "Movie", 17.21, 50),
    ("Gladiator", "Movie", 19.50, 17),
    -- ("Daddy's Home 2", "Movie", 9.99, 7), 
    -- ("The Man Who Invented Christmas2017", "Movie", 9.99,11), 
    ("Home Alone", "Movie", 7.99, 38),
    ("Gotti", "Movie", 7.99, 27),
    -- ("Jim Gaffigan: Noble Ape", "Movie", 9.99, 4), 
    ("Holiday Nut and Dried Fruit Gift Basket", "Food", 28.95, 100),
    ("Hickory Farms Hearty Selection", "Food", 50.00, 60),
    -- ("Biscotti Cookie Gift Basket, Gourmet Gift Basket", "Food", 31.99, 40), --
    -- ("Wilton Icing Colors, Gel-Based Food Color", "Food", 8.47, 100), --
    -- ("TRUFF Hot Sauce, Gourmet Hot Sauce with Ripe", "Food", 17.98, 80), --
    -- ("SNICKERS Christmas Slice n' Share Giant", "Food", 10.00, 200), 
    -- ("Green Mountain Coffee Keurig Coffee Lover's Variety Pack Single-Serve K-Cup Sampler, 40 Count", "Food", 24.99, 500), --
    ("12V Police Motorcycle", "Toys", 213.97, 20),
    -- ("Laser Pegs Mission Control Light-Up Building Block Playset", "Toys", 29.39, 35),
    ("Save on Anki Cozmo", "Toys", 139.99, 9),
    ("Save on Peppa Pig favorites", "Toys", 22.99, 16)
  ,
  -- ("Green Toys Ferry Boat with Mini Cars Bathtub Toy, Blue/White", "Toys", 13.97, 42),
  -- ("Fisher-Price Imaginext DC Super Friends, Batmobile", "Toys", 11.73, 82), --
  -- ("Fisher-Price Thomas & Friends TrackMaster, Fiery Rescue Set", "Toys", 33.01, 75); --



  SELECT *
  FROM products
  WHERE stock_quantity >0;

ALTER TABLE products ADD product_sales FLOAT(12,2);


CREATE TABLE sales (
  order_id INT NOT NULL AUTO_INCREMENT,
  order_date DATETIME,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price FLOAT(10,2),
  stock_quantity INTEGER, 
  total_price FLOAT(12,2), 
  PRIMARY KEY (order_id)
);
