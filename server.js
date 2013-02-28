var express = require('express');
var CAS = require('cas-sfu');
var url = require('url');
var config = require('./config.json');

var app = express();
var cas = new CAS(config.cas);

app.get('/login', function(req, res){
    var ticket = req.param('ticket');
    if (ticket) {
        // If we have a ticket in the parameters, we try to validate it.
        cas.validate(ticket, function(err, loggedIn, casResponse) {
            if (loggedIn) {
                success(casResponse.user);
            } else {
                // The CAS server thinks this is an invalid token.
                return res.send(401, 'Invalid token');
            }
        });
    } else {
        // No ticket, redirect to cas login
        var redirectUrl = url.parse(config.cas.casHost + config.cas.loginPath, true);
        redirectUrl.query.service = config.cas.service;
        if (config.cas.allow) {
            redirectUrl.query.allow = config.cas.allow;
        }
        res.redirect(url.format(redirectUrl));
    }
});

var success = function(user) {
    console.log(user);
};

app.listen(8080);
