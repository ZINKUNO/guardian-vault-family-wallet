@val external require: string => unit = "require"

let registerContractHandlers = (
  ~contractName,
  ~handlerPathRelativeToRoot,
  ~handlerPathRelativeToConfig,
) => {
  try {
    require(`../${Path.relativePathToRootFromGenerated}/${handlerPathRelativeToRoot}`)
  } catch {
  | exn =>
    let params = {
      "Contract Name": contractName,
      "Expected Handler Path": handlerPathRelativeToConfig,
      "Code": "EE500",
    }
    let logger = Logging.createChild(~params)

    let errHandler = exn->ErrorHandling.make(~msg="Failed to import handler file", ~logger)
    errHandler->ErrorHandling.log
    errHandler->ErrorHandling.raiseExn
  }
}

let makeGeneratedConfig = () => {
  let chains = [
    {
      let contracts = [
        {
          Config.name: "GuardianVault",
          abi: Types.GuardianVault.abi,
          addresses: [
            "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"->Address.Evm.fromStringOrThrow
,
          ],
          events: [
            (Types.GuardianVault.Deposit.register() :> Internal.eventConfig),
            (Types.GuardianVault.Withdrawal.register() :> Internal.eventConfig),
            (Types.GuardianVault.BeneficiaryAdded.register() :> Internal.eventConfig),
            (Types.GuardianVault.TriggerActivated.register() :> Internal.eventConfig),
          ],
          startBlock: None,
        },
        {
          Config.name: "USDC",
          abi: Types.USDC.abi,
          addresses: [
            "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"->Address.Evm.fromStringOrThrow
,
          ],
          events: [
            (Types.USDC.Transfer.register() :> Internal.eventConfig),
          ],
          startBlock: None,
        },
        {
          Config.name: "WETH",
          abi: Types.WETH.abi,
          addresses: [
            "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"->Address.Evm.fromStringOrThrow
,
          ],
          events: [
            (Types.WETH.Transfer.register() :> Internal.eventConfig),
          ],
          startBlock: None,
        },
      ]
      let chain = ChainMap.Chain.makeUnsafe(~chainId=11155111)
      {
        Config.maxReorgDepth: 200,
        startBlock: 0,
        id: 11155111,
        contracts,
        sources: NetworkSources.evm(~chain, ~contracts=[{name: "GuardianVault",events: [Types.GuardianVault.Deposit.register(), Types.GuardianVault.Withdrawal.register(), Types.GuardianVault.BeneficiaryAdded.register(), Types.GuardianVault.TriggerActivated.register()],abi: Types.GuardianVault.abi}, {name: "USDC",events: [Types.USDC.Transfer.register()],abi: Types.USDC.abi}, {name: "WETH",events: [Types.WETH.Transfer.register()],abi: Types.WETH.abi}], ~hyperSync=None, ~allEventSignatures=[Types.GuardianVault.eventSignatures, Types.USDC.eventSignatures, Types.WETH.eventSignatures]->Belt.Array.concatMany, ~shouldUseHypersyncClientDecoder=true, ~rpcs=[{url: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY", sourceFor: Sync, syncConfig: {}}], ~lowercaseAddresses=false)
      }
    },
  ]

  Config.make(
    ~shouldRollbackOnReorg=true,
    ~shouldSaveFullHistory=false,
    ~multichain=if (
      Env.Configurable.isUnorderedMultichainMode->Belt.Option.getWithDefault(
        Env.Configurable.unstable__temp_unordered_head_mode->Belt.Option.getWithDefault(
          false,
        ),
      )
    ) {
      Unordered
    } else {
      Ordered
    },
    ~chains,
    ~enableRawEvents=false,
    ~batchSize=?Env.batchSize,
    ~preloadHandlers=false,
    ~lowercaseAddresses=false,
    ~shouldUseHypersyncClientDecoder=true,
  )
}

let configWithoutRegistrations = makeGeneratedConfig()

let registerAllHandlers = () => {
  EventRegister.startRegistration(
    ~ecosystem=configWithoutRegistrations.ecosystem,
    ~multichain=configWithoutRegistrations.multichain,
    ~preloadHandlers=configWithoutRegistrations.preloadHandlers,
  )

  registerContractHandlers(
    ~contractName="GuardianVault",
    ~handlerPathRelativeToRoot="src/handlers.ts",
    ~handlerPathRelativeToConfig="src/handlers.ts",
  )
  registerContractHandlers(
    ~contractName="USDC",
    ~handlerPathRelativeToRoot="src/handlers.ts",
    ~handlerPathRelativeToConfig="src/handlers.ts",
  )
  registerContractHandlers(
    ~contractName="WETH",
    ~handlerPathRelativeToRoot="src/handlers.ts",
    ~handlerPathRelativeToConfig="src/handlers.ts",
  )

  EventRegister.finishRegistration()
}

let initialSql = Db.makeClient()
let storagePgSchema = Env.Db.publicSchema
let makeStorage = (~sql, ~pgSchema=storagePgSchema, ~isHasuraEnabled=Env.Hasura.enabled) => {
  PgStorage.make(
    ~sql,
    ~pgSchema,
    ~pgHost=Env.Db.host,
    ~pgUser=Env.Db.user,
    ~pgPort=Env.Db.port,
    ~pgDatabase=Env.Db.database,
    ~pgPassword=Env.Db.password,
    ~onInitialize=?{
      if isHasuraEnabled {
        Some(
          () => {
            Hasura.trackDatabase(
              ~endpoint=Env.Hasura.graphqlEndpoint,
              ~auth={
                role: Env.Hasura.role,
                secret: Env.Hasura.secret,
              },
              ~pgSchema=storagePgSchema,
              ~userEntities=Entities.userEntities,
              ~responseLimit=Env.Hasura.responseLimit,
              ~schema=Db.schema,
              ~aggregateEntities=Env.Hasura.aggregateEntities,
            )->Promise.catch(err => {
              Logging.errorWithExn(
                err->Utils.prettifyExn,
                `EE803: Error tracking tables`,
              )->Promise.resolve
            })
          },
        )
      } else {
        None
      }
    },
    ~onNewTables=?{
      if isHasuraEnabled {
        Some(
          (~tableNames) => {
            Hasura.trackTables(
              ~endpoint=Env.Hasura.graphqlEndpoint,
              ~auth={
                role: Env.Hasura.role,
                secret: Env.Hasura.secret,
              },
              ~pgSchema=storagePgSchema,
              ~tableNames,
            )->Promise.catch(err => {
              Logging.errorWithExn(
                err->Utils.prettifyExn,
                `EE804: Error tracking new tables`,
              )->Promise.resolve
            })
          },
        )
      } else {
        None
      }
    },
    ~isHasuraEnabled,
  )
}

let codegenPersistence = Persistence.make(
  ~userEntities=Entities.userEntities,
  ~allEnums=Enums.allEnums,
  ~storage=makeStorage(~sql=initialSql),
  ~sql=initialSql,
)

%%private(let indexer: ref<option<Indexer.t>> = ref(None))
let getIndexer = () => {
  switch indexer.contents {
  | Some(indexer) => indexer
  | None =>
    let i = {
      Indexer.registrations: registerAllHandlers(),
      // Need to recreate initial config one more time,
      // since configWithoutRegistrations called register for event
      // before they were ready
      config: makeGeneratedConfig(),
      persistence: codegenPersistence,
    }
    indexer := Some(i)
    i
  }
}
