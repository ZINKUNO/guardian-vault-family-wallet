/* TypeScript file generated from Types.res by genType. */

/* eslint-disable */
/* tslint:disable */

import type {BeneficiaryExecution_t as Entities_BeneficiaryExecution_t} from '../src/db/Entities.gen';

import type {Beneficiary_t as Entities_Beneficiary_t} from '../src/db/Entities.gen';

import type {Deposit_t as Entities_Deposit_t} from '../src/db/Entities.gen';

import type {Execution_t as Entities_Execution_t} from '../src/db/Entities.gen';

import type {HandlerContext as $$handlerContext} from './Types.ts';

import type {HandlerWithOptions as $$fnWithEventConfig} from './bindings/OpaqueTypes.ts';

import type {LoaderContext as $$loaderContext} from './Types.ts';

import type {Permission_t as Entities_Permission_t} from '../src/db/Entities.gen';

import type {SingleOrMultiple as $$SingleOrMultiple_t} from './bindings/OpaqueTypes';

import type {TriggerEvent_t as Entities_TriggerEvent_t} from '../src/db/Entities.gen';

import type {VaultStats_t as Entities_VaultStats_t} from '../src/db/Entities.gen';

import type {Vault_t as Entities_Vault_t} from '../src/db/Entities.gen';

import type {Withdrawal_t as Entities_Withdrawal_t} from '../src/db/Entities.gen';

import type {entityHandlerContext as Internal_entityHandlerContext} from 'envio/src/Internal.gen';

import type {eventOptions as Internal_eventOptions} from 'envio/src/Internal.gen';

import type {genericContractRegisterArgs as Internal_genericContractRegisterArgs} from 'envio/src/Internal.gen';

import type {genericContractRegister as Internal_genericContractRegister} from 'envio/src/Internal.gen';

import type {genericEvent as Internal_genericEvent} from 'envio/src/Internal.gen';

import type {genericHandlerArgs as Internal_genericHandlerArgs} from 'envio/src/Internal.gen';

import type {genericHandlerWithLoader as Internal_genericHandlerWithLoader} from 'envio/src/Internal.gen';

import type {genericHandler as Internal_genericHandler} from 'envio/src/Internal.gen';

import type {genericLoaderArgs as Internal_genericLoaderArgs} from 'envio/src/Internal.gen';

import type {genericLoader as Internal_genericLoader} from 'envio/src/Internal.gen';

import type {logger as Envio_logger} from 'envio/src/Envio.gen';

import type {noEventFilters as Internal_noEventFilters} from 'envio/src/Internal.gen';

import type {t as Address_t} from 'envio/src/Address.gen';

export type id = string;
export type Id = id;

export type contractRegistrations = {
  readonly log: Envio_logger; 
  readonly addGuardianVault: (_1:Address_t) => void; 
  readonly addUSDC: (_1:Address_t) => void; 
  readonly addWETH: (_1:Address_t) => void
};

export type entityLoaderContext<entity,indexedFieldOperations> = {
  readonly get: (_1:id) => Promise<(undefined | entity)>; 
  readonly getOrThrow: (_1:id, message:(undefined | string)) => Promise<entity>; 
  readonly getWhere: indexedFieldOperations; 
  readonly getOrCreate: (_1:entity) => Promise<entity>; 
  readonly set: (_1:entity) => void; 
  readonly deleteUnsafe: (_1:id) => void
};

export type loaderContext = $$loaderContext;

export type entityHandlerContext<entity> = Internal_entityHandlerContext<entity>;

export type handlerContext = $$handlerContext;

export type beneficiary = Entities_Beneficiary_t;
export type Beneficiary = beneficiary;

export type beneficiaryExecution = Entities_BeneficiaryExecution_t;
export type BeneficiaryExecution = beneficiaryExecution;

export type deposit = Entities_Deposit_t;
export type Deposit = deposit;

export type execution = Entities_Execution_t;
export type Execution = execution;

export type permission = Entities_Permission_t;
export type Permission = permission;

export type triggerEvent = Entities_TriggerEvent_t;
export type TriggerEvent = triggerEvent;

export type vault = Entities_Vault_t;
export type Vault = vault;

export type vaultStats = Entities_VaultStats_t;
export type VaultStats = vaultStats;

export type withdrawal = Entities_Withdrawal_t;
export type Withdrawal = withdrawal;

export type Transaction_t = { readonly hash: string; readonly from: (undefined | Address_t) };

export type Block_t = {
  readonly number: number; 
  readonly timestamp: number; 
  readonly hash: string
};

export type AggregatedBlock_t = {
  readonly hash: string; 
  readonly number: number; 
  readonly timestamp: number
};

export type AggregatedTransaction_t = { readonly from: (undefined | Address_t); readonly hash: string };

export type eventLog<params> = Internal_genericEvent<params,Block_t,Transaction_t>;
export type EventLog<params> = eventLog<params>;

export type SingleOrMultiple_t<a> = $$SingleOrMultiple_t<a>;

export type HandlerTypes_args<eventArgs,context> = { readonly event: eventLog<eventArgs>; readonly context: context };

export type HandlerTypes_contractRegisterArgs<eventArgs> = Internal_genericContractRegisterArgs<eventLog<eventArgs>,contractRegistrations>;

export type HandlerTypes_contractRegister<eventArgs> = Internal_genericContractRegister<HandlerTypes_contractRegisterArgs<eventArgs>>;

export type HandlerTypes_loaderArgs<eventArgs> = Internal_genericLoaderArgs<eventLog<eventArgs>,loaderContext>;

export type HandlerTypes_loader<eventArgs,loaderReturn> = Internal_genericLoader<HandlerTypes_loaderArgs<eventArgs>,loaderReturn>;

export type HandlerTypes_handlerArgs<eventArgs,loaderReturn> = Internal_genericHandlerArgs<eventLog<eventArgs>,handlerContext,loaderReturn>;

export type HandlerTypes_handler<eventArgs,loaderReturn> = Internal_genericHandler<HandlerTypes_handlerArgs<eventArgs,loaderReturn>>;

export type HandlerTypes_loaderHandler<eventArgs,loaderReturn,eventFilters> = Internal_genericHandlerWithLoader<HandlerTypes_loader<eventArgs,loaderReturn>,HandlerTypes_handler<eventArgs,loaderReturn>,eventFilters>;

export type HandlerTypes_eventConfig<eventFilters> = Internal_eventOptions<eventFilters>;

export type fnWithEventConfig<fn,eventConfig> = $$fnWithEventConfig<fn,eventConfig>;

export type handlerWithOptions<eventArgs,loaderReturn,eventFilters> = fnWithEventConfig<HandlerTypes_handler<eventArgs,loaderReturn>,HandlerTypes_eventConfig<eventFilters>>;

export type contractRegisterWithOptions<eventArgs,eventFilters> = fnWithEventConfig<HandlerTypes_contractRegister<eventArgs>,HandlerTypes_eventConfig<eventFilters>>;

export type GuardianVault_chainId = 11155111;

export type GuardianVault_Deposit_eventArgs = { readonly sender: Address_t; readonly amount: bigint };

export type GuardianVault_Deposit_block = Block_t;

export type GuardianVault_Deposit_transaction = Transaction_t;

export type GuardianVault_Deposit_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: GuardianVault_Deposit_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: GuardianVault_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: GuardianVault_Deposit_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: GuardianVault_Deposit_block
};

export type GuardianVault_Deposit_loaderArgs = Internal_genericLoaderArgs<GuardianVault_Deposit_event,loaderContext>;

export type GuardianVault_Deposit_loader<loaderReturn> = Internal_genericLoader<GuardianVault_Deposit_loaderArgs,loaderReturn>;

export type GuardianVault_Deposit_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<GuardianVault_Deposit_event,handlerContext,loaderReturn>;

export type GuardianVault_Deposit_handler<loaderReturn> = Internal_genericHandler<GuardianVault_Deposit_handlerArgs<loaderReturn>>;

export type GuardianVault_Deposit_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<GuardianVault_Deposit_event,contractRegistrations>>;

export type GuardianVault_Deposit_eventFilter = { readonly sender?: SingleOrMultiple_t<Address_t> };

export type GuardianVault_Deposit_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: GuardianVault_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type GuardianVault_Deposit_eventFiltersDefinition = 
    GuardianVault_Deposit_eventFilter
  | GuardianVault_Deposit_eventFilter[];

export type GuardianVault_Deposit_eventFilters = 
    GuardianVault_Deposit_eventFilter
  | GuardianVault_Deposit_eventFilter[]
  | ((_1:GuardianVault_Deposit_eventFiltersArgs) => GuardianVault_Deposit_eventFiltersDefinition);

export type GuardianVault_Withdrawal_eventArgs = { readonly recipient: Address_t; readonly amount: bigint };

export type GuardianVault_Withdrawal_block = Block_t;

export type GuardianVault_Withdrawal_transaction = Transaction_t;

export type GuardianVault_Withdrawal_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: GuardianVault_Withdrawal_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: GuardianVault_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: GuardianVault_Withdrawal_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: GuardianVault_Withdrawal_block
};

export type GuardianVault_Withdrawal_loaderArgs = Internal_genericLoaderArgs<GuardianVault_Withdrawal_event,loaderContext>;

export type GuardianVault_Withdrawal_loader<loaderReturn> = Internal_genericLoader<GuardianVault_Withdrawal_loaderArgs,loaderReturn>;

export type GuardianVault_Withdrawal_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<GuardianVault_Withdrawal_event,handlerContext,loaderReturn>;

export type GuardianVault_Withdrawal_handler<loaderReturn> = Internal_genericHandler<GuardianVault_Withdrawal_handlerArgs<loaderReturn>>;

export type GuardianVault_Withdrawal_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<GuardianVault_Withdrawal_event,contractRegistrations>>;

export type GuardianVault_Withdrawal_eventFilter = { readonly recipient?: SingleOrMultiple_t<Address_t> };

export type GuardianVault_Withdrawal_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: GuardianVault_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type GuardianVault_Withdrawal_eventFiltersDefinition = 
    GuardianVault_Withdrawal_eventFilter
  | GuardianVault_Withdrawal_eventFilter[];

export type GuardianVault_Withdrawal_eventFilters = 
    GuardianVault_Withdrawal_eventFilter
  | GuardianVault_Withdrawal_eventFilter[]
  | ((_1:GuardianVault_Withdrawal_eventFiltersArgs) => GuardianVault_Withdrawal_eventFiltersDefinition);

export type GuardianVault_BeneficiaryAdded_eventArgs = { readonly beneficiary: Address_t; readonly percentage: bigint };

export type GuardianVault_BeneficiaryAdded_block = Block_t;

export type GuardianVault_BeneficiaryAdded_transaction = Transaction_t;

export type GuardianVault_BeneficiaryAdded_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: GuardianVault_BeneficiaryAdded_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: GuardianVault_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: GuardianVault_BeneficiaryAdded_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: GuardianVault_BeneficiaryAdded_block
};

export type GuardianVault_BeneficiaryAdded_loaderArgs = Internal_genericLoaderArgs<GuardianVault_BeneficiaryAdded_event,loaderContext>;

export type GuardianVault_BeneficiaryAdded_loader<loaderReturn> = Internal_genericLoader<GuardianVault_BeneficiaryAdded_loaderArgs,loaderReturn>;

export type GuardianVault_BeneficiaryAdded_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<GuardianVault_BeneficiaryAdded_event,handlerContext,loaderReturn>;

export type GuardianVault_BeneficiaryAdded_handler<loaderReturn> = Internal_genericHandler<GuardianVault_BeneficiaryAdded_handlerArgs<loaderReturn>>;

export type GuardianVault_BeneficiaryAdded_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<GuardianVault_BeneficiaryAdded_event,contractRegistrations>>;

export type GuardianVault_BeneficiaryAdded_eventFilter = { readonly beneficiary?: SingleOrMultiple_t<Address_t> };

export type GuardianVault_BeneficiaryAdded_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: GuardianVault_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type GuardianVault_BeneficiaryAdded_eventFiltersDefinition = 
    GuardianVault_BeneficiaryAdded_eventFilter
  | GuardianVault_BeneficiaryAdded_eventFilter[];

export type GuardianVault_BeneficiaryAdded_eventFilters = 
    GuardianVault_BeneficiaryAdded_eventFilter
  | GuardianVault_BeneficiaryAdded_eventFilter[]
  | ((_1:GuardianVault_BeneficiaryAdded_eventFiltersArgs) => GuardianVault_BeneficiaryAdded_eventFiltersDefinition);

export type GuardianVault_TriggerActivated_eventArgs = { readonly triggerType: bigint };

export type GuardianVault_TriggerActivated_block = Block_t;

export type GuardianVault_TriggerActivated_transaction = Transaction_t;

export type GuardianVault_TriggerActivated_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: GuardianVault_TriggerActivated_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: GuardianVault_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: GuardianVault_TriggerActivated_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: GuardianVault_TriggerActivated_block
};

export type GuardianVault_TriggerActivated_loaderArgs = Internal_genericLoaderArgs<GuardianVault_TriggerActivated_event,loaderContext>;

export type GuardianVault_TriggerActivated_loader<loaderReturn> = Internal_genericLoader<GuardianVault_TriggerActivated_loaderArgs,loaderReturn>;

export type GuardianVault_TriggerActivated_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<GuardianVault_TriggerActivated_event,handlerContext,loaderReturn>;

export type GuardianVault_TriggerActivated_handler<loaderReturn> = Internal_genericHandler<GuardianVault_TriggerActivated_handlerArgs<loaderReturn>>;

export type GuardianVault_TriggerActivated_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<GuardianVault_TriggerActivated_event,contractRegistrations>>;

export type GuardianVault_TriggerActivated_eventFilter = {};

export type GuardianVault_TriggerActivated_eventFilters = Internal_noEventFilters;

export type USDC_chainId = 11155111;

export type USDC_Transfer_eventArgs = {
  readonly from: Address_t; 
  readonly to: Address_t; 
  readonly value: bigint
};

export type USDC_Transfer_block = Block_t;

export type USDC_Transfer_transaction = Transaction_t;

export type USDC_Transfer_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: USDC_Transfer_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: USDC_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: USDC_Transfer_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: USDC_Transfer_block
};

export type USDC_Transfer_loaderArgs = Internal_genericLoaderArgs<USDC_Transfer_event,loaderContext>;

export type USDC_Transfer_loader<loaderReturn> = Internal_genericLoader<USDC_Transfer_loaderArgs,loaderReturn>;

export type USDC_Transfer_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<USDC_Transfer_event,handlerContext,loaderReturn>;

export type USDC_Transfer_handler<loaderReturn> = Internal_genericHandler<USDC_Transfer_handlerArgs<loaderReturn>>;

export type USDC_Transfer_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<USDC_Transfer_event,contractRegistrations>>;

export type USDC_Transfer_eventFilter = { readonly from?: SingleOrMultiple_t<Address_t>; readonly to?: SingleOrMultiple_t<Address_t> };

export type USDC_Transfer_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: USDC_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type USDC_Transfer_eventFiltersDefinition = 
    USDC_Transfer_eventFilter
  | USDC_Transfer_eventFilter[];

export type USDC_Transfer_eventFilters = 
    USDC_Transfer_eventFilter
  | USDC_Transfer_eventFilter[]
  | ((_1:USDC_Transfer_eventFiltersArgs) => USDC_Transfer_eventFiltersDefinition);

export type WETH_chainId = 11155111;

export type WETH_Transfer_eventArgs = {
  readonly from: Address_t; 
  readonly to: Address_t; 
  readonly value: bigint
};

export type WETH_Transfer_block = Block_t;

export type WETH_Transfer_transaction = Transaction_t;

export type WETH_Transfer_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: WETH_Transfer_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: WETH_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: WETH_Transfer_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: WETH_Transfer_block
};

export type WETH_Transfer_loaderArgs = Internal_genericLoaderArgs<WETH_Transfer_event,loaderContext>;

export type WETH_Transfer_loader<loaderReturn> = Internal_genericLoader<WETH_Transfer_loaderArgs,loaderReturn>;

export type WETH_Transfer_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<WETH_Transfer_event,handlerContext,loaderReturn>;

export type WETH_Transfer_handler<loaderReturn> = Internal_genericHandler<WETH_Transfer_handlerArgs<loaderReturn>>;

export type WETH_Transfer_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<WETH_Transfer_event,contractRegistrations>>;

export type WETH_Transfer_eventFilter = { readonly from?: SingleOrMultiple_t<Address_t>; readonly to?: SingleOrMultiple_t<Address_t> };

export type WETH_Transfer_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: WETH_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type WETH_Transfer_eventFiltersDefinition = 
    WETH_Transfer_eventFilter
  | WETH_Transfer_eventFilter[];

export type WETH_Transfer_eventFilters = 
    WETH_Transfer_eventFilter
  | WETH_Transfer_eventFilter[]
  | ((_1:WETH_Transfer_eventFiltersArgs) => WETH_Transfer_eventFiltersDefinition);

export type chainId = number;

export type chain = 11155111;
