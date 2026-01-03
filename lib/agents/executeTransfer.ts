import { http, encodeFunctionData, parseEther, type PublicClient, type Address } from 'viem';
import { sepolia } from 'viem/chains';

/**
 * ERC-20 Transfer ABI for encoding transfer function calls
 */
const ERC20_TRANSFER_ABI = [
    {
        name: 'transfer',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'to', type: 'address' },
            { name: 'value', type: 'uint256' }
        ],
        outputs: [{ name: '', type: 'bool' }]
    }
] as const;

/**
 * Execute Transfer Parameters
 */
export interface ExecuteTransferParams {
    primaryAgentAccount: any; // Agent's smart account instance
    beneficiaryAddress: Address; // Recipient address
    tokenType: 'ETH' | 'ERC20';
    amount: string; // Amount in human-readable format
    permissionsContext: string; // ERC-7715 permissions context from permission grant
    delegationManager: Address; // Delegation manager contract address
    publicClient: PublicClient;
    tokenAddress?: Address; // Required for ERC20 transfers
}

/**
 * Execution Result
 */
export interface ExecutionResult {
    userOpHash: string;
    receipt: any;
    transactionHash?: string;
    status: 'success' | 'failed';
}

// TODO: In production, install permissionless package and use:
// import { createBundlerClient } from 'permissionless';
// import { erc7710BundlerActions } from 'permissionless/actions';

/**
 * Mock Bundler Client (replace with permissionless in production)
 * In production, use: createBundlerClient from permissionless package
 */
function createBundlerClient(params: any) {
    return {
        extend: (actions: any) => ({
            sendUserOperationWithDelegation: async (args: any) => {
                console.log("📤 Sending UserOp with delegation:", args);
                // In production, this calls the bundler API
                return `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
            },
            waitForUserOperationReceipt: async (args: any) => {
                console.log("⏳ Waiting for receipt:", args);
                // In production, this polls for the receipt
                await new Promise(resolve => setTimeout(resolve, 2000));
                return { 
                    status: "success", 
                    transactionHash: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}` 
                };
            },
            estimateUserOperationGas: async (args: any) => {
                // Mock gas estimation
                return {
                    callGasLimit: 100000n,
                    preVerificationGas: 50000n,
                    verificationGasLimit: 100000n,
                    maxFeePerGas: 1000000000n, // 1 gwei
                    maxPriorityFeePerGas: 100000000n // 0.1 gwei
                };
            }
        })
    };
}

const erc7710BundlerActions = () => ({});

/**
 * Execute Transfer with Permission
 * 
 * Primary Executor Agent executes inheritance transfer using ERC-7715 permission.
 * 
 * Prerequisites:
 * - Permission granted by user (from usePermissionRequest)
 * - Trigger condition met (from useTriggerSystem)
 * 
 * Flow:
 * 1. Create Bundler Client for agent's smart account
 * 2. Prepare transfer calldata (ETH or ERC20)
 * 3. Estimate gas for UserOperation
 * 4. Execute with delegation using sendUserOperationWithDelegation
 * 5. Wait for receipt
 * 
 * Error Handling:
 * - Permission expired → throws error
 * - Amount exceeds limit → throws error
 * - Trigger not met → should be checked before calling this function
 */
export async function executeTransfer(
    params: ExecuteTransferParams
): Promise<ExecutionResult> {
    const {
        primaryAgentAccount,
        beneficiaryAddress,
        tokenType,
        amount,
        permissionsContext,
        delegationManager,
        publicClient,
        tokenAddress
    } = params;

    const BUNDLER_RPC_URL = process.env.NEXT_PUBLIC_BUNDLER_RPC_URL;
    
    if (!BUNDLER_RPC_URL) {
        throw new Error("BUNDLER_RPC_URL not configured. Please set NEXT_PUBLIC_BUNDLER_RPC_URL in .env.local");
    }

    // 1. Create Bundler Client
    // In production: const bundlerClient = createBundlerClient({ ... }).extend(erc7710BundlerActions());
    const bundlerClient = createBundlerClient({
        client: publicClient,
        transport: http(BUNDLER_RPC_URL),
        paymaster: process.env.PAYMASTER_URL ? true : false // Use paymaster if configured
    }).extend(erc7710BundlerActions());

    // 2. Prepare transfer calldata
    let callData: `0x${string}` = "0x";
    let value = 0n;

    if (tokenType === 'ETH') {
        // ETH transfer: value is the amount, callData is empty
        value = parseEther(amount);
    } else if (tokenType === 'ERC20') {
        // ERC20 transfer: encode transfer(to, amount) function call
        if (!tokenAddress) {
            throw new Error("tokenAddress is required for ERC20 transfers");
        }

        const amountWei = parseEther(amount); // Assuming 18 decimals, adjust if needed
        
        callData = encodeFunctionData({
            abi: ERC20_TRANSFER_ABI,
            functionName: 'transfer',
            args: [beneficiaryAddress, amountWei]
        });
        
        value = 0n; // ERC20 transfers don't send ETH
    } else {
        throw new Error(`Unsupported token type: ${tokenType}`);
    }

    try {
        // 3. Estimate gas (optional but recommended)
        // In production, use: const gasEstimate = await bundlerClient.estimateUserOperationGas({ ... });
        const estimatedGas = await bundlerClient.estimateUserOperationGas({
            account: primaryAgentAccount,
            calls: [{
                to: beneficiaryAddress,
                value: value,
                data: callData
            }]
        });

        // 4. Execute with delegation
        console.log('🚀 Executing transfer with ERC-7715 delegation...');
        console.log(`   To: ${beneficiaryAddress}`);
        console.log(`   Amount: ${amount} ${tokenType}`);
        console.log(`   Permissions Context: ${permissionsContext.substring(0, 20)}...`);

        const userOpHash = await bundlerClient.sendUserOperationWithDelegation({
            publicClient,
            account: primaryAgentAccount, // Agent's smart account
            calls: [{
                to: beneficiaryAddress,
                value: value,
                data: callData,
                permissionsContext, // From stored permission
                delegationManager // From stored permission
            }],
            maxFeePerGas: estimatedGas.maxFeePerGas || 1000000000n,
            maxPriorityFeePerGas: estimatedGas.maxPriorityFeePerGas || 100000000n
        });

        console.log("✅ UserOp sent:", userOpHash);

        // 5. Wait for receipt
        console.log("⏳ Waiting for transaction confirmation...");
        const receipt = await bundlerClient.waitForUserOperationReceipt({
            hash: userOpHash
        });

        console.log("✅ Transaction confirmed:", receipt.transactionHash);

        return {
            userOpHash,
            receipt,
            transactionHash: receipt.transactionHash,
            status: receipt.status === 'success' ? 'success' : 'failed'
        };

    } catch (error: any) {
        console.error("❌ Execution failed:", error);
        
        // Enhanced error handling
        if (error.message?.includes('expired') || error.message?.includes('EXPIRED')) {
            throw new Error("Permission expired. Please request a new permission.");
        }
        if (error.message?.includes('allowance') || error.message?.includes('INSUFFICIENT')) {
            throw new Error("Transfer amount exceeds remaining allowance.");
        }
        if (error.message?.includes('unauthorized') || error.message?.includes('UNAUTHORIZED')) {
            throw new Error("Agent does not have permission to execute this transfer.");
        }
        
        throw error;
    }
}
