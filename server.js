const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('dotenv').load()
const port = process.env.PORT || 3000
const crypto = require('crypto');
const passtoken = process.env.TOKEN_SECRET || "T%oi#!Ty2@2@"; //must be 32 char length
const encryptionMethod = 'AES-256-CBC';
//
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
//
//
var https = require('https'), http = require('http');
require('./api/hostphp') //importing route
//
chkHealth_PHPHOST=function (param) {
    //console.log("done! ", param);
    if (param["p"] == 0) return;
    //
    try {
        var jsonObject = JSON.stringify({
            'HANDSHARKE_KEY': process.env.HANDSHARKE_KEY||'abc1',
            'Value2': 'abc2',
            'Value3': '3'
        });

        var options = {
            hostname: param["hosturl"],
            port: param["p"],
            path: '/localsrc/reporthosthealth.php?XDEBUG_SESSION_START=154A5348',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(jsonObject, 'utf8')
            }
        };
        var req = (param["pc"] == 's' ? https : http).request(options, (res) => {
            //console.log('STATUS:', res.statusCode);
            //console.log('HEADERS:', JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                //global.hostINFO['192.168.1.91'] = { 'health': chunk };
                try {
                    var reinfo = JSON.parse(chunk);
                    if (hostINFO.hasOwnProperty(reinfo['myreply'])) {
                        hostINFO[reinfo['myreply']]['_h'] = reinfo['health'];
                    }
                    setTimeout(function () { testsend(chunk); }, 1);
                //console.log('BODY:', chunk);
                } catch (err) {
                    console.log("chunk ERROR: " + err.message);
                }
            });
            res.on('end', () => {
                console.log('No more data in response.');
            });
        });
        //
        req.on('error', (e) => {
            console.log(`problem with request: ${e.message}`);
        });
        //
        // write data to request body
        req.write(jsonObject);
        req.end();
        //
    } catch (err) {
        console.log("HEROKU INVOKE ERROR: " + err.message);
    }
}
//
//START PREVENT HEROKU SLEEP ....................
//
app.route('/keepalive').get(function (req, res) {
    var d = new Date();
    var options = {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "numeric"
    };
    res.send(d.toLocaleString("vi-vn"));
});
function redirect_post(orginParams) {
    try {
        var jsonObject = JSON.stringify(orginParams);

        //var options =  {
        //    hostname: 'hrpro.cf',
        //    port: 443,
        //    path: '/localsrc/ping.php',
        //    method: 'POST',
        //    headers: {
        //        'Content-Type': 'application/json',
        //        'Content-Length': Buffer.byteLength(jsonObject, 'utf8')
        //    }
        //};
        var options = {
            hostname: '192.168.1.91',
            port: 10996,
            path: '/localsrc/loadtime.php?XDEBUG_SESSION_START=154A5348',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(jsonObject, 'utf8')
            }
        };

        var req = http.request(options, (res) => {
            console.log('STATUS:', res.statusCode);
            console.log('HEADERS:', JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                console.log('BODY:', chunk);
            });
            res.on('end', () => {
                console.log('No more data in response.');
            });
        });

        req.on('error', (e) => {
            console.log(`problem with request: ${e.message}`);
        });

        // write data to request body
        req.write(jsonObject);
        req.end();
    } catch (err) {
        console.log("HEROKU INVOKE ERROR: " + err.message);
    }
}

function startKeepAlive() {
    setInterval(function () {
        //////////var req = https.get("https://hrpro.cf/localsrc/ping.php", function (res) {//"https://hellohrmapi.herokuapp.com/keepalive"
        //////////    res.on('data', function (chunk) {
        //////////        try {
        //////////            // optional logging... disable after it's working
        //////////            console.log("HEROKU INVOKE OK: " + chunk);
        //////////        } catch (err) {
        //////////            console.log("HEROKU INVOKE ERROR: " + err.message);
        //////////        }
        //////////    });
        //////////}).on('error', function (err) {
        //////////    console.log("keepalive error: " + err.message);
        //////////});

        ////////try {
        ////////    var querystring = require('querystring');
        ////////    var postData = querystring.stringify({
        ////////        'msg': 'Hello World!'
        ////////    });

        ////////    var options = {
        ////////        hostname: 'hrpro.cf',
        ////////        port: 443,
        ////////        path: '/localsrc/ping.php',
        ////////        method: 'POST',
        ////////        headers: {
        ////////            'Content-Type': 'application/x-www-form-urlencoded',
        ////////            'Content-Length': Buffer.byteLength(postData)
        ////////        }
        ////////    };

        ////////    var req = https.request(options, (res) => {
        ////////        console.log('STATUS:', res.statusCode);
        ////////        console.log('HEADERS:', JSON.stringify(res.headers));
        ////////        res.setEncoding('utf8');
        ////////        res.on('data', (chunk) => {
        ////////            console.log('BODY:',chunk);
        ////////        });
        ////////        res.on('end', () => {
        ////////            console.log('No more data in response.');
        ////////        });
        ////////    });

        ////////    req.on('error', (e) => {
        ////////        console.log(`problem with request: ${e.message}`);
        ////////    });

        ////////    // write data to request body
        ////////    req.write(postData);
        ////////    req.end();
        ////////} catch (err) {
        ////////    console.log("HEROKU INVOKE ERROR: " + err.message);
        ////////}



        //try {
        //    var jsonObject = JSON.stringify({
        //        'Value1': 'abc1',
        //        'Value2': 'abc2',
        //        'Value3': '3'
        //    });

        //    var options = {
        //        hostname: 'hrpro.cf',
        //        port: 443,
        //        path: '/localsrc/reporthosthealth.php',
        //        method: 'POST',
        //        headers: {
        //            'Content-Type': 'application/json',
        //            'Content-Length': Buffer.byteLength(jsonObject, 'utf8')
        //        }
        //    };

        //    var req = https.request(options, (res) => {
        //        console.log('STATUS:', res.statusCode);
        //        console.log('HEADERS:', JSON.stringify(res.headers));
        //        res.setEncoding('utf8');
        //        res.on('data', (chunk) => {
        //            console.log('BODY:', chunk);
        //        });
        //        res.on('end', () => {
        //            console.log('No more data in response.');
        //        });
        //    });

        //    req.on('error', (e) => {
        //        console.log(`problem with request: ${e.message}`);
        //    });

        //    // write data to request body
        //    req.write(jsonObject);
        //    req.end();
        //} catch (err) {
        //    console.log("HEROKU INVOKE ERROR: " + err.message);
        //}

        try {
            var jsonObject = JSON.stringify({
                'Value1': 'abc1',
                'Value2': 'abc2',
                'Value3': '3'
            });

            var options = {
                hostname: '192.168.1.91',
                port: 10996,
                path: '/localsrc/reporthosthealth.php?XDEBUG_SESSION_START=154A5348',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(jsonObject, 'utf8')
                }
            };


            var req = http.request(options, (res) => {
                console.log('STATUS:', res.statusCode);
                console.log('HEADERS:', JSON.stringify(res.headers));
                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                    global.hostINFO['192.168.1.91'] = { 'health': chunk };
                    console.log('BODY:', chunk);
                });
                res.on('end', () => {
                    console.log('No more data in response.');
                });
            });

            req.on('error', (e) => {
                console.log(`problem with request: ${e.message}`);
            });

            // write data to request body
            req.write(jsonObject);
            req.end();
        } catch (err) {
            console.log("HEROKU INVOKE ERROR: " + err.message);
        }



    }, 1 * 60 * 1000); // load every 20 minutes
}
//startKeepAlive();
//END PREVENT HEROKU SLEEP ....................
//
//
let routes = require('./api/routes') //importing route
routes(app)


//let IOsocket = require('./api/socketio') //importing route
////app.use(express.static("public"));// Static files
//IOsocket(app, port);
$accDB = {};
class jsCACHE {
    constructor(id) {
        this.cnt = 0;
        this.key = id;
        this.val = {};
        this.hisprocess = [];
    }
    get _hisprocess() {
        return this.hisprocess;
    }
    set _hisprocess(scopework) {
        this.hisprocess.push(scopework);
    }
    set cval(x) {
        this.cnt++;
        this.val = x;
        console.log('cacheset: ' + this.val['handshakeKEY']);
    }
    _expire(cb,x) {
        clearTimeout(this.hwndExpire);
        this.hwndExpire = setTimeout(this._that.bind(this, cb), x);
    }
    _that(cb) {
        cb(this.val);
        console.log('cachexpire: ' + this.val['handshakeKEY']);
        delete $accDB[this.key];
    }
}
app.route('/phphostprocessing').post(function (req, res) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed


    let post_body = req.body;
    let $ciphertext = decodeURIComponent(post_body['token']);
    //let buff = Buffer.from($ciphertext, 'base64');
    //$ciphertext =  buff.toString();
    let $_48 = $ciphertext.substr(80);// substr($ciphertext, 48);
    let $_16_32 = $ciphertext.substr(16, 64);// substr($ciphertext, 16, 32);
    $key256 = crypto.createHash('sha256').update(passtoken).digest("hex").toString();//php true
    let $iv = $ciphertext.substr(0, 16);
    let $Hmac = crypto.createHmac("sha256", $key256).update($_48 + $iv).digest("hex");//php false
    //
    if ($Hmac == $_16_32) {
        //
        $_48 = Buffer.from($_48, 'hex').toString('utf8');
        let decryptor = crypto.createDecipheriv(encryptionMethod, $key256.substr(30, 32), $iv);
        let decryptedMessage= decryptor.update($_48, 'base64', 'utf8') + decryptor.final('utf8');
        //
        let handshakeKEY, init_handshakeKEY = function () {
            if ($accDB.hasOwnProperty(post_body['handshakeKEY'])) {
                handshakeKEY = $accDB[post_body['handshakeKEY']];
            } else {
                handshakeKEY = new jsCACHE(post_body['handshakeKEY']);
                $accDB[post_body['handshakeKEY']] = handshakeKEY;
            };
            handshakeKEY._hisprocess = scopework;
        };
        var scopework = decryptedMessage.split('|')[0];
        console.log(post_body['handshakeKEY'] + ': ' + scopework);
        //
        switch (scopework) {
            case 'init_acc_firstlogin': {
                init_handshakeKEY();
                handshakeKEY.cval = post_body;
                io.emit(post_body['handshakeKEY'], { act: '..', message: JSON.stringify(post_body) });
                break;
            }
            case 'create_new_acc_finish': {
                init_handshakeKEY();
                let timeout = 5000;
                if (handshakeKEY._hisprocess.indexOf('init_acc_clientwelcome') > -1) {
                    timeout=0
                } else {
                    handshakeKEY.cval = post_body;
                    io.emit(post_body['handshakeKEY'], { act: '..', message: JSON.stringify(post_body) });
                };
                handshakeKEY._expire(function (cacheVAL) {
                    io.emit(cacheVAL['handshakeKEY'], { act: 'ok', message: "end di nhe em: " + timeout });
                }, timeout);
                break;
            }
            case 'init_acc_clientwelcome': {
                init_handshakeKEY();
                var act = '..';
                if (handshakeKEY._hisprocess.indexOf('create_new_acc_finish') > -1) {
                    act = 'ok';
                };
                //
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ act: act, message: "Hi client keep patience!" }));
                //
                break;
            }
        }
        ////encrypt data to base64 send to php
        //$iv = crypto.randomBytes(8).toString('hex');
        //let encryptor = crypto.createCipheriv(encryptionMethod, $key256.substr(30, 32), $iv);
        //let encryptedMessage = encryptor.update(decryptedMessage, 'utf8', 'base64') + encryptor.final('base64');
        ////
        ////encode hex
        //$ciphertext = Buffer.from(encryptedMessage, 'utf8').toString('hex');
        //$Hmac = crypto.createHmac("sha256", $key256).update($ciphertext + $iv).digest("hex");//php false
        ////
        ////var c = $iv + $Hmac + $ciphertext;
        //let hostcofig = { 'data': decryptedMessage, 'token': $iv + $Hmac + $ciphertext };
        //res.setHeader('Content-Type', 'application/json');
        //res.send(JSON.stringify(hostcofig));
        //
    };
    //
    res.end();
});




app.use(function (req, res) {

    //res.status(404).send({ url: req.originalUrl + ' not found' })
    //res.status(301).redirect('https://hrpro.cf/pages/invoice.html' + req.url) // 'http://192.168.1.91:10996/pages/testredirect.php?XDEBUG_SESSION_START=154A5348'
    //console.log(req.body);
    //res.writeHead(301,
    //    { Location: 'http://192.168.1.91:10996/localsrc/ping.php?XDEBUG_SESSION_START=154A5348',fuck:'dumemay' }////'http://192.168.1.91:10996/pages/invoice.html'
    //);
    //redirect_post( req.body);
    res.end();
})

//app.listen(port)

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
//app.set('view engine', 'ejs');
//app.engine('ejs', require('ejs').__express);
//
const socket = require("socket.io");
const { exit } = require('process')
const server = app.listen(port, function () {
    console.log(`Listening on port ${port}`);
    console.log(`http://localhost:${port}`);
});
// Socket setup
const io = socket(server);
io.on("connection", function (socket) {

    socket.on('event', function (data) {
        hostphp_pubPort('requestHealth',data);
    });

    console.log("Made socket connection");
    socket.emit('announcements', { message: 'A new user has joined!' });


});


function testsend(data) {
    io.emit('announcements', { message: data });
}

console.log('RESTful API server started on: ' + port)
