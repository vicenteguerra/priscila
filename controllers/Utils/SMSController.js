let AWS = require('aws-sdk');

let SMS = function(){
    this.send = send;
};

let send = function (data) {
    return new Promise(function (resolve, reject) {
        var base = process.env.PWD;
        AWS.config.loadFromPath(base + '/config/aws.config.json');

        var sns = new AWS.SNS();

        if(data.message == null) data.message = '';
        if(data.type == null) data.type = 'string';
        if(data.subject == null) data.subject = '';

        var params = {
            Message: data.message,
            MessageStructure: data.type,
            PhoneNumber: data.phone.length == 10 ? "521" + data.phone : data.phone,
            Subject: data.subject ? data.subject: "Botlers Enterprise"
        };

        sns.publish(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
        });

    });
};

exports.SMS = new SMS();
