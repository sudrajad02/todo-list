class helper {
    sendResponse(res, body, code) {
		/*
		 *	body : {
		 *		status	: true/false,
         *      code    : ....,
		 *		error	: ....,
		 *		data	: ....,
		 *	};
		 */
		try {
			res.status(body.code);
			res.setHeader('Content-Type', 'application/json')
			res.send(body);

			return true;
		} catch (error) {
			console.error('helper sendResponse Error :', error);

			res.status(code);
			res.setHeader('Content-Type', 'application/json')
			res.send({
				status: false,
				error: String(error),
			});

			return false;
		}
	}
}

module.exports = new helper();