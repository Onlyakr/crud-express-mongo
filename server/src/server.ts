import "dotenv/config";

import app from "./app.js";
import connectToDB from "./config/db.js";
import env from "./config/env.js";

app.listen(env.LISTEN_PORT, () => {
	console.log(`Server is running on port ${env.LISTEN_PORT}`);
	connectToDB();
});
