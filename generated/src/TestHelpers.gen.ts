/* TypeScript file generated from TestHelpers.res by genType. */

/* eslint-disable */
/* tslint:disable */

const TestHelpersJS = require('./TestHelpers.res.js');

import type {GuardianVault_BeneficiaryAdded_event as Types_GuardianVault_BeneficiaryAdded_event} from './Types.gen';

import type {GuardianVault_Deposit_event as Types_GuardianVault_Deposit_event} from './Types.gen';

import type {GuardianVault_TriggerActivated_event as Types_GuardianVault_TriggerActivated_event} from './Types.gen';

import type {GuardianVault_Withdrawal_event as Types_GuardianVault_Withdrawal_event} from './Types.gen';

import type {USDC_Transfer_event as Types_USDC_Transfer_event} from './Types.gen';

import type {WETH_Transfer_event as Types_WETH_Transfer_event} from './Types.gen';

import type {t as Address_t} from 'envio/src/Address.gen';

import type {t as TestHelpers_MockDb_t} from './TestHelpers_MockDb.gen';

/** The arguements that get passed to a "processEvent" helper function */
export type EventFunctions_eventProcessorArgs<event> = {
  readonly event: event; 
  readonly mockDb: TestHelpers_MockDb_t; 
  readonly chainId?: number
};

export type EventFunctions_eventProcessor<event> = (_1:EventFunctions_eventProcessorArgs<event>) => Promise<TestHelpers_MockDb_t>;

export type EventFunctions_MockBlock_t = {
  readonly hash?: string; 
  readonly number?: number; 
  readonly timestamp?: number
};

export type EventFunctions_MockTransaction_t = { readonly from?: (undefined | Address_t); readonly hash?: string };

export type EventFunctions_mockEventData = {
  readonly chainId?: number; 
  readonly srcAddress?: Address_t; 
  readonly logIndex?: number; 
  readonly block?: EventFunctions_MockBlock_t; 
  readonly transaction?: EventFunctions_MockTransaction_t
};

export type GuardianVault_Deposit_createMockArgs = {
  readonly sender?: Address_t; 
  readonly amount?: bigint; 
  readonly mockEventData?: EventFunctions_mockEventData
};

export type GuardianVault_Withdrawal_createMockArgs = {
  readonly recipient?: Address_t; 
  readonly amount?: bigint; 
  readonly mockEventData?: EventFunctions_mockEventData
};

export type GuardianVault_BeneficiaryAdded_createMockArgs = {
  readonly beneficiary?: Address_t; 
  readonly percentage?: bigint; 
  readonly mockEventData?: EventFunctions_mockEventData
};

export type GuardianVault_TriggerActivated_createMockArgs = { readonly triggerType?: bigint; readonly mockEventData?: EventFunctions_mockEventData };

export type USDC_Transfer_createMockArgs = {
  readonly from?: Address_t; 
  readonly to?: Address_t; 
  readonly value?: bigint; 
  readonly mockEventData?: EventFunctions_mockEventData
};

export type WETH_Transfer_createMockArgs = {
  readonly from?: Address_t; 
  readonly to?: Address_t; 
  readonly value?: bigint; 
  readonly mockEventData?: EventFunctions_mockEventData
};

export const MockDb_createMockDb: () => TestHelpers_MockDb_t = TestHelpersJS.MockDb.createMockDb as any;

export const Addresses_mockAddresses: Address_t[] = TestHelpersJS.Addresses.mockAddresses as any;

export const Addresses_defaultAddress: Address_t = TestHelpersJS.Addresses.defaultAddress as any;

export const GuardianVault_Deposit_processEvent: EventFunctions_eventProcessor<Types_GuardianVault_Deposit_event> = TestHelpersJS.GuardianVault.Deposit.processEvent as any;

export const GuardianVault_Deposit_createMockEvent: (args:GuardianVault_Deposit_createMockArgs) => Types_GuardianVault_Deposit_event = TestHelpersJS.GuardianVault.Deposit.createMockEvent as any;

export const GuardianVault_Withdrawal_processEvent: EventFunctions_eventProcessor<Types_GuardianVault_Withdrawal_event> = TestHelpersJS.GuardianVault.Withdrawal.processEvent as any;

export const GuardianVault_Withdrawal_createMockEvent: (args:GuardianVault_Withdrawal_createMockArgs) => Types_GuardianVault_Withdrawal_event = TestHelpersJS.GuardianVault.Withdrawal.createMockEvent as any;

export const GuardianVault_BeneficiaryAdded_processEvent: EventFunctions_eventProcessor<Types_GuardianVault_BeneficiaryAdded_event> = TestHelpersJS.GuardianVault.BeneficiaryAdded.processEvent as any;

export const GuardianVault_BeneficiaryAdded_createMockEvent: (args:GuardianVault_BeneficiaryAdded_createMockArgs) => Types_GuardianVault_BeneficiaryAdded_event = TestHelpersJS.GuardianVault.BeneficiaryAdded.createMockEvent as any;

export const GuardianVault_TriggerActivated_processEvent: EventFunctions_eventProcessor<Types_GuardianVault_TriggerActivated_event> = TestHelpersJS.GuardianVault.TriggerActivated.processEvent as any;

export const GuardianVault_TriggerActivated_createMockEvent: (args:GuardianVault_TriggerActivated_createMockArgs) => Types_GuardianVault_TriggerActivated_event = TestHelpersJS.GuardianVault.TriggerActivated.createMockEvent as any;

export const USDC_Transfer_processEvent: EventFunctions_eventProcessor<Types_USDC_Transfer_event> = TestHelpersJS.USDC.Transfer.processEvent as any;

export const USDC_Transfer_createMockEvent: (args:USDC_Transfer_createMockArgs) => Types_USDC_Transfer_event = TestHelpersJS.USDC.Transfer.createMockEvent as any;

export const WETH_Transfer_processEvent: EventFunctions_eventProcessor<Types_WETH_Transfer_event> = TestHelpersJS.WETH.Transfer.processEvent as any;

export const WETH_Transfer_createMockEvent: (args:WETH_Transfer_createMockArgs) => Types_WETH_Transfer_event = TestHelpersJS.WETH.Transfer.createMockEvent as any;

export const Addresses: { mockAddresses: Address_t[]; defaultAddress: Address_t } = TestHelpersJS.Addresses as any;

export const GuardianVault: {
  Deposit: {
    processEvent: EventFunctions_eventProcessor<Types_GuardianVault_Deposit_event>; 
    createMockEvent: (args:GuardianVault_Deposit_createMockArgs) => Types_GuardianVault_Deposit_event
  }; 
  Withdrawal: {
    processEvent: EventFunctions_eventProcessor<Types_GuardianVault_Withdrawal_event>; 
    createMockEvent: (args:GuardianVault_Withdrawal_createMockArgs) => Types_GuardianVault_Withdrawal_event
  }; 
  BeneficiaryAdded: {
    processEvent: EventFunctions_eventProcessor<Types_GuardianVault_BeneficiaryAdded_event>; 
    createMockEvent: (args:GuardianVault_BeneficiaryAdded_createMockArgs) => Types_GuardianVault_BeneficiaryAdded_event
  }; 
  TriggerActivated: {
    processEvent: EventFunctions_eventProcessor<Types_GuardianVault_TriggerActivated_event>; 
    createMockEvent: (args:GuardianVault_TriggerActivated_createMockArgs) => Types_GuardianVault_TriggerActivated_event
  }
} = TestHelpersJS.GuardianVault as any;

export const WETH: { Transfer: { processEvent: EventFunctions_eventProcessor<Types_WETH_Transfer_event>; createMockEvent: (args:WETH_Transfer_createMockArgs) => Types_WETH_Transfer_event } } = TestHelpersJS.WETH as any;

export const USDC: { Transfer: { processEvent: EventFunctions_eventProcessor<Types_USDC_Transfer_event>; createMockEvent: (args:USDC_Transfer_createMockArgs) => Types_USDC_Transfer_event } } = TestHelpersJS.USDC as any;

export const MockDb: { createMockDb: () => TestHelpers_MockDb_t } = TestHelpersJS.MockDb as any;
