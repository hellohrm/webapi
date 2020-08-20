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
    });

};
