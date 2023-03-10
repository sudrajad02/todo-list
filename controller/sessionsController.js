const { PrismaClient } = require("@prisma/client");
const helper = require(__class_dir + "/helper");
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

const getUserExistence = async function (userName) {
    try {
        const usr = await prisma.auth_user.findFirst({
            where: {
                user_name: userName
            }
        })
    
        return usr ? true : false
    } catch (error) {
        return false
    }
    
};

const tokenValidation = async function (token) {
	const validity = await jwt.validation(token);

	if (!validity.status) {
		return validity;
	}

	validity.status &= await getUserExistence(validity.data.u);
	return validity;
};

class _sessions {
    async sessionChecker(req, res, next) {
		try {
            if (req.headers && req.headers.authorization) {
                const authorization = req.headers.authorization.split(' ');

                if (authorization[0].toLowerCase() == 'bearer' && authorization[1]) {
                    const isValid = await tokenValidation(authorization[1]);

                    if (isValid.status) {
                        req.decoded = isValid.data;
                        next();
                        return true;
                    } else {
                        throw isValid;
                    }
                } else {
                    throw 'Invalid authorization';
                }   
            } else {
                throw {
                    code: 404,
                    status: false,
                    error: 'Token not defined'
                };
            }
		} catch (error) {
            if (typeof(error) == "object") {
                return helper.sendResponse(res, error)
            }

            helper.sendResponse(res, {
                code: 400,
                status: false,
                error: error
            })
		}
	}

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
				throw {
                    code: 404,
                    status: false,
                    error: "User not found"
                };
			}

			const expiresAt = dayjs().add(expired, 'seconds').format('YYYY-MM-DD HH:mm:ss');
			const payload = {
					u: userExist.user_name,
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
            if (typeof(error) == "object") {
                return error
            }

			return {
                code: 400,
                status: false,
                error: error
            }
		}
	}
}

module.exports = new _sessions();