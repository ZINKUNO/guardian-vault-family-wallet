"use client";

import { useState, useEffect, useCallback } from 'react';
import { usePublicClient } from 'wagmi';
import { checkTriggerAndDistribute, type BatchExecutionResult } from '@/lib/agents/batchDistribution';
import { useTriggerSystem } from './useTriggerSystem';

/**
 * Vault Interface for batch execution
 */
export interface VaultForExecution {
    id: string;
    name: string;
    vaultAddress: string;
    balance: string;
    assetType: 'ETH' | 'ERC20';
    tokenAddress?: string;
    beneficiaries: Array<{
        address: string;
        name?: string;
        percentage?: number;
    }>;
    triggerType: 'time' | 'manual' | 'oracle';
    triggerTimestamp?: number;
    manualTrigger?: boolean;
    oracleVerified?: boolean;
    permissionsContext?: string;
    delegationManager?: string;
}

/**
 * Auto Execution Status
 */
export interface AutoExecutionStatus {
    isEnabled: boolean;
    isChecking: boolean;
    lastCheck: number;
    nextCheck: number;
    lastExecution?: BatchExecutionResult;
}

/**
 * useAutoExecution - Hook to automatically execute beneficiary distribution
 * when trigger conditions are met
 * 
 * Features:
 * - Periodic checking of trigger conditions
 * - Automatic batch distribution to beneficiaries
 * - Execution history tracking
 * - Manual trigger capability
 * - Configurable check intervals
 */
export function useAutoExecution(vault: VaultForExecution | null | undefined) {
    const publicClient = usePublicClient();
    const { status: triggerStatus, isTriggerConditionMet } = useTriggerSystem(vault);
    
    const [autoStatus, setAutoStatus] = useState<AutoExecutionStatus>({
        isEnabled: true,
        isChecking: false,
        lastCheck: 0,
        nextCheck: Date.now() + 60000 // Check every minute
    });
    
    const [executionHistory, setExecutionHistory] = useState<BatchExecutionResult[]>([]);
    const [isExecuting, setIsExecuting] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    /**
     * Execute beneficiary distribution manually
     */
    const executeDistribution = useCallback(async (): Promise<BatchExecutionResult | null> => {
        if (!vault || !publicClient) {
            throw new Error("Vault or public client not available");
        }

        setIsExecuting(true);
        setError(null);

        try {
            console.log('🚀 Manually executing beneficiary distribution...');
            
            // Mock agent account - in production, get from vault configuration
            const mockAgentAccount = {
                address: vault.vaultAddress,
                // Add other necessary agent account properties
            };

            const result = await checkTriggerAndDistribute(vault, mockAgentAccount, publicClient);
            
            if (result) {
                // Update execution history
                setExecutionHistory(prev => [result, ...prev].slice(0, 10)); // Keep last 10 executions
                
                // Update auto status
                setAutoStatus(prev => ({
                    ...prev,
                    lastExecution: result,
                    lastCheck: Date.now(),
                    nextCheck: Date.now() + 60000
                }));

                console.log('✅ Manual execution completed:', result.overallStatus);
            }

            return result;

        } catch (err: any) {
            console.error('❌ Manual execution failed:', err);
            setError(err);
            throw err;
        } finally {
            setIsExecuting(false);
        }
    }, [vault, publicClient]);

    /**
     * Check and auto-execute if trigger condition is met
     */
    const checkAndAutoExecute = useCallback(async () => {
        if (!vault || !autoStatus.isEnabled || isExecuting) {
            return;
        }

        // Check if trigger condition is met
        if (!isTriggerConditionMet()) {
            setAutoStatus(prev => ({
                ...prev,
                isChecking: false,
                lastCheck: Date.now(),
                nextCheck: Date.now() + 60000
            }));
            return;
        }

        console.log('🔥 Trigger condition met! Auto-executing beneficiary distribution...');
        
        try {
            await executeDistribution();
        } catch (err) {
            console.error('Auto-execution failed:', err);
        }
    }, [vault, autoStatus.isEnabled, isExecuting, isTriggerConditionMet, executeDistribution]);

    /**
     * Periodic checking effect
     */
    useEffect(() => {
        if (!vault || !autoStatus.isEnabled) {
            return;
        }

        const interval = setInterval(async () => {
            setAutoStatus(prev => ({ ...prev, isChecking: true }));
            await checkAndAutoExecute();
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [vault, autoStatus.isEnabled, checkAndAutoExecute]);

    /**
     * Enable/disable auto-execution
     */
    const toggleAutoExecution = useCallback((enabled: boolean) => {
        setAutoStatus(prev => ({
            ...prev,
            isEnabled: enabled,
            nextCheck: enabled ? Date.now() + 60000 : 0
        }));
    }, []);

    /**
     * Get execution summary
     */
    const getExecutionSummary = useCallback(() => {
        if (executionHistory.length === 0) {
            return {
                totalExecutions: 0,
                successfulExecutions: 0,
                partialExecutions: 0,
                failedExecutions: 0,
                totalDistributed: "0"
            };
        }

        const summary = executionHistory.reduce((acc, exec) => {
            acc.totalExecutions++;
            if (exec.overallStatus === 'success') acc.successfulExecutions++;
            else if (exec.overallStatus === 'partial') acc.partialExecutions++;
            else acc.failedExecutions++;
            
            acc.totalDistributed = (parseFloat(acc.totalDistributed) + parseFloat(exec.totalDistributed)).toString();
            return acc;
        }, {
            totalExecutions: 0,
            successfulExecutions: 0,
            partialExecutions: 0,
            failedExecutions: 0,
            totalDistributed: "0"
        });

        return summary;
    }, [executionHistory]);

    return {
        // Status
        autoStatus,
        triggerStatus,
        isExecuting,
        error,
        
        // Actions
        executeDistribution,
        toggleAutoExecution,
        
        // Data
        executionHistory,
        getExecutionSummary,
        
        // Helpers
        isTriggerConditionMet
    };
}
