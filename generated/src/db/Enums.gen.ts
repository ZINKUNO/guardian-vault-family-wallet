/* TypeScript file generated from Enums.res by genType. */

/* eslint-disable */
/* tslint:disable */

export type ContractType_t = "GuardianVault" | "USDC" | "WETH";

export type EntityType_t = 
    "Beneficiary"
  | "BeneficiaryExecution"
  | "Deposit"
  | "Execution"
  | "Permission"
  | "TriggerEvent"
  | "Vault"
  | "VaultStats"
  | "Withdrawal"
  | "dynamic_contract_registry";

export type AssetType_t = "ETH" | "USDC" | "WETH" | "ERC20";

export type ExecutionStatus_t = "SUCCESS" | "FAILED" | "PENDING";

export type ExecutionType_t = "AUTO" | "MANUAL" | "EMERGENCY";

export type PermissionStatus_t = "ACTIVE" | "REVOKED" | "EXPIRED" | "USED_UP";

export type TriggerType_t = "TIME" | "MANUAL" | "ORACLE";
