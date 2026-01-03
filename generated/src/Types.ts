// This file is to dynamically generate TS types
// which we can't get using GenType
// Use @genType.import to link the types back to ReScript code

import type { Logger, EffectCaller } from "envio";
import type * as Entities from "./db/Entities.gen.ts";

export type LoaderContext = {
  /**
   * Access the logger instance with event as a context. The logs will be displayed in the console and Envio Hosted Service.
   */
  readonly log: Logger;
  /**
   * Call the provided Effect with the given input.
   * Effects are the best for external calls with automatic deduplication, error handling and caching.
   * Define a new Effect using createEffect outside of the handler.
   */
  readonly effect: EffectCaller;
  /**
   * True when the handlers run in preload mode - in parallel for the whole batch.
   * Handlers run twice per batch of events, and the first time is the "preload" run
   * During preload entities aren't set, logs are ignored and exceptions are silently swallowed.
   * Preload mode is the best time to populate data to in-memory cache.
   * After preload the handler will run for the second time in sequential order of events.
   */
  readonly isPreload: boolean;
  /**
   * Per-chain state information accessible in event handlers and block handlers.
   * Each chain ID maps to an object containing chain-specific state:
   * - isReady: true when the chain has completed initial sync and is processing live events,
   *            false during historical synchronization
   */
  readonly chains: {
    [chainId: string]: {
      readonly isReady: boolean;
    };
  };
  readonly Beneficiary: {
    /**
     * Load the entity Beneficiary from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.Beneficiary_t | undefined>,
    /**
     * Load the entity Beneficiary from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.Beneficiary_t>,
    readonly getWhere: Entities.Beneficiary_indexedFieldOperations,
    /**
     * Returns the entity Beneficiary from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.Beneficiary_t) => Promise<Entities.Beneficiary_t>,
    /**
     * Set the entity Beneficiary in the storage.
     */
    readonly set: (entity: Entities.Beneficiary_t) => void,
    /**
     * Delete the entity Beneficiary from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly BeneficiaryExecution: {
    /**
     * Load the entity BeneficiaryExecution from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.BeneficiaryExecution_t | undefined>,
    /**
     * Load the entity BeneficiaryExecution from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.BeneficiaryExecution_t>,
    readonly getWhere: Entities.BeneficiaryExecution_indexedFieldOperations,
    /**
     * Returns the entity BeneficiaryExecution from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.BeneficiaryExecution_t) => Promise<Entities.BeneficiaryExecution_t>,
    /**
     * Set the entity BeneficiaryExecution in the storage.
     */
    readonly set: (entity: Entities.BeneficiaryExecution_t) => void,
    /**
     * Delete the entity BeneficiaryExecution from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly Deposit: {
    /**
     * Load the entity Deposit from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.Deposit_t | undefined>,
    /**
     * Load the entity Deposit from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.Deposit_t>,
    readonly getWhere: Entities.Deposit_indexedFieldOperations,
    /**
     * Returns the entity Deposit from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.Deposit_t) => Promise<Entities.Deposit_t>,
    /**
     * Set the entity Deposit in the storage.
     */
    readonly set: (entity: Entities.Deposit_t) => void,
    /**
     * Delete the entity Deposit from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly Execution: {
    /**
     * Load the entity Execution from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.Execution_t | undefined>,
    /**
     * Load the entity Execution from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.Execution_t>,
    readonly getWhere: Entities.Execution_indexedFieldOperations,
    /**
     * Returns the entity Execution from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.Execution_t) => Promise<Entities.Execution_t>,
    /**
     * Set the entity Execution in the storage.
     */
    readonly set: (entity: Entities.Execution_t) => void,
    /**
     * Delete the entity Execution from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly Permission: {
    /**
     * Load the entity Permission from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.Permission_t | undefined>,
    /**
     * Load the entity Permission from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.Permission_t>,
    readonly getWhere: Entities.Permission_indexedFieldOperations,
    /**
     * Returns the entity Permission from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.Permission_t) => Promise<Entities.Permission_t>,
    /**
     * Set the entity Permission in the storage.
     */
    readonly set: (entity: Entities.Permission_t) => void,
    /**
     * Delete the entity Permission from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly TriggerEvent: {
    /**
     * Load the entity TriggerEvent from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.TriggerEvent_t | undefined>,
    /**
     * Load the entity TriggerEvent from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.TriggerEvent_t>,
    readonly getWhere: Entities.TriggerEvent_indexedFieldOperations,
    /**
     * Returns the entity TriggerEvent from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.TriggerEvent_t) => Promise<Entities.TriggerEvent_t>,
    /**
     * Set the entity TriggerEvent in the storage.
     */
    readonly set: (entity: Entities.TriggerEvent_t) => void,
    /**
     * Delete the entity TriggerEvent from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly Vault: {
    /**
     * Load the entity Vault from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.Vault_t | undefined>,
    /**
     * Load the entity Vault from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.Vault_t>,
    readonly getWhere: Entities.Vault_indexedFieldOperations,
    /**
     * Returns the entity Vault from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.Vault_t) => Promise<Entities.Vault_t>,
    /**
     * Set the entity Vault in the storage.
     */
    readonly set: (entity: Entities.Vault_t) => void,
    /**
     * Delete the entity Vault from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly VaultStats: {
    /**
     * Load the entity VaultStats from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.VaultStats_t | undefined>,
    /**
     * Load the entity VaultStats from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.VaultStats_t>,
    readonly getWhere: Entities.VaultStats_indexedFieldOperations,
    /**
     * Returns the entity VaultStats from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.VaultStats_t) => Promise<Entities.VaultStats_t>,
    /**
     * Set the entity VaultStats in the storage.
     */
    readonly set: (entity: Entities.VaultStats_t) => void,
    /**
     * Delete the entity VaultStats from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly Withdrawal: {
    /**
     * Load the entity Withdrawal from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.Withdrawal_t | undefined>,
    /**
     * Load the entity Withdrawal from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.Withdrawal_t>,
    readonly getWhere: Entities.Withdrawal_indexedFieldOperations,
    /**
     * Returns the entity Withdrawal from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.Withdrawal_t) => Promise<Entities.Withdrawal_t>,
    /**
     * Set the entity Withdrawal in the storage.
     */
    readonly set: (entity: Entities.Withdrawal_t) => void,
    /**
     * Delete the entity Withdrawal from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
};

export type HandlerContext = {
  /**
   * Access the logger instance with event as a context. The logs will be displayed in the console and Envio Hosted Service.
   */
  readonly log: Logger;
  /**
   * Call the provided Effect with the given input.
   * Effects are the best for external calls with automatic deduplication, error handling and caching.
   * Define a new Effect using createEffect outside of the handler.
   */
  readonly effect: EffectCaller;
  /**
   * Per-chain state information accessible in event handlers and block handlers.
   * Each chain ID maps to an object containing chain-specific state:
   * - isReady: true when the chain has completed initial sync and is processing live events,
   *            false during historical synchronization
   */
  readonly chains: {
    [chainId: string]: {
      readonly isReady: boolean;
    };
  };
  readonly Beneficiary: {
    /**
     * Load the entity Beneficiary from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.Beneficiary_t | undefined>,
    /**
     * Load the entity Beneficiary from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.Beneficiary_t>,
    /**
     * Returns the entity Beneficiary from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.Beneficiary_t) => Promise<Entities.Beneficiary_t>,
    /**
     * Set the entity Beneficiary in the storage.
     */
    readonly set: (entity: Entities.Beneficiary_t) => void,
    /**
     * Delete the entity Beneficiary from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly BeneficiaryExecution: {
    /**
     * Load the entity BeneficiaryExecution from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.BeneficiaryExecution_t | undefined>,
    /**
     * Load the entity BeneficiaryExecution from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.BeneficiaryExecution_t>,
    /**
     * Returns the entity BeneficiaryExecution from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.BeneficiaryExecution_t) => Promise<Entities.BeneficiaryExecution_t>,
    /**
     * Set the entity BeneficiaryExecution in the storage.
     */
    readonly set: (entity: Entities.BeneficiaryExecution_t) => void,
    /**
     * Delete the entity BeneficiaryExecution from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly Deposit: {
    /**
     * Load the entity Deposit from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.Deposit_t | undefined>,
    /**
     * Load the entity Deposit from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.Deposit_t>,
    /**
     * Returns the entity Deposit from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.Deposit_t) => Promise<Entities.Deposit_t>,
    /**
     * Set the entity Deposit in the storage.
     */
    readonly set: (entity: Entities.Deposit_t) => void,
    /**
     * Delete the entity Deposit from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly Execution: {
    /**
     * Load the entity Execution from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.Execution_t | undefined>,
    /**
     * Load the entity Execution from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.Execution_t>,
    /**
     * Returns the entity Execution from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.Execution_t) => Promise<Entities.Execution_t>,
    /**
     * Set the entity Execution in the storage.
     */
    readonly set: (entity: Entities.Execution_t) => void,
    /**
     * Delete the entity Execution from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly Permission: {
    /**
     * Load the entity Permission from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.Permission_t | undefined>,
    /**
     * Load the entity Permission from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.Permission_t>,
    /**
     * Returns the entity Permission from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.Permission_t) => Promise<Entities.Permission_t>,
    /**
     * Set the entity Permission in the storage.
     */
    readonly set: (entity: Entities.Permission_t) => void,
    /**
     * Delete the entity Permission from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly TriggerEvent: {
    /**
     * Load the entity TriggerEvent from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.TriggerEvent_t | undefined>,
    /**
     * Load the entity TriggerEvent from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.TriggerEvent_t>,
    /**
     * Returns the entity TriggerEvent from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.TriggerEvent_t) => Promise<Entities.TriggerEvent_t>,
    /**
     * Set the entity TriggerEvent in the storage.
     */
    readonly set: (entity: Entities.TriggerEvent_t) => void,
    /**
     * Delete the entity TriggerEvent from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly Vault: {
    /**
     * Load the entity Vault from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.Vault_t | undefined>,
    /**
     * Load the entity Vault from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.Vault_t>,
    /**
     * Returns the entity Vault from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.Vault_t) => Promise<Entities.Vault_t>,
    /**
     * Set the entity Vault in the storage.
     */
    readonly set: (entity: Entities.Vault_t) => void,
    /**
     * Delete the entity Vault from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly VaultStats: {
    /**
     * Load the entity VaultStats from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.VaultStats_t | undefined>,
    /**
     * Load the entity VaultStats from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.VaultStats_t>,
    /**
     * Returns the entity VaultStats from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.VaultStats_t) => Promise<Entities.VaultStats_t>,
    /**
     * Set the entity VaultStats in the storage.
     */
    readonly set: (entity: Entities.VaultStats_t) => void,
    /**
     * Delete the entity VaultStats from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly Withdrawal: {
    /**
     * Load the entity Withdrawal from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.Withdrawal_t | undefined>,
    /**
     * Load the entity Withdrawal from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.Withdrawal_t>,
    /**
     * Returns the entity Withdrawal from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.Withdrawal_t) => Promise<Entities.Withdrawal_t>,
    /**
     * Set the entity Withdrawal in the storage.
     */
    readonly set: (entity: Entities.Withdrawal_t) => void,
    /**
     * Delete the entity Withdrawal from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
};
