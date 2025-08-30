export function handlerReadiness(req, res) {
    res.set("Content-Type", "text/plain");
    res.send("OK");
}
