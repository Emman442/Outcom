import "dotenv/config";
import http from "node:http";
import { createAdminOutcom } from "./OutcomVerifier.mjs";

const port = Number(process.env.PORT || 8787);

http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "POST" && req.url === "/set-trial") {
    let body = "";
    for await (const chunk of req) body += chunk;
    const { trialId, definitionOfDone } = JSON.parse(body || "{}");

    try {
      const outcom = createAdminOutcom();
      const feePreset = await outcom.estimateSetTrialFees(trialId, definitionOfDone);
      const receipt = await outcom.setTrial(trialId, definitionOfDone, feePreset);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, receipt }));
    } catch (e) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false, error: String(e.message || e) }));
    }
    return;
  }

  res.writeHead(404);
  res.end();
}).listen(port, () => console.log("relayer http", port));