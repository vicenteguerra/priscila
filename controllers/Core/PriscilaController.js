let Models = require('../../models/index');

let Priscila = function () {
    this.processMessage = processMessage;
};

let processMessage = function (req, res) {
    let data = req.body;
    return res.json({
        success: true
    })
};

exports.Priscila = new Priscila();