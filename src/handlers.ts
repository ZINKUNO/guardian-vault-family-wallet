import * as Generated from "../generated/src/Handlers.res.js";
const { GuardianVault, USDC, WETH } = Generated as any;

// Constants
const GLOBAL_STATS_ID = "global";

// Helper to update global stats
async function updateGlobalStats(context: any, depositAmount: bigint = 0n, withdrawalAmount: bigint = 0n) {
  let stats = await context.VaultStats.get(GLOBAL_STATS_ID);

  if (!stats) {
    stats = {
      id: GLOBAL_STATS_ID,
      totalVaults: 0,
      totalValueLocked: 0n,
      totalDeposits: 0n,
      totalWithdrawals: 0n,
      activePermissions: 0,
      successfulExecutions: 0,
      lastUpdated: 0n
    };
  } else {
    stats = {
      ...stats,
      totalDeposits: stats.totalDeposits + depositAmount,
      totalWithdrawals: stats.totalWithdrawals + withdrawalAmount,
      totalValueLocked: stats.totalValueLocked + depositAmount - withdrawalAmount,
    };
  }

  // Ensure TVL doesn't go negative
  if (stats.totalValueLocked < 0n) {
    stats = { ...stats, totalValueLocked: 0n };
  }

  context.VaultStats.set(stats);
}

GuardianVault.Deposit.handler(async ({ event, context }: any) => {
  const vaultAddress = event.srcAddress;
  const amount = event.params.amount;
  const sender = event.params.sender;
  const timestamp = BigInt(event.block.timestamp);

  // Update Vault
  let vault = await context.Vault.get(vaultAddress);

  if (!vault) {
    vault = {
      id: vaultAddress,
      name: "Guardian Vault",
      owner: sender,
      createdAt: timestamp,
      balance: amount,
      assetType: "ETH",
      tokenAddress: undefined,
      triggerType: "TIME",
      triggerTimestamp: undefined,
      isTriggered: false,
      totalDeposited: amount,
      totalWithdrawn: 0n,
      lastActivity: timestamp
    };

    let stats = await context.VaultStats.get(GLOBAL_STATS_ID);
    if (stats) {
      context.VaultStats.set({
        ...stats,
        totalVaults: stats.totalVaults + 1
      });
    }
  } else {
    vault = {
      ...vault,
      balance: vault.balance + amount,
      totalDeposited: vault.totalDeposited + amount,
      lastActivity: timestamp
    };
  }

  context.Vault.set(vault);

  // Create Deposit entity
  const depositId = `${event.transaction.hash}-${event.logIndex}`;
  context.Deposit.set({
    id: depositId,
    vault_id: vaultAddress,
    from: sender,
    amount: amount,
    assetType: "ETH",
    tokenAddress: undefined,
    timestamp: timestamp,
    transactionHash: event.transaction.hash,
    blockNumber: BigInt(event.block.number)
  });

  // Update Global Stats
  await updateGlobalStats(context, amount, 0n);
});

GuardianVault.Withdrawal.handler(async ({ event, context }: any) => {
  const vaultAddress = event.srcAddress;
  const amount = event.params.amount;
  const recipient = event.params.recipient;
  const timestamp = BigInt(event.block.timestamp);

  // Update Vault
  let vault = await context.Vault.get(vaultAddress);

  if (vault) {
    vault = {
      ...vault,
      balance: vault.balance - amount,
      totalWithdrawn: vault.totalWithdrawn + amount,
      lastActivity: timestamp
    };
    context.Vault.set(vault);
  }

  // Create Withdrawal entity
  const withdrawalId = `${event.transaction.hash}-${event.logIndex}`;
  context.Withdrawal.set({
    id: withdrawalId,
    vault_id: vaultAddress,
    to: recipient,
    amount: amount,
    assetType: "ETH",
    tokenAddress: undefined,
    timestamp: timestamp,
    transactionHash: event.transaction.hash,
    blockNumber: BigInt(event.block.number),
    executedBy: event.transaction.from || "",
    executionType: "MANUAL",
    permissionId: undefined
  });

  // Update Global Stats
  await updateGlobalStats(context, 0n, amount);
});

GuardianVault.BeneficiaryAdded.handler(async ({ event, context }: any) => {
  const vaultAddress = event.srcAddress;
  const beneficiaryAddress = event.params.beneficiary;
  const percentage = Number(event.params.percentage);
  const timestamp = BigInt(event.block.timestamp);

  const beneficiaryId = `${vaultAddress}-${beneficiaryAddress}`;

  context.Beneficiary.set({
    id: beneficiaryId,
    vault_id: vaultAddress,
    address: beneficiaryAddress,
    name: undefined,
    percentage: percentage,
    allocatedAmount: 0n,
    receivedAmount: 0n,
    addedAt: timestamp
  });
});

GuardianVault.TriggerActivated.handler(async ({ event, context }: any) => {
  const vaultAddress = event.srcAddress;
  const timestamp = BigInt(event.block.timestamp);

  let vault = await context.Vault.get(vaultAddress);
  if (vault) {
    vault = {
      ...vault,
      isTriggered: true
    };
    context.Vault.set(vault);
  }

  const triggerId = `${event.transaction.hash}-${event.logIndex}`;
  context.TriggerEvent.set({
    id: triggerId,
    vault_id: vaultAddress,
    triggerType: "MANUAL",
    triggeredAt: timestamp,
    transactionHash: event.transaction.hash,
    blockNumber: BigInt(event.block.number),
    reason: "Trigger activated on-chain",
    metadata: undefined
  });
});

// ERC20 Handlers
const handleERC20Transfer = async (event: any, context: any, tokenType: string) => {
  const tokenAddress = event.srcAddress;
  const from = event.params.from;
  const to = event.params.to;
  const value = event.params.value;
  const timestamp = BigInt(event.block.timestamp);

  // Check if 'to' is a known vault
  let vault = await context.Vault.get(to);
  if (vault) {
    if (vault.assetType === tokenType) {
      vault = {
        ...vault,
        balance: vault.balance + value,
        totalDeposited: vault.totalDeposited + value,
        lastActivity: timestamp
      };
      context.Vault.set(vault);

      const depositId = `${event.transaction.hash}-${event.logIndex}`;
      context.Deposit.set({
        id: depositId,
        vault_id: to,
        from: from,
        amount: value,
        assetType: tokenType,
        tokenAddress: tokenAddress,
        timestamp: timestamp,
        transactionHash: event.transaction.hash,
        blockNumber: BigInt(event.block.number)
      });
    }
  }

  // Check if 'from' is a known vault
  vault = await context.Vault.get(from);
  if (vault) {
    if (vault.assetType === tokenType) {
      vault = {
        ...vault,
        balance: vault.balance - value,
        totalWithdrawn: vault.totalWithdrawn + value,
        lastActivity: timestamp
      };
      context.Vault.set(vault);

      const withdrawalId = `${event.transaction.hash}-${event.logIndex}`;
      context.Withdrawal.set({
        id: withdrawalId,
        vault_id: from,
        to: to,
        amount: value,
        assetType: tokenType,
        tokenAddress: tokenAddress,
        timestamp: timestamp,
        transactionHash: event.transaction.hash,
        blockNumber: BigInt(event.block.number),
        executedBy: event.transaction.from || "",
        executionType: "MANUAL",
        permissionId: undefined
      });
    }
  }
};

USDC.Transfer.handler(async ({ event, context }: any) => {
  await handleERC20Transfer(event, context, "USDC");
});

WETH.Transfer.handler(async ({ event, context }: any) => {
  await handleERC20Transfer(event, context, "WETH");
});
