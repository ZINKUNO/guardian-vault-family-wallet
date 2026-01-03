/***** TAKE NOTE ******
This is a hack to get genType to work!

In order for genType to produce recursive types, it needs to be at the 
root module of a file. If it's defined in a nested module it does not 
work. So all the MockDb types and internal functions are defined in TestHelpers_MockDb
and only public functions are recreated and exported from this module.

the following module:
```rescript
module MyModule = {
  @genType
  type rec a = {fieldB: b}
  @genType and b = {fieldA: a}
}
```

produces the following in ts:
```ts
// tslint:disable-next-line:interface-over-type-literal
export type MyModule_a = { readonly fieldB: b };

// tslint:disable-next-line:interface-over-type-literal
export type MyModule_b = { readonly fieldA: MyModule_a };
```

fieldB references type b which doesn't exist because it's defined
as MyModule_b
*/

module MockDb = {
  @genType
  let createMockDb = TestHelpers_MockDb.createMockDb
}

@genType
module Addresses = {
  include TestHelpers_MockAddresses
}

module EventFunctions = {
  //Note these are made into a record to make operate in the same way
  //for Res, JS and TS.

  /**
  The arguements that get passed to a "processEvent" helper function
  */
  @genType
  type eventProcessorArgs<'event> = {
    event: 'event,
    mockDb: TestHelpers_MockDb.t,
    @deprecated("Set the chainId for the event instead")
    chainId?: int,
  }

  @genType
  type eventProcessor<'event> = eventProcessorArgs<'event> => promise<TestHelpers_MockDb.t>

  /**
  A function composer to help create individual processEvent functions
  */
  let makeEventProcessor = (~register) => args => {
    let {event, mockDb, ?chainId} =
      args->(Utils.magic: eventProcessorArgs<'event> => eventProcessorArgs<Internal.event>)

    // Have the line here, just in case the function is called with
    // a manually created event. We don't want to break the existing tests here.
    let _ =
      TestHelpers_MockDb.mockEventRegisters->Utils.WeakMap.set(event, register)
    TestHelpers_MockDb.makeProcessEvents(mockDb, ~chainId=?chainId)([event->(Utils.magic: Internal.event => Types.eventLog<unknown>)])
  }

  module MockBlock = {
    @genType
    type t = {
      hash?: string,
      number?: int,
      timestamp?: int,
    }

    let toBlock = (_mock: t) => {
      hash: _mock.hash->Belt.Option.getWithDefault("foo"),
      number: _mock.number->Belt.Option.getWithDefault(0),
      timestamp: _mock.timestamp->Belt.Option.getWithDefault(0),
    }->(Utils.magic: Types.AggregatedBlock.t => Internal.eventBlock)
  }

  module MockTransaction = {
    @genType
    type t = {
      from?: option<Address.t>,
      hash?: string,
    }

    let toTransaction = (_mock: t) => {
      from: _mock.from->Belt.Option.getWithDefault(None),
      hash: _mock.hash->Belt.Option.getWithDefault("foo"),
    }->(Utils.magic: Types.AggregatedTransaction.t => Internal.eventTransaction)
  }

  @genType
  type mockEventData = {
    chainId?: int,
    srcAddress?: Address.t,
    logIndex?: int,
    block?: MockBlock.t,
    transaction?: MockTransaction.t,
  }

  /**
  Applies optional paramters with defaults for all common eventLog field
  */
  let makeEventMocker = (
    ~params: Internal.eventParams,
    ~mockEventData: option<mockEventData>,
    ~register: unit => Internal.eventConfig,
  ): Internal.event => {
    let {?block, ?transaction, ?srcAddress, ?chainId, ?logIndex} =
      mockEventData->Belt.Option.getWithDefault({})
    let block = block->Belt.Option.getWithDefault({})->MockBlock.toBlock
    let transaction = transaction->Belt.Option.getWithDefault({})->MockTransaction.toTransaction
    let event: Internal.event = {
      params,
      transaction,
      chainId: switch chainId {
      | Some(chainId) => chainId
      | None =>
        switch Generated.configWithoutRegistrations.defaultChain {
        | Some(chainConfig) => chainConfig.id
        | None =>
          Js.Exn.raiseError(
            "No default chain Id found, please add at least 1 chain to your config.yaml",
          )
        }
      },
      block,
      srcAddress: srcAddress->Belt.Option.getWithDefault(Addresses.defaultAddress),
      logIndex: logIndex->Belt.Option.getWithDefault(0),
    }
    // Since currently it's not possible to figure out the event config from the event
    // we store a reference to the register function by event in a weak map
    let _ = TestHelpers_MockDb.mockEventRegisters->Utils.WeakMap.set(event, register)
    event
  }
}


module GuardianVault = {
  module Deposit = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.GuardianVault.Deposit.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.GuardianVault.Deposit.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("sender")
      sender?: Address.t,
      @as("amount")
      amount?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?sender,
        ?amount,
        ?mockEventData,
      } = args

      let params = 
      {
       sender: sender->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       amount: amount->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.GuardianVault.Deposit.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.GuardianVault.Deposit.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.GuardianVault.Deposit.event)
    }
  }

  module Withdrawal = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.GuardianVault.Withdrawal.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.GuardianVault.Withdrawal.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("recipient")
      recipient?: Address.t,
      @as("amount")
      amount?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?recipient,
        ?amount,
        ?mockEventData,
      } = args

      let params = 
      {
       recipient: recipient->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       amount: amount->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.GuardianVault.Withdrawal.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.GuardianVault.Withdrawal.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.GuardianVault.Withdrawal.event)
    }
  }

  module BeneficiaryAdded = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.GuardianVault.BeneficiaryAdded.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.GuardianVault.BeneficiaryAdded.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("beneficiary")
      beneficiary?: Address.t,
      @as("percentage")
      percentage?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?beneficiary,
        ?percentage,
        ?mockEventData,
      } = args

      let params = 
      {
       beneficiary: beneficiary->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       percentage: percentage->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.GuardianVault.BeneficiaryAdded.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.GuardianVault.BeneficiaryAdded.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.GuardianVault.BeneficiaryAdded.event)
    }
  }

  module TriggerActivated = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.GuardianVault.TriggerActivated.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.GuardianVault.TriggerActivated.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("triggerType")
      triggerType?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?triggerType,
        ?mockEventData,
      } = args

      let params = 
      {
       triggerType: triggerType->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.GuardianVault.TriggerActivated.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.GuardianVault.TriggerActivated.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.GuardianVault.TriggerActivated.event)
    }
  }

}


module USDC = {
  module Transfer = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.USDC.Transfer.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.USDC.Transfer.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("from")
      from?: Address.t,
      @as("to")
      to?: Address.t,
      @as("value")
      value?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?from,
        ?to,
        ?value,
        ?mockEventData,
      } = args

      let params = 
      {
       from: from->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       to: to->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       value: value->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.USDC.Transfer.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.USDC.Transfer.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.USDC.Transfer.event)
    }
  }

}


module WETH = {
  module Transfer = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.WETH.Transfer.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.WETH.Transfer.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("from")
      from?: Address.t,
      @as("to")
      to?: Address.t,
      @as("value")
      value?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?from,
        ?to,
        ?value,
        ?mockEventData,
      } = args

      let params = 
      {
       from: from->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       to: to->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       value: value->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.WETH.Transfer.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.WETH.Transfer.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.WETH.Transfer.event)
    }
  }

}

