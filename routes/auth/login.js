const express =  require("express");
const helper = require(__class_dir + "/helper");
const session =  require(`${__controller_dir}/sessionsController.js`);

const router = express.Router()

router.post("/", async function(req, res, next) {
    const login = await session.loginValidation(req.body)

    helper.sendResponse(res, login)
})

module.exports = router;
