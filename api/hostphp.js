hostINFO = require('./phphost.json');//bien public ko co var delarce
phpHOST = function (req, res) {
    var post_body = req.body;
    hostOverload(req, res);
}
function hostOverload(req, res) {
    var post_body = req.body;
    var cont = "<?php\r\n";
    cont += "$at=" + post_body.atval + ";\r\n";
    cont += "$nxt = microtime(true);\r\n"
    cont += "if ($nxt - $at > 1 * 60) {\r\n";
    //cont += "    unlink(dirname(__FILE__).'/overload.php');\r\n";
    cont += "    $releaseRedirect= $at; \r\n";
    cont += "} else {\r\n";
    cont += "    header('Location: https://www.hrpro.cf', true, 301);\r\n";
    cont += "    $GLOBALS['host_config']['err']['exit'] ='redirect';\r\n";
    cont += "    exit();\r\n";
    cont += "};\r\n";
    cont += "?>";
    res.send(cont);
    res.end();
}


var my_queue = [], my_active = false,my_check = function () {
    if (!my_active && my_queue.length > 0) {
        var f = my_queue.shift();
        f();
    }
},my_fakeAsync = function (param, cb) {
    setTimeout(function () {
        chkHealth_PHPHOST(param);
        cb();
    }, param['timeout']||1000);
},my_invoke = function (param) {
    my_queue.push(function () {
        my_active = true;
        my_fakeAsync(param, function () {
            my_active = false;
            my_check();
        });
    });
    my_check();
}

setInterval(function () {
    for (var k in hostINFO) {
        // use hasOwnProperty to filter out keys from the Object.prototype
        if (hostINFO.hasOwnProperty(k)) {
            my_invoke(Object.assign({ hosturl: k, timeout: 1 }, hostINFO[k]));
            //my_invoke({ ...{ hosturl: k, timeout: 1 }, ...hostINFO[k]});
        }
    }
}, 1 * 60 * 1000); // load every 20 minutes