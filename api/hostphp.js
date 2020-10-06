hostINFO = process.env.PHP_HOST_CHK_HEALTH_JSON && JSON.parse(process.env.PHP_HOST_CHK_HEALTH_JSON) || require('./phphost.json');//bien public ko co var delarce
//var testjson = JSON.stringify(hostINFO);

hostphp_pubPort = function (act,params) {
    switch (act) {
        case 'hostOverload': {
            hostOverload(params['req'], params['res']);
            break;
        }
        case 'requestHealth': {
            requestHealth();
        }
    }
};

function hostOverload(req, res) {
    var post_body = req.body, myself = post_body.hostname, sosanh = 1000000, redirect = '';
    for (var k in hostINFO) {
        // use hasOwnProperty to filter out keys from the Object.prototype
        if (hostINFO.hasOwnProperty(k)) {
            if (k != myself) {//nhung host khac
                var host = hostINFO[k];
                if (host['p'] != 0 && host['_h'][2] == 0) {//active and not overload
                    if (host['_h'][1] < sosanh) {
                        redirect = 'http' + host['pc'] + '://' + k + ([80, 443].indexOf(host['p']) == -1 ? ":" + host['p'] : "");
                        sosanh = hostINFO[k]['_h'][1];//update lai base so sanh
                    };
                };
            } else {// dictionary cua toi -> phai update status de host khac ko redirect qua toi
                hostINFO[myself]['_h'] = post_body['resHIS'];
            }; 
        }
    };
    if (redirect != '') {
        redirect = "header('Location: " + redirect + "', true, 301);";
    };
    //var cont = "header('Location: https://www.hrpro.cf', true, 301);";
    res.send(redirect);
    res.end();
}

var my_queue = [], my_active = false, my_check = function () {
    if (!my_active && my_queue.length > 0) {
        var f = my_queue.shift();
        f();
    }
}, my_fakeAsync = function (param, cb) {
    setTimeout(function () {
        chkHealth_PHPHOST(param);
        cb();
    }, param['timeout'] || 1000);
}, my_invoke = function (param) {
    my_queue.push(function () {
        my_active = true;
        my_fakeAsync(param, function () {
            my_active = false;
            my_check();
        });
    });
    my_check();
}, requestHealth = function () {
    for (var k in hostINFO) {
        // use hasOwnProperty to filter out keys from the Object.prototype
        if (hostINFO.hasOwnProperty(k)) {
            if (hostINFO[k]['p'] != 0) {// port=0 meaning ignore!
                my_invoke(Object.assign({ hosturl: k, timeout: 1 }, hostINFO[k]));
                //my_invoke({ ...{ hosturl: k, timeout: 1 }, ...hostINFO[k]});
            };
        }
    }
};

requestHealth();

setInterval(function () {
    requestHealth();
}, 1 * 60 * 1000); // load every 20 minutes