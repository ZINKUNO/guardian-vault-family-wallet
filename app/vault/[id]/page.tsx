"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Shield, ArrowLeft, Wallet, Clock, Users, History, Key, CheckCircle2, ExternalLink, Loader2, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useBalance } from "wagmi"
import { parseEther, formatEther } from "viem"
import { sepolia } from "viem/chains"
import { useAutoExecution } from "@/hooks/useAutoExecution"
import Link from "next/link"

export default function VaultPage() {
  const { id } = useParams()
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const [vault, setVault] = useState<any>(null)
  const [permissions, setPermissions] = useState<any[]>([])
  const [executionHistory, setExecutionHistory] = useState<any[]>([])
  const [depositAmount, setDepositAmount] = useState("")
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false)
  
  // Wagmi hooks for contract interaction
  const { data: hash, writeContract, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })
  const { data: balance } = useBalance({ address })

  // Auto-execution hook for beneficiary distribution
  const { 
    autoStatus, 
    triggerStatus, 
    isExecuting, 
    executeDistribution, 
    executionHistory: autoExecHistory,
    getExecutionSummary 
  } = useAutoExecution(vault)

  // Update vault balance when transaction confirms
  useEffect(() => {
    if (isConfirmed && vault && depositAmount) {
      const updatedVaults = JSON.parse(localStorage.getItem("guardian_vaults") || "[]").map((v: any) => {
        if (v.id === id) {
          const currentBalance = parseFloat(v.balance || "0")
          const depositValue = parseFloat(depositAmount)
          return {
            ...v,
            balance: (currentBalance + depositValue).toFixed(4)
          }
        }
        return v
      })
      localStorage.setItem("guardian_vaults", JSON.stringify(updatedVaults))
      setVault(updatedVaults.find((v: any) => v.id === id))
      
      // Reset dialog
      setIsDepositDialogOpen(false)
      setDepositAmount("")
    }
  }, [isConfirmed, vault, id, depositAmount])

  useEffect(() => {
    const loadData = () => {
      const storedVaults = JSON.parse(localStorage.getItem("guardian_vaults") || "[]")
      const foundVault = storedVaults.find((v: any) => v.id === id)
      if (foundVault) {
        setVault(foundVault)
        const storedPerms = JSON.parse(localStorage.getItem("guardian_permissions") || "[]")
        setPermissions(storedPerms.filter((p: any) => p.vaultId === id))
        const storedHistory = JSON.parse(localStorage.getItem("guardian_execution_history") || "[]")
        setExecutionHistory(storedHistory.filter((h: any) => h.vaultId === id))
      }
    }
    
    loadData()
    // Refresh every 5 seconds for real-time updates
    const interval = setInterval(loadData, 5000)
    return () => clearInterval(interval)
  }, [id])

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) return
    
    try {
      // Mock vault contract ABI - in production, use actual deployed vault contract
      const VAULT_ABI = [
        {
          inputs: [],
          name: "deposit",
          outputs: [],
          stateMutability: "payable",
          type: "function"
        }
      ] as const

      // For demo, we'll simulate the transaction
      // In production, this would be the actual vault contract address
      const mockVaultAddress = vault?.vaultAddress || "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
      
      writeContract({
        address: mockVaultAddress as `0x${string}`,
        abi: VAULT_ABI,
        functionName: "deposit",
        value: parseEther(depositAmount),
        chain: sepolia
      })
    } catch (error) {
      console.error("Deposit failed:", error)
    }
  }

  if (!vault) return null

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <Button variant="ghost" onClick={() => router.back()} className="mb-8 hover:bg-transparent -ml-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-primary/10 text-primary border-primary/20">Active Vault</Badge>
              <Badge variant="outline" className="font-mono text-xs">
                ID: {vault.id}
              </Badge>
            </div>
            <h1 className="text-4xl font-bold mb-2">{vault.name}</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Smart Account Vault • Established {new Date(vault.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="bg-transparent"
              onClick={() => setIsDepositDialogOpen(true)}
              disabled={!isConnected}
            >
              {isConnected ? "Deposit" : "Connect Wallet"}
            </Button>
            <Button asChild>
              <Link href="/permissions">Manage Permissions</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {/* Balance Overview */}
            <Card className="bg-card/50 overflow-hidden border-primary/10">
              <div className="h-1.5 bg-primary" />
              <CardHeader>
                <CardTitle>Vault Assets</CardTitle>
                <CardDescription>Current balance and inheritance rules.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-4 rounded-2xl">
                      <Wallet className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Available Balance</p>
                      <p className="text-4xl font-bold">
                        {vault.balance} {vault.assetType.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <div className="flex items-center gap-1.5 text-emerald-500 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      Secured
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Inactivity Trigger
                    </span>
                    <span className="font-medium text-orange-500">{vault.emergencyRule || 90} Days</span>
                  </div>
                  {vault.createdAt && (() => {
                    const daysSinceCreation = Math.floor((Date.now() - new Date(vault.createdAt).getTime()) / (1000 * 60 * 60 * 24))
                    const triggerDays = parseInt(vault.emergencyRule || "90")
                    const progress = Math.min(100, (daysSinceCreation / triggerDays) * 100)
                    return (
                      <>
                        <Progress value={progress} className="h-2" />
                        <p className="text-[10px] text-muted-foreground text-center italic">
                          {daysSinceCreation < triggerDays 
                            ? `${daysSinceCreation} days since creation. ${triggerDays - daysSinceCreation} days until trigger.`
                            : "Trigger condition met. Assets can be released."}
                        </p>
                      </>
                    )
                  })()}
                </div>
              </CardContent>
            </Card>

            {/* Auto-Execution Status */}
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Auto-Execution Status
                </CardTitle>
                <CardDescription>
                  Automatic beneficiary distribution when trigger conditions are met.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Auto-Execution</p>
                    <p className="text-xs text-muted-foreground">
                      {autoStatus.isEnabled ? "Enabled - Checking every minute" : "Disabled"}
                    </p>
                  </div>
                  <Badge className={autoStatus.isEnabled ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-muted"}>
                    {autoStatus.isEnabled ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Trigger Status</p>
                    <p className="text-xs text-muted-foreground">
                      {triggerStatus.isTriggered ? "Condition met - Ready to execute" : "Waiting for trigger"}
                    </p>
                  </div>
                  <Badge variant={triggerStatus.isTriggered ? "destructive" : "secondary"}>
                    {triggerStatus.isTriggered ? "🔥 Ready" : "⏳ Waiting"}
                  </Badge>
                </div>

                {triggerStatus.isTriggered && (
                  <Button 
                    onClick={executeDistribution}
                    disabled={isExecuting}
                    className="w-full"
                  >
                    {isExecuting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Executing Distribution...
                      </>
                    ) : (
                      "Execute Beneficiary Distribution Now"
                    )}
                  </Button>
                )}

                {autoStatus.lastExecution && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Last Execution:</p>
                    <div className="text-xs space-y-1">
                      <p>Status: <span className={`font-medium ${
                        autoStatus.lastExecution.overallStatus === 'success' ? 'text-emerald-500' :
                        autoStatus.lastExecution.overallStatus === 'partial' ? 'text-orange-500' :
                        'text-red-500'
                      }`}>{autoStatus.lastExecution.overallStatus.toUpperCase()}</span></p>
                      <p>Distributed: {autoStatus.lastExecution.totalDistributed} {vault.assetType}</p>
                      <p>Beneficiaries: {autoStatus.lastExecution.summary.successCount}/{autoStatus.lastExecution.summary.totalBeneficiaries} successful</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Permissions */}
            <Card className="bg-card/50">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5 text-primary" />
                    ERC-7715 Permissions
                  </CardTitle>
                  <Badge variant="outline">{permissions.length}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {permissions.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground italic border border-dashed rounded-xl">
                    No active permissions for this vault.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {permissions.map((p) => {
                      const remaining = p.remainingAllowance || p.spendLimit
                      return (
                        <div key={p.id} className="flex items-center justify-between p-4 border rounded-xl bg-card/30">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">
                                {p.spendLimit} {p.assetType || "ETH"}
                              </p>
                              <Badge className="text-[9px] h-4 py-0 bg-primary/10 text-primary border-none">
                                Primary Agent
                              </Badge>
                              <Badge variant="outline" className="text-[9px] h-4 py-0">
                                {p.assetType || "ETH"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-xs">
                              <span className="text-muted-foreground">
                                Remaining: <span className="font-semibold text-emerald-500">{remaining} {p.assetType || "ETH"}</span>
                              </span>
                              <span className="text-muted-foreground font-mono">
                                Agent: {p.agentAddress?.substring(0, 8)}...{p.agentAddress?.slice(-6)}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-medium">Expires</p>
                            <p className="text-xs text-muted-foreground">{new Date(p.expiry).toLocaleDateString()}</p>
                            <Badge 
                              variant="outline" 
                              className="mt-2 text-[9px] h-4 py-0"
                              style={{
                                backgroundColor: p.status === "active" ? "rgba(16, 185, 129, 0.1)" : "rgba(107, 114, 128, 0.1)",
                                color: p.status === "active" ? "rgb(16, 185, 129)" : "rgb(107, 114, 128)",
                                borderColor: p.status === "active" ? "rgba(16, 185, 129, 0.2)" : "rgba(107, 114, 128, 0.2)"
                              }}
                            >
                              {p.status || "active"}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            {/* Beneficiaries */}
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Beneficiaries
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {vault.beneficiaries.map((b: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg bg-card border border-muted-foreground/10"
                  >
                    <div>
                      <p className="text-sm font-bold">{b.name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{b.address}</p>
                    </div>
                    <Badge variant="outline" className="text-[9px]">
                      Verified
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* History */}
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" />
                  Vault Activity
                </CardTitle>
                <CardDescription className="text-xs">
                  {executionHistory.length} execution{executionHistory.length !== 1 ? 's' : ''} recorded
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {executionHistory.length === 0 ? (
                  <div className="text-xs space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1" />
                      <div>
                        <p className="font-medium">Vault Created</p>
                        <p className="text-muted-foreground">Smart account initialized</p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {new Date(vault.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1" />
                      <div>
                        <p className="font-medium">Beneficiaries Added</p>
                        <p className="text-muted-foreground">{vault.beneficiaries.length} member{vault.beneficiaries.length !== 1 ? 's' : ''} registered</p>
                      </div>
                    </div>
                    {permissions.length > 0 && (
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1" />
                        <div>
                          <p className="font-medium">Permissions Granted</p>
                          <p className="text-muted-foreground">{permissions.length} active permission{permissions.length !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs space-y-4">
                    {executionHistory.slice(0, 5).map((h) => (
                      <div key={h.id} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1" />
                        <div className="flex-1">
                          <p className="font-medium">Transfer Executed</p>
                          <p className="text-muted-foreground">
                            {h.amount} {h.assetType} → {h.beneficiary.substring(0, 8)}...{h.beneficiary.slice(-6)}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {new Date(h.timestamp).toLocaleString()}
                          </p>
                          {h.transactionHash && (
                            <a
                              href={`https://sepolia.etherscan.io/tx/${h.transactionHash}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-primary hover:underline flex items-center gap-1 mt-1"
                            >
                              View on Etherscan <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] h-4 py-0">
                          Success
                        </Badge>
                      </div>
                    ))}
                    {executionHistory.length > 5 && (
                      <p className="text-[10px] text-muted-foreground text-center pt-2">
                        +{executionHistory.length - 5} more execution{executionHistory.length - 5 !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Deposit Dialog */}
      {isDepositDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Deposit to Vault</CardTitle>
              <CardDescription>
                Send ETH to your family vault using MetaMask
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (ETH)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.1"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  step="0.001"
                  min="0.001"
                />
                {balance && (
                  <p className="text-xs text-muted-foreground">
                    Available: {Number(formatEther(balance.value)).toFixed(4)} ETH
                  </p>
                )}
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDepositDialogOpen(false)
                    setDepositAmount("")
                  }}
                  disabled={isPending || isConfirming}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeposit}
                  disabled={!depositAmount || parseFloat(depositAmount) <= 0 || isPending || isConfirming}
                  className="flex-1"
                >
                  {isPending || isConfirming ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Deposit ${depositAmount || "0"} ETH`
                  )}
                </Button>
              </div>
              
              {hash && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Transaction submitted:</p>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${hash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    View on Etherscan <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
