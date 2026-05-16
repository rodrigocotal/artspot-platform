# AWS Region Migration — Brainstorming Notes (in progress)

**Status:** Brainstorming, not yet a design. Resume from "Open questions" below.
**Date started:** 2026-05-16

## Goal

Migrate the ArtAldo stack from `ap-southeast-2` (Sydney) to a US region.

## Current Sydney footprint (as of 2026-05-16)

- **Amplify** — App ID `db0y1lrxbre06`, WEB_COMPUTE, branches `main` (prod `www.artaldo.com`) and `develop` (`develop.d33bfmlx9m4rwh.amplifyapp.com`)
- **App Runner** — API, prod `api.artaldo.com`, staging `vzpregb2dy.ap-southeast-2.awsapprunner.com`
- **RDS PostgreSQL** — single instance in ap-southeast-2
- **SES** — `AWS_SES_REGION=ap-southeast-2`, sender `contact@artaldo.com`, staff recipients verified
- **ACM** — regional certs for `www.artaldo.com` and `api.artaldo.com`
- **DNS** — `artaldo.com` (provider not yet confirmed in this session — Route 53 vs external registrar TBD)
- **GitHub Actions** — `deploy-production.yml`, `deploy-staging.yml`, `pr-checks.yml` (may reference region in secrets/config)

## Decisions made

| Decision | Value | Notes |
|---|---|---|
| Target region | **`us-east-1`** (N. Virginia) | Cheapest, broadest service availability |
| Downtime tolerance | **A few hours OK** | Serial cutover, snapshot/restore — no replication needed |

## Open questions (resume here)

1. **SES sandbox status** — Memory says production access was requested in ap-southeast-2 on 2026-03-16. In us-east-1 we'll start fresh: re-verify identities and request production access. Need to know current state so we can size the SES timeline (24h+ for sandbox exit).
2. **DNS provider** — Is `artaldo.com` in Route 53 or an external registrar? Drives the cutover steps (TTL pre-lowering, who flips records).
3. **Same AWS account or fresh account?** — Same account is simpler (IAM roles, billing). Fresh account is cleaner but a much bigger lift.
4. **Old Sydney resources after cutover** — Delete immediately, or keep for a grace period (1–2 weeks) as rollback?
5. **Data volume in RDS** — Affects snapshot copy time across regions (typically minutes-to-hours).
6. **CI/CD secrets** — GitHub Actions secrets referencing region need updating; need to inventory them.
7. **Amplify custom domain** — Whether to keep the existing app and just move backing resources, or recreate the Amplify app in us-east-1 (likely the latter — Amplify apps are regional).

## Likely migration shape (sketch only — not approved)

Assuming "Option C" (few hours of downtime acceptable):

1. **Pre-work (no downtime):**
   - Create RDS subnet group + parameter group in us-east-1
   - Create new Amplify app pointed at same GitHub repo, region us-east-1
   - Create new App Runner service in us-east-1
   - Request ACM certs in us-east-1 for `www.artaldo.com` and `api.artaldo.com` (DNS validation)
   - Verify SES sender identities in us-east-1, request production access
   - Lower DNS TTLs for `www` and `api` records to 60s, ~24h before cutover
   - Inventory GitHub Actions secrets, prepare us-east-1 versions
2. **Cutover window (downtime starts):**
   - Put maintenance page up (or just accept errors)
   - Take final RDS snapshot in ap-southeast-2
   - Copy snapshot to us-east-1
   - Restore RDS in us-east-1, run any pending Prisma `db push`
   - Update App Runner env vars with new `DATABASE_URL`, deploy
   - Update Amplify env vars (`NEXT_PUBLIC_API_URL`, `AUTH_URL` unchanged if domain stays), deploy
   - Smoke test on direct App Runner / Amplify URLs
   - Flip DNS records to new endpoints
3. **Post-cutover:**
   - Monitor for 24–48h
   - Decommission Sydney resources after grace period
   - Update memory files with new region + endpoints

## Brainstorming process state

- Skill in use: `superpowers:brainstorming`
- Next step in skill: continue clarifying questions, then propose 2–3 approaches, then present design sections for approval, then formal design doc + writing-plans skill.
- These notes are NOT the final design. Resume by answering the open questions above.
