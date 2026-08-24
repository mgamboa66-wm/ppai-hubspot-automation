const { calculateHighestCredential } = require("./credentialHelper");

/**
 * Reads the custom workflow action request and returns its output fields.
 * The workflow action sends the enrolled contact properties under
 * `object.properties`; inputFields are also supported for local testing and
 * for action definitions that map properties as explicit inputs.
 */
exports.main = async (context = {}) => {
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
