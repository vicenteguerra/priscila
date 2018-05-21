"use strict";
require('dotenv').config();
var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var env       = process.env.NODE_ENV || "development";
var config    = require(path.join(__dirname, '..', 'config', 'config.json'))[env];

config.password = process.env.database_password ? process.env.database_password : config.password;
config.username = process.env.database_username ? process.env.database_username : config.username;
config.database = process.env.database_dbname ? process.env.database_dbname : config.database;


if (process.env.DATABASE_URL) {
    var sequelize = new Sequelize(process.env.DATABASE_URL,config);
} else {
    var sequelize = new Sequelize(config.database, config.username, config.password, config);
}
var db        = {};


fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;


module.exports = db;