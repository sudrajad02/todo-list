const express =  require("express");
const helper = require("../../class/helper");
const todo =  require(`${__controller_dir}/todoController.js`);

const router = express.Router()

router.get("/", async function(req, res, next) {
    const todos = await todo.getTodo()

    helper.sendResponse(res, todos)
})

router.get("/:id", async function(req, res, next) {
    const todo = await todo.getTodoById(req.params.id)

    helper.sendResponse(res, todo)
})

router.post("/", async function(req, res, next) {
    const todos = await todo.createTodo(req.body)

    helper.sendResponse(res, todos)
})

router.put("/:id", async function(req, res, next) {
    const todos = await todo.updateTodo({ ...req.body, id: req.params.id })

    helper.sendResponse(res, todos)
})

router.delete("/:id", async function(req, res, next) {
    const todos = await todo.deleteTodo(req.params.id)

    helper.sendResponse(res, todos)
})

module.exports = router;