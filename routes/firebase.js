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

const sendNotificationToRider = async (req, res) => {
  const body = req.body;
  console.log("yoooooooooooooooooooooo");

  var tokens = (
    await admin.firestore().collection("users").doc(body.riderUid).get()
  ).data().tokens;
  console.log(tokens);

  await admin.messaging().sendToDevice(tokens, {
    data: {
      tripId: body.tripId,
      riderUid: body.riderUid,
      driverUid: body.driverUid,
      requestType: "RequestByDriver",
    },
    notification: {
      title: "New Request Recieved",
      body: "Someone send you a ride request!",
      image:
        "https://firebase.google.com/images/brand-guidelines/logo-vertical.png",
    },
  });
  res.send("Notification Sent");
};

const sendNotificationToDriver = async (req, res) => {
  const body = req.body;
  console.log("yoooooooooooooooooooooo");

  var tokens = (
    await admin.firestore().collection("users").doc(body.driverUid).get()
  ).data().tokens;
  console.log(tokens);

  await admin.messaging().sendToDevice(tokens, {
    data: {
      tripId: body.tripId,
      riderUid: body.riderUid,
      driverUid: body.driverUid,
      requestType: "RequestByRider",
    },
    notification: {
      title: "New Request Recieved",
      body: "Someone send you a drive request",
      image:
        "https://firebase.google.com/images/brand-guidelines/logo-vertical.png",
    },
  });
  res.send("Notification Sent");
};

const sendChatNotification = async (req, res) => {
  const body = req.body;
  console.log("yoooooooooooooooooooooo");

  var tokens = (
    await admin.firestore().collection("users").doc(body.receiverUid).get()
  ).data().tokens;
  console.log(tokens);

  await admin.messaging().sendToDevice(tokens, {
    data: {
      requestType: "Chat",
      receiverUid: body.receiverUid,
      senderUid: body.senderUid,
    },
    notification: {
      title: "New Message Recieved",
      body: body.message,
    },
  });
  res.send("Notification Sent");
};

router.post("/send-req-to-rider", sendNotificationToRider);
router.post("/send-req-to-driver", sendNotificationToDriver);
router.post("/send-chat-notification", sendChatNotification);
// router.get("/send", sendNotification);

module.exports = router;
