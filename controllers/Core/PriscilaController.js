let Models = require('../../models/index');
let SMS = require('../Utils/SMSController').SMS;
let Payment = require('../API/PaymentController').Payment;

let Priscila = function () {
    this.processMessage = processMessage;
};

let processMessage = function (req, res) {
    let data = req.body;

    if(!data.user_id){
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
        let sms_data = {
            phone: user.get("phone")
        };
        Payment.creaCadenaPago({
            reference: "Cafeteria MIT",
            amount: 45
        }).then(function (response) {
            sms_data.message = response.nb_url;
            SMS.send(sms_data);
            return res.json({
                success: true,
                url: response.nb_url
            })
        });
    });
};

exports.Priscila = new Priscila();