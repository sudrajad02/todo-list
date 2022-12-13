const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class _todo {
    async deleteTodo(id) {
        try {
            const todo = await prisma.todo.delete({
                where: {
                    todo_id: Number(id)
                }
            })
    
            return {
                code: 200,
                status: true,
                data: todo
            }
        } catch (error) {
            return {
                code: 400,
                status: false,
                error: error.message
            }
        }
    } 

    async updateTodo(data) {
        try {
            const todo = await prisma.todo.update({
                where: {
                    todo_id: Number(data.id)
                },
                data: {
                    todo_name: data.name
                }
            })
    
            return {
                code: 200,
                status: true,
                data: todo
            }
        } catch (error) {
            return {
                code: 400,
                status: false,
                error: error.message
            }
        }
    } 

    async createTodo(data) {
        try {
            const todo = await prisma.todo.create({
                data: {
                    todo_name: data.name
                }
            })
    
            return {
                code: 201,
                status: true,
                data: todo
            }
        } catch (error) {
            return {
                code: 400,
                status: false,
                error: error.message
            }
        }
    } 

    async getTodoById(id) {
        try {
            const list_todo = await prisma.todo.findUnique({
                where: {
                    todo_id: Number(id)
                }
            })

            if (list_todo == null) {
                return {
                    code: 404,
                    status: false,
                    error: "Data tidak ditemukan!"
                }
            }

            return {
                code: 200,
                status: true,
                data: list_todo
            }
        } catch (error) {
            return {
                code: 404,
                status: false,
                error: "Data tidak ditemukan!"
            }
        }
    } 

    async getTodo() {
        try {
            const list_todo = await prisma.todo.findMany()

            return {
                code: 200,
                status: true,
                data: list_todo
            }
        } catch (error) {
            return {
                code: 401,
                status: false,
                error
            }
        }
    } 
}

module.exports = new _todo();