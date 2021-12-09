var express = require("express");
var router = express.Router();
var admin = require("firebase-admin");
var serviceAccount = require("../ride_share_service.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("Firebase Integration");
});

const sendNotification = async (req, res) => {
  var tokens = [
    "e6LIwPSrQMiqnOipxQvbgm:APA91bE84Mi7h0RBBs-bOdvFnE7gMtnk2KhFdyRPB1YKK7Zf0X0quGWPaG-5LJOF-TW8KT_PI-543aLTdHzealS2fCtKW2Us9vlhn_dEsnQYOcbmK3KLhb35fYgn3LroAEFcVgsMqGtA",
  ];
  await admin.messaging().sendToDevice(tokens, {
    data: {},
    notification: {
      title: "FCM Message",
      body: "This is an FCM notification message!",
      image:
        "https://firebase.google.com/images/brand-guidelines/logo-vertical.png",
    },
  });
  res.send("Notification Sent");
};

router.post("/send", sendNotification);
router.get("/send", sendNotification);

module.exports = router;
