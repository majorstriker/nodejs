import Metrics from "./metrics.js";
import ServerExpress from "./serverExpress.mjs";

const metrics = new Metrics();
const server = new ServerExpress(metrics);
server.start();