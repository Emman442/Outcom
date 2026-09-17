import "dotenv/config";
import http from "node:http";
import { createAdminOutcom } from "./OutcomVerifier.mjs";

const port = Number(process.env.PORT || 8787);

function send(res, code, obj) {
  res.writeHead(code, { "Content-Type": "application/json" });
  res.end(JSON.stringify(obj));
}

http
  .createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    const path = (req.url || "").split("?")[0];
    const isSetTrial =
      req.method === "POST" &&
      (path === "/set-trial" || path === "/set_trial");

    if (!isSetTrial) {
      send(res, 404, { ok: false, error: `no route ${req.method} ${path}` });
      return;
    }

    let body = "";
    for await (const chunk of req) body += chunk;

    let parsed = {};
    try {
      parsed = JSON.parse(body || "{}");
    } catch {
      send(res, 400, { ok: false, error: "invalid json" });
      return;
    }

    const trialId = parsed.trialId || parsed.trial_id;
    const definitionOfDone =
      parsed.definitionOfDone || parsed.definition_of_done;

    console.log("set_trial request", { trialId });

    try {
      const outcom = createAdminOutcom();
      const receipt = await outcom.setTrial(trialId, definitionOfDone);
      console.log("set_trial ok", trialId);
      send(res, 200, { ok: true, receipt });
    } catch (e) {
      console.error("set_trial failed", e);
      send(res, 500, { ok: false, error: String(e.message || e) });
    }
  })
  .listen(port, () => console.log("relayer http", port));