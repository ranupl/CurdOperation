const express = require("express");
const crypto = require("crypto");
const app = express();
const path = require("path");
const ejs = require("ejs");
const bodyparser = require("body-parser");
const fs = require("fs");

const PORT = 8080;

app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));
app.use("/css", express.static(path.resolve(__dirname, "public/css")));

app.get("/", (req, res) => {
  const data = fs.readFileSync("./db.json", "utf-8");
  const jsonParse = JSON.parse(data);
  res.render("index", { tasks: jsonParse.tasks });
});

app.get("/addItem", (req, res) => {
  res.render("addItem");
});

app.post("/submit", (req, res) => {
  let task = {
    title: req.body.title,
    desc: req.body.desc,
    status: req.body.status,
    priority: req.body.priority,
    cDate: req.body.cDate,
    dDate: req.body.dDate,
  };
  const id = crypto.randomBytes(16).toString("hex");

  // read the file
  fs.readFile("./db.json", "utf8", (err, data) => {
    if (err) {
      console.log(`Error reading file from disk: ${err}`);
    } else {
      // parse JSON string to JSON object
      const databases = JSON.parse(data);
      // add a new record
      task.id = id;
      databases.tasks.push(task);

      // write new data back to the file
      fs.writeFile("./db.json", JSON.stringify(databases, null, 4), (err) => {
        if (err) {
          console.log(`Error writing file: ${err}`);
        }
        // console.log(data);
        res.send("file written successfully");
        req.redirect("index.ejs");
      });
    }
  });
});

// update a user (render a edit form)
app.get("/editItem/:id", (req, res) => {
  const id = req.params.id;
  // const data = readData();
  const data = fs.readFileSync("db.json", 'utf-8');
  const newData = JSON.parse(data);
  const item = newData.tasks.find((item) => item.id === id);
  if (!item) {
    res.status(404).send("User not found");
    return;
  }
  res.render("editItem", { item });
});

// update a user (handle form submission)
app.post("/update/:id", (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  const desc = req.body.desc;
  const status = req.body.status;
  const priority = req.body.priority;
  const cDate = req.body.cDate;
  const dDate = req.body.dDate;

  // const data = readData();
  const data = fs.readFileSync("db.json", "utf-8");
  const newData = JSON.parse(data);
  const user = newData.tasks.find((user) => user.id === id);
  if (!user) {
    res.status(404).send("User not found");
    return;
  }
  user.title = title;
  user.desc = desc;
  user.status = status;
  user.priority = priority;
  user.cDate = cDate;
  user.dDate = dDate;

  // writeData(data);
  fs.writeFile("db.json", JSON.stringify(newData, null, 2), (err) => {
    if (err) {
      console.log(err);
    }
  });

  res.redirect("/");
});

// delete a user
app.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  // const data = readData();
  const data = fs.readFileSync("db.json", "utf-8");
  const newData = JSON.parse(data);
  const index = newData.tasks.findIndex((user) => user.id === id);
  if (index == -1) {
    res.status(400).send("user not found");
    return;
  }
  newData.tasks.splice(index, 1);
  // writeData(data);
  fs.writeFile("db.json", JSON.stringify(newData, null, 2), (err) => {
    if (err) {
      console.log(err);
    }
    // res.send("task deleted");
  });
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`server is running at ${PORT}`);
});
