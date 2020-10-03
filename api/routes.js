'use strict';
module.exports = function (app) {
    var productsCtrl = require('./controllers/ProductsController');

    // todoList Routes
    app.route('/products')
      .get(productsCtrl.get)
      .post(productsCtrl.store);


    app.route('/products/:productId')
      .get(productsCtrl.detail)
      .put(productsCtrl.update)
      .delete(productsCtrl.delete);

    // todoList Routes
    app.route('/host_config').post(function (req, res) {
        var post_body = req.body;
        var hostcofig = { 'err': {} };
        hostcofig['api'] = { 'master': 'http://localhost:3000' };
        hostcofig['database'] = { 'host': 'localhost', 'name': 'somedb', 'user': 'someuser', 'pass': 'somepass' };
        hostcofig['cacheexpire'] = { 'config': 1 * 60 };
        //
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(hostcofig));

        res.end();
    }).get(function (req, res) {
        // todoList Routes
        //hostINFO = require('./phphost.json');
        //res.setHeader('Content-Type', 'application/json');
        //res.send(JSON.stringify(hostINFO));
        //res.end();
        //var path = require("path") //assuming express is installed 
        //res.sendFile(path.join(__dirname + '/../public/admin.html'));
        //res.render(path.join(__dirname + '/../views/pages/index.ejs'));
        res.render('../views/pages/index.ejs');
        res.end;
    });



    // todoList Routes
    app.route('/health_state').post(function (req, res) {
        phpHOST(req, res);
    });


    // Server frontpage
    app.route('/').get(function (req, res) {
        var redis = require("redis");
        var redisSVR = process.env.REDIS_SVR && JSON.parse(process.env.REDIS_SVR) || require('./redisinfo.json');
        const client = redis.createClient(Object.assign({ "port": 6379, "no_ready_check": true }, redisSVR));

        client.on('connect', () => {
            global.console.log("connected");
        });

        client.on('error', err => {
            global.console.log(err.message)
        });

        //client.set("foo", 'bar');
        client.get("foo", function (err, reply) {
            global.console.log(reply.toString());
        })

        res.send('This is TestBot Server');
    });

    // Facebook Webhook
    app.route('/webhook').get(function (req, res) {
        if (req.query['hub.verify_token'] === 'testbot_verify_token') {
            res.send(req.query['hub.challenge']);
        } else {
            res.send('Invalid verify token');
        }
    }).post(function (req, res) {// handler receiving messages
        var events = req.body.entry[0].messaging;
        var i;
        for ( i = 0; i < events.length; i++) {
            var event = events[i];
            if (event.message && event.message.text) {
                sendMessage(event.sender.id, { text: "Echo: " + event.message.text });
            }
        }
        res.sendStatus(200);
    });
    //
    //
    const request = require('request');
    // generic function sending messages '110441870777146'
    function sendMessage(recipientId, message) {
        console.log('access_token: ', process.env.PAGE_ACCESS_TOKEN);
        console.log('recipientId: ', recipientId);
        console.log('message: ', message);
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
            method: 'POST',
            json: {
                recipient: { id: recipientId },
                message: message,
            }
        }, function (error, response, body) {
            if (error) {
                console.log('Error sending message: ', error);
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
            }
        });
    };

    //https://developer.tawk.to/webhooks/8a25cff620291e86fc6c81755ee3b8c78268902623a610d42464c1724f78ee352bd59d237e5747e544aae06d2b965864
    //const WEBHOOK_SECRET = '8a25cff620291e86fc6c81755ee3b8c78268902623a610d42464c1724f78ee352bd59d237e5747e544aae06d2b965864';
    //const crypto = require('crypto');
    //function verifySignature(body, signature) {
    //    const digest = crypto
    //        .createHmac('sha1', WEBHOOK_SECRET)
    //        .update(body)
    //        .digest('hex');
    //    return signature === digest;
    //};
    //app.route('/webhooks').post(function (req, res) {
    //    if (!verifySignature(req.rawBody, req.headers['x-tawk-signature'])) {
    //         //verification failed
    //        console.log('verification failed: ', req.rawBody);
    //    }
         
    //    console.log('verification success: ', req.rawBody);
    //});
    //--------------------------------------------------------------------
};
