const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.sendNotification = functions.https.onRequest(async (req, res) => {
  const {token, title, body} = req.body;

  if (!token || !title || !body) {
    return res.status(400).send("Missing token, title, or body.");
  }

  const message = {
    token: token,
    notification: {
      title: title,
      body: body,
    },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("✅ Notification sent:", response);
    return res.status(200).send("Notification sent successfully!");
  } catch (error) {
    console.error("Error sending notification:", error);
    return res.status(500).send("Notification sending failed.");
  }
});
