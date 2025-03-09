const path = require("path");
const express = require('express');
const uuid = require('uuid');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

const todos = [];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get('/api/home', (req, res) => {
    res.json({ msg: "Todo List Home Page" });
});

app.get('/api/todos', (req, res) => {
    res.json(todos);
});

app.get('/api/todos/:id', (req, res) => {
    let todo = todos.filter((todo) => todo.id == req.params.id);
    res.json({ msg: `Todo ${req.params.id}`, data: todo });
});

app.post('/api/todos', (req, res) => {
    todos.push({ id: uuid.v4(), ...req.body });
    res.json({ msg: "Add Todo", data: todos });
});

app.put('/api/todos/:id', (req, res) => {
    let todo = todos.find((todo) => todo.id == req.params.id);
    if (todo) {
        todo.name = req.body.name;
        todo.completed = req.body.completed;
        res.json({ msg: "Edit/Update Todo", data: todos });
    } else {
        res.status(404).json({ msg: "Todo not found" });
    }
});

app.delete("/api/todos/:id", (req, res) => {
    let index = todos.findIndex((todo) => todo.id == req.params.id);
    if (index !== -1) {
        todos.splice(index, 1);
        res.json(todos);
    } else {
        res.status(404).json({ msg: "Todo not found" });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`);
});