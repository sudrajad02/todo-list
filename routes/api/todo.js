const express =  require("express");
const helper = require("../../class/helper");
const todo =  require(`${__controller_dir}/todoController.js`);

const router = express.Router()

router.get("/", async function(req, res, next) {
    const products = await todo.getTodo()

    helper.sendResponse(res, products)
})

router.get("/:id", async function(req, res, next) {
    const product = await todo.getTodoById(req.params.id)

    helper.sendResponse(res, product)
})

router.post("/", async function(req, res, next) {
    const products = await todo.createTodo(req.body)

    helper.sendResponse(res, products)
})

router.put("/:id", async function(req, res, next) {
    const products = await todo.updateTodo({ ...req.body, id: req.params.id })

    helper.sendResponse(res, products)
})

router.delete("/:id", async function(req, res, next) {
    const products = await todo.deleteTodo(req.params.id)

    helper.sendResponse(res, products)
})

module.exports = router;