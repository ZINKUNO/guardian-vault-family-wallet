"use client";

import { createConfig, http, WagmiProvider, usePublicClient, useWalletClient } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { metaMask } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useMemo } from 'react';
import { type WalletClient } from 'viem';
// ERC-7715 provider actions for permission requests
import { erc7715Actions } from 'viem/experimental';

// Create a QueryClient instance for React Query
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

// Get RPC URL from environment variables, fallback to default
const sepoliaRpcUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_KEY';

// Create wagmi config with Sepolia testnet
export const config = createConfig({
    chains: [sepolia],
    transports: {
        [sepolia.id]: http(sepoliaRpcUrl),
    },
    connectors: [
        metaMask({
            // MetaMask connector configuration
            dappMetadata: {
                name: 'GuardianVault Family Wallet',
            },
        }),
    ],
});

/**
 * WalletProvider - Wraps the app with wagmi and React Query providers
 * Provides wallet connection and ERC-7715 support throughout the application
 */
export function WalletProvider({ children }: { children: ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    );
}

/**
 * useWalletClients - Custom hook to get public and wallet clients
 * Extends wallet client with ERC-7715 actions for permission requests
 * 
 * @returns {Object} { publicClient, walletClient }
 * @returns {PublicClient} publicClient - Public client for read operations
 * @returns {WalletClient | null} walletClient - Extended wallet client with ERC-7715 support
 */
export function useWalletClients() {
    const publicClient = usePublicClient();
    const { data: walletClient } = useWalletClient();

    // Extend wallet client with ERC-7715 actions for permission requests
    const extendedWalletClient = useMemo(() => {
        if (!walletClient) return null;
        try {
            // Extend with ERC-7715 actions (experimental feature)
            // This enables requestExecutionPermissions() method
            return walletClient.extend(erc7715Actions());
        } catch (error) {
            console.warn('Failed to extend wallet client with ERC-7715 actions:', error);
            // Fallback to standard wallet client if extension fails
            return walletClient;
        }
    }, [walletClient]);

    return {
        publicClient,
        walletClient: extendedWalletClient,
    };
}
