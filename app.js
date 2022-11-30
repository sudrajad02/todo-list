const createError = require('http-errors');
const express = require("express");
const path = require('path');
const fs = require('fs');
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

global.__basedir = __dirname;
global.__class_dir = __basedir + '/class';
global.__controller_dir = __basedir + '/controller';
global.__routes_dir = __basedir + '/routes';

function getRoutersSync(__path, __extension) {
	const files = {};

	//using sync, because it's only run when server is starting up and I dont want to get unnecessary headache
	fs.readdirSync(__path)
		.forEach(file => {
			const stats = fs.statSync(__path + '/' + file);

			if (stats.isFile() && path.extname(file) === __extension) {
				files[path.basename(file, path.extname(file))] = path.resolve(__path, file);
			} else if (stats.isDirectory()) {
				//if file is a directory, recursively get all files inside it and add them into object
				const tmp = getRoutersSync(path.resolve(__path, file), __extension);
				for (let key in tmp) {
					files[path.basename(file, path.extname(file)) + '/' + key] = tmp[key];
				}
			}
		});

	return files;
};

app.use(cors());
app.use(express.json());

//https://stackoverflow.com/questions/7067966/how-to-allow-cors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

function getAllRouters(__path) {
	return {
		'/': getRoutersSync(__path, '.js'),
	};
};

// ROUTERS SETTING
const routers = getAllRouters(__routes_dir);
for (const mainRoute in routers) {
	for(const subRoute in routers[mainRoute]){
		app.use(`${mainRoute === '/' ? '' : mainRoute}/${subRoute}`, require(routers[mainRoute][subRoute]));
	}
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	//if it's api request, return json instead
	if(req.headers['content-type'] == 'application/json' || (req.headers['authorization'] && req.headers['authorization'].toLowerCase().includes('bearer '))){
		res.status(404).send({
			status: false,
			error: "Sorry can't find this route!"
		});

		if(process.env.DEBUG){
			next(createError(404));
		}

		return;
	} else {
        res.status(404).send({
			status: false,
			error: "Must json!"
		});

		next(createError(404));
	}
});

app.listen(process.env.APP_PORT, () => {
    console.log(new Date() + ` : Listening on ${process.env.APP_PORT}`);
})