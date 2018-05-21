var Models  = require('../../models/index');
var Promise = require("bluebird");
var builder = require('xmlbuilder');
var crypto = require('crypto');
var request = require('request');
var cheerio = require('cheerio');

let mode = "aes-128-cbc";
let webPayURL = "http://webpayplus-env.us-east-2.elasticbeanstalk.com/gen";

var Payment = function(){
    this.creaCadenaPago = creaCadenaPago;
};

let AESEncryption = function(){
  this.encrypt = encrypt;
  this.decrypt = decrypt;
};

let creaCadenaPago = function(req, res){
    console.log("CREANDO CADENA PAGO");
    credentials = {
        key: "5DCC67393750523CD165F17E1EFADD21",
        data0: "SNDBX123"
    };

    var toParse = {
        P:{
            business:{
                id_company: "SNBX",
                id_branch: "01SNBXBRNCH",
                user: "SNBXUSR01",
                pwd: "SECRETO"
            },
            url:{
                reference: req.params.reference,
                amount: req.params.amount,
                moneda: "MXN",
                canal: "W",
                omitir_notif_default: 1,
                st_correo: 1
            }
        }
    };

    return new Promise(function (resolve, reject){
        //PARSEAR JSON A XML
        var parsedXML = builder.create(toParse, { encoding: 'utf-8', standalone:'yes' });
        parsedXML = parsedXML.end({ pretty: true });
        console.log("PARSED XML");
        console.log(parsedXML);

        //ENCRYPTAR XML
        var encryptedXML = encrypt(credentials.key, parsedXML);

        //CREAR OBJETO XML PARA ENVIAR
        var toSend = {
          pgs:{
            data0: credentials.data0,
            data: encryptedXML
          }
        };

        //PARSEAR JSON DEL OBJETO A ENVIAR A XML
        toSend = builder.create(toSend, { encoding: 'utf-8' });
        toSend = toSend.end({ pretty: true });
        console.log("TO SEND XML");
        console.log(toSend);

        //ENVIAR OBJETO CON METODO POST
        var options = {
          method: 'POST',
          url: webPayURL,
          headers:{
            'cache-control': 'no-cache',
            'content-type': 'application/x-www-form-urlencoded'
          },
          form: {xml: toSend}
        };
        request(options, function (error, response, encryptedResponse) {
          //MANEJO DE ERRORES EN REQUEST
          if (error || encryptedResponse.startsWith("No se encuentra")) {
              console.log("Error al recibir la respuesta");
              console.log(error);
              console.log(response);
              return resolve(false);
          }else{
            //DECRYPTAR RESPUESTA XML
            var decryptedXMLResponse = decrypt(credentials.key, encryptedResponse);

            //CONVERTIR A JSON
            var $ = cheerio.load(decryptedXMLResponse);
            var P_RESPONSE = {
                cd_response: $('cd_response').text(),
                nb_response: $('nb_response').text(),
                nb_url: $('nb_url').text()
            };

            //REGRESAR VALOR
            console.log("P_RESPONSE")
            console.log(P_RESPONSE);
            return resolve(P_RESPONSE);
          }
        });
    });
};

let encrypt = function(key, data) {
    //var key = new Buffer(_key, 'base64').toString();
    var key = (key instanceof Buffer) ? key : new Buffer(key, 'hex');
    var iv = crypto.randomBytes(16);
    var cipher = crypto.createCipheriv( mode, key, iv);
    var result = Buffer.concat([iv, cipher.update(data), cipher.final()]);
    return new Buffer( result ).toString('base64');
};


let decrypt = function(key, b64_data) {
    //var key = new Buffer(_key, 'base64').toString();
    var key = (key instanceof Buffer) ? key : new Buffer(key, 'hex') ;
    var raw_data = new Buffer(b64_data, 'base64');
    var iv = raw_data.slice(0,16);
    var data = raw_data.slice(16);
    var decipher = crypto.createDecipheriv( mode, key, iv);
    var buf1 = decipher.update(data);
    var buf2 = decipher.final();
    return Buffer.concat([buf1, buf2]).toString('utf8');
};


exports.Payment = new Payment();
exports.AESEncryption = new AESEncryption();
