
type hyperSyncConfig = {endpointUrl: string}
type hyperFuelConfig = {endpointUrl: string}

@genType.opaque
type rpcConfig = {
  syncConfig: Config.sourceSync,
}

@genType
type syncSource = HyperSync(hyperSyncConfig) | HyperFuel(hyperFuelConfig) | Rpc(rpcConfig)

@genType.opaque
type aliasAbi = Ethers.abi

type eventName = string

type contract = {
  name: string,
  abi: aliasAbi,
  addresses: array<string>,
  events: array<eventName>,
}

type configYaml = {
  syncSource,
  startBlock: int,
  confirmedBlockThreshold: int,
  contracts: dict<contract>,
  lowercaseAddresses: bool,
}

let publicConfig = ChainMap.fromArrayUnsafe([
  {
    let contracts = Js.Dict.fromArray([
      (
        "GuardianVault",
        {
          name: "GuardianVault",
          abi: Types.GuardianVault.abi,
          addresses: [
            "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
          ],
          events: [
            Types.GuardianVault.Deposit.name,
            Types.GuardianVault.Withdrawal.name,
            Types.GuardianVault.BeneficiaryAdded.name,
            Types.GuardianVault.TriggerActivated.name,
          ],
        }
      ),
      (
        "USDC",
        {
          name: "USDC",
          abi: Types.USDC.abi,
          addresses: [
            "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
          ],
          events: [
            Types.USDC.Transfer.name,
          ],
        }
      ),
      (
        "WETH",
        {
          name: "WETH",
          abi: Types.WETH.abi,
          addresses: [
            "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
          ],
          events: [
            Types.WETH.Transfer.name,
          ],
        }
      ),
    ])
    let chain = ChainMap.Chain.makeUnsafe(~chainId=11155111)
    (
      chain,
      {
        confirmedBlockThreshold: 200,
        syncSource: Rpc({syncConfig: NetworkSources.getSyncConfig({})}),
        startBlock: 0,
        contracts,
        lowercaseAddresses: false
      }
    )
  },
])

@genType
let getGeneratedByChainId: int => configYaml = chainId => {
  let chain = ChainMap.Chain.makeUnsafe(~chainId)
  if !(publicConfig->ChainMap.has(chain)) {
    Js.Exn.raiseError(
      "No chain with id " ++ chain->ChainMap.Chain.toString ++ " found in config.yaml",
    )
  }
  publicConfig->ChainMap.get(chain)
}
