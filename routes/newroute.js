var express = require('express');
var router = express.Router();


router.get('/newroute', function (req, res) {
    res.render('newroute', { title: 'My New Route Jungle Express' });
});

module.exports = router;
