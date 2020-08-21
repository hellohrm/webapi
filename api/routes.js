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
    app.route('/').get(function (req, res) {
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
            url: 'https://graph.facebook.com/v8.0/me/messages',
            qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
            method: 'POST',
            json: {
                recipient: { id:'167485091569906'  },
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

};
