var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Jungle Express', myMess: 'A Jungle Mess for You!' });
});

router.get('/index', function (req, res) {
  res.render('index', { title: 'My Jungle Express' });
});


/* GET New User page. */
router.get('/newuser', function (req, res) {
  res.render('newuser', { title: 'Add New User' });
}); 



/* GET Userlist page with data from database! */ 
router.get('/userlist', function (req, res) {
  var db = req.db;
  var collection = db.get('UserCollection');
  collection.find({}, {}, function (errorCode, docs) {
    console.log(errorCode);
    console.log(docs);
    res.render('userlist', {
      "userlist": docs
    });
  });
}); 



/* POST to Add User Service */
router.post('/adduser', function (req, res) {
  console.log("in router Post for adduser");
  // Set our internal DB variable 
  var db = req.db;

  // Get our form values. These rely on the "name" attributes
  var userName = req.body.username;
  var userEmail = req.body.useremail;
  console.log("user: " + userName + "  email: " + userEmail);
  // Set our collection 
  var collection = db.get('UserCollection');

  // Submit to the DB
  collection.insert({
    "username": userName,
    "email": userEmail
  }, function (err, doc) {
    if (err) {
      // If it failed, return error
      console.log('could not get to database');
      res.send("There was a problem adding the information to the database.");
    }
    else {
      // if good, forward to success page, userlist to show updated data 
      res.redirect("userlist");
    }
  });
}); 






module.exports = router;
