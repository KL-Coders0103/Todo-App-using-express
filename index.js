const express = require("express");
const methodOverride = require("method-override");
const app = express();

app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

let todos = [];

app.get("/", (req, res) => {
  const error = req.query.error;
  res.render("index", { todos, selectedPriority: "all", error });
});

app.post("/add", (req, res) => {
  const { title, priority } = req.body;
  if(!title.trim()){
    return res.redirect("/?error=Title cannot be empty");
  }
  todos.push({ id: Date.now(), title, priority });
  res.redirect("/");
});

app.put("/edit/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { title, priority } = req.body;
    console.log("Before update:", todos);
    console.log("Editing id:", id, "New title:", title, "New priority:", priority);

    if(!title.trim()){
        return res.redirect("/?error=Title cannot be empty");
    } 

    todos = todos.map(todo => {
       return todo.id === id ? { ...todo, title, priority } : todo;
    });
    console.log("After update:", todos);
    res.redirect("/");
});

app.delete("/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  todos = todos.filter(todo => todo.id !== id);
  res.redirect("/");
});

app.post("/filter", (req, res) => {
  const priority = req.body.priority;
  if (priority === "all") {
    res.render("index", { todos, selectedPriority: "all" , error: null });
  } else {
    const filteredTodos = todos.filter(todo => todo.priority === priority);
    res.render("index", { todos: filteredTodos, selectedPriority: priority, error: null });
  }
});

app.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});
