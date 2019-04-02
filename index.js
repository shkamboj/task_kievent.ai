var
  express = require('express'),
  url = require('url'),
  fs = require('fs'),
  mongoose = require('mongoose'),
  path = require('path'),
  dotenv = require('dotenv').config(),
  cookieParser = require('cookie-parser'),
  cookieSession = require('cookie-session'),
  randomUrl = require('random-url'),
  nodemailer = require('nodemailer');


var imageSchema = mongoose.Schema({
    
    name:{type: String,
      required: true,
    },
    email:{type:String,
      required :true,
  },
    link:{type: String,
      required: false,
    }
});

var Image = mongoose.model("Image", imageSchema);



var app = express();
app.set('port', (process.env.PORT || 5000));


var uri = 'mongodb://amit:amit123@ds237072.mlab.com:37072/quizapp';

mongoose.connect(uri);

app.set('view engine', 'ejs');
app.set('views','./views');


var path = require('path');
app.use('/static',express.static(__dirname + '/public'));

app.use(cookieParser());


app.set("view options", { layout: false } );
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', function(req, res) {
  res.send('For uploading link of photo use localhost:5000/enter_links and for sending them to your mail use localhost:5000/images');
});


app.get('/enter_links', function(req, res) {
  res.render('enter_links');
});



app.post('/enter_links',function (req,res) {
  var name = req.body.name;
  var email = req.body.email;
  var link = req.body.link;
  var image = new Image({
    name : name,
    email : email,
    link : link,
  });
  image.save(function (err) {
    if(err)
    {
      console.log("ERRONN");
    }
    else
    {
      res.redirect('/');
    }
  });
});



app.get('/images', function(req, res) {
  res.render('images');
});


app.get('/mailsent', function(req, res) {
  res.render('mailsent');
});




app.post('/images',function(req, res){


  var name = req.body.name;
  var email = req.body.email;
  Image.find({"email" : email },function(err,res2){
  var link2 = res2[0].link;
    console.log(link2); 
          



  nodemailer.createTestAccount((err, account) => {
    let transporter = nodemailer.createTransport({

  from: 'nithparadox@gmail.com',
  host: 'smtp.gmail.com',
  secureConnection: true,
  port: 465,
  transportMethod: 'SMTP',
  auth: {
    user: 'nithparadox@gmail.com',
    pass: 'finalLOVE@12'
  }
    });


var text = 'Hi ' + name  + ' You can now download your images from here ' + link2;

  var img = require("fs").readFileSync('/home/shkamboj/QuizApp/shubham3.jpeg');

    let mailOptions = {
        from: 'nithparadox@gmail.com',
        to: email,
        subject: 'Your Images',
        text: text,
        attachments: [
        {
        filename: "image.jpg",
        contents: img
    }
       ]
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
    else
    {
      res.redirect('/mailsent');
  }
    });
});
});

});


app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'));
});