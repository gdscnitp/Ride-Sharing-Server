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
  var uid = req.body.uid;
  console.log("yoooooooooooooooooooooo");

  var tokens = (
    await admin.firestore().collection("users").doc(uid).get()
  ).data().tokens;
  console.log(tokens);

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
// router.get("/send", sendNotification);

module.exports = router;
