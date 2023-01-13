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

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema],
});

const List = mongoose.model("List", listSchema);

// Inserting the items as default.

// Global variables.
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

// Setting Route Parameters for multiple Todo lists.
app.get("/:customListName", (req, res) => {
  const customListName = req.params.customListName;

  List.findOne({ name: customListName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        // Create new list
        const list = new List({
          name: customListName,
          items: defaultItems,
        });

        list.save();
        res.redirect("/" + customListName);
      } else {
        // Show existing list

        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items,
        });
      }
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

// Setting post route for delete

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId, (err, result) => {
    if (err) {
      console.log("something went wrong!");
    } else {
      console.log("Item deleted!");
    }
  });
  res.redirect("/");
});

// Startup the server
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
