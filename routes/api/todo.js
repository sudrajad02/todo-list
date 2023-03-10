const express =  require("express");
const helper = require(__class_dir + "/helper");
const todo =  require(`${__controller_dir}/todoController.js`);
const session =  require(`${__controller_dir}/sessionsController.js`);

const router = express.Router()

router.get("/", session.sessionChecker, async function(req, res, next) {
    const todos = await todo.getTodo()

    helper.sendResponse(res, todos)
})

router.get("/:id", session.sessionChecker, async function(req, res, next) {
    const todos = await todo.getTodoById(req.params.id)

    helper.sendResponse(res, todos)
})

router.post("/", session.sessionChecker, async function(req, res, next) {
    const todos = await todo.createTodo(req.body)

    helper.sendResponse(res, todos)
})

router.put("/:id", session.sessionChecker, async function(req, res, next) {
    const todos = await todo.updateTodo({ ...req.body, id: req.params.id })

    helper.sendResponse(res, todos)
})

router.delete("/:id", session.sessionChecker, async function(req, res, next) {
    const todos = await todo.deleteTodo(req.params.id)

    helper.sendResponse(res, todos)
})

module.exports = router;