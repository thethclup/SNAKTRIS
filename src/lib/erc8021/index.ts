/**
 * ERC-8021: Transaction Attribution & Base Builder Codes
 * Compatible with Base Mainnet (Denim Upgrade - 200ms canonical blocks)
 */

export const ATTRIBUTION_CODE = "[ATTRIBUTION_CODE]";
export const BUILDER_CODE = "bc_ktc2jlrn";
export const APP_ID = "693d789cd77c069a945bde63";
export const NETWORK_UPGRADE = "Base Denim (200ms Blocks)";

export function formatAttributionData(action: string): `0x${string}` {
  // Simple hex formatting for standard message + attribution markers
  const text = `${action} | App:${APP_ID} | B:${BUILDER_CODE} | A:${ATTRIBUTION_CODE}`;
  let hex = '';
  for (let i = 0; i < text.length; i++) {
    hex += text.charCodeAt(i).toString(16);
  }
  return `0x${hex}`;
}
