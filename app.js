const express = require('express');
const bodyParser = require('body-parser');
const mailchimp = require('@mailchimp/mailchimp_marketing');
 
const app = express();
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"));
 
mailchimp.setConfig({
  apiKey: "6b6603c2deb8998632b0987b27e10169",
  server: "us18"
});
 
app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
})
 
app.post("/", function(req, res){
 
  const listId = "5b7f8aee61";
  const subscribingUser = {
      firstName: req.body.fname,
      lastName: req.body.lname,
      email: req.body.email
  };
 
  async function run() {
    try {
        const response = await mailchimp.lists.addListMember(listId, {
          email_address: subscribingUser.email,
          status: "subscribed",
          merge_fields: {
            FNAME: subscribingUser.firstName,
            LNAME: subscribingUser.lastName
          }
        });

        console.log(
          `Successfully added contact as an audience member. The contact's id is ${response.id}.`
        );

        res.sendFile(__dirname + "/success.html");
    } catch (e) {
        res.sendFile(__dirname + "/failure.html");
    }
}

run();
})

app.post("/failure", function(req, res) {
    res.redirect("/");
  })
 
app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000")
});
//api key
//6b6603c2deb8998632b0987b27e10169-us18

// audience Id 
// 5b7f8aee61