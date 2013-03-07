var express = require('express');
var CAS = require('cas-sfu');
var url = require('url');
var crypto = require('crypto');
var config = require('./config.json');

var app = express();
var cas = new CAS(config.cas);

app.get('/login', function(req, res){
    var ticket = req.param('ticket');
    if (ticket) {
        // If we have a ticket in the parameters, we try to validate it.
        cas.validate(ticket, function(err, loggedIn, casResponse) {
            if (loggedIn) {
                success(res, casResponse.user);
            } else {
                // The CAS server thinks this is an invalid token.
                return res.send(401, 'Invalid token');
            }
        });
    } else {
        // No ticket, redirect to cas login
        var redirectUrl = url.parse(config.cas.casHost +
            config.cas.casBasePath + config.cas.loginPath, true);
        redirectUrl.query.service = config.cas.service;
        if (config.cas.allow) {
            redirectUrl.query.allow = config.cas.allow;
        }
        res.redirect(url.format(redirectUrl));
    }
});

var success = function(res, userId) {
    var userRole = config.kaltura.roles[userId] || config.kaltura.defaultRole;
    var salt = config.kaltura.secret;
    // Expires in 24 hours
    var expires = Date.now() / 1000 + (60 * 60 * 24);
    // random number from 0-32000
    var r = Math.floor(Math.random() * 32000);
    var info = userId + ';' + userRole + ';;' + expires + ';' + r;
    var shasum = crypto.createHash('sha1');
    shasum.update(salt + info);
    var signature = shasum.digest('hex');
    var hashed = new Buffer(signature + '|' + info).toString('base64');
    res.redirect(config.kaltura.host +
            '/mediaspacefolder/user/authenticate/sessionKey/' + hashed);
};

app.listen(8080);
