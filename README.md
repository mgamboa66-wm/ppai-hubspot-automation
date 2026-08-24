# PPAI HubSpot Automation

This private HubSpot Developer Project provides a custom workflow actions.

## Requirements

- Node.js and npm
- HubSpot CLI 7.4 or later
- A HubSpot Personal Access Key with permission to manage developer projects

Install or update the CLI:

```bash
npm install -g @hubspot/cli
```

## Configure staging and production accounts

Authenticate each HubSpot account separately. The names are local CLI labels; they do not create HubSpot accounts.

```bash
hs account auth --account=staging
hs account auth --account=production
```

When prompted, select the appropriate HubSpot account and provide its Personal Access Key. Use a sandbox or test account for `staging` and the live account for `production`.

Verify the configured accounts:

```bash
hs account list
```

You can set a default account, but using `--account` explicitly is safer:

```bash
hs account use staging
```

Never commit Personal Access Keys or the CLI global configuration to this repository.

## Validate the project

Run validation against the account you intend to use:

```bash
hs project validate --account staging
hs project validate --account production
```

## Run unit tests

The unit tests use Node's built-in test runner and do not require additional dependencies:

```bash
node --test test/*.test.js
```

Run the tests before validating or uploading the project.

## Deploy to staging

Upload and build the project in the staging account:

```bash
hs project upload --account staging --message "Deploy to staging"
```

If automatic deployment is disabled, deploy the latest build manually:

```bash
hs project deploy --account staging --deploy-latest-build
```

## Deploy to production

Validate production first, then upload using the production account label:

```bash
hs project validate --account production
hs project upload --account production --message "Deploy to production"
```

To review a build before deploying it, prevent automatic deployment:

```bash
hs project upload --account production --skip-auto-deploy --message "Prepare production build"
hs project deploy --account production --build BUILD_ID
```

Replace `BUILD_ID` with the build ID shown by the upload command.

## Useful commands

```bash
hs project info --account staging --json
hs project open --account staging
hs project logs --project ppai-hubspot-automation
```

For more information, see the [HubSpot CLI account commands](https://developers.hubspot.com/docs/developer-tooling/local-development/hubspot-cli/commands/account-commands) and [project commands](https://developers.hubspot.com/docs/developer-tooling/local-development/hubspot-cli/project-commands).
