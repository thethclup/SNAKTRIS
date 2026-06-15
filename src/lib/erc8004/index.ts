/**
 * ERC-8004: Trustless Agents
 * Defines standard interfaces for agentic interactions and autonomous onchain actions.
 * Placeholder for future Snaktris Agent extensions (e.g. auto-playing agents).
 */

export interface IAgentConfiguration {
  agentId: string;
  allowedActions: string[];
  maxDailyTransactions: number;
}

export const SNAKTRIS_AGENT_CONFIG: IAgentConfiguration = {
  agentId: "snaktris-agent-v1",
  allowedActions: ["submit_score", "claim_reward"],
  maxDailyTransactions: 10
};

export function buildAgentPayload(action: string, data: any) {
  return {
    version: "8004-1",
    agent: SNAKTRIS_AGENT_CONFIG.agentId,
    action,
    payload: data,
    timestamp: Date.now()
  };
}
