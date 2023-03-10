const { PrismaClient } = require("@prisma/client");
const hash = require(__class_dir + '/hash.js');

const dayjs = require('dayjs')
const jsonwebtoken = require('jsonwebtoken');

const prisma = new PrismaClient();

const jwt = {
    validation(token = null) {
        if (!token) {
            return {
                status: false,
                error: 'Token is empty'
            };
        }

        return new Promise((resolve, reject) => {
                jsonwebtoken.verify(token, process.env.PRIVATE_KEY, (error, decoded) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve(decoded);
                    return;
                });
            })
            .then(data => {
                return {
                    status: true,
                    data,
                };
            })
            .catch(error => {
                return {
                    status: false,
                    error,
                };
            });
    },

    sign(payload, options = { algorithm: 'HS256', expiresIn: '30m' }) {
        return new Promise((resolve, reject) => {
            jsonwebtoken.sign(payload, process.env.PRIVATE_KEY, options, (err, token) => {
                if (err) {
                    reject(false);
                    return;
                }

                resolve(token);
                return;
            });
        });
    },
};

class _sessions {
    async loginValidation(data) {
		const username = data.username
		const password = data.password

		const expired = process.env.TOKEN_EXPIRED;

		const userExist = await prisma.auth_user.findFirst({
            where: {
                AND: {
                    user_name: username,
                    password: hash.sha256(password)
                }
            }
        })

		try {
			if (!userExist) {
				throw false;
			}

			const expiresAt = dayjs().add(expired, 'seconds').format('YYYY-MM-DD HH:mm:ss');
			const payload = {
					u: userExist.user,
					// l: userExist.level,
					t: expiresAt,
					v: hash.randomString(18, 'base64'),
				};
			const token = await jwt.sign(payload, {expiresIn:String(expired)});

			return {
                code: 200,
                status: true,
                data: {token, expiresAt},
            }
		} catch (error) {
			return {
                code: 400,
                status: false,
                error: error.message
            }
		}
	}
}

module.exports = new _sessions();