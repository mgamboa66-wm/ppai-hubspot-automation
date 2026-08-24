const test = require("node:test");
const assert = require("node:assert/strict");

const { main } = require("../src/app/functions/RecalculateHighestCredential.js");

const run = (inputFields) => main({ body: { inputFields } });

test("returns MAS+ when a MAS+ issue date is present", async () => {
  const response = await run({ mas_plus_issue_date: "2024-01-01" });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.outputFields.highest_credential_level, "MAS+");
  assert.equal(response.body.outputFields.hs_execution_state, "SUCCESS");
});

test("returns MAS when MAS is valid and higher credentials are absent", async () => {
  const response = await run({
    mas_issue_date: "2024-01-01",
    mas_expire_date: "2099-12-31",
  });

  assert.equal(response.body.outputFields.highest_credential_level, "MAS");
});

test("returns CAS when MAS is not valid", async () => {
  const response = await run({
    mas_issue_date: "2024-01-01",
    mas_expire_date: "2000-01-01",
    cas_issue_date: "2024-01-01",
    cas_expire_date: "2099-12-31",
  });

  assert.equal(response.body.outputFields.highest_credential_level, "CAS");
});

test("returns TAS when no MAS or CAS credential is valid", async () => {
  const response = await run({ tas_issue_date: "2024-01-01" });

  assert.equal(response.body.outputFields.highest_credential_level, "TAS");
});

test("returns an empty level when no credential is present", async () => {
  const response = await run({});

  assert.deepEqual(response, {
    statusCode: 200,
    body: {
      outputFields: {
        highest_credential_level: "",
        hs_execution_state: "SUCCESS",
      },
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
});
