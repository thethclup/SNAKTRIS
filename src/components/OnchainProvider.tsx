import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import React, { ReactNode } from 'react';
import { Attribution } from 'ox/erc8021';
import { BUILDER_CODE } from '../lib/erc8021';

// Base Mainnet with Denim Upgrade (200ms native canonical blocks)
export const baseDenim = {
  ...base,
  name: 'Base Mainnet (Denim)',
  rpcUrls: {
    ...base.rpcUrls,
    default: {
      http: ['https://mainnet.base.org'],
    },
  },
} as const;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 1000,
    },
  },
});

export const wagmiConfig = createConfig({
  chains: [baseDenim],
  connectors: [injected()],
  transports: {
    [baseDenim.id]: http('https://mainnet.base.org'),
  },
  pollingInterval: 1000,
  dataSuffix: Attribution.toDataSuffix({ codes: [BUILDER_CODE] }),
} as any);

export function OnchainProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

