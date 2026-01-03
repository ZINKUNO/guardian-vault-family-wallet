open Table
open Enums.EntityType
type id = string

type internalEntity = Internal.entity
module type Entity = {
  type t
  let index: int
  let name: string
  let schema: S.t<t>
  let rowsSchema: S.t<array<t>>
  let table: Table.table
  let entityHistory: EntityHistory.t<t>
}
external entityModToInternal: module(Entity with type t = 'a) => Internal.entityConfig = "%identity"
external entityModsToInternal: array<module(Entity)> => array<Internal.entityConfig> = "%identity"
external entitiesToInternal: array<'a> => array<Internal.entity> = "%identity"

@get
external getEntityId: internalEntity => string = "id"

// Use InMemoryTable.Entity.getEntityIdUnsafe instead of duplicating the logic
let getEntityIdUnsafe = InMemoryTable.Entity.getEntityIdUnsafe

//shorthand for punning
let isPrimaryKey = true
let isNullable = true
let isArray = true
let isIndex = true

@genType
type whereOperations<'entity, 'fieldType> = {
  eq: 'fieldType => promise<array<'entity>>,
  gt: 'fieldType => promise<array<'entity>>,
  lt: 'fieldType => promise<array<'entity>>
}

module Beneficiary = {
  let name = (Beneficiary :> string)
  let index = 0
  @genType
  type t = {
    addedAt: bigint,
    address: string,
    allocatedAmount: bigint,
    id: id,
    name: option<string>,
    percentage: int,
    receivedAmount: bigint,
    vault_id: id,
  }

  let schema = S.object((s): t => {
    addedAt: s.field("addedAt", BigInt.schema),
    address: s.field("address", S.string),
    allocatedAmount: s.field("allocatedAmount", BigInt.schema),
    id: s.field("id", S.string),
    name: s.field("name", S.null(S.string)),
    percentage: s.field("percentage", S.int),
    receivedAmount: s.field("receivedAmount", BigInt.schema),
    vault_id: s.field("vault_id", S.string),
  })

  let rowsSchema = S.array(schema)

  @genType
  type indexedFieldOperations = {
    
      @as("vault_id") vault_id: whereOperations<t, id>,
    
  }

  let table = mkTable(
    (name :> string),
    ~fields=[
      mkField(
      "addedAt", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "address", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "allocatedAmount", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "id", 
      Text,
      ~fieldSchema=S.string,
      ~isPrimaryKey,
      
      
      
      
      ),
      mkField(
      "name", 
      Text,
      ~fieldSchema=S.null(S.string),
      
      ~isNullable,
      
      
      
      ),
      mkField(
      "percentage", 
      Integer,
      ~fieldSchema=S.int,
      
      
      
      
      
      ),
      mkField(
      "receivedAmount", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "vault", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      ~linkedEntity="Vault",
      ),
    ],
  )

  let entityHistory = table->EntityHistory.fromTable(~schema, ~entityIndex=index)

  external castToInternal: t => Internal.entity = "%identity"
}

module BeneficiaryExecution = {
  let name = (BeneficiaryExecution :> string)
  let index = 1
  @genType
  type t = {
    amount: bigint,
    beneficiaryAddress: string,
    error: option<string>,
    execution_id: id,
    id: id,
    status: Enums.ExecutionStatus.t,
    transactionHash: option<string>,
  }

  let schema = S.object((s): t => {
    amount: s.field("amount", BigInt.schema),
    beneficiaryAddress: s.field("beneficiaryAddress", S.string),
    error: s.field("error", S.null(S.string)),
    execution_id: s.field("execution_id", S.string),
    id: s.field("id", S.string),
    status: s.field("status", Enums.ExecutionStatus.config.schema),
    transactionHash: s.field("transactionHash", S.null(S.string)),
  })

  let rowsSchema = S.array(schema)

  @genType
  type indexedFieldOperations = {
    
      @as("execution_id") execution_id: whereOperations<t, id>,
    
  }

  let table = mkTable(
    (name :> string),
    ~fields=[
      mkField(
      "amount", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "beneficiaryAddress", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "error", 
      Text,
      ~fieldSchema=S.null(S.string),
      
      ~isNullable,
      
      
      
      ),
      mkField(
      "execution", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      ~linkedEntity="Execution",
      ),
      mkField(
      "id", 
      Text,
      ~fieldSchema=S.string,
      ~isPrimaryKey,
      
      
      
      
      ),
      mkField(
      "status", 
      Custom(Enums.ExecutionStatus.config.name),
      ~fieldSchema=Enums.ExecutionStatus.config.schema,
      
      
      
      
      
      ),
      mkField(
      "transactionHash", 
      Text,
      ~fieldSchema=S.null(S.string),
      
      ~isNullable,
      
      
      
      ),
    ],
  )

  let entityHistory = table->EntityHistory.fromTable(~schema, ~entityIndex=index)

  external castToInternal: t => Internal.entity = "%identity"
}

module Deposit = {
  let name = (Deposit :> string)
  let index = 2
  @genType
  type t = {
    amount: bigint,
    assetType: Enums.AssetType.t,
    blockNumber: bigint,
    from: string,
    id: id,
    timestamp: bigint,
    tokenAddress: option<string>,
    transactionHash: string,
    vault_id: id,
  }

  let schema = S.object((s): t => {
    amount: s.field("amount", BigInt.schema),
    assetType: s.field("assetType", Enums.AssetType.config.schema),
    blockNumber: s.field("blockNumber", BigInt.schema),
    from: s.field("from", S.string),
    id: s.field("id", S.string),
    timestamp: s.field("timestamp", BigInt.schema),
    tokenAddress: s.field("tokenAddress", S.null(S.string)),
    transactionHash: s.field("transactionHash", S.string),
    vault_id: s.field("vault_id", S.string),
  })

  let rowsSchema = S.array(schema)

  @genType
  type indexedFieldOperations = {
    
      @as("vault_id") vault_id: whereOperations<t, id>,
    
  }

  let table = mkTable(
    (name :> string),
    ~fields=[
      mkField(
      "amount", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "assetType", 
      Custom(Enums.AssetType.config.name),
      ~fieldSchema=Enums.AssetType.config.schema,
      
      
      
      
      
      ),
      mkField(
      "blockNumber", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "from", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "id", 
      Text,
      ~fieldSchema=S.string,
      ~isPrimaryKey,
      
      
      
      
      ),
      mkField(
      "timestamp", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "tokenAddress", 
      Text,
      ~fieldSchema=S.null(S.string),
      
      ~isNullable,
      
      
      
      ),
      mkField(
      "transactionHash", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "vault", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      ~linkedEntity="Vault",
      ),
    ],
  )

  let entityHistory = table->EntityHistory.fromTable(~schema, ~entityIndex=index)

  external castToInternal: t => Internal.entity = "%identity"
}

module Execution = {
  let name = (Execution :> string)
  let index = 3
  @genType
  type t = {
    beneficiariesPaid: int,
    
    blockNumber: bigint,
    executedAt: bigint,
    id: id,
    status: Enums.ExecutionStatus.t,
    successRate: BigDecimal.t,
    totalAmount: bigint,
    transactionHash: string,
    triggerType: Enums.TriggerType.t,
    vault_id: id,
  }

  let schema = S.object((s): t => {
    beneficiariesPaid: s.field("beneficiariesPaid", S.int),
    
    blockNumber: s.field("blockNumber", BigInt.schema),
    executedAt: s.field("executedAt", BigInt.schema),
    id: s.field("id", S.string),
    status: s.field("status", Enums.ExecutionStatus.config.schema),
    successRate: s.field("successRate", BigDecimal.schema),
    totalAmount: s.field("totalAmount", BigInt.schema),
    transactionHash: s.field("transactionHash", S.string),
    triggerType: s.field("triggerType", Enums.TriggerType.config.schema),
    vault_id: s.field("vault_id", S.string),
  })

  let rowsSchema = S.array(schema)

  @genType
  type indexedFieldOperations = {
    
      @as("vault_id") vault_id: whereOperations<t, id>,
    
  }

  let table = mkTable(
    (name :> string),
    ~fields=[
      mkField(
      "beneficiariesPaid", 
      Integer,
      ~fieldSchema=S.int,
      
      
      
      
      
      ),
      mkField(
      "blockNumber", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "executedAt", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "id", 
      Text,
      ~fieldSchema=S.string,
      ~isPrimaryKey,
      
      
      
      
      ),
      mkField(
      "status", 
      Custom(Enums.ExecutionStatus.config.name),
      ~fieldSchema=Enums.ExecutionStatus.config.schema,
      
      
      
      
      
      ),
      mkField(
      "successRate", 
      Numeric,
      ~fieldSchema=BigDecimal.schema,
      
      
      
      
      
      ),
      mkField(
      "totalAmount", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "transactionHash", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "triggerType", 
      Custom(Enums.TriggerType.config.name),
      ~fieldSchema=Enums.TriggerType.config.schema,
      
      
      
      
      
      ),
      mkField(
      "vault", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      ~linkedEntity="Vault",
      ),
      mkDerivedFromField(
      "beneficiaryResults", 
      ~derivedFromEntity="BeneficiaryExecution",
      ~derivedFromField="execution",
      ),
    ],
  )

  let entityHistory = table->EntityHistory.fromTable(~schema, ~entityIndex=index)

  external castToInternal: t => Internal.entity = "%identity"
}

module Permission = {
  let name = (Permission :> string)
  let index = 4
  @genType
  type t = {
    agentAddress: string,
    expiresAt: bigint,
    grantedAt: bigint,
    id: id,
    lastUsed: option<bigint>,
    maxAmount: bigint,
    periodDuration: bigint,
    remainingAllowance: bigint,
    status: Enums.PermissionStatus.t,
    tokenType: Enums.AssetType.t,
    usageCount: int,
    vault_id: id,
  }

  let schema = S.object((s): t => {
    agentAddress: s.field("agentAddress", S.string),
    expiresAt: s.field("expiresAt", BigInt.schema),
    grantedAt: s.field("grantedAt", BigInt.schema),
    id: s.field("id", S.string),
    lastUsed: s.field("lastUsed", S.null(BigInt.schema)),
    maxAmount: s.field("maxAmount", BigInt.schema),
    periodDuration: s.field("periodDuration", BigInt.schema),
    remainingAllowance: s.field("remainingAllowance", BigInt.schema),
    status: s.field("status", Enums.PermissionStatus.config.schema),
    tokenType: s.field("tokenType", Enums.AssetType.config.schema),
    usageCount: s.field("usageCount", S.int),
    vault_id: s.field("vault_id", S.string),
  })

  let rowsSchema = S.array(schema)

  @genType
  type indexedFieldOperations = {
    
      @as("vault_id") vault_id: whereOperations<t, id>,
    
  }

  let table = mkTable(
    (name :> string),
    ~fields=[
      mkField(
      "agentAddress", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "expiresAt", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "grantedAt", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "id", 
      Text,
      ~fieldSchema=S.string,
      ~isPrimaryKey,
      
      
      
      
      ),
      mkField(
      "lastUsed", 
      Numeric,
      ~fieldSchema=S.null(BigInt.schema),
      
      ~isNullable,
      
      
      
      ),
      mkField(
      "maxAmount", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "periodDuration", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "remainingAllowance", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "status", 
      Custom(Enums.PermissionStatus.config.name),
      ~fieldSchema=Enums.PermissionStatus.config.schema,
      
      
      
      
      
      ),
      mkField(
      "tokenType", 
      Custom(Enums.AssetType.config.name),
      ~fieldSchema=Enums.AssetType.config.schema,
      
      
      
      
      
      ),
      mkField(
      "usageCount", 
      Integer,
      ~fieldSchema=S.int,
      
      
      
      
      
      ),
      mkField(
      "vault", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      ~linkedEntity="Vault",
      ),
    ],
  )

  let entityHistory = table->EntityHistory.fromTable(~schema, ~entityIndex=index)

  external castToInternal: t => Internal.entity = "%identity"
}

module TriggerEvent = {
  let name = (TriggerEvent :> string)
  let index = 5
  @genType
  type t = {
    blockNumber: bigint,
    id: id,
    metadata: option<string>,
    reason: option<string>,
    transactionHash: string,
    triggerType: Enums.TriggerType.t,
    triggeredAt: bigint,
    vault_id: id,
  }

  let schema = S.object((s): t => {
    blockNumber: s.field("blockNumber", BigInt.schema),
    id: s.field("id", S.string),
    metadata: s.field("metadata", S.null(S.string)),
    reason: s.field("reason", S.null(S.string)),
    transactionHash: s.field("transactionHash", S.string),
    triggerType: s.field("triggerType", Enums.TriggerType.config.schema),
    triggeredAt: s.field("triggeredAt", BigInt.schema),
    vault_id: s.field("vault_id", S.string),
  })

  let rowsSchema = S.array(schema)

  @genType
  type indexedFieldOperations = {
    
  }

  let table = mkTable(
    (name :> string),
    ~fields=[
      mkField(
      "blockNumber", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "id", 
      Text,
      ~fieldSchema=S.string,
      ~isPrimaryKey,
      
      
      
      
      ),
      mkField(
      "metadata", 
      Text,
      ~fieldSchema=S.null(S.string),
      
      ~isNullable,
      
      
      
      ),
      mkField(
      "reason", 
      Text,
      ~fieldSchema=S.null(S.string),
      
      ~isNullable,
      
      
      
      ),
      mkField(
      "transactionHash", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "triggerType", 
      Custom(Enums.TriggerType.config.name),
      ~fieldSchema=Enums.TriggerType.config.schema,
      
      
      
      
      
      ),
      mkField(
      "triggeredAt", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "vault", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      ~linkedEntity="Vault",
      ),
    ],
  )

  let entityHistory = table->EntityHistory.fromTable(~schema, ~entityIndex=index)

  external castToInternal: t => Internal.entity = "%identity"
}

module Vault = {
  let name = (Vault :> string)
  let index = 6
  @genType
  type t = {
    assetType: Enums.AssetType.t,
    balance: bigint,
    
    createdAt: bigint,
    
    
    id: id,
    isTriggered: bool,
    lastActivity: bigint,
    name: string,
    owner: string,
    
    tokenAddress: option<string>,
    totalDeposited: bigint,
    totalWithdrawn: bigint,
    triggerTimestamp: option<bigint>,
    triggerType: Enums.TriggerType.t,
    
  }

  let schema = S.object((s): t => {
    assetType: s.field("assetType", Enums.AssetType.config.schema),
    balance: s.field("balance", BigInt.schema),
    
    createdAt: s.field("createdAt", BigInt.schema),
    
    
    id: s.field("id", S.string),
    isTriggered: s.field("isTriggered", S.bool),
    lastActivity: s.field("lastActivity", BigInt.schema),
    name: s.field("name", S.string),
    owner: s.field("owner", S.string),
    
    tokenAddress: s.field("tokenAddress", S.null(S.string)),
    totalDeposited: s.field("totalDeposited", BigInt.schema),
    totalWithdrawn: s.field("totalWithdrawn", BigInt.schema),
    triggerTimestamp: s.field("triggerTimestamp", S.null(BigInt.schema)),
    triggerType: s.field("triggerType", Enums.TriggerType.config.schema),
    
  })

  let rowsSchema = S.array(schema)

  @genType
  type indexedFieldOperations = {
    
  }

  let table = mkTable(
    (name :> string),
    ~fields=[
      mkField(
      "assetType", 
      Custom(Enums.AssetType.config.name),
      ~fieldSchema=Enums.AssetType.config.schema,
      
      
      
      
      
      ),
      mkField(
      "balance", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "createdAt", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "id", 
      Text,
      ~fieldSchema=S.string,
      ~isPrimaryKey,
      
      
      
      
      ),
      mkField(
      "isTriggered", 
      Boolean,
      ~fieldSchema=S.bool,
      
      
      
      
      
      ),
      mkField(
      "lastActivity", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "name", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "owner", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "tokenAddress", 
      Text,
      ~fieldSchema=S.null(S.string),
      
      ~isNullable,
      
      
      
      ),
      mkField(
      "totalDeposited", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "totalWithdrawn", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "triggerTimestamp", 
      Numeric,
      ~fieldSchema=S.null(BigInt.schema),
      
      ~isNullable,
      
      
      
      ),
      mkField(
      "triggerType", 
      Custom(Enums.TriggerType.config.name),
      ~fieldSchema=Enums.TriggerType.config.schema,
      
      
      
      
      
      ),
      mkDerivedFromField(
      "beneficiaries", 
      ~derivedFromEntity="Beneficiary",
      ~derivedFromField="vault",
      ),
      mkDerivedFromField(
      "deposits", 
      ~derivedFromEntity="Deposit",
      ~derivedFromField="vault",
      ),
      mkDerivedFromField(
      "executions", 
      ~derivedFromEntity="Execution",
      ~derivedFromField="vault",
      ),
      mkDerivedFromField(
      "permissions", 
      ~derivedFromEntity="Permission",
      ~derivedFromField="vault",
      ),
      mkDerivedFromField(
      "withdrawals", 
      ~derivedFromEntity="Withdrawal",
      ~derivedFromField="vault",
      ),
    ],
  )

  let entityHistory = table->EntityHistory.fromTable(~schema, ~entityIndex=index)

  external castToInternal: t => Internal.entity = "%identity"
}

module VaultStats = {
  let name = (VaultStats :> string)
  let index = 7
  @genType
  type t = {
    activePermissions: int,
    id: id,
    lastUpdated: bigint,
    successfulExecutions: int,
    totalDeposits: bigint,
    totalValueLocked: bigint,
    totalVaults: int,
    totalWithdrawals: bigint,
  }

  let schema = S.object((s): t => {
    activePermissions: s.field("activePermissions", S.int),
    id: s.field("id", S.string),
    lastUpdated: s.field("lastUpdated", BigInt.schema),
    successfulExecutions: s.field("successfulExecutions", S.int),
    totalDeposits: s.field("totalDeposits", BigInt.schema),
    totalValueLocked: s.field("totalValueLocked", BigInt.schema),
    totalVaults: s.field("totalVaults", S.int),
    totalWithdrawals: s.field("totalWithdrawals", BigInt.schema),
  })

  let rowsSchema = S.array(schema)

  @genType
  type indexedFieldOperations = {
    
  }

  let table = mkTable(
    (name :> string),
    ~fields=[
      mkField(
      "activePermissions", 
      Integer,
      ~fieldSchema=S.int,
      
      
      
      
      
      ),
      mkField(
      "id", 
      Text,
      ~fieldSchema=S.string,
      ~isPrimaryKey,
      
      
      
      
      ),
      mkField(
      "lastUpdated", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "successfulExecutions", 
      Integer,
      ~fieldSchema=S.int,
      
      
      
      
      
      ),
      mkField(
      "totalDeposits", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "totalValueLocked", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "totalVaults", 
      Integer,
      ~fieldSchema=S.int,
      
      
      
      
      
      ),
      mkField(
      "totalWithdrawals", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
    ],
  )

  let entityHistory = table->EntityHistory.fromTable(~schema, ~entityIndex=index)

  external castToInternal: t => Internal.entity = "%identity"
}

module Withdrawal = {
  let name = (Withdrawal :> string)
  let index = 8
  @genType
  type t = {
    amount: bigint,
    assetType: Enums.AssetType.t,
    blockNumber: bigint,
    executedBy: string,
    executionType: Enums.ExecutionType.t,
    id: id,
    permissionId: option<string>,
    timestamp: bigint,
    to: string,
    tokenAddress: option<string>,
    transactionHash: string,
    vault_id: id,
  }

  let schema = S.object((s): t => {
    amount: s.field("amount", BigInt.schema),
    assetType: s.field("assetType", Enums.AssetType.config.schema),
    blockNumber: s.field("blockNumber", BigInt.schema),
    executedBy: s.field("executedBy", S.string),
    executionType: s.field("executionType", Enums.ExecutionType.config.schema),
    id: s.field("id", S.string),
    permissionId: s.field("permissionId", S.null(S.string)),
    timestamp: s.field("timestamp", BigInt.schema),
    to: s.field("to", S.string),
    tokenAddress: s.field("tokenAddress", S.null(S.string)),
    transactionHash: s.field("transactionHash", S.string),
    vault_id: s.field("vault_id", S.string),
  })

  let rowsSchema = S.array(schema)

  @genType
  type indexedFieldOperations = {
    
      @as("vault_id") vault_id: whereOperations<t, id>,
    
  }

  let table = mkTable(
    (name :> string),
    ~fields=[
      mkField(
      "amount", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "assetType", 
      Custom(Enums.AssetType.config.name),
      ~fieldSchema=Enums.AssetType.config.schema,
      
      
      
      
      
      ),
      mkField(
      "blockNumber", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "executedBy", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "executionType", 
      Custom(Enums.ExecutionType.config.name),
      ~fieldSchema=Enums.ExecutionType.config.schema,
      
      
      
      
      
      ),
      mkField(
      "id", 
      Text,
      ~fieldSchema=S.string,
      ~isPrimaryKey,
      
      
      
      
      ),
      mkField(
      "permissionId", 
      Text,
      ~fieldSchema=S.null(S.string),
      
      ~isNullable,
      
      
      
      ),
      mkField(
      "timestamp", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "to", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "tokenAddress", 
      Text,
      ~fieldSchema=S.null(S.string),
      
      ~isNullable,
      
      
      
      ),
      mkField(
      "transactionHash", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "vault", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      ~linkedEntity="Vault",
      ),
    ],
  )

  let entityHistory = table->EntityHistory.fromTable(~schema, ~entityIndex=index)

  external castToInternal: t => Internal.entity = "%identity"
}

let userEntities = [
  module(Beneficiary),
  module(BeneficiaryExecution),
  module(Deposit),
  module(Execution),
  module(Permission),
  module(TriggerEvent),
  module(Vault),
  module(VaultStats),
  module(Withdrawal),
]->entityModsToInternal

let allEntities =
  userEntities->Js.Array2.concat(
    [module(InternalTable.DynamicContractRegistry)]->entityModsToInternal,
  )

let byName =
  allEntities
  ->Js.Array2.map(entityConfig => {
    (entityConfig.name, entityConfig)
  })
  ->Js.Dict.fromArray
