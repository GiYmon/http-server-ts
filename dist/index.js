import express from "express";
import { logResponses } from "./middleware.js";
const app = express();
const PORT = 8080;
app.use(logResponses);
app.use("/app", express.static("./src/app"));
app.get("/healthz", handlerReadiness);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
function handlerReadiness(req, res) {
    res.set("Content-Type", "text/plain");
    res.send("OK");
}
