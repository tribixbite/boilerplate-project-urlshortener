require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');
//dns.lookup(url, cb);
// dns.lookup("techneesssh.com", function(err, address){console.log(address == undefined)}) true if invalid

var savedURLS = [];

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.get('/api/shorturl/:urlNum', function(req, res) {
  let urlNum = req.body.urlNum;
  if (urlNum <= savedURLS.length){
    res.redirect(savedURLS[urlNum]);
    return;
  }
  res.json({error: 'url not saved'});
});

app.post('/api/shorturl/new', function(req, res) {
  console.log(req.body.url);
  let host = req.body.url;
  let reghttp = /^https?:\/\//;
  if (reghttp.test(host)){host = host.slice(host.indexOf("//")+2)};
  if (host.indexOf("/") > 0) {host = host.slice(0, host.indexOf("/"))}
  //host = host.replace("http://","").replace("https://","").split('/')[0].split('?')[0] prolly a better way to do it...
  console.log(host);
  dns.lookup(host, function(err, address){
    if (err) { 
      res.json({error: 'invalid url'}); 
      return console.error(err); 
      }

    if (address == undefined) {
      res.json({error: 'invalid url'});
      return;
    }
    res.json({ original_url : req.body.url, short_url : savedURLS.length});
    savedURLS.push(req.body.url);
    //do some stuff
    });
  //res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

