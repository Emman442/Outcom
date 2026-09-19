# v0.3.0
# { "Depends": "py-genlayer:5jycge4q8k23462jtb0b9fyey1s9qz928sz2nbrd9mg4sxqg2qng" }

import genlayer as gl
from genlayer.types import *
import json
import typing


class OutcomVerifier(gl.contract.Contract):
    admin: str
    trials_json: str

    def __init__(self):
        self.admin = str(gl.message.sender_address)
        self.trials_json = "{}"

    def _load(self) -> dict:
        try:
            data = json.loads(self.trials_json or "{}")
            return data if isinstance(data, dict) else {}
        except Exception:
            return {}

    def _save(self, data: dict) -> None:
        self.trials_json = json.dumps(data)

    def _empty_trial(self) -> dict:
        return {
            "definition_of_done": "",
            "requirements": "",
            "candidate_solana": "",
            "referrer_solana": "",
            "github_repo_url": "",
            "deployed_app_url": "",
            "extra_url": "",
            "verdict": "",
            "score": 0,
            "reasoning": "",
            "payload_hex": "",
        }

    @gl.public.write
    def set_trial(
        self,
        trial_id: str,
        definition_of_done: str,
        requirements: str,
    ) -> None:
        if str(gl.message.sender_address) != self.admin:
            raise gl.vm.UserError("Only admin")
        if len(trial_id) == 0 or len(trial_id) > 32:
            raise gl.vm.UserError("trial_id must be 1-32 chars")
        if len(definition_of_done) < 20:
            raise gl.vm.UserError("definition_of_done too short")
        if len(requirements) < 8:
            raise gl.vm.UserError("requirements too short")

        data = self._load()
        row = data.get(trial_id) or self._empty_trial()
        if row.get("verdict") == "PASS":
            raise gl.vm.UserError("Trial already passed")

        row["definition_of_done"] = definition_of_done
        row["requirements"] = requirements
        row["verdict"] = ""
        row["score"] = 0
        row["reasoning"] = ""
        row["payload_hex"] = ""
        data[trial_id] = row
        self._save(data)

    @gl.public.write
    def submit_and_verify(
        self,
        trial_id: str,
        candidate_solana_pubkey: str,
        referrer_solana_pubkey: str,
        github_repo_url: str,
        deployed_app_url: str,
        extra_url: str,
    ) -> None:
        data = self._load()
        if trial_id not in data:
            raise gl.vm.UserError("Unknown trial_id. Call set_trial first")
        row = data[trial_id]
        if row.get("verdict") == "PASS":
            raise gl.vm.UserError("Already passed")
        if not github_repo_url.startswith("http"):
            raise gl.vm.UserError("github_repo_url must be http(s)")
        if not deployed_app_url.startswith("http"):
            raise gl.vm.UserError("deployed_app_url must be http(s)")
        if len(candidate_solana_pubkey) < 32:
            raise gl.vm.UserError("candidate pubkey required")

        dod = row["definition_of_done"]
        reqs = row.get("requirements") or ""
        repo = github_repo_url
        deploy = deployed_app_url
        extra = extra_url or ""

        def evaluate_verdict() -> str:
            repo_txt = "REPO_FETCH_FAILED"
            deploy_txt = "DEPLOY_FETCH_FAILED"
            extra_txt = ""
            try:
                repo_txt = gl.nondet.web.render(repo, mode="text")[:800]
            except Exception:
                pass
            try:
                deploy_txt = gl.nondet.web.render(deploy, mode="text")[:800]
            except Exception:
                pass
            if extra.startswith("http"):
                try:
                    extra_txt = gl.nondet.web.render(extra, mode="text")[:400]
                except Exception:
                    extra_txt = "EXTRA_FETCH_FAILED"

            prompt = f"""Verify work trial {trial_id}.

Definition of done:
{dod}

Requirements:
{reqs}

GitHub page text:
{repo_txt}

Deployed app text:
{deploy_txt}

Extra evidence text:
{extra_txt}

If the evidence clearly meets the definition of done AND the requirements, reply PASS.
Otherwise reply FAIL.
Reply with one word only: PASS or FAIL.
"""
            raw = gl.nondet.exec_prompt(prompt).strip().upper()
            return "PASS" if raw.startswith("PASS") else "FAIL"

        # Only the verdict uses consensus — one word, strict match
        decision = gl.eq_principle.strict_eq(evaluate_verdict)
        passed = decision == "PASS"
        score = 80 if passed else 0

        # Deterministic template — no second LLM, no Undetermined risk
        if passed:
            reasoning = (
                f"PASS for {trial_id}. Submitted repository and deployment evidence "
                f"were judged to meet the definition of done and the listed requirements. "
                f"Repo: {repo}. Deploy: {deploy}."
            )
        else:
            reasoning = (
                f"FAIL for {trial_id}. Submitted repository and deployment evidence "
                f"were judged not to meet the definition of done and the listed requirements. "
                f"Repo: {repo}. Deploy: {deploy}."
            )

        payload = self._encode_solana_payload(
            trial_id,
            candidate_solana_pubkey,
            referrer_solana_pubkey,
            score,
            passed,
        )

        row["github_repo_url"] = github_repo_url
        row["deployed_app_url"] = deployed_app_url
        row["extra_url"] = extra_url
        row["candidate_solana"] = candidate_solana_pubkey
        row["referrer_solana"] = referrer_solana_pubkey
        row["verdict"] = decision
        row["score"] = score
        row["reasoning"] = reasoning
        row["payload_hex"] = payload
        data[trial_id] = row
        self._save(data)


        
    def _encode_solana_payload(self, trial_id, candidate, referrer, score, passed) -> str:
        tid = trial_id.encode("utf-8")[:32].ljust(32, b"\x00")
        cand = self._b58_32(candidate)
        ref = self._b58_32(referrer) if referrer and referrer.strip() else (b"\x00" * 32)
        return (tid + cand + ref + int(score).to_bytes(8, "big") + (b"\x01" if passed else b"\x00")).hex()

    def _b58_32(self, pubkey: str) -> bytes:
        alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
        n = 0
        for ch in pubkey.strip():
            idx = alphabet.find(ch)
            if idx < 0:
                raise gl.vm.UserError("invalid base58 pubkey")
            n = n * 58 + idx
        return n.to_bytes(32, "big")

    @gl.public.view
    def get_trial_status(self, trial_id: str) -> dict[str, typing.Any]:
        data = self._load()
        if trial_id not in data:
            return {"trial_id": trial_id, "found": False}
        row = data[trial_id]
        row["trial_id"] = trial_id
        row["found"] = True
        row["admin"] = self.admin
        return row

    @gl.public.view
    def list_trial_ids(self) -> list:
        return list(self._load().keys())