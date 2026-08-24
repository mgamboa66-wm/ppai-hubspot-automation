/**
 * Returns true when the expiration date is today or in the future.
 * Supports HubSpot date values (YYYY-MM-DD), timestamps, and date strings.
 */
const isValidDate = (value) => {
  if (!value) return false;

  let date;

  // Treat a HubSpot date property as a calendar date instead of letting the
  // JavaScript Date parser interpret YYYY-MM-DD as midnight UTC.
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    date = new Date(year, month - 1, day);
  } else {
    const numericValue = Number(value);
    date = new Date(Number.isNaN(numericValue) ? value : numericValue);
  }

  if (Number.isNaN(date.getTime())) return false;

  const today = new Date();

  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return date >= today;
};

/**
 * Returns the highest credential level based on the provided properties.
 */
const calculateHighestCredential = (properties = {}) => {
  const hasMAS = Boolean(
    properties.mas_issue_date ||
    properties.mas_recert_date ||
    properties.mas_lifetime_issue_date,
  );

  const hasCAS = Boolean(
    properties.cas_issue_date ||
    properties.cas_recert_date ||
    properties.cas_lifetime_issue_date,
  );

  const masValid =
    hasMAS &&
    Boolean(
      properties.mas_lifetime_issue_date ||
      isValidDate(properties.mas_expire_date),
    );

  const casValid =
    hasCAS &&
    Boolean(
      properties.cas_lifetime_issue_date ||
      isValidDate(properties.cas_expire_date),
    );

  if (properties.mas_plus_issue_date) return "MAS+";
  if (masValid) return "MAS";
  if (casValid) return "CAS";
  if (properties.tas_issue_date) return "TAS";

  return "";
};

/**
 * Reads the custom workflow action request and returns its output fields.
 */
exports.main = async function main(context = {}) {
  try {
    const rawBody = context.body ?? context;
    const body =
      typeof rawBody === "string" ? JSON.parse(rawBody) : rawBody || {};

    const properties = {
      ...(body.object?.properties || {}),
      ...(body.inputFields || {}),
    };

    return {
      outputFields: {
        highest_credential_level: calculateHighestCredential(properties),
        hs_execution_state: "SUCCESS",
      },
    };
  } catch (error) {
    console.error("Failed to recalculate highest credential", error);
    throw error;
  }
};
