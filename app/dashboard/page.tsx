"use client"

import { useState, useEffect, useMemo } from "react"
import { Plus, Key, ArrowUpRight, Activity, Wallet, History, ExternalLink, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { useAccount, useBalance } from "wagmi"
import { formatEther } from "viem"
import { useEnvioVaults, useEnvioStats } from "@/hooks/useEnvio"
import { Database } from "lucide-react"

export default function DashboardPage() {
  const { address } = useAccount()
  const { data: walletBalance } = useBalance({ address })

  const [vaults, setVaults] = useState<any[]>([])
  const [permissions, setPermissions] = useState<any[]>([])
  const [executionHistory, setExecutionHistory] = useState<any[]>([])

  // Envio Data
  const { vaults: envioVaults, loading: envioLoading } = useEnvioVaults(address)
  const { stats: globalStats } = useEnvioStats()

  // Calculate real stats from actual data
  const totalVaultBalance = useMemo(() => {
    return vaults.reduce((sum, v) => sum + parseFloat(v.balance || "0"), 0).toFixed(4)
  }, [vaults])

  const activeVaultBalance = useMemo(() => {
    // Balance in vaults with active permissions
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

  const totalExecutions = useMemo(() => {
    return executionHistory.length
  }, [executionHistory])

  const totalExecutedAmount = useMemo(() => {
    return executionHistory
      .filter(h => h.status === "success")
      .reduce((sum, h) => sum + parseFloat(h.amount || "0"), 0)
      .toFixed(4)
  }, [executionHistory])

  useEffect(() => {
    const loadData = () => {
      if (typeof window === 'undefined') return;

      const storedVaults = JSON.parse(localStorage.getItem("guardian_vaults") || "[]")
      const storedPerms = JSON.parse(localStorage.getItem("guardian_permissions") || "[]")
      const storedHistory = JSON.parse(localStorage.getItem("guardian_execution_history") || "[]")

      setVaults(storedVaults)
      setPermissions(storedPerms)
      setExecutionHistory(storedHistory)
    }

    loadData()
    // Refresh every 5 seconds for real-time updates
    const interval = setInterval(loadData, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Vault Dashboard</h1>
            {globalStats && (
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 flex gap-1 items-center">
                <Database className="h-3 w-3" /> Envio Live
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">Manage your family assets and active permissions.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild className="bg-transparent">
            <Link href="/agent">Agent View</Link>
          </Button>
          <Button asChild>
            <Link href="/vault/new">
              <Plus className="w-4 h-4 mr-2" />
              New Vault
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Wallet className="w-5 h-5 text-primary" />}
          label="Total Vault Balance"
          value={`${totalVaultBalance} ETH`}
          description={globalStats ? `${(Number(globalStats.totalValueLocked) / 1e18).toFixed(2)} ETH Network TVL` : `Across ${vaults.length} vaults`}
        />
        <StatCard
          icon={<Activity className="w-5 h-5 text-emerald-500" />}
          label="Active Balance"
          value={`${activeVaultBalance} ETH`}
          description={`${totalPermissionsAllowance} ETH allowance`}
        />
        <StatCard
          icon={<Key className="w-5 h-5 text-blue-500" />}
          label="Active Permissions"
          value={activePermissionsCount.toString()}
          description={globalStats ? `${globalStats.activePermissions} Network Delegations` : "ERC-7715 Delegations"}
        />
        <StatCard
          icon={<History className="w-5 h-5 text-purple-500" />}
          label="Total Executed"
          value={`${totalExecutedAmount} ETH`}
          description={globalStats ? `${globalStats.successfulExecutions} Network Executions` : `${totalExecutions} transactions`}
        />
      </div>

      <Tabs defaultValue="vaults" className="space-y-6">
        <TabsList className="bg-card border h-11 p-1">
          <TabsTrigger value="vaults" className="px-6">
            My Vaults
          </TabsTrigger>
          <TabsTrigger value="permissions" className="px-6">
            Active Permissions
          </TabsTrigger>
          <TabsTrigger value="history" className="px-6">
            Audit Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vaults" className="space-y-4">
          {vaults.length === 0 ? (
            <EmptyState title="No Vaults" description="Create your first family vault to get started." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vaults.map((vault) => (
                <Card key={vault.id} className="bg-card/50 overflow-hidden group">
                  <div className="h-2 bg-primary/20 group-hover:bg-primary/40 transition-colors" />
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                        {vault.assetType.toUpperCase()}
                      </Badge>
                      <Link href={`/vault/${vault.id}`} className="text-muted-foreground hover:text-primary">
                        <ArrowUpRight className="w-5 h-5" />
                      </Link>
                    </div>
                    <CardTitle>{vault.name}</CardTitle>
                    <CardDescription className="font-mono text-xs truncate">{vault.id}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Balance</p>
                        <p className="text-2xl font-bold">
                          {vault.balance} {vault.assetType.toUpperCase()}
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-none">
                        Protected
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          {permissions.length === 0 ? (
            <EmptyState title="No Permissions" description="Grant execution rights to agents for your vaults." />
          ) : (
            <div className="border rounded-xl overflow-hidden bg-card/30">
              <table className="w-full text-sm">
                <thead className="bg-card border-b">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium">Agent</th>
                    <th className="text-left py-4 px-6 font-medium">Vault</th>
                    <th className="text-left py-4 px-6 font-medium">Asset</th>
                    <th className="text-left py-4 px-6 font-medium">Limit / Remaining</th>
                    <th className="text-left py-4 px-6 font-medium">Expiry</th>
                    <th className="text-left py-4 px-6 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((p) => {
                    const remaining = p.remainingAllowance || p.spendLimit
                    const vault = vaults.find((v) => v.id === p.vaultId)
                    return (
                      <tr key={p.id} className="border-b last:border-0 hover:bg-card/50 transition-colors">
                        <td className="py-4 px-6 font-mono text-xs truncate max-w-[150px]">
                          {p.agentAddress?.substring(0, 8)}...{p.agentAddress?.slice(-6)}
                        </td>
                        <td className="py-4 px-6">{vault?.name || "Unknown"}</td>
                        <td className="py-4 px-6">
                          <Badge variant="outline" className="text-xs">
                            {p.assetType || "ETH"}
                          </Badge>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="font-semibold">{p.spendLimit} {p.assetType || "ETH"}</span>
                            <span className="text-xs text-muted-foreground">
                              Remaining: {remaining} {p.assetType || "ETH"}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-muted-foreground text-xs">
                          {new Date(p.expiry).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          <Badge
                            className={
                              p.status === "active"
                                ? "bg-primary/10 text-primary border-primary/20"
                                : p.status === "revoked"
                                  ? "bg-red-500/10 text-red-500 border-red-500/20"
                                  : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                            }
                          >
                            {p.status || "active"}
                          </Badge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Audit Trail
              </CardTitle>
              <CardDescription>On-chain actions recorded for your vaults.</CardDescription>
            </CardHeader>
            <CardContent>
              {executionHistory.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="font-medium">No execution history yet</p>
                  <p className="text-sm">Executions will appear here after agents process transfers.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {executionHistory.map((h) => (
                    <div key={h.id} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="bg-emerald-500/10 p-2 rounded-lg">
                          <Activity className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            Released {h.amount} {h.assetType} to beneficiary
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            {new Date(h.timestamp).toLocaleString()} • {h.vaultName}
                          </p>
                          {h.transactionHash && (
                            <a
                              href={`https://sepolia.etherscan.io/tx/${h.transactionHash}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                            >
                              View on Etherscan <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                        {h.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  description,
}: { icon: any; label: string; value: string; description: string }) {
  return (
    <Card className="bg-card/50">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-primary/10 p-2 rounded-lg">{icon}</div>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
        <p className="text-3xl font-bold mb-1">{value}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="py-20 text-center border-2 border-dashed rounded-3xl bg-card/20">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>
      <Button variant="outline" className="bg-transparent">
        Get Started
      </Button>
    </div>
  )
}
