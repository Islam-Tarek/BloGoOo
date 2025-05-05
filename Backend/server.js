// server.js
const jsonServer = require("json-server");
const auth = require("json-server-auth");
const cors = require("cors");
require("dotenv").config();

const app = jsonServer.create();
const router = jsonServer.router("db.json");

app.db = router.db;

app.use(cors());
app.use(jsonServer.bodyParser);
app.use(auth);
app.use(router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`JSON Server with Auth is running on port ${PORT}`);
});
