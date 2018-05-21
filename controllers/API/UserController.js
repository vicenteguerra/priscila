let Models  = require('../../models/index');

let User = function(){
    this.index = index;
    this.show = show;
    this.create = create;
    this.destroy = destroy;
    this.update = update;
};

let index = function (req, res) {
    Models.User.findAll({
        where: { user_id: req.param("id")}
    }).then(function (users) {
        res.json({
            success: true,
            resource: users
        });
    });
};

let show = function (req, res) {
    Models.User.findOne({
        where: { user_id: req.params.id}
    }).then(function (user) {
        res.json({
            success: true,
            resource: user
        });
    });
};

let create = function (req, res) {
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email = req.body.email;
    var token = req.body.token;
    var voice_hash = req.body.voice_hash;

    if(!first_name || !email){
        return res.json({
            success: false,
            error: "Datos incompletos"
        });
    }

    Models.User.create({
        first_name: first_name,
        last_name: last_name,
        token: token,
        voice_hash: voice_hash,
        email: email
    }).then(function (user) {
        return res.json({
            success: true,
            resource: user
        });
    });
};

let update = function (req, res) {
    var json = req.body;

    if(isNaN(req.params.id)){
        res.json({
            success: false,
            result: "User not found"
        });
    }

    let user_id = req.params.id;
    let email = json.email;
    let token = token;
    let voice_hash = voice_hash;

    Models.User.findOne({
        where: {
            user_id: user_id
        }
    }).then(function (user) {
        user.update({
            email: email,
            token: token,
            voice_hash: voice_hash
        }).then(function (user_updated) {
            return res.json({
                success: true,
                resource: user_updated
            });
        });
    });
};

let destroy = function (req, res) {
    Models.User.destroy({
        where: { user_id: req.param("id")}
    }).then(function (user) {
        res.json(user);
    });
};


exports.User = new User();