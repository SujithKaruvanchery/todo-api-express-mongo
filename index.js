const express = require('express')
const mongoose = require('mongoose');
const app = express()
const port = 6000

async function main() {
    await mongoose.connect('mongodb+srv://sujithkaruvanchery:9UKtOulz4xhH2bTK@cluster-todo-app.6gmyq.mongodb.net/?retryWrites=true&w=majority&appName=cluster-todo-app');
}
main()
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection failed", err));

const todoSchema = new mongoose.Schema({
    task: { type: String, required: true },
    status: { type: String, default: 'pending' },
    user: { type: String, required: true }
});

const Todo = mongoose.model('Todo', todoSchema);

app.use(express.json());

app.get('/', async (req, res) => {
    try {
        const todos = await Todo.find({});
        res.json(todos);
    } catch (err) {
        res.status(500).send("Error fetching todos");
    }
});

app.post('/', async (req, res) => {
    try {
        const todo = new Todo(req.body);
        await todo.save();
        res.send('Todo added successfully!');
    } catch (err) {
        res.status(500).send('Failed to add todo');
    }
});

app.put('/:id', async (req, res) => {
    const id = req.params.id;
    const updatedTodo = req.body;
    try {
        await Todo.findByIdAndUpdate(id, updatedTodo);
        res.send('Todo updated successfully!');
    } catch (err) {
        res.status(500).send('Failed to update todo');
    }
});

app.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await Todo.findByIdAndDelete(id);
        res.send('Todo deleted successfully!');
    } catch (err) {
        res.status(500).send('Failed to delete todo');
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})