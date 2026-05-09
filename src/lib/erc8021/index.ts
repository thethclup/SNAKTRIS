/**
 * ERC-8021: Transaction Attribution
 * Specifies attribution parameters for tracking origin of transactions.
 */

export const ATTRIBUTION_CODE = "[ATTRIBUTION_CODE]";
export const BUILDER_CODE = "bc_ktc2jlrn";
export const APP_ID = "693d789cd77c069a945bde63";

export function formatAttributionData(action: string): `0x${string}` {
  // Simple hex formatting for standard message + attribution markers
  const text = `${action} | App:${APP_ID} | B:${BUILDER_CODE} | A:${ATTRIBUTION_CODE}`;
  let hex = '';
  for (let i = 0; i < text.length; i++) {
    hex += text.charCodeAt(i).toString(16);
  }
  return `0x${hex}`;
}
