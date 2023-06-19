const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// read the data from the json file
function readData() {
  const data = fs.readFileSync("data.json", "utf-8");
  return JSON.parse(data);
}

// write the data to the json file
function writeData(data) {
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2), "utf-8");
}

// render the form templates
app.get("/", (req, res) => {
  const data = readData();
  res.render("form", { users: data.users });
});

// create a new user
app.post("/create", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;

  const data = readData();
  const newUser = { id: Date.now(), name, email };
  data.users.push(newUser);
  writeData(data);
  res.redirect("/");
});

// update a user (render a edit form)
app.get('/edit/:id', (req, res) => {
    const id = req.params.id;
    const data = readData();
    const user = data.users.find(user => user.id === parseInt(id));
    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    res.render('edit', { user });
  });

// update a user (handle form submission)
app.post('/update/:id', (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const email = req.body.email;
  
    const data = readData();
    const user = data.users.find(user => user.id === parseInt(id));
    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    user.name = name;
    user.email = email;
    writeData(data);
  
    res.redirect('/');
  });
  


// delete a user
app.get('/delete/:id', (req, res) => 
{
    const id = req.params.id;
    const data = readData();
    const index = data.users.findIndex(user =>user.id === parseInt(id));
    if(index == -1)
    {
        res.status(400).send("user not found");
        return;
    }
    data.users.splice(index, 1);
    writeData(data);
    res.redirect('/');

})

app.set("view engine", "ejs");

const port = 3000;
app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
