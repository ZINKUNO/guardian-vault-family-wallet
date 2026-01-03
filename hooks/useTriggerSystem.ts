"use client";

import { useState, useEffect, useCallback } from 'react';

/**
 * Vault Interface (subset of full vault object)
 */
export interface VaultTriggerConfig {
    triggerType: 'time' | 'manual' | 'oracle';
    triggerTimestamp?: number; // For time-based triggers
    manualTrigger?: boolean; // For manual triggers
    oracleVerified?: boolean; // For oracle-based triggers (future)
}

/**
 * Trigger Status
 */
export interface TriggerStatus {
    isTriggered: boolean;
    canExecute: boolean;
    remainingTime: number; // seconds
    triggerType: 'time' | 'manual' | 'oracle';
    daysRemaining?: number;
    hoursRemaining?: number;
    minutesRemaining?: number;
}

/**
 * useTriggerSystem - Hook to manage trigger conditions for vault execution
 * 
 * Supports three trigger types:
 * 1. TIME-BASED: Release after specified duration (e.g., 90 days)
 * 2. MANUAL: User activates trigger manually (for demo/emergency)
 * 3. ORACLE-BASED: Triggered by external oracle (e.g., proof-of-death) - future implementation
 * 
 * @param vault - Vault configuration object
 * @returns Trigger status and activation function
 */
export function useTriggerSystem(vault: VaultTriggerConfig | null | undefined) {
    const [status, setStatus] = useState<TriggerStatus>({
        isTriggered: false,
        canExecute: false,
        remainingTime: 0,
        triggerType: 'time'
    });

    // Manual trigger state (for demo/emergency access)
    const [manualTriggerActivated, setManualTriggerActivated] = useState(false);

    // Check trigger condition
    const checkTrigger = useCallback(() => {
        if (!vault) {
            setStatus({
                isTriggered: false,
                canExecute: false,
                remainingTime: 0,
                triggerType: 'time'
            });
            return;
        }

        const now = Date.now();
        let isTriggered = false;
        let remaining = 0;

        switch (vault.triggerType) {
            case 'time':
                // Time-based trigger: check if current time >= trigger timestamp
                if (vault.triggerTimestamp) {
                    if (now >= vault.triggerTimestamp) {
                        isTriggered = true;
                    } else {
                        remaining = Math.floor((vault.triggerTimestamp - now) / 1000);
                    }
                }
                break;

            case 'manual':
                // Manual trigger: activated by user (for demo/emergency)
                isTriggered = manualTriggerActivated || vault.manualTrigger === true;
                break;

            case 'oracle':
                // Oracle-based trigger: verified by external oracle (future implementation)
                // In production, this would check an oracle contract or API
                isTriggered = vault.oracleVerified === true;
                // TODO: Implement oracle verification logic
                // Example: Check Chainlink oracle or proof-of-death service
                break;

            default:
                isTriggered = false;
        }

        // Calculate time breakdown for display
        const daysRemaining = Math.floor(remaining / 86400);
        const hoursRemaining = Math.floor((remaining % 86400) / 3600);
        const minutesRemaining = Math.floor((remaining % 3600) / 60);

        setStatus({
            isTriggered,
            canExecute: isTriggered,
            remainingTime: remaining > 0 ? remaining : 0,
            triggerType: vault.triggerType,
            daysRemaining: remaining > 0 ? daysRemaining : undefined,
            hoursRemaining: remaining > 0 ? hoursRemaining : undefined,
            minutesRemaining: remaining > 0 ? minutesRemaining : undefined
        });
    }, [vault, manualTriggerActivated]);

    // Check trigger every second for real-time updates
    useEffect(() => {
        checkTrigger();
        
        const interval = setInterval(checkTrigger, 1000); // Update every second
        
        return () => clearInterval(interval);
    }, [checkTrigger]);

    /**
     * Activate manual trigger (for demo/emergency access)
     */
    const activateManualTrigger = useCallback(() => {
        if (vault?.triggerType === 'manual') {
            setManualTriggerActivated(true);
            console.log('🔥 Manual trigger activated');
        } else {
            console.warn('Manual trigger only available for manual trigger type');
        }
    }, [vault]);

    /**
     * Check if trigger condition is met
     * Used before executing agent transfer
     */
    const isTriggerConditionMet = useCallback((): boolean => {
        return status.canExecute && status.isTriggered;
    }, [status]);

    return {
        status,
        activateManualTrigger,
        isTriggerConditionMet
    };
}
