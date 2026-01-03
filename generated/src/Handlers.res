  @genType
module GuardianVault = {
  module Deposit = Types.MakeRegister(Types.GuardianVault.Deposit)
  module Withdrawal = Types.MakeRegister(Types.GuardianVault.Withdrawal)
  module BeneficiaryAdded = Types.MakeRegister(Types.GuardianVault.BeneficiaryAdded)
  module TriggerActivated = Types.MakeRegister(Types.GuardianVault.TriggerActivated)
}

  @genType
module USDC = {
  module Transfer = Types.MakeRegister(Types.USDC.Transfer)
}

  @genType
module WETH = {
  module Transfer = Types.MakeRegister(Types.WETH.Transfer)
}

@genType /** Register a Block Handler. It'll be called for every block by default. */
let onBlock: (
  Envio.onBlockOptions<Types.chain>,
  Envio.onBlockArgs<Types.handlerContext> => promise<unit>,
) => unit = (
  EventRegister.onBlock: (unknown, Internal.onBlockArgs => promise<unit>) => unit
)->Utils.magic
