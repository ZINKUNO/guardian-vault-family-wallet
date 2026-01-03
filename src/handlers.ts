// Simplified Envio handlers for GuardianVault
// This will be updated when Envio generates types

// Constants
const ZERO_BI = BigInt(0);
const GLOBAL_STATS_ID = "global";

/**
 * Handle vault deposit events
 */
export function handleDeposit(event: any): void {
  const vaultAddress = event.address.toHexString();
  const transactionHash = event.transaction.hash.toHexString();
  const logIndex = event.logIndex.toString();
  
  console.log(`Handling deposit: ${event.params.amount.toString()} ETH to vault ${vaultAddress}`);
  
  // This will be implemented when Envio generates types
  // For now, just log the event
}

/**
 * Handle vault withdrawal events
 */
export function handleWithdrawal(event: any): void {
  const vaultAddress = event.address.toHexString();
  const transactionHash = event.transaction.hash.toHexString();
  
  console.log(`Handling withdrawal: ${event.params.amount.toString()} ETH from vault ${vaultAddress}`);
}

/**
 * Handle beneficiary addition events
 */
export function handleBeneficiaryAdded(event: any): void {
  const vaultAddress = event.address.toHexString();
  const beneficiaryAddress = event.params.beneficiary.toHexString();
  const percentage = event.params.percentage.toI32();
  
  console.log(`Adding beneficiary ${beneficiaryAddress} to vault ${vaultAddress} with ${percentage}% allocation`);
}

/**
 * Handle trigger activation events
 */
export function handleTriggerActivated(event: any): void {
  const vaultAddress = event.address.toHexString();
  const triggerType = event.params.triggerType.toI32();
  
  console.log(`Trigger activated for vault ${vaultAddress}: type ${triggerType}`);
}

/**
 * Handle ERC-20 transfer events
 */
export function handleERC20Transfer(event: any): void {
  const from = event.params.from.toHexString();
  const to = event.params.to.toHexString();
  const tokenAddress = event.address.toHexString();
  const amount = event.params.value;
  
  console.log(`ERC-20 Transfer: ${amount.toString()} ${tokenAddress} from ${from} to ${to}`);
}
