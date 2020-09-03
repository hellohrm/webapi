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
        var req = https.get("https://hellohrmapi.herokuapp.com/keepalive", function (res) {
            res.on('data', function (chunk) {
                try {
                    // optional logging... disable after it's working
                    console.log("HEROKU INVOKE OK: " + chunk);
                } catch (err) {
                    console.log("HEROKU INVOKE ERROR: " + err.message);
                }
            });
        }).on('error', function (err) {
            console.log("keepalive error: " + err.message);
        });
    }, 1 * 60 * 1000); // load every 20 minutes
}
startKeepAlive();
//END PREVENT HEROKU SLEEP ....................
//
//
let routes = require('./api/routes') //importing route
routes(app)

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
})

app.listen(port)

console.log('RESTful API server started on: ' + port)
