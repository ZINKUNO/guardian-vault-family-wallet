"use client";

import { useState, useMemo } from 'react';
import { usePublicClient, useWalletClient } from 'wagmi';
import { parseUnits, createWalletClient, custom } from 'viem';
import { sepolia } from 'viem/chains';
import { erc7715ProviderActions } from '@metamask/smart-accounts-kit/actions';

/**
 * Permission Request Parameters
 */
export interface PermissionRequestParams {
    tokenType: 'ETH' | 'USDC' | 'ERC20';
    amount: string; // Amount in human-readable format (e.g., "5.0")
    periodDuration: number; // in seconds (e.g., 86400 for 1 day)
    periodType?: 'one-time' | 'periodic'; // Permission type
    duration?: number; // Duration in days (e.g., 90 days for trigger delay)
    beneficiary: string; // Beneficiary address
    vaultName: string; // Vault name for justification
    vaultId: string; // Vault ID to associate permission with
    agentAddress: string; // Primary Executor Agent address
}

/**
 * Permission Response - Stored permission data
 */
export interface PermissionResponse {
    permissionId: string;
    vaultId: string;
    agentAddress: string;
    permissionsContext: string; // ERC-7715 permissions context
    delegationManager: string; // Delegation manager contract address
    tokenType: string;
    maxAmount: string;
    expiresAt: number; // Unix timestamp in milliseconds
    status: 'active' | 'revoked' | 'expired';
    createdAt: number;
    signedDelegation?: any; // Full signed delegation object (for revocation)
}

/**
 * usePermissionRequest - Hook to request ERC-7715 permissions from user
 * 
 * Requests permission for Primary Executor Agent to execute transfers on behalf of user.
 * MetaMask modal appears → user approves → permission is granted.
 * 
 * Note: Requires MetaMask Flask 13.5.0+ with ERC-7715 support
 * 
 * Flow:
 * 1. User clicks "Grant Permission" on vault dashboard
 * 2. Form inputs: token type, max amount, period type, duration, beneficiary
 * 3. Call walletClient.requestExecutionPermissions()
 * 4. MetaMask modal appears → user approves
 * 5. Store permission response for later use
 */
export function usePermissionRequest() {
    const publicClient = usePublicClient();
    const { data: walletClient } = useWalletClient();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Create wallet client with ERC-7715 provider actions (official MetaMask way)
    // According to: https://docs.metamask.io/smart-accounts-kit/guides/advanced-permissions/execute-on-metamask-users-behalf/
    const extendedWalletClient = useMemo(() => {
        if (typeof window === 'undefined' || !window.ethereum) return null;
        
        try {
            // Create wallet client using window.ethereum and extend with erc7715ProviderActions
            // This is the official way according to MetaMask documentation
            const client = createWalletClient({
                transport: custom(window.ethereum),
            }).extend(erc7715ProviderActions());
            
            return client;
        } catch (error) {
            console.error('Failed to create wallet client with ERC-7715 actions:', error);
            return null;
        }
    }, []);

    /**
     * Request ERC-7715 execution permission
     */
    const requestPermission = async (
        params: PermissionRequestParams
    ): Promise<PermissionResponse | null> => {
        if (!extendedWalletClient) {
            const err = new Error("Wallet client not initialized. Please connect your wallet.");
            setError(err);
            return null;
        }

        setIsLoading(true);
        setError(null);

        try {
            const { 
                tokenType, 
                amount, 
                periodDuration, 
                duration = 90, // Default 90 days
                beneficiary, 
                vaultName, 
                vaultId,
                agentAddress 
            } = params;
            
            const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS || "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

            // Calculate expiry timestamp (default: 90 days from now)
            const expiry = Math.floor(Date.now() / 1000) + (duration * 24 * 60 * 60);
            const startTime = Math.floor(Date.now() / 1000);

            // Determine permission type based on token type
            const permissionType = tokenType === "ETH" 
                ? "native-token-periodic" 
                : "erc20-token-periodic";

            // Parse amount based on token decimals
            const decimals = tokenType === "USDC" ? 6 : 18;
            const periodAmount = parseUnits(amount, decimals);

            // Prepare permission request
            // Note: requestExecutionPermissions is from erc7715Actions() extension
            const permissionRequest = {
                chainId: sepolia.id,
                expiry: expiry,
                signer: {
                    type: "account" as const,
                    data: { address: agentAddress as `0x${string}` }
                },
                permission: {
                    type: permissionType,
                    data: {
                        tokenAddress: tokenType === "ETH" ? undefined : USDC_ADDRESS as `0x${string}`,
                        periodAmount: periodAmount,
                        periodDuration: periodDuration, // e.g., 86400 (1 day)
                        startTime: startTime,
                        justification: `Inheritance permission for ${vaultName}. Beneficiary: ${beneficiary}`
                    }
                },
                isAdjustmentAllowed: false // Strict limits - no adjustments allowed
            };

            // Request permission from user via MetaMask
            // This will show a MetaMask modal for user approval
            console.log('📤 Requesting permission via MetaMask...', permissionRequest);
            console.log('Wallet client:', extendedWalletClient);
            console.log('Has requestExecutionPermissions:', !!(extendedWalletClient as any)?.requestExecutionPermissions);
            
            let permissions;
            
            // Try using extended wallet client first
            if (extendedWalletClient && (extendedWalletClient as any).requestExecutionPermissions) {
                try {
                    permissions = await (extendedWalletClient as any).requestExecutionPermissions([
                        permissionRequest
                    ]);
                } catch (err: any) {
                    console.warn('Extended wallet client failed, trying direct ethereum:', err);
                    // Fall through to direct ethereum call
                }
            }
            
            // Fallback: Try direct ethereum.request if walletClient method doesn't work
            if (!permissions) {
                const ethereum = (window as any).ethereum;
                if (ethereum && ethereum.isMetaMask) {
                    // Check if it's Flask version
                    const isFlask = ethereum.version?.includes('flask') || 
                                   ethereum._metamask?.isUnlocked?.() !== undefined ||
                                   ethereum.request?.toString().includes('wallet_requestExecutionPermissions');
                    
                    if (!isFlask) {
                        throw new Error(
                            "MetaMask Flask required. Please install MetaMask Flask 13.5.0+ with ERC-7715 support."
                        );
                    }
                    
                    // Try direct ethereum.request for ERC-7715
                    try {
                        console.log('Trying direct ethereum.request for ERC-7715...');
                        permissions = await ethereum.request({
                            method: 'wallet_requestExecutionPermissions',
                            params: [permissionRequest]
                        });
                        console.log('✅ Permission granted via direct ethereum.request:', permissions);
                    } catch (err: any) {
                        console.error('Direct ethereum.request failed:', err);
                        // Handle user rejection
                        if (err.code === 4001 || err.message?.includes('reject') || err.message?.includes('denied') || err.message?.includes('User rejected')) {
                            throw new Error("Permission request was rejected by user.");
                        }
                        throw new Error(
                            "ERC-7715 not supported. Please ensure you're using MetaMask Flask 13.5.0+ with ERC-7715 support enabled."
                        );
                    }
                } else {
                    throw new Error(
                        "MetaMask not detected. Please install MetaMask Flask 13.5.0+ with ERC-7715 support."
                    );
                }
            }

            if (!permissions || permissions.length === 0) {
                throw new Error("Permission request denied or failed. User may have rejected the request.");
            }

            console.log('✅ Permission granted by user:', permissions);

            const grantedPermission = permissions[0];

            // Create permission response object
            const response: PermissionResponse = {
                permissionId: crypto.randomUUID(),
                vaultId: vaultId,
                agentAddress: agentAddress,
                permissionsContext: grantedPermission.context,
                delegationManager: grantedPermission.signerMeta?.delegationManager || 
                    process.env.NEXT_PUBLIC_DELEGATION_MANAGER || 
                    "",
                tokenType: tokenType,
                maxAmount: amount,
                expiresAt: expiry * 1000, // Convert to milliseconds
                status: 'active',
                createdAt: Date.now(),
                signedDelegation: grantedPermission // Store full delegation for revocation
            };

            console.log('✅ Permission granted:', response);

            // TODO: Store permission in database/localStorage
            // await storePermission(response);

            return response;

        } catch (err: any) {
            console.error("Permission request error:", err);
            setError(err);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        requestPermission,
        isLoading,
        error
    };
}
