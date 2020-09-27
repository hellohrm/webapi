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


    // Server frontpage
    app.route('/thai').get(function (req, res) {

        const { client, xml } = require('@xmpp/client')
        const debug = require('@xmpp/debug')

        const xmpp = client({
            service: 'ws://34.121.155.40:5280/ws',
            domain: 'xmpp.hrpro.cf',
            resource: '',
            username: 'thai',
            password: '123',
        })

        debug(xmpp, true)

        xmpp.on('error', err => {
            console.error(err)
        })

        xmpp.on('offline', () => {
            console.log('offline')
        })

        xmpp.on('stanza', async stanza => {
            if (stanza.is('message')) {
  
                //await xmpp.send(xml('presence', { type: 'unavailable' }))
                //await xmpp.stop()
            }
            console.log('co tin hieu: ' + new Date().getTime())
        })

        xmpp.on('online', async address => {
            // Makes itself available
            await xmpp.send(xml('presence'))

            // Sends a chat message to itself
            const message = xml(
                'message',
                { type: 'chat', to: address },
                xml('body', {}, 'hello world xxx xdee' + new Date().getTime())
            )
            await xmpp.send(message)
        })

        xmpp.start().catch(console.error)
        res.end();
    });

    // Server frontpage
    app.route('/').get(function (req, res) {

        var redis = require('redis');
        var client = redis.createClient(6379, process.env.REDIS_HOST, { no_ready_check: true });
        client.auth(process.env.REDIS_PASS, function (err) {
            if (!err) {
                client.get("foo", function (err, reply) {
                    console.log(reply);
                });
                client.publish("events.123.new", '{"some": "data"}');
            }
        });

        client.on('error', function (err) {
            console.log('Error ' + err);
        });

        client.on('connect', function () {
            console.log('Connected to Redis');
        });


        res.send('This is TestBot Server');
        //res.writeHead(301,
        //    { Location: 'http://192.168.1.91:10996/localsrc/ping.php?XDEBUG_SESSION_START=154A5348' }////'http://192.168.1.91:10996/pages/invoice.html'
        //);
        res.end();
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
