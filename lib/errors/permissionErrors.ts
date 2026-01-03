/**
 * Permission Error Types and Handlers
 * Comprehensive error system for ERC-7715 permission edge cases
 */

export const PERMISSION_ERRORS = {
    ACCOUNT_NOT_UPGRADED: "ACCOUNT_NOT_UPGRADED",
    PERMISSION_EXPIRED: "PERMISSION_EXPIRED",
    INSUFFICIENT_ALLOWANCE: "INSUFFICIENT_ALLOWANCE",
    TRIGGER_NOT_MET: "TRIGGER_NOT_MET",
    AGENT_UNAUTHORIZED: "AGENT_UNAUTHORIZED",
    REVOKED_PERMISSION: "REVOKED_PERMISSION",
    INVALID_DELEGATION_CHAIN: "INVALID_DELEGATION_CHAIN"
} as const;

export type PermissionErrorType = keyof typeof PERMISSION_ERRORS;

export interface PermissionError extends Error {
    type: PermissionErrorType;
    details?: any;
    action?: string; // Suggested action for user
    retryable?: boolean; // Whether error can be retried
}

/**
 * Create a permission error with type and details
 */
export function createPermissionError(
    type: PermissionErrorType, 
    details?: any
): PermissionError {
    const error = new Error(getErrorMessage(type, details)) as PermissionError;
    error.name = 'PermissionError';
    error.type = type;
    error.details = details;
    
    // Set suggested actions and retryability
    switch (type) {
        case PERMISSION_ERRORS.ACCOUNT_NOT_UPGRADED:
            error.action = "Upgrade to MetaMask Smart Account";
            error.retryable = true;
            break;
        case PERMISSION_ERRORS.PERMISSION_EXPIRED:
            error.action = "Request a new permission";
            error.retryable = true;
            break;
        case PERMISSION_ERRORS.INSUFFICIENT_ALLOWANCE:
            error.action = "Check remaining allowance or request new permission";
            error.retryable = false;
            break;
        case PERMISSION_ERRORS.TRIGGER_NOT_MET:
            error.action = "Wait for trigger condition or activate manually";
            error.retryable = true;
            break;
        case PERMISSION_ERRORS.AGENT_UNAUTHORIZED:
            error.action = "Grant permission to agent";
            error.retryable = true;
            break;
        case PERMISSION_ERRORS.REVOKED_PERMISSION:
            error.action = "Permission cannot be used after revocation";
            error.retryable = false;
            break;
        case PERMISSION_ERRORS.INVALID_DELEGATION_CHAIN:
            error.action = "Check delegation chain configuration";
            error.retryable = false;
            break;
    }
    
    return error;
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(type: PermissionErrorType, details?: any): string {
    switch (type) {
        case PERMISSION_ERRORS.ACCOUNT_NOT_UPGRADED:
            return "Please upgrade to MetaMask Smart Account to use this feature";
        case PERMISSION_ERRORS.PERMISSION_EXPIRED:
            const expiryDate = details?.date 
                ? new Date(details.date).toLocaleDateString() 
                : details?.expiry 
                    ? new Date(details.expiry * 1000).toLocaleDateString()
                    : 'unknown date';
            return `Permission expired on ${expiryDate}. Please request a new permission.`;
        case PERMISSION_ERRORS.INSUFFICIENT_ALLOWANCE:
            const requested = details?.requested || 'unknown';
            const remaining = details?.remaining || 'unknown';
            return `Transfer amount (${requested}) exceeds remaining allowance (${remaining})`;
        case PERMISSION_ERRORS.TRIGGER_NOT_MET:
            const countdown = details?.countdown;
            if (countdown) {
                return `Trigger condition not satisfied. ${countdown} remaining.`;
            }
            return "Trigger condition not satisfied. Please wait or activate trigger manually.";
        case PERMISSION_ERRORS.AGENT_UNAUTHORIZED:
            const agentAddress = details?.agentAddress || 'agent';
            return `Agent (${agentAddress}) does not have permission. Please grant permission first.`;
        case PERMISSION_ERRORS.REVOKED_PERMISSION:
            const revokedAt = details?.revokedAt 
                ? new Date(details.revokedAt).toLocaleDateString() 
                : 'previously';
            return `Permission has been revoked by owner on ${revokedAt}`;
        case PERMISSION_ERRORS.INVALID_DELEGATION_CHAIN:
            return "Delegation chain validation failed. Check that all delegations in the chain are valid.";
        default:
            return "Unknown permission error occurred";
    }
}

/**
 * Handle permission errors - to be used with UI components
 * This function can be extended to trigger toasts, modals, etc.
 */
export function handlePermissionError(error: any, onError?: (error: PermissionError) => void) {
    console.error("Permission Error:", error);
    
    if (error.type && onError) {
        onError(error as PermissionError);
        return;
    }
    
    // Default handling - can be extended with toast notifications
    if (error.type === PERMISSION_ERRORS.ACCOUNT_NOT_UPGRADED) {
        // Could trigger upgrade modal here
        console.warn("Account upgrade required");
    }
}

/**
 * Check if an error is a permission error
 */
export function isPermissionError(error: any): error is PermissionError {
    return error && error.type && PERMISSION_ERRORS[error.type as PermissionErrorType] !== undefined;
}
