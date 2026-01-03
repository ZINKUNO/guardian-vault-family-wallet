"use client";

import { useState } from 'react';
import { useWalletClients } from '@/lib/providers/WalletProvider';
import { type Address } from 'viem';

/**
 * Mock DelegationManager (replace with permissionless SDK in production)
 * TODO: Use DelegationManager from permissionless/delegation package
 */
const DelegationManager = {
    encode: {
        disableDelegation: (args: any): `0x${string}` => {
            // In production, this encodes the disableDelegation call
            // Example: DelegationManager.encode.disableDelegation({ delegation: storedDelegation })
            return `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}` as `0x${string}`;
        }
    }
};

/**
 * useRevokePermission - Hook to revoke active ERC-7715 permissions
 * 
 * Allows vault owner to revoke agent permissions at any time.
 * Once revoked, the agent cannot execute transfers using that permission.
 * 
 * Flow:
 * 1. Get stored delegation object from permission grant (Phase 5)
 * 2. Generate revocation calldata using DelegationManager.encode.disableDelegation
 * 3. Send transaction from user's smart account (vault owner)
 * 4. Wait for confirmation
 * 5. Update permission status in database/state
 * 
 * Note: In production, use bundler client for UserOperations instead of sendTransaction
 */
export function useRevokePermission() {
    const { walletClient, publicClient } = useWalletClients();
    const [isRevoking, setIsRevoking] = useState(false);
    const [revocationError, setRevocationError] = useState<Error | null>(null);

    /**
     * Revoke an active permission
     * 
     * @param storedDelegation - The delegation object from permission grant (stored in Phase 5)
     * @param userSmartAccount - User's smart account address (vault owner)
     * @returns Transaction hash
     */
    const revokePermission = async (
        storedDelegation: any, 
        userSmartAccount: Address
    ): Promise<string> => {
        if (!walletClient) {
            const err = new Error("Wallet client not initialized. Please connect your wallet.");
            setRevocationError(err);
            throw err;
        }

        setIsRevoking(true);
        setRevocationError(null);

        try {
            console.log('🔄 Revoking permission...');
            console.log(`   Delegation: ${JSON.stringify(storedDelegation).substring(0, 100)}...`);

            // 2. Generate revocation calldata
            // In production: DelegationManager.encode.disableDelegation({ delegation: storedDelegation })
            const disableDelegationData = DelegationManager.encode.disableDelegation({
                delegation: storedDelegation
            });

            const delegationManagerAddress = (
                process.env.NEXT_PUBLIC_DELEGATION_MANAGER || 
                "0x0000000071727De22E5E9d8BAf0edAc6f37da032"
            ) as Address;

            // 3. Send transaction from user's smart account
            // Note: In production with smart accounts, use bundler client:
            // const bundlerClient = createBundlerClient({ ... });
            // const userOpHash = await bundlerClient.sendUserOperation({
            //   account: userSmartAccount,
            //   calls: [{ to: delegationManagerAddress, data: disableDelegationData }],
            //   ...
            // });
            
            // For now, using standard transaction (works if user's account is EOA or smart account supports it)
            const hash = await walletClient.sendTransaction({
                to: delegationManagerAddress,
                data: disableDelegationData,
                account: userSmartAccount,
                chain: undefined // Use connected chain
            });

            console.log("✅ Revocation transaction sent:", hash);

            // 4. Wait for confirmation
            if (publicClient) {
                console.log("⏳ Waiting for transaction confirmation...");
                const receipt = await publicClient.waitForTransactionReceipt({
                    hash: hash as `0x${string}`
                });
                console.log("✅ Permission revoked. Transaction confirmed:", receipt.transactionHash);
            } else {
                // Fallback: wait for a short time (not ideal, but works for mock)
                await new Promise(resolve => setTimeout(resolve, 2000));
                console.log("⚠️ Public client not available, skipping receipt wait");
            }

            // 5. Update permission status in database/state
            // TODO: await updatePermissionStatus(permissionId, 'revoked', { revokedAt: Date.now() });

            return hash;

        } catch (err: any) {
            console.error("❌ Revocation failed:", err);
            setRevocationError(err);
            throw err;
        } finally {
            setIsRevoking(false);
        }
    };

    return {
        revokePermission,
        isRevoking,
        revocationError
    };
}
