import { http, encodeFunctionData, parseEther, type PublicClient, type Address } from 'viem';
import { sepolia } from 'viem/chains';
import { executeTransfer, type ExecuteTransferParams } from './executeTransfer';

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
 * Beneficiary distribution interface
 */
export interface BeneficiaryDistribution {
    address: Address;
    percentage: number; // Percentage of total funds (0-100)
    amount?: string; // Calculated amount in human-readable format
}

/**
 * Batch Execution Parameters
 */
export interface BatchExecutionParams {
    primaryAgentAccount: any; // Agent's smart account instance
    beneficiaries: BeneficiaryDistribution[];
    tokenType: 'ETH' | 'ERC20';
    totalAmount: string; // Total amount to distribute
    permissionsContext: string; // ERC-7715 permissions context from permission grant
    delegationManager: Address; // Delegation manager contract address
    publicClient: PublicClient;
    tokenAddress?: Address; // Required for ERC20 transfers
}

/**
 * Individual Execution Result
 */
export interface IndividualExecution {
    beneficiaryAddress: Address;
    amount: string;
    userOpHash: string;
    transactionHash?: string;
    status: 'success' | 'failed';
    error?: string;
}

/**
 * Batch Execution Result
 */
export interface BatchExecutionResult {
    totalDistributed: string;
    successfulExecutions: IndividualExecution[];
    failedExecutions: IndividualExecution[];
    overallStatus: 'success' | 'partial' | 'failed';
    summary: {
        totalBeneficiaries: number;
        successCount: number;
        failureCount: number;
    };
}

/**
 * Execute Batch Distribution to Beneficiaries
 * 
 * This function distributes funds to multiple beneficiaries according to their
 * allocated percentages after a trigger condition is met.
 * 
 * Flow:
 * 1. Calculate individual amounts based on percentages
 * 2. Execute transfers sequentially (or in parallel for production)
 * 3. Track individual execution results
 * 4. Return comprehensive batch result
 * 
 * Features:
 * - Handles both ETH and ERC20 tokens
 * - Respects ERC-7715 permission limits
 * - Provides detailed execution tracking
 * - Supports partial success scenarios
 */
export async function executeBatchDistribution(
    params: BatchExecutionParams
): Promise<BatchExecutionResult> {
    const {
        primaryAgentAccount,
        beneficiaries,
        tokenType,
        totalAmount,
        permissionsContext,
        delegationManager,
        publicClient,
        tokenAddress
    } = params;

    console.log('🏦 Starting batch distribution to beneficiaries...');
    console.log(`   Total Amount: ${totalAmount} ${tokenType}`);
    console.log(`   Beneficiaries: ${beneficiaries.length}`);

    // Validate inputs
    if (!beneficiaries || beneficiaries.length === 0) {
        throw new Error("No beneficiaries provided for distribution");
    }

    const totalPercentage = beneficiaries.reduce((sum, ben) => sum + ben.percentage, 0);
    if (Math.abs(totalPercentage - 100) > 0.01) {
        throw new Error(`Beneficiary percentages must sum to 100%. Current sum: ${totalPercentage}%`);
    }

    const totalAmountWei = parseEther(totalAmount);
    const successfulExecutions: IndividualExecution[] = [];
    const failedExecutions: IndividualExecution[] = [];

    // Calculate individual amounts
    const beneficiariesWithAmounts: BeneficiaryDistribution[] = beneficiaries.map(ben => ({
        ...ben,
        amount: formatEther((totalAmountWei * BigInt(Math.floor(ben.percentage * 10000)) / BigInt(10000)) / BigInt(100))
    }));

    console.log('📊 Calculated distribution amounts:');
    beneficiariesWithAmounts.forEach((ben, index) => {
        console.log(`   ${index + 1}. ${ben.address}: ${ben.amount} ${tokenType} (${ben.percentage}%)`);
    });

    // Execute transfers to each beneficiary
    for (let i = 0; i < beneficiariesWithAmounts.length; i++) {
        const beneficiary = beneficiariesWithAmounts[i];
        
        try {
            console.log(`💸 Executing transfer to beneficiary ${i + 1}/${beneficiaries.length}...`);
            
            const transferParams: ExecuteTransferParams = {
                primaryAgentAccount,
                beneficiaryAddress: beneficiary.address,
                tokenType,
                amount: beneficiary.amount || "0",
                permissionsContext,
                delegationManager,
                publicClient,
                tokenAddress
            };

            const result = await executeTransfer(transferParams);

            const execution: IndividualExecution = {
                beneficiaryAddress: beneficiary.address,
                amount: beneficiary.amount || "0",
                userOpHash: result.userOpHash,
                transactionHash: result.transactionHash,
                status: result.status
            };

            if (result.status === 'success') {
                successfulExecutions.push(execution);
                console.log(`✅ Transfer successful to ${beneficiary.address}`);
            } else {
                failedExecutions.push(execution);
                console.log(`❌ Transfer failed to ${beneficiary.address}`);
            }

        } catch (error: any) {
            const failedExecution: IndividualExecution = {
                beneficiaryAddress: beneficiary.address,
                amount: beneficiary.amount || "0",
                userOpHash: "",
                status: 'failed',
                error: error.message
            };
            
            failedExecutions.push(failedExecution);
            console.error(`❌ Transfer failed to ${beneficiary.address}:`, error.message);
        }
    }

    // Calculate total distributed amount
    const totalDistributed = successfulExecutions
        .reduce((sum, exec) => sum + parseFloat(exec.amount), 0)
        .toString();

    // Determine overall status
    let overallStatus: 'success' | 'partial' | 'failed';
    if (successfulExecutions.length === beneficiaries.length) {
        overallStatus = 'success';
    } else if (successfulExecutions.length > 0) {
        overallStatus = 'partial';
    } else {
        overallStatus = 'failed';
    }

    const result: BatchExecutionResult = {
        totalDistributed,
        successfulExecutions,
        failedExecutions,
        overallStatus,
        summary: {
            totalBeneficiaries: beneficiaries.length,
            successCount: successfulExecutions.length,
            failureCount: failedExecutions.length
        }
    };

    console.log('📋 Batch Distribution Summary:');
    console.log(`   Status: ${overallStatus.toUpperCase()}`);
    console.log(`   Successful: ${result.summary.successCount}/${result.summary.totalBeneficiaries}`);
    console.log(`   Total Distributed: ${totalDistributed} ${tokenType}`);

    if (failedExecutions.length > 0) {
        console.log('❌ Failed Executions:');
        failedExecutions.forEach(exec => {
            console.log(`   ${exec.beneficiaryAddress}: ${exec.error || 'Unknown error'}`);
        });
    }

    return result;
}

/**
 * Format ether value to human-readable string
 */
function formatEther(value: bigint): string {
    const etherString = value.toString();
    const etherNumber = parseInt(etherString, 16) / 1e18;
    return etherNumber.toString();
}

/**
 * Check if trigger condition is met and execute distribution
 * 
 * This is a higher-level function that combines trigger checking
 * with batch distribution execution.
 */
export async function checkTriggerAndDistribute(
    vault: any,
    agentAccount: any,
    publicClient: PublicClient
): Promise<BatchExecutionResult | null> {
    // Check if trigger condition is met
    const now = Date.now();
    let isTriggered = false;

    if (vault.triggerType === 'time' && vault.triggerTimestamp) {
        isTriggered = now >= vault.triggerTimestamp;
    } else if (vault.triggerType === 'manual') {
        isTriggered = vault.manualTrigger === true;
    } else if (vault.triggerType === 'oracle') {
        isTriggered = vault.oracleVerified === true;
    }

    if (!isTriggered) {
        console.log('⏰ Trigger condition not met yet');
        return null;
    }

    console.log('🔥 Trigger condition met! Executing beneficiary distribution...');

    // Get permissions and delegation info
    // In production, fetch from database/storage
    const permissionsContext = vault.permissionsContext || "mock-context";
    const delegationManager = vault.delegationManager || "0x0000000000000000000000000000000000000000";

    // Prepare beneficiaries for distribution
    const beneficiaries: BeneficiaryDistribution[] = vault.beneficiaries.map((ben: any) => ({
        address: ben.address,
        percentage: ben.percentage || (100 / vault.beneficiaries.length) // Equal distribution if not specified
    }));

    // Execute batch distribution
    const result = await executeBatchDistribution({
        primaryAgentAccount: agentAccount,
        beneficiaries,
        tokenType: vault.assetType || 'ETH',
        totalAmount: vault.balance || "0",
        permissionsContext,
        delegationManager,
        publicClient,
        tokenAddress: vault.tokenAddress
    });

    return result;
}
