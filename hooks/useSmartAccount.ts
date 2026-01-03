"use client";

import { useAccount, usePublicClient } from 'wagmi';
import { useState, useEffect } from 'react';

/**
 * useSmartAccount - Custom hook to check if user's account is upgraded to MetaMask Smart Account
 * 
 * Checks if the account is using EIP-7702 delegation (0xef0100 prefix)
 * MetaMask Flask 13.9.0+ auto-upgrades during permission request
 * 
 * @returns {Object} Account status and upgrade requirements
 * @returns {boolean} isSmartAccount - Whether account is a smart account
 * @returns {boolean} isLoading - Loading state
 * @returns {string | undefined} userAddress - Current user address
 * @returns {boolean} upgradeRequired - Whether upgrade is required
 */
export function useSmartAccount() {
    const { address } = useAccount();
    const publicClient = usePublicClient();
    const [isSmartAccount, setIsSmartAccount] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [upgradeRequired, setUpgradeRequired] = useState(false);

    useEffect(() => {
        async function checkAccount() {
            if (!address || !publicClient) {
                setIsLoading(false);
                setIsSmartAccount(false);
                setUpgradeRequired(false);
                return;
            }

            setIsLoading(true);
            try {
                // Get account bytecode to check if it's a smart account
                const code = await publicClient.getCode({ address });

                // EIP-7702 delegation format: 0xef0100 + 20 bytes (implementation address)
                // If code starts with 0xef0100, it's a delegated account (smart account)
                if (code && code.startsWith('0xef0100')) {
                    // Extract implementation address (remove 0xef0100 prefix, get next 20 bytes = 40 hex chars)
                    const implementationAddress = '0x' + code.slice(8, 48); // 0xef0100 = 8 chars, + 40 chars = 48
                    
                    const expectedImpl = process.env.NEXT_PUBLIC_SMART_ACCOUNT_IMPLEMENTATION;

                    // Validate against expected implementation if configured
                    if (expectedImpl) {
                        if (implementationAddress.toLowerCase() === expectedImpl.toLowerCase()) {
                            setIsSmartAccount(true);
                            setUpgradeRequired(false);
                        } else {
                            // Different implementation, but still a smart account
                            console.warn('Smart account with different implementation:', implementationAddress);
                            setIsSmartAccount(true);
                            setUpgradeRequired(false);
                        }
                    } else {
                        // No expected implementation configured, accept any smart account
                        setIsSmartAccount(true);
                        setUpgradeRequired(false);
                    }
                } else if (code && code !== '0x') {
                    // Account has code but not EIP-7702 format
                    // Could be a contract account (different type of smart account)
                    setIsSmartAccount(true);
                    setUpgradeRequired(false);
                } else {
                    // No code = EOA (Externally Owned Account)
                    // Needs upgrade to smart account
                    setIsSmartAccount(false);
                    setUpgradeRequired(true);
                }
            } catch (error) {
                console.error("Error checking smart account status:", error);
                // On error, assume upgrade required to be safe
                setIsSmartAccount(false);
                setUpgradeRequired(true);
            } finally {
                setIsLoading(false);
            }
        }

        checkAccount();
    }, [address, publicClient]);

    return {
        isSmartAccount,
        isLoading,
        userAddress: address,
        upgradeRequired
    };
}
