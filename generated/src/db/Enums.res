module ContractType = {
  @genType
  type t = 
    | @as("GuardianVault") GuardianVault
    | @as("USDC") USDC
    | @as("WETH") WETH

  let name = "CONTRACT_TYPE"
  let variants = [
    GuardianVault,
    USDC,
    WETH,
  ]
  let config = Internal.makeEnumConfig(~name, ~variants)
}

module EntityType = {
  @genType
  type t = 
    | @as("Beneficiary") Beneficiary
    | @as("BeneficiaryExecution") BeneficiaryExecution
    | @as("Deposit") Deposit
    | @as("Execution") Execution
    | @as("Permission") Permission
    | @as("TriggerEvent") TriggerEvent
    | @as("Vault") Vault
    | @as("VaultStats") VaultStats
    | @as("Withdrawal") Withdrawal
    | @as("dynamic_contract_registry") DynamicContractRegistry

  let name = "ENTITY_TYPE"
  let variants = [
    Beneficiary,
    BeneficiaryExecution,
    Deposit,
    Execution,
    Permission,
    TriggerEvent,
    Vault,
    VaultStats,
    Withdrawal,
    DynamicContractRegistry,
  ]
  let config = Internal.makeEnumConfig(~name, ~variants)
}

module AssetType = {
  @genType
  type t = 
    | @as("ETH") ETH
    | @as("USDC") USDC
    | @as("WETH") WETH
    | @as("ERC20") ERC20

  let name = "AssetType"
  let variants = [
    ETH,
    USDC,
    WETH,
    ERC20,
  ]
  let config = Internal.makeEnumConfig(~name, ~variants)
}

module ExecutionStatus = {
  @genType
  type t = 
    | @as("SUCCESS") SUCCESS
    | @as("FAILED") FAILED
    | @as("PENDING") PENDING

  let name = "ExecutionStatus"
  let variants = [
    SUCCESS,
    FAILED,
    PENDING,
  ]
  let config = Internal.makeEnumConfig(~name, ~variants)
}

module ExecutionType = {
  @genType
  type t = 
    | @as("AUTO") AUTO
    | @as("MANUAL") MANUAL
    | @as("EMERGENCY") EMERGENCY

  let name = "ExecutionType"
  let variants = [
    AUTO,
    MANUAL,
    EMERGENCY,
  ]
  let config = Internal.makeEnumConfig(~name, ~variants)
}

module PermissionStatus = {
  @genType
  type t = 
    | @as("ACTIVE") ACTIVE
    | @as("REVOKED") REVOKED
    | @as("EXPIRED") EXPIRED
    | @as("USED_UP") USED_UP

  let name = "PermissionStatus"
  let variants = [
    ACTIVE,
    REVOKED,
    EXPIRED,
    USED_UP,
  ]
  let config = Internal.makeEnumConfig(~name, ~variants)
}

module TriggerType = {
  @genType
  type t = 
    | @as("TIME") TIME
    | @as("MANUAL") MANUAL
    | @as("ORACLE") ORACLE

  let name = "TriggerType"
  let variants = [
    TIME,
    MANUAL,
    ORACLE,
  ]
  let config = Internal.makeEnumConfig(~name, ~variants)
}

let allEnums = ([
  ContractType.config->Internal.fromGenericEnumConfig,
  EntityType.config->Internal.fromGenericEnumConfig,
  AssetType.config->Internal.fromGenericEnumConfig,
  ExecutionStatus.config->Internal.fromGenericEnumConfig,
  ExecutionType.config->Internal.fromGenericEnumConfig,
  PermissionStatus.config->Internal.fromGenericEnumConfig,
  TriggerType.config->Internal.fromGenericEnumConfig,
])
