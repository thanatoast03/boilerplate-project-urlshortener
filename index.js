require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
// const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

let count = 0;
let sites = {};
const urlRegex = /^https?:\/\/localhost(?::\d+)?(?:\/\?v=\d+)?$/;

//todo: put app.get here to retrieve sites. i think they are 1-indexed
app.use(bodyParser.urlencoded({extended:false}));

app.get("/api/shorturl/:short_url?", function (req, res) {
  if (req.params.short_url) {
    if (req.params.short_url in sites) res.redirect(sites[req.params.short_url]);
    else res.json({ error: 'invalid short_url'});
  } else {
    res.json({ error: 'invalid short_url'});
  }
})

app.post("/api/shorturl", function  (req, res) {
  console.log(req.body.url);
  const match = urlRegex.test(req.body.url);
  if (match) {
    console.log("matched");
    // const domain = match[2]; 
    // dns.lookup(domain, (err, address, family) => {
    //   if (err) console.error("DNS Lookup failed:", err);
    //   count++;
    //   sites[count.toString()] = req.body.url;
    //   res.json({
    //     original_url: req.body.url,
    //     short_url: count
    //   });
    // });
    count++;
    sites[count.toString()] = req.body.url;
    res.json({
      original_url: req.body.url,
      short_url: count
    });
  } else {
    console.log("didn't match");
    res.json({
      error: 'Invalid URL'
    });
  }
});

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
