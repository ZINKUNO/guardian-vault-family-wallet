/* TypeScript file generated from Handlers.res by genType. */

/* eslint-disable */
/* tslint:disable */

const HandlersJS = require('./Handlers.res.js');

import type {GuardianVault_BeneficiaryAdded_eventFilters as Types_GuardianVault_BeneficiaryAdded_eventFilters} from './Types.gen';

import type {GuardianVault_BeneficiaryAdded_event as Types_GuardianVault_BeneficiaryAdded_event} from './Types.gen';

import type {GuardianVault_Deposit_eventFilters as Types_GuardianVault_Deposit_eventFilters} from './Types.gen';

import type {GuardianVault_Deposit_event as Types_GuardianVault_Deposit_event} from './Types.gen';

import type {GuardianVault_TriggerActivated_eventFilters as Types_GuardianVault_TriggerActivated_eventFilters} from './Types.gen';

import type {GuardianVault_TriggerActivated_event as Types_GuardianVault_TriggerActivated_event} from './Types.gen';

import type {GuardianVault_Withdrawal_eventFilters as Types_GuardianVault_Withdrawal_eventFilters} from './Types.gen';

import type {GuardianVault_Withdrawal_event as Types_GuardianVault_Withdrawal_event} from './Types.gen';

import type {HandlerTypes_eventConfig as Types_HandlerTypes_eventConfig} from './Types.gen';

import type {USDC_Transfer_eventFilters as Types_USDC_Transfer_eventFilters} from './Types.gen';

import type {USDC_Transfer_event as Types_USDC_Transfer_event} from './Types.gen';

import type {WETH_Transfer_eventFilters as Types_WETH_Transfer_eventFilters} from './Types.gen';

import type {WETH_Transfer_event as Types_WETH_Transfer_event} from './Types.gen';

import type {chain as Types_chain} from './Types.gen';

import type {contractRegistrations as Types_contractRegistrations} from './Types.gen';

import type {fnWithEventConfig as Types_fnWithEventConfig} from './Types.gen';

import type {genericContractRegisterArgs as Internal_genericContractRegisterArgs} from 'envio/src/Internal.gen';

import type {genericContractRegister as Internal_genericContractRegister} from 'envio/src/Internal.gen';

import type {genericHandlerArgs as Internal_genericHandlerArgs} from 'envio/src/Internal.gen';

import type {genericHandlerWithLoader as Internal_genericHandlerWithLoader} from 'envio/src/Internal.gen';

import type {genericHandler as Internal_genericHandler} from 'envio/src/Internal.gen';

import type {genericLoaderArgs as Internal_genericLoaderArgs} from 'envio/src/Internal.gen';

import type {genericLoader as Internal_genericLoader} from 'envio/src/Internal.gen';

import type {handlerContext as Types_handlerContext} from './Types.gen';

import type {loaderContext as Types_loaderContext} from './Types.gen';

import type {onBlockArgs as Envio_onBlockArgs} from 'envio/src/Envio.gen';

import type {onBlockOptions as Envio_onBlockOptions} from 'envio/src/Envio.gen';

export const GuardianVault_Deposit_contractRegister: Types_fnWithEventConfig<Internal_genericContractRegister<Internal_genericContractRegisterArgs<Types_GuardianVault_Deposit_event,Types_contractRegistrations>>,Types_HandlerTypes_eventConfig<Types_GuardianVault_Deposit_eventFilters>> = HandlersJS.GuardianVault.Deposit.contractRegister as any;

export const GuardianVault_Deposit_handler: Types_fnWithEventConfig<Internal_genericHandler<Internal_genericHandlerArgs<Types_GuardianVault_Deposit_event,Types_handlerContext,void>>,Types_HandlerTypes_eventConfig<Types_GuardianVault_Deposit_eventFilters>> = HandlersJS.GuardianVault.Deposit.handler as any;

export const GuardianVault_Deposit_handlerWithLoader: <loaderReturn>(_1:Internal_genericHandlerWithLoader<Internal_genericLoader<Internal_genericLoaderArgs<Types_GuardianVault_Deposit_event,Types_loaderContext>,loaderReturn>,Internal_genericHandler<Internal_genericHandlerArgs<Types_GuardianVault_Deposit_event,Types_handlerContext,loaderReturn>>,Types_GuardianVault_Deposit_eventFilters>) => void = HandlersJS.GuardianVault.Deposit.handlerWithLoader as any;

export const GuardianVault_Withdrawal_contractRegister: Types_fnWithEventConfig<Internal_genericContractRegister<Internal_genericContractRegisterArgs<Types_GuardianVault_Withdrawal_event,Types_contractRegistrations>>,Types_HandlerTypes_eventConfig<Types_GuardianVault_Withdrawal_eventFilters>> = HandlersJS.GuardianVault.Withdrawal.contractRegister as any;

export const GuardianVault_Withdrawal_handler: Types_fnWithEventConfig<Internal_genericHandler<Internal_genericHandlerArgs<Types_GuardianVault_Withdrawal_event,Types_handlerContext,void>>,Types_HandlerTypes_eventConfig<Types_GuardianVault_Withdrawal_eventFilters>> = HandlersJS.GuardianVault.Withdrawal.handler as any;

export const GuardianVault_Withdrawal_handlerWithLoader: <loaderReturn>(_1:Internal_genericHandlerWithLoader<Internal_genericLoader<Internal_genericLoaderArgs<Types_GuardianVault_Withdrawal_event,Types_loaderContext>,loaderReturn>,Internal_genericHandler<Internal_genericHandlerArgs<Types_GuardianVault_Withdrawal_event,Types_handlerContext,loaderReturn>>,Types_GuardianVault_Withdrawal_eventFilters>) => void = HandlersJS.GuardianVault.Withdrawal.handlerWithLoader as any;

export const GuardianVault_BeneficiaryAdded_contractRegister: Types_fnWithEventConfig<Internal_genericContractRegister<Internal_genericContractRegisterArgs<Types_GuardianVault_BeneficiaryAdded_event,Types_contractRegistrations>>,Types_HandlerTypes_eventConfig<Types_GuardianVault_BeneficiaryAdded_eventFilters>> = HandlersJS.GuardianVault.BeneficiaryAdded.contractRegister as any;

export const GuardianVault_BeneficiaryAdded_handler: Types_fnWithEventConfig<Internal_genericHandler<Internal_genericHandlerArgs<Types_GuardianVault_BeneficiaryAdded_event,Types_handlerContext,void>>,Types_HandlerTypes_eventConfig<Types_GuardianVault_BeneficiaryAdded_eventFilters>> = HandlersJS.GuardianVault.BeneficiaryAdded.handler as any;

export const GuardianVault_BeneficiaryAdded_handlerWithLoader: <loaderReturn>(_1:Internal_genericHandlerWithLoader<Internal_genericLoader<Internal_genericLoaderArgs<Types_GuardianVault_BeneficiaryAdded_event,Types_loaderContext>,loaderReturn>,Internal_genericHandler<Internal_genericHandlerArgs<Types_GuardianVault_BeneficiaryAdded_event,Types_handlerContext,loaderReturn>>,Types_GuardianVault_BeneficiaryAdded_eventFilters>) => void = HandlersJS.GuardianVault.BeneficiaryAdded.handlerWithLoader as any;

export const GuardianVault_TriggerActivated_contractRegister: Types_fnWithEventConfig<Internal_genericContractRegister<Internal_genericContractRegisterArgs<Types_GuardianVault_TriggerActivated_event,Types_contractRegistrations>>,Types_HandlerTypes_eventConfig<Types_GuardianVault_TriggerActivated_eventFilters>> = HandlersJS.GuardianVault.TriggerActivated.contractRegister as any;

export const GuardianVault_TriggerActivated_handler: Types_fnWithEventConfig<Internal_genericHandler<Internal_genericHandlerArgs<Types_GuardianVault_TriggerActivated_event,Types_handlerContext,void>>,Types_HandlerTypes_eventConfig<Types_GuardianVault_TriggerActivated_eventFilters>> = HandlersJS.GuardianVault.TriggerActivated.handler as any;

export const GuardianVault_TriggerActivated_handlerWithLoader: <loaderReturn>(_1:Internal_genericHandlerWithLoader<Internal_genericLoader<Internal_genericLoaderArgs<Types_GuardianVault_TriggerActivated_event,Types_loaderContext>,loaderReturn>,Internal_genericHandler<Internal_genericHandlerArgs<Types_GuardianVault_TriggerActivated_event,Types_handlerContext,loaderReturn>>,Types_GuardianVault_TriggerActivated_eventFilters>) => void = HandlersJS.GuardianVault.TriggerActivated.handlerWithLoader as any;

export const USDC_Transfer_contractRegister: Types_fnWithEventConfig<Internal_genericContractRegister<Internal_genericContractRegisterArgs<Types_USDC_Transfer_event,Types_contractRegistrations>>,Types_HandlerTypes_eventConfig<Types_USDC_Transfer_eventFilters>> = HandlersJS.USDC.Transfer.contractRegister as any;

export const USDC_Transfer_handler: Types_fnWithEventConfig<Internal_genericHandler<Internal_genericHandlerArgs<Types_USDC_Transfer_event,Types_handlerContext,void>>,Types_HandlerTypes_eventConfig<Types_USDC_Transfer_eventFilters>> = HandlersJS.USDC.Transfer.handler as any;

export const USDC_Transfer_handlerWithLoader: <loaderReturn>(_1:Internal_genericHandlerWithLoader<Internal_genericLoader<Internal_genericLoaderArgs<Types_USDC_Transfer_event,Types_loaderContext>,loaderReturn>,Internal_genericHandler<Internal_genericHandlerArgs<Types_USDC_Transfer_event,Types_handlerContext,loaderReturn>>,Types_USDC_Transfer_eventFilters>) => void = HandlersJS.USDC.Transfer.handlerWithLoader as any;

export const WETH_Transfer_contractRegister: Types_fnWithEventConfig<Internal_genericContractRegister<Internal_genericContractRegisterArgs<Types_WETH_Transfer_event,Types_contractRegistrations>>,Types_HandlerTypes_eventConfig<Types_WETH_Transfer_eventFilters>> = HandlersJS.WETH.Transfer.contractRegister as any;

export const WETH_Transfer_handler: Types_fnWithEventConfig<Internal_genericHandler<Internal_genericHandlerArgs<Types_WETH_Transfer_event,Types_handlerContext,void>>,Types_HandlerTypes_eventConfig<Types_WETH_Transfer_eventFilters>> = HandlersJS.WETH.Transfer.handler as any;

export const WETH_Transfer_handlerWithLoader: <loaderReturn>(_1:Internal_genericHandlerWithLoader<Internal_genericLoader<Internal_genericLoaderArgs<Types_WETH_Transfer_event,Types_loaderContext>,loaderReturn>,Internal_genericHandler<Internal_genericHandlerArgs<Types_WETH_Transfer_event,Types_handlerContext,loaderReturn>>,Types_WETH_Transfer_eventFilters>) => void = HandlersJS.WETH.Transfer.handlerWithLoader as any;

/** Register a Block Handler. It'll be called for every block by default. */
export const onBlock: (_1:Envio_onBlockOptions<Types_chain>, _2:((_1:Envio_onBlockArgs<Types_handlerContext>) => Promise<void>)) => void = HandlersJS.onBlock as any;

export const GuardianVault: {
  Deposit: {
    handlerWithLoader: <loaderReturn>(_1:Internal_genericHandlerWithLoader<Internal_genericLoader<Internal_genericLoaderArgs<Types_GuardianVault_Deposit_event,Types_loaderContext>,loaderReturn>,Internal_genericHandler<Internal_genericHandlerArgs<Types_GuardianVault_Deposit_event,Types_handlerContext,loaderReturn>>,Types_GuardianVault_Deposit_eventFilters>) => void; 
    handler: Types_fnWithEventConfig<Internal_genericHandler<Internal_genericHandlerArgs<Types_GuardianVault_Deposit_event,Types_handlerContext,void>>,Types_HandlerTypes_eventConfig<Types_GuardianVault_Deposit_eventFilters>>; 
    contractRegister: Types_fnWithEventConfig<Internal_genericContractRegister<Internal_genericContractRegisterArgs<Types_GuardianVault_Deposit_event,Types_contractRegistrations>>,Types_HandlerTypes_eventConfig<Types_GuardianVault_Deposit_eventFilters>>
  }; 
  Withdrawal: {
    handlerWithLoader: <loaderReturn>(_1:Internal_genericHandlerWithLoader<Internal_genericLoader<Internal_genericLoaderArgs<Types_GuardianVault_Withdrawal_event,Types_loaderContext>,loaderReturn>,Internal_genericHandler<Internal_genericHandlerArgs<Types_GuardianVault_Withdrawal_event,Types_handlerContext,loaderReturn>>,Types_GuardianVault_Withdrawal_eventFilters>) => void; 
    handler: Types_fnWithEventConfig<Internal_genericHandler<Internal_genericHandlerArgs<Types_GuardianVault_Withdrawal_event,Types_handlerContext,void>>,Types_HandlerTypes_eventConfig<Types_GuardianVault_Withdrawal_eventFilters>>; 
    contractRegister: Types_fnWithEventConfig<Internal_genericContractRegister<Internal_genericContractRegisterArgs<Types_GuardianVault_Withdrawal_event,Types_contractRegistrations>>,Types_HandlerTypes_eventConfig<Types_GuardianVault_Withdrawal_eventFilters>>
  }; 
  BeneficiaryAdded: {
    handlerWithLoader: <loaderReturn>(_1:Internal_genericHandlerWithLoader<Internal_genericLoader<Internal_genericLoaderArgs<Types_GuardianVault_BeneficiaryAdded_event,Types_loaderContext>,loaderReturn>,Internal_genericHandler<Internal_genericHandlerArgs<Types_GuardianVault_BeneficiaryAdded_event,Types_handlerContext,loaderReturn>>,Types_GuardianVault_BeneficiaryAdded_eventFilters>) => void; 
    handler: Types_fnWithEventConfig<Internal_genericHandler<Internal_genericHandlerArgs<Types_GuardianVault_BeneficiaryAdded_event,Types_handlerContext,void>>,Types_HandlerTypes_eventConfig<Types_GuardianVault_BeneficiaryAdded_eventFilters>>; 
    contractRegister: Types_fnWithEventConfig<Internal_genericContractRegister<Internal_genericContractRegisterArgs<Types_GuardianVault_BeneficiaryAdded_event,Types_contractRegistrations>>,Types_HandlerTypes_eventConfig<Types_GuardianVault_BeneficiaryAdded_eventFilters>>
  }; 
  TriggerActivated: {
    handlerWithLoader: <loaderReturn>(_1:Internal_genericHandlerWithLoader<Internal_genericLoader<Internal_genericLoaderArgs<Types_GuardianVault_TriggerActivated_event,Types_loaderContext>,loaderReturn>,Internal_genericHandler<Internal_genericHandlerArgs<Types_GuardianVault_TriggerActivated_event,Types_handlerContext,loaderReturn>>,Types_GuardianVault_TriggerActivated_eventFilters>) => void; 
    handler: Types_fnWithEventConfig<Internal_genericHandler<Internal_genericHandlerArgs<Types_GuardianVault_TriggerActivated_event,Types_handlerContext,void>>,Types_HandlerTypes_eventConfig<Types_GuardianVault_TriggerActivated_eventFilters>>; 
    contractRegister: Types_fnWithEventConfig<Internal_genericContractRegister<Internal_genericContractRegisterArgs<Types_GuardianVault_TriggerActivated_event,Types_contractRegistrations>>,Types_HandlerTypes_eventConfig<Types_GuardianVault_TriggerActivated_eventFilters>>
  }
} = HandlersJS.GuardianVault as any;

export const WETH: { Transfer: {
  handlerWithLoader: <loaderReturn>(_1:Internal_genericHandlerWithLoader<Internal_genericLoader<Internal_genericLoaderArgs<Types_WETH_Transfer_event,Types_loaderContext>,loaderReturn>,Internal_genericHandler<Internal_genericHandlerArgs<Types_WETH_Transfer_event,Types_handlerContext,loaderReturn>>,Types_WETH_Transfer_eventFilters>) => void; 
  handler: Types_fnWithEventConfig<Internal_genericHandler<Internal_genericHandlerArgs<Types_WETH_Transfer_event,Types_handlerContext,void>>,Types_HandlerTypes_eventConfig<Types_WETH_Transfer_eventFilters>>; 
  contractRegister: Types_fnWithEventConfig<Internal_genericContractRegister<Internal_genericContractRegisterArgs<Types_WETH_Transfer_event,Types_contractRegistrations>>,Types_HandlerTypes_eventConfig<Types_WETH_Transfer_eventFilters>>
} } = HandlersJS.WETH as any;

export const USDC: { Transfer: {
  handlerWithLoader: <loaderReturn>(_1:Internal_genericHandlerWithLoader<Internal_genericLoader<Internal_genericLoaderArgs<Types_USDC_Transfer_event,Types_loaderContext>,loaderReturn>,Internal_genericHandler<Internal_genericHandlerArgs<Types_USDC_Transfer_event,Types_handlerContext,loaderReturn>>,Types_USDC_Transfer_eventFilters>) => void; 
  handler: Types_fnWithEventConfig<Internal_genericHandler<Internal_genericHandlerArgs<Types_USDC_Transfer_event,Types_handlerContext,void>>,Types_HandlerTypes_eventConfig<Types_USDC_Transfer_eventFilters>>; 
  contractRegister: Types_fnWithEventConfig<Internal_genericContractRegister<Internal_genericContractRegisterArgs<Types_USDC_Transfer_event,Types_contractRegistrations>>,Types_HandlerTypes_eventConfig<Types_USDC_Transfer_eventFilters>>
} } = HandlersJS.USDC as any;
