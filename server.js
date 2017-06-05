var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var bodyParser = require('body-parser');
var emotional = require("emotional");
var ml = require('ml-sentiment')();
var app     = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res) {
        res.sendFile(__dirname + 'index.html');
});


app.post('/sentiFrame', function(req, res) {
       console.log(req.body.answers)
       var sentiList = []

       emotional.load(function () {

    for(x=0; x<req.body.answers.length; x++){

          var r4 = emotional.get(req.body.answers[x]) // { polarity: [-1,1], subjectivity: [0,1], assessments: ... };

          var r2 = ml.classify(req.body.answers[x])

          if( r2 >0){
              var pack = {sentence:req.body.answers[x], emote:r4, ml:r2, senti:"Positive" }

          }else if (r2<0) {
              var pack = {sentence:req.body.answers[x], emote:r4, ml:r2, senti:"Negative" }
          }else {
              var pack = {sentence:req.body.answers[x], emote:r4, ml:r2, senti:"Neutral" }
            }

          sentiList.push(pack)
          console.log(sentiList)


      }

          res.json(sentiList)
        });

});


http.listen(process.env.PORT || 3000, function(){
  console.log('listening on', http.address().port);
});

console.log('Magic happens on port 8000');

exports = module.exports = app;
