/* TypeScript file generated from Entities.res by genType. */

/* eslint-disable */
/* tslint:disable */

import type {AssetType_t as Enums_AssetType_t} from './Enums.gen';

import type {ExecutionStatus_t as Enums_ExecutionStatus_t} from './Enums.gen';

import type {ExecutionType_t as Enums_ExecutionType_t} from './Enums.gen';

import type {PermissionStatus_t as Enums_PermissionStatus_t} from './Enums.gen';

import type {TriggerType_t as Enums_TriggerType_t} from './Enums.gen';

import type {t as BigDecimal_t} from 'envio/src/bindings/BigDecimal.gen';

export type id = string;

export type whereOperations<entity,fieldType> = {
  readonly eq: (_1:fieldType) => Promise<entity[]>; 
  readonly gt: (_1:fieldType) => Promise<entity[]>; 
  readonly lt: (_1:fieldType) => Promise<entity[]>
};

export type Beneficiary_t = {
  readonly addedAt: bigint; 
  readonly address: string; 
  readonly allocatedAmount: bigint; 
  readonly id: id; 
  readonly name: (undefined | string); 
  readonly percentage: number; 
  readonly receivedAmount: bigint; 
  readonly vault_id: id
};

export type Beneficiary_indexedFieldOperations = { readonly vault_id: whereOperations<Beneficiary_t,id> };

export type BeneficiaryExecution_t = {
  readonly amount: bigint; 
  readonly beneficiaryAddress: string; 
  readonly error: (undefined | string); 
  readonly execution_id: id; 
  readonly id: id; 
  readonly status: Enums_ExecutionStatus_t; 
  readonly transactionHash: (undefined | string)
};

export type BeneficiaryExecution_indexedFieldOperations = { readonly execution_id: whereOperations<BeneficiaryExecution_t,id> };

export type Deposit_t = {
  readonly amount: bigint; 
  readonly assetType: Enums_AssetType_t; 
  readonly blockNumber: bigint; 
  readonly from: string; 
  readonly id: id; 
  readonly timestamp: bigint; 
  readonly tokenAddress: (undefined | string); 
  readonly transactionHash: string; 
  readonly vault_id: id
};

export type Deposit_indexedFieldOperations = { readonly vault_id: whereOperations<Deposit_t,id> };

export type Execution_t = {
  readonly beneficiariesPaid: number; 
  readonly blockNumber: bigint; 
  readonly executedAt: bigint; 
  readonly id: id; 
  readonly status: Enums_ExecutionStatus_t; 
  readonly successRate: BigDecimal_t; 
  readonly totalAmount: bigint; 
  readonly transactionHash: string; 
  readonly triggerType: Enums_TriggerType_t; 
  readonly vault_id: id
};

export type Execution_indexedFieldOperations = { readonly vault_id: whereOperations<Execution_t,id> };

export type Permission_t = {
  readonly agentAddress: string; 
  readonly expiresAt: bigint; 
  readonly grantedAt: bigint; 
  readonly id: id; 
  readonly lastUsed: (undefined | bigint); 
  readonly maxAmount: bigint; 
  readonly periodDuration: bigint; 
  readonly remainingAllowance: bigint; 
  readonly status: Enums_PermissionStatus_t; 
  readonly tokenType: Enums_AssetType_t; 
  readonly usageCount: number; 
  readonly vault_id: id
};

export type Permission_indexedFieldOperations = { readonly vault_id: whereOperations<Permission_t,id> };

export type TriggerEvent_t = {
  readonly blockNumber: bigint; 
  readonly id: id; 
  readonly metadata: (undefined | string); 
  readonly reason: (undefined | string); 
  readonly transactionHash: string; 
  readonly triggerType: Enums_TriggerType_t; 
  readonly triggeredAt: bigint; 
  readonly vault_id: id
};

export type TriggerEvent_indexedFieldOperations = {};

export type Vault_t = {
  readonly assetType: Enums_AssetType_t; 
  readonly balance: bigint; 
  readonly createdAt: bigint; 
  readonly id: id; 
  readonly isTriggered: boolean; 
  readonly lastActivity: bigint; 
  readonly name: string; 
  readonly owner: string; 
  readonly tokenAddress: (undefined | string); 
  readonly totalDeposited: bigint; 
  readonly totalWithdrawn: bigint; 
  readonly triggerTimestamp: (undefined | bigint); 
  readonly triggerType: Enums_TriggerType_t
};

export type Vault_indexedFieldOperations = {};

export type VaultStats_t = {
  readonly activePermissions: number; 
  readonly id: id; 
  readonly lastUpdated: bigint; 
  readonly successfulExecutions: number; 
  readonly totalDeposits: bigint; 
  readonly totalValueLocked: bigint; 
  readonly totalVaults: number; 
  readonly totalWithdrawals: bigint
};

export type VaultStats_indexedFieldOperations = {};

export type Withdrawal_t = {
  readonly amount: bigint; 
  readonly assetType: Enums_AssetType_t; 
  readonly blockNumber: bigint; 
  readonly executedBy: string; 
  readonly executionType: Enums_ExecutionType_t; 
  readonly id: id; 
  readonly permissionId: (undefined | string); 
  readonly timestamp: bigint; 
  readonly to: string; 
  readonly tokenAddress: (undefined | string); 
  readonly transactionHash: string; 
  readonly vault_id: id
};

export type Withdrawal_indexedFieldOperations = { readonly vault_id: whereOperations<Withdrawal_t,id> };
