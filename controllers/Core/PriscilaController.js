let Models = require('../../models/index');
let SMS = require('../Utils/SMSController').SMS;
let Payment = require('../API/PaymentController').Payment;
const Op = Models.Sequelize.Op;

let Priscila = function () {
    this.processMessage = processMessage;
};

let processMessage = function (req, res) {
    let data = req.body;

    if(!data.user_id || !data.products){
        return res.json({
            success: false,
            response:  "User not found"
        });
    }

    Models.User.findOne({
        where: {
            user_id: data.user_id
        }
    }).then(function (user) {
        if(!user){
            return res.json({
                success: false,
                response:  "User not found"
            });
        }

        let array_names = data.products.map(function (product) {
            return {name: product.name};
        });


        Models.Product.findAll({
            where: {
                [Op.or] : array_names
            }
        }).then(function (products) {
            console.log(JSON.stringify(products));
            var total = 0;
            products.forEach(function (product_db) {
                var product = data.products.find(function (product) {
                    if(product.name == product_db.get("name")){
                        return product;
                    }
                })
                if(product){
                    total += parseInt(product.quantity) * product_db.get("price");
                }
            });
            let sms_data = {
                phone: user.get("phone")
            };
            if(total <= 0){
                return res.json({
                    success: false,
                    response:  "Amount not valid"
                });
            }
            Payment.creaCadenaPago({
                reference: "Cafeteria MIT",
                amount: total
            }).then(function (response) {
                sms_data.message = response.nb_url;
                SMS.send(sms_data);
                return res.json({
                    success: true,
                    url: response.nb_url
                })
            });
        });
    });
};

exports.Priscila = new Priscila();