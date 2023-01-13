const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Setting the app.
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Setting the database.
mongoose.set("strictQuery", true);
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

const itemsSchema = new mongoose.Schema({
  name: String,
});

const Item = mongoose.model("Item", itemsSchema);

const todo1 = new Item({
  name: "Buy Food",
});

const todo2 = new Item({
  name: "Eat food ",
});

const todo3 = new Item({
  name: "Drink food",
});

const defaultItems = [todo1, todo2, todo3];

// Inserting the items as default.

// Global variables.
const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

// Setting get route for home
app.get("/", function (req, res) {
  // Find all the items in db
  Item.find({}, (err, foundItems) => {
    // checks if database has items, if it does do nothing.
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("inserted Many Items");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  });
});

// setting post route for home
app.post("/", function (req, res) {
  const item = req.body.newItem;
  // Allows to add new item! to database.
  const newItem = new Item({
    name: item,
  });

  newItem.save();

  res.redirect("/");
});

// Setting work route
app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

// Setting about route
app.get("/about", function (req, res) {
  res.render("about");
});

// Startup the server
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
