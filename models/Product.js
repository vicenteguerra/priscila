"use strict";
module.exports = function(sequelize, DataTypes) {
    const Product = sequelize.define("Product", {
        product_id : { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: DataTypes.STRING,
        price: DataTypes.INTEGER,
        stock: DataTypes.INTEGER
    });

    Product.associate = function(models) {

    };

    return Product;
};
