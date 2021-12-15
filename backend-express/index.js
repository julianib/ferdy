const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_ID =
  "179923541658-kfl4lp6lgd1nur0pk5vnqsb3d2hg49e6.apps.googleusercontent.com";
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(CLIENT_ID);

async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();

  return payload;
}

app.post("/", async (request, response) => {
  try {
    console.log(await verify(request.body.tokenId));
  } catch (error) {
    response.status(400).json({
      auth: false,
    });
  }
});

app.listen(1962, () => {
  console.log("We are listening :D");
});
