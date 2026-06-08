# Fix: production email delivery (App Runner → SES)

## Problem
The App Runner API services have **no instance (runtime) role**, so the AWS SDK
in `apps/api/src/services/email.service.ts` (`new SESClient(...)` with no keys)
finds no credentials at runtime:

```
Failed to send email to ...: CredentialsProviderError: Could not load credentials from any providers
```

Result: **all** transactional emails silently fail — welcome, password reset,
inquiry notifications, order confirmations, and contact-form notifications.
(Failures are swallowed by the fire-and-forget `catch` in `email.service.ts`.)

## Fix — create one IAM role, attach it to both API services

### Step 1 — Create the instance role
IAM → Roles → Create role → **Custom trust policy**, paste:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    { "Effect": "Allow", "Principal": { "Service": "tasks.apprunner.amazonaws.com" }, "Action": "sts:AssumeRole" }
  ]
}
```
Name it `artspot-apprunner-instance-role`. Add a permissions policy (inline) — least privilege:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    { "Sid": "AllowSESSend", "Effect": "Allow", "Action": ["ses:SendEmail", "ses:SendRawEmail"], "Resource": "*" }
  ]
}
```
(Quick alternative: attach the managed `AmazonSESFullAccess`.)

CLI equivalent (needs admin creds — the default `rodrigocastillof` user lacks IAM write):
```bash
aws iam create-role --role-name artspot-apprunner-instance-role \
  --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"tasks.apprunner.amazonaws.com"},"Action":"sts:AssumeRole"}]}'

aws iam put-role-policy --role-name artspot-apprunner-instance-role \
  --policy-name ses-send \
  --policy-document '{"Version":"2012-10-17","Statement":[{"Sid":"AllowSESSend","Effect":"Allow","Action":["ses:SendEmail","ses:SendRawEmail"],"Resource":"*"}]}'
```

### Step 2 — Attach as Instance role on each API service (App Runner console)
Do this in the console (the CLI `update-service` requires re-specifying CPU/memory):
1. App Runner → **`artspot-api-production`** → Configuration → Edit → Security → **Instance role** → select `artspot-apprunner-instance-role` → Save & deploy.
2. Repeat for **`artspot-api-development`** (staging API).

Each service redeploys (~few minutes) with the role attached.

> Note: this is the *instance role* (runtime), distinct from the *access role* (ECR image pull). Don't change the access role.

## Step 3 — SES sandbox check
Credentials only let SES *authenticate*. If SES is still in **sandbox** (`ap-southeast-2`),
it only delivers to **verified** addresses. In SES console confirm either:
- Production access granted (Account dashboard), **or**
- Sender `contact@artaldo.com` and staff recipients `art@artaldo.com`, `rodrigo@artaldo.com` are verified identities.

## Step 4 — Verify
After the redeploys: submit a test contact form on `www.artaldo.com`, then check
the prod App Runner application logs — the `CredentialsProviderError` should be
gone and staff should receive the email.
Log group: `/aws/apprunner/artspot-api-production/.../application`.
