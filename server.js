const express = require("express");
const app = express();

app.use(express.urlencoded({extended: true}))
app.use(express.json());

app.use('/', express.static('public'))

app.post("/test", (req, res) => {
    console.log(req.body)
  res.status(200).send("got it!");
});

app.listen(3000, () => console.log("Port 3000"));