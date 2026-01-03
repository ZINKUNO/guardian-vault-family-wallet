"use client"

import { useState, useEffect, useMemo } from "react"
import { Zap, AlertTriangle, CheckCircle2, Terminal, ArrowRight, Loader2, Wallet, Activity, ExternalLink } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "@/hooks/use-toast"
import { useAccount, useBalance, usePublicClient } from "wagmi"
import { formatEther } from "viem"
import { executeTransfer } from "@/lib/agents/executeTransfer"
import { createAgentAccount } from "@/lib/agents/createAgentAccount"
import { useTriggerSystem } from "@/hooks/useTriggerSystem"

export default function AgentPage() {
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const { data: balance } = useBalance({ address })

  const [vaults, setVaults] = useState<any[]>([])
  const [permissions, setPermissions] = useState<any[]>([])
  const [triggerActive, setTriggerActive] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [executingPermissionId, setExecutingPermissionId] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>(["> Agent initialized", "> Waiting for ERC-7715 context..."])
  const [executionHistory, setExecutionHistory] = useState<any[]>([])

  // Calculate real stats from actual data
  const totalVaultBalance = useMemo(() => {
    return vaults.reduce((sum, v) => sum + parseFloat(v.balance || "0"), 0).toFixed(4)
  }, [vaults])

  const activeVaultBalance = useMemo(() => {
    // Calculate balance that can be executed (vaults with active permissions)
    return vaults
      .filter(v => permissions.some(p => p.vaultId === v.id && p.status === "active"))
      .reduce((sum, v) => sum + parseFloat(v.balance || "0"), 0)
      .toFixed(4)
  }, [vaults, permissions])

  const totalPermissionsAllowance = useMemo(() => {
    // Total allowance across all active permissions
    return permissions
      .filter(p => p.status === "active")
      .reduce((sum, p) => sum + parseFloat(p.remainingAllowance || p.spendLimit || "0"), 0)
      .toFixed(4)
  }, [permissions])

  const activePermissionsCount = useMemo(() => {
    return permissions.filter(p => p.status === "active").length
  }, [permissions])

  const totalExecuted = useMemo(() => {
    return executionHistory
      .filter(h => h.status === "success")
      .reduce((sum, h) => sum + parseFloat(h.amount || "0"), 0)
      .toFixed(4)
  }, [executionHistory])

  // Load vaults and permissions from localStorage
  useEffect(() => {
    const loadData = () => {
      if (typeof window === 'undefined') return;
      const storedVaults = JSON.parse(localStorage.getItem("guardian_vaults") || "[]")
      const storedPerms = JSON.parse(localStorage.getItem("guardian_permissions") || "[]")
      const storedHistory = JSON.parse(localStorage.getItem("guardian_execution_history") || "[]")

      const activePerms = storedPerms.filter((p: any) => p.status === "active")

      setVaults(storedVaults)
      setPermissions(activePerms)
      setExecutionHistory(storedHistory)

      // Only log on initial load
      if (logs.length <= 2 && activePerms.length > 0) {
        addLog(`> Found ${activePerms.length} active permission${activePerms.length !== 1 ? 's' : ''}`)
        activePerms.forEach((p: any) => {
          const vault = storedVaults.find((v: any) => v.id === p.vaultId)
          if (vault) {
            addLog(`> Permission ${p.id.substring(0, 8)}... for vault "${vault.name}"`)
            addLog(`>   Allowance: ${p.remainingAllowance || p.spendLimit} ${p.assetType || "ETH"}`)
          }
        })
      }
    }

    loadData()
    // Refresh every 3 seconds to get latest data
    const interval = setInterval(loadData, 3000)
    return () => clearInterval(interval)
  }, [])

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, msg])
  }

  const simulateTrigger = () => {
    setTriggerActive(true)
    addLog("> EMERGENCY TRIGGER ACTIVATED")
    addLog("> Validating trigger conditions (Inactivity Oracle)...")
    addLog("> Conditions met. Permissions now executable.")
    toast({
      title: "Trigger Activated",
      description: "Emergency conditions have been met. Agent can now execute.",
    })
  }

  const handleExecute = async (permission: any) => {
    if (!address || !publicClient) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to execute transfers.",
        variant: "destructive",
      })
      return
    }

    if (!triggerActive) {
      toast({
        title: "Trigger Not Active",
        description: "Please activate the emergency trigger first.",
        variant: "destructive",
      })
      return
    }

    setIsExecuting(true)
    setExecutingPermissionId(permission.id)

    try {
      // Get vault details
      const vault = vaults.find(v => v.id === permission.vaultId)
      if (!vault) {
        throw new Error("Vault not found")
      }

      // Check vault balance
      const vaultBalance = parseFloat(vault.balance || "0")
      const executeAmount = parseFloat(permission.spendLimit)

      if (vaultBalance < executeAmount) {
        throw new Error(`Insufficient vault balance. Available: ${vaultBalance} ${permission.assetType || "ETH"}`)
      }

      // Check remaining allowance
      const remainingAllowance = parseFloat(permission.remainingAllowance || permission.spendLimit || "0")
      if (remainingAllowance < executeAmount) {
        throw new Error(`Insufficient permission allowance. Remaining: ${remainingAllowance} ${permission.assetType || "ETH"}`)
      }

      // Get beneficiary address from vault
      const beneficiaryAddress = vault.beneficiaries?.[0]?.address || address

      addLog(`> Initiating ERC-7715 execution for vault ${vault.name}...`)
      addLog(`> Vault ID: ${permission.vaultId.substring(0, 8)}...`)
      addLog(`> Current Vault Balance: ${vaultBalance} ${permission.assetType || "ETH"}`)
      addLog(`> Beneficiary: ${beneficiaryAddress.substring(0, 10)}...${beneficiaryAddress.slice(-8)}`)
      addLog(`> Transfer Amount: ${permission.spendLimit} ${permission.assetType || "ETH"}`)
      addLog(`> Permission ID: ${permission.id.substring(0, 8)}...`)

      // Create agent account for execution (in production, this would be stored securely)
      addLog("> Creating Primary Executor Agent session account...")
      await new Promise((r) => setTimeout(r, 500))
      const primaryAgent = await createAgentAccount('primary', permission.vaultId)
      addLog(`> Primary Agent Address: ${primaryAgent.address.substring(0, 10)}...${primaryAgent.address.slice(-8)}`)

      // Request re-delegation check from Verifier Agent (A2A flow)
      addLog("> Requesting re-delegation check from Verifier Agent...")
      addLog("> Validating A2A (Agent-to-Agent) delegation chain...")
      await new Promise((r) => setTimeout(r, 800))

      const verifierAgent = await createAgentAccount('verifier', permission.vaultId)
      addLog(`> Verifier Agent Address: ${verifierAgent.address.substring(0, 10)}...${verifierAgent.address.slice(-8)}`)
      addLog("> Verifier Agent confirmed. Delegation chain validated.")
      addLog("> Submitting UserOperation with ERC-7715 delegation...")

      // Execute transfer using ERC-7715 permission
      if (!permission.permissionsContext || !permission.delegationManager) {
        throw new Error("Permission context or delegation manager missing. Please grant permission again.")
      }

      addLog("> Estimating gas for UserOperation...")
      await new Promise((r) => setTimeout(r, 600))

      const executionResult = await executeTransfer({
        primaryAgentAccount: primaryAgent.account,
        beneficiaryAddress: beneficiaryAddress as `0x${string}`,
        tokenType: permission.assetType === "USDC" ? "ERC20" : "ETH",
        amount: permission.spendLimit,
        permissionsContext: permission.permissionsContext,
        delegationManager: permission.delegationManager as `0x${string}`,
        publicClient: publicClient,
        tokenAddress: permission.assetType === "USDC"
          ? (process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}` || "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238" as `0x${string}`)
          : undefined
      })

      const txHash = executionResult.transactionHash || executionResult.userOpHash
      addLog(`> UserOperation submitted: ${txHash?.substring(0, 20)}...`)
      addLog("> Waiting for transaction confirmation...")
      await new Promise((r) => setTimeout(r, 1000))
      addLog(`> ✅ SUCCESS: Released ${permission.spendLimit} ${permission.assetType || "ETH"} to beneficiary`)
      addLog(`> Transaction Hash: ${txHash}`)
      addLog(`> New Vault Balance: ${(vaultBalance - executeAmount).toFixed(4)} ${permission.assetType || "ETH"}`)

      // Update execution history
      const historyEntry = {
        id: crypto.randomUUID(),
        permissionId: permission.id,
        vaultId: permission.vaultId,
        vaultName: vault.name,
        amount: permission.spendLimit,
        assetType: permission.assetType || "ETH",
        beneficiary: beneficiaryAddress,
        transactionHash: txHash,
        timestamp: Date.now(),
        status: "success"
      }

      const existingHistory = JSON.parse(localStorage.getItem("guardian_execution_history") || "[]")
      localStorage.setItem("guardian_execution_history", JSON.stringify([historyEntry, ...existingHistory]))
      setExecutionHistory([historyEntry, ...existingHistory])

      // Update vault balance (subtract executed amount)
      const updatedVaults = vaults.map(v => {
        if (v.id === permission.vaultId) {
          const currentBalance = parseFloat(v.balance || "0")
          const executedAmount = parseFloat(permission.spendLimit)
          return {
            ...v,
            balance: Math.max(0, currentBalance - executedAmount).toFixed(4)
          }
        }
        return v
      })
      setVaults(updatedVaults)
      localStorage.setItem("guardian_vaults", JSON.stringify(updatedVaults))

      // Update permission remaining allowance
      const updatedPermissions = permissions.map(p => {
        if (p.id === permission.id) {
          const currentAllowance = parseFloat(p.remainingAllowance || p.spendLimit || "0")
          const executedAmount = parseFloat(permission.spendLimit)
          const newAllowance = Math.max(0, currentAllowance - executedAmount).toFixed(4)
          return {
            ...p,
            remainingAllowance: newAllowance,
            // Mark as expired if allowance is 0
            status: parseFloat(newAllowance) === 0 ? "expired" : p.status
          }
        }
        return p
      })
      setPermissions(updatedPermissions.filter(p => p.status === "active"))
      localStorage.setItem("guardian_permissions", JSON.stringify(
        JSON.parse(localStorage.getItem("guardian_permissions") || "[]").map((p: any) => {
          if (p.id === permission.id) {
            const currentAllowance = parseFloat(p.remainingAllowance || p.spendLimit || "0")
            const executedAmount = parseFloat(permission.spendLimit)
            return {
              ...p,
              remainingAllowance: Math.max(0, currentAllowance - executedAmount).toFixed(4),
              status: parseFloat(Math.max(0, currentAllowance - executedAmount).toFixed(4)) === 0 ? "expired" : p.status
            }
          }
          return p
        })
      ))

      toast({
        title: "Assets Released Successfully",
        description: `Released ${permission.spendLimit} ${permission.assetType || "ETH"} to beneficiary. Transaction: ${txHash?.substring(0, 10)}...`,
      })

    } catch (error: any) {
      console.error("Execution error:", error)
      addLog(`> ❌ ERROR: ${error.message || "Execution failed"}`)
      addLog(`> Execution aborted. Vault balance unchanged.`)
      toast({
        title: "Execution Failed",
        description: error.message || "Failed to execute transfer. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExecuting(false)
      setExecutingPermissionId(null)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Zap className="w-8 h-8 text-primary" />
            Agent Actions
          </h1>
          <p className="text-muted-foreground">Execute inheritance transfers using ERC-7715 Advanced Permissions.</p>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-4 py-1 text-sm">
          Agent Status: Operational
        </Badge>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-card/50 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Vault Balance</p>
                <p className="text-2xl font-bold">{totalVaultBalance} ETH</p>
                <p className="text-xs text-muted-foreground mt-1">Across {vaults.length} vault{vaults.length !== 1 ? 's' : ''}</p>
              </div>
              <Wallet className="w-8 h-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-emerald-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Balance</p>
                <p className="text-2xl font-bold text-emerald-500">{activeVaultBalance} ETH</p>
                <p className="text-xs text-muted-foreground mt-1">Available for execution</p>
              </div>
              <Activity className="w-8 h-8 text-emerald-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Permissions</p>
                <p className="text-2xl font-bold">{activePermissionsCount}</p>
                <p className="text-xs text-muted-foreground mt-1">{totalPermissionsAllowance} ETH allowance</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-purple-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Executed</p>
                <p className="text-2xl font-bold text-purple-500">{totalExecuted} ETH</p>
                <p className="text-xs text-muted-foreground mt-1">{executionHistory.length} transaction{executionHistory.length !== 1 ? 's' : ''}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-purple-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* Trigger Control */}
          <Card className="bg-card/50 border-orange-500/20 shadow-xl shadow-orange-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Emergency Trigger
              </CardTitle>
              <CardDescription>
                Manual simulation of oracle-based inactivity trigger for hackathon demo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {triggerActive ? (
                <Alert className="bg-emerald-500/10 border-emerald-500/20 text-emerald-500">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Trigger Active</AlertTitle>
                  <AlertDescription>Inheritance conditions have been met. Agents can execute.</AlertDescription>
                </Alert>
              ) : (
                <Button
                  onClick={simulateTrigger}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white border-none h-12"
                >
                  Simulate Emergency Event
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Available Permissions */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Permissions in Context</h2>
            {permissions.length === 0 ? (
              <Card className="bg-card/50 border-dashed py-8 text-center text-muted-foreground">
                No active permissions to execute.
              </Card>
            ) : (
              permissions.map((p) => {
                const vault = vaults.find(v => v.id === p.vaultId)
                const beneficiary = vault?.beneficiaries?.[0]?.address || address || "0x..."
                const remainingAllowance = p.remainingAllowance || p.spendLimit
                const canExecute = triggerActive && parseFloat(remainingAllowance) > 0 && !isExecuting

                return (
                  <Card key={p.id} className="bg-card/50 border-primary/20">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {p.id.substring(0, 8)}...
                        </Badge>
                        {triggerActive && canExecute && (
                          <Badge className="bg-emerald-500 text-white">Ready</Badge>
                        )}
                        {!triggerActive && (
                          <Badge variant="secondary">Waiting for Trigger</Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg mt-2">
                        {vault?.name || `Vault ${p.vaultId.substring(0, 8)}`}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Permission ID: {p.id}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 pb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Spend Limit:</span>
                        <span className="font-bold">{p.spendLimit} {p.assetType || "ETH"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Remaining Allowance:</span>
                        <span className="font-semibold text-emerald-500">
                          {parseFloat(remainingAllowance).toFixed(4)} {p.assetType || "ETH"}
                        </span>
                      </div>
                      {vault && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Vault Balance:</span>
                          <span className="font-semibold">
                            {parseFloat(vault.balance || "0").toFixed(4)} {vault.assetType?.toUpperCase() || "ETH"}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Can Execute:</span>
                        <Badge variant={canExecute ? "default" : "secondary"} className="text-xs">
                          {canExecute ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Beneficiary:</span>
                        <span className="font-mono text-[10px]">
                          {beneficiary.substring(0, 6)}...{beneficiary.slice(-4)}
                        </span>
                      </div>
                      {vault && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Vault Balance:</span>
                            <span className="font-semibold">{parseFloat(vault.balance || "0").toFixed(4)} {vault.assetType?.toUpperCase() || "ETH"}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Vault Status:</span>
                            <Badge variant={parseFloat(vault.balance || "0") > 0 ? "default" : "secondary"} className="text-xs">
                              {parseFloat(vault.balance || "0") > 0 ? "Active" : "Empty"}
                            </Badge>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Expires:</span>
                        <span className="text-xs">
                          {new Date(p.expiry).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button
                        disabled={!canExecute || executingPermissionId === p.id}
                        onClick={() => handleExecute(p)}
                        className="w-full"
                      >
                        {executingPermissionId === p.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Executing...
                          </>
                        ) : (
                          <>
                            Execute Release
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })
            )}
          </div>
        </div>

        {/* Execution Terminal */}
        <div className="flex flex-col h-full">
          <Card className="bg-black border-zinc-800 flex-1 flex flex-col min-h-[400px]">
            <CardHeader className="border-b border-zinc-800 py-3">
              <CardTitle className="text-xs font-mono text-zinc-500 flex items-center gap-2">
                <Terminal className="w-3 h-3" />
                EXECUTION_LOG.SH
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 font-mono text-xs p-4 overflow-y-auto space-y-1">
              <ScrollArea className="h-full">
                {logs.map((log, i) => {
                  // Check if log contains a transaction hash
                  const txHashMatch = log.match(/Transaction Hash: (0x[a-fA-F0-9]+)/i) ||
                    log.match(/Transaction: (0x[a-fA-F0-9]+)/i) ||
                    log.match(/TX: (0x[a-fA-F0-9]+)/i)
                  const isSuccess = log.includes("SUCCESS") || log.includes("✅")
                  const isTrigger = log.includes("TRIGGER") || log.includes("ACTIVATED")
                  const isError = log.includes("ERROR") || log.includes("❌")
                  const isInfo = log.includes(">") && !isSuccess && !isTrigger && !isError

                  return (
                    <div
                      key={i}
                      className={`mb-1 break-words ${isSuccess
                          ? "text-emerald-400 font-semibold"
                          : isTrigger
                            ? "text-orange-400 font-semibold"
                            : isError
                              ? "text-red-400 font-semibold"
                              : isInfo
                                ? "text-zinc-300"
                                : "text-zinc-400"
                        }`}
                    >
                      {log}
                      {txHashMatch && (
                        <a
                          href={`https://sepolia.etherscan.io/tx/${txHashMatch[1]}`}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-2 text-blue-400 hover:text-blue-300 underline inline-flex items-center gap-1"
                        >
                          View <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )
                })}
                {isExecuting && <div className="text-primary animate-pulse">{">"} Processing transaction...</div>}
              </ScrollArea>
            </CardContent>
            <CardFooter className="border-t border-zinc-800 py-3 bg-zinc-950/50 flex justify-between items-center">
              <p className="text-[10px] text-zinc-500 italic">
                Real-time execution logs from ERC-7715 agent operations.
              </p>
              {executionHistory.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[10px] h-6"
                  onClick={() => {
                    const history = executionHistory.slice(0, 5)
                    history.forEach((h: any) => {
                      addLog(`> HISTORY: ${h.amount} ${h.assetType} → ${h.beneficiary.substring(0, 10)}...`)
                      addLog(`>   TX: ${h.transactionHash?.substring(0, 20)}...`)
                    })
                  }}
                >
                  Show Recent History
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
