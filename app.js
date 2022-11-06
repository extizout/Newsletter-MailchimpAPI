const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const conf = require(__dirname + '/conf.js')
//Setting express & body-parser;
const app = express();
//Setting Static path to relative call path e.g <img src="/img/img.png">
app.use(express.static("Public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
//Config port for Heroku or use 3000 when run on local
const port = process.env.PORT || 3000;

//when receiving get request sending signup.html to client
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

//when receiving post request in root route, parse data from action="post" form in signup.html .
app.post("/", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  //Declaration of JS object to send via POST request to API
  var data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_field: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  }
  //Change JS object to JSON
  var jsonData = JSON.stringify(data);
  //Declare request variable to be able call when sending POST request via request.write(data)
  const request = https.request(conf.api, conf.option, (response) => {
    //loging  status code of POST request
    console.log(response.statusCode);

    //Receive data response from external API server while posting request to the API(NOTE when receiving data response)
    response.on("data", (data) => {
      const dataJSON = JSON.parse(data);
      console.log(dataJSON);
      //Check error_count from Mailchimp JSON to send html file.
      if (dataJSON.error_count === 0) {
        res.sendFile(__dirname + "/success.html")
        console.log("Subscribe complete. :" + dataJSON.total_created);
      } else if (dataJSON.error_count != 0) {
        res.sendFile(__dirname + "/failure.html")
        console.log("ERROR: " + dataJSON.errors[0].error);
      }
    });

  });
  //Write Post request to external API
  request.write(jsonData);
  //Ending writing post request
  request.end();

});

app.get("/failure", (req,res) => {
  res.redirect('/');
});

app.listen(port, function() {
  console.log("Server is running on port " + port);
});
