const assert = require("node:assert/strict");
const test = require("node:test");

const {
  calculateHighestCredential,
  isValidDate,
} = require("./credentialHelper");

const today = new Date();
const toDateOnly = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

test("accepts an expiration date that is today", () => {
  assert.equal(isValidDate(toDateOnly(today)), true);
});

test("rejects an invalid expiration date", () => {
  assert.equal(isValidDate("not-a-date"), false);
});

test("returns MAS+ before all other credentials", () => {
  assert.equal(
    calculateHighestCredential({
      mas_plus_issue_date: "2020-01-01",
      mas_issue_date: "2020-01-01",
      mas_expire_date: toDateOnly(today),
      cas_issue_date: "2020-01-01",
      cas_expire_date: toDateOnly(today),
      tas_issue_date: "2020-01-01",
    }),
    "MAS+"
  );
});

test("returns MAS when MAS is valid", () => {
  assert.equal(
    calculateHighestCredential({
      mas_issue_date: "2020-01-01",
      mas_expire_date: toDateOnly(today),
      cas_issue_date: "2020-01-01",
      cas_expire_date: toDateOnly(today),
      tas_issue_date: "2020-01-01",
    }),
    "MAS"
  );
});

test("returns CAS when MAS is expired and CAS is valid", () => {
  assert.equal(
    calculateHighestCredential({
      mas_issue_date: "2020-01-01",
      mas_expire_date: "2000-01-01",
      cas_issue_date: "2020-01-01",
      cas_expire_date: toDateOnly(today),
    }),
    "CAS"
  );
});

test("returns TAS when no MAS or CAS credential is valid", () => {
  assert.equal(
    calculateHighestCredential({
      mas_issue_date: "2020-01-01",
      mas_expire_date: "2000-01-01",
      cas_issue_date: "2020-01-01",
      cas_expire_date: "2000-01-01",
      tas_issue_date: "2020-01-01",
    }),
    "TAS"
  );
});

test("returns an empty string when no credential exists", () => {
  assert.equal(calculateHighestCredential({}), "");
});
