const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('dotenv').load()
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


const WEBHOOK_SECRET = '8a25cff620291e86fc6c81755ee3b8c78268902623a610d42464c1724f78ee352bd59d237e5747e544aae06d2b965864';
const crypto = require('crypto');
function verifySignature(body, signature) {
    const digest = crypto
        .createHmac('sha1', WEBHOOK_SECRET)
        .update(body)
        .digest('hex');
    return signature === digest;
};
app.post('/webhooks', function (req, res, next) {
    console.log('verification success: ', req.body);
    if (!verifySignature(req.body, req.headers['x-tawk-signature'])) {
            //verification failed
        console.log('verification failed: ', req.rawBody);
    }

    //console.log('verification success: ', req.rawBody);
});

let routes = require('./api/routes') //importing route
routes(app)

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
})

app.listen(port)

console.log('RESTful API server started on: ' + port)
