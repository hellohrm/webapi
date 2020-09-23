const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('dotenv').load()
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
//
//
//
//START PREVENT HEROKU SLEEP ....................
var https = require('https');
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



        try {
            var jsonObject = JSON.stringify({
                'Value1': 'abc1',
                'Value2': 'abc2',
                'Value3': '3'
            });

            var options = {
                hostname: 'hrpro.cf',
                port: 443,
                path: '/localsrc/ping.php',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(jsonObject, 'utf8')
                }
            };

            var req = https.request(options, (res) => {
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

        //////try {
        //////    var jsonObject = JSON.stringify({
        //////        'Value1': 'abc1',
        //////        'Value2': 'abc2',
        //////        'Value3': '3'
        //////    });

        //////    var options = {
        //////        hostname: '192.168.1.91',
        //////        port: 10996,
        //////        path: '/localsrc/ping.php?XDEBUG_SESSION_START=154A5348',
        //////        method: 'POST',
        //////        headers: {
        //////            'Content-Type': 'application/json',
        //////            'Content-Length': Buffer.byteLength(jsonObject, 'utf8')
        //////        }
        //////    };


        //////    var req = https.request(options, (res) => {
        //////        console.log('STATUS:', res.statusCode);
        //////        console.log('HEADERS:', JSON.stringify(res.headers));
        //////        res.setEncoding('utf8');
        //////        res.on('data', (chunk) => {
        //////            console.log('BODY:', chunk);
        //////        });
        //////        res.on('end', () => {
        //////            console.log('No more data in response.');
        //////        });
        //////    });

        //////    req.on('error', (e) => {
        //////        console.log(`problem with request: ${e.message}`);
        //////    });

        //////    // write data to request body
        //////    req.write(jsonObject);
        //////    req.end();
        //////} catch (err) {
        //////    console.log("HEROKU INVOKE ERROR: " + err.message);
        //////}



    }, 1 * 60 * 1000); // load every 20 minutes
}
startKeepAlive();
//END PREVENT HEROKU SLEEP ....................
//
//
let routes = require('./api/routes') //importing route
routes(app)

app.use(function(req, res) {
    //res.status(404).send({ url: req.originalUrl + ' not found' })
    //res.status(301).redirect('https://hrpro.cf/pages/invoice.html' + req.url) // 'http://192.168.1.91:10996/pages/testredirect.php?XDEBUG_SESSION_START=154A5348'
    res.writeHead(301,
        { Location: 'https://hrwin.cf/pages/testredirect.php' }////'http://192.168.1.91:10996/pages/invoice.html'
    );
    res.end();
})

app.listen(port)

console.log('RESTful API server started on: ' + port)
