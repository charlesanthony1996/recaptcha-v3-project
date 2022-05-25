var express = require("express")
var path = require("path")
var bodyParser = require("body-parser")
var request = require("request")

var app = express()
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())

var port = 3000;

app.get("/", function(req, res) {
    res.render("index")
})

app.post("/captcha", function (req, res) {
    if (req.body["g-recaptcha-response"] === undefined || req.body["g-recaptcha-response"] === "" || req.body["g-recaptcha-response"] === null)
    {
        return res.json({"responseError": "something goes wrong"})
    }

    const secretKey = "secret key here";

    const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

    request(verificationURL, function(error , response, body) {
        body = JSON.parse(body);

        if (body.success !== undefined && !body.success) {
            return res.json({ "responseError": "Failed captcha verification"})
        }
        res.json({"responseSuccess":"success"})
    })
})

app.listen(port, () => {
    console.log("server running here")
})
