//APIkey : Gen at Mailchimp.
//listID  df984f2351
//Service: mailchimp

const apiUrl = "https://us12.api.mailchimp.com/3.0/lists/df984f2351";
//Option to sending post to other server by https.request(apiUrl, option, (response) => {}
const option = {
  method: "POST",
  auth: ""
}

exports.api = apiUrl;
exports.option = option;
