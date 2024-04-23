const db = require("../../../helper_files/database");
const router = require("express").Router();

const {OAuth2Client} = require("google-auth-library");
const http = require("http");
const url = require("url");
import("open");
const destroyer = require("server-destroy");

const keys = require("./oauth.keys.json");

async function googleApi() {
	const oAuth2Client = await getAuthenticatedClient();

	const url = "https://people.googleapis.com/v1/people/me?personFields=names";
	const res = await oAuth2Client.request({url});
	console.log(res.data);

	const tokenInfo = await oAuth2Client.getTokenInfo(
		oAuth2Client.credentials.access_token
	);
	console.log(tokenInfo);
}

function getAuthenticatedClient() {
	return new Promise((resolve, reject) => {
		const oAuth2Client = new OAuth2Client(
			keys.web.client_id,
			keys.web.client_secret,
			keys.web.redirect_uris[0]
		);

		const authorizeUrl = oAuth2Client.generateAuthUrl({
			access_type: "offline",
			scope: "https://www.googleapis.com/auth/userinfo.profile",
		});

		const server = http
			.createServer(async (req, res) => {
				try {
					if (req.url.indexOf("/oauth2callback") > -1) {
						const qs = new url.URL(req.url, "http://localhost:3000")
							.searchParams;
						const code = qs.get("code");
						console.log(`code is ${code}`);
						res.end("Authentication successfull! Please return to the console.");
						server.destroy();

						const r = await oAuth2Client.getToken(code);
						oAuth2Client.setCredentials(r.tokens);
						console.info("Tokens acquired.");
						resolve(oAuth2Client);
					}
				} catch (e) {
					reject(e);
				}
			})
			.listen(3000, () => {
				open(authorizeUrl, {wait: false}).then(cp => cp.unref());
			});
		destroyer(server);
	});
}


router.get('/', async (req, res) => {
	await googleApi();
	res.send("done");
});

module.exports = router;
