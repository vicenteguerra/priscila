"use strict";

module.exports = function(sequelize, DataTypes) {
    const User = sequelize.define("User", {
        user_id : { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        email: DataTypes.STRING,
        token: DataTypes.TEXT,
        voice_hash: DataTypes.TEXT,
        phone: DataTypes.STRING
    });

    User.associate = function(models) {

    };

    return User;
};
