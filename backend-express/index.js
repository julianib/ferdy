const express = require("express");
const app = express();
app.use(express.json());

const CLIENT_ID = "179923541658-kfl4lp6lgd1nur0pk5vnqsb3d2hg49e6.apps.googleusercontent.com";
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(CLIENT_ID);

async function verify(token) {
	const ticket = await client.verifyIdToken({
		idToken: token,
		audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
		// Or, if multiple clients access the backend:
		//[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
	});
	const payload = ticket.getPayload();

	return payload;
}

app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	next();
});

app.post('/', async (request, response) => {
	try {
		console.log(await verify(request.body.tokenId))
	} catch (error) {
		response.status(400).json({
			auth: false
		});
	}
});

app.listen(3001, () => {
	console.log("We are listening :D");
});
