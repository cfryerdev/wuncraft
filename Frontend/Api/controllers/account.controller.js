var express = require('express')
, app = express()
, authMiddleware = require('../middleware/authentication.middleware')
, manager = require('../managers/account.manager');

app.post('/account/login', function (req, res) {
    manager.login(req.body.username, req.body.password, function(data, code) {
        if (code == 200) {
            req.session.user = data;
        }
        res.status(code).send(data);
    });
});

app.get('/account/logout', function (req, res) {
    req.session.destroy();
    res.status(200).send('Logged out successfully');
});

app.get('/account/status', function (req, res) {
    res.status(200).send(req.session.user);
});

app.get('/account/checkuser/:id', [authMiddleware], function (req, res) {
    manager.getAccountInfo(req.params.id, function(data, code) {
        res.status(code).send(data);
    });
});

app.get('/account/checkemail/:email', [authMiddleware], function (req, res) {
    manager.isExistingEmail(req.params.email, function(data, code) {
        res.status(code).send(data);
    });
});

app.get('/account/checkusername/:name', [authMiddleware], function (req, res) {
    manager.isExistingUsername(req.params.name, function(data, code) {
        res.status(code).send(data);
    });
});

app.post('/account/register', [authMiddleware], function (req, res) {
    manager.register(req.body.email, req.body.username, req.body.password, function(data, code) {
        res.status(code).send(data);
    });
});

app.post('/account/resetPassword', [authMiddleware], function (req, res) {
    manager.resetPassword(req.body.username, req.body.oldPassword, req.body.newPassword, function(data, code) {
        res.status(code).send(data);
    });
});

app.get('/account/*', [authMiddleware], function (req, res) {
    res.status(404).send('Not found.');
});

module.exports = app;