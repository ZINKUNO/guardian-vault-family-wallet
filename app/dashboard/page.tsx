"use client"

import { useState, useEffect } from "react"
import { Plus, Key, ArrowUpRight, Activity, Wallet, History, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function DashboardPage() {
  const [vaults, setVaults] = useState<any[]>([])
  const [permissions, setPermissions] = useState<any[]>([])

  useEffect(() => {
    const storedVaults = JSON.parse(localStorage.getItem("guardian_vaults") || "[]")
    const storedPerms = JSON.parse(localStorage.getItem("guardian_permissions") || "[]")
    setVaults(storedVaults)
    setPermissions(storedPerms)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Vault Dashboard</h1>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<Wallet className="w-5 h-5 text-primary" />}
          label="Total Vault Balance"
          value="12.45 ETH"
          description="Across 3 accounts"
        />
        <StatCard
          icon={<Key className="w-5 h-5 text-primary" />}
          label="Active Permissions"
          value={permissions.length.toString()}
          description="Granted via ERC-7715"
        />
        <StatCard
          icon={<Activity className="w-5 h-5 text-primary" />}
          label="Trigger Status"
          value="Secure"
          description="Last check: 2m ago"
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
                    <th className="text-left py-4 px-6 font-medium">Limit</th>
                    <th className="text-left py-4 px-6 font-medium">Expiry</th>
                    <th className="text-left py-4 px-6 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((p) => (
                    <tr key={p.id} className="border-b last:border-0 hover:bg-card/50 transition-colors">
                      <td className="py-4 px-6 font-mono text-xs truncate max-w-[150px]">{p.agentAddress}</td>
                      <td className="py-4 px-6">{vaults.find((v) => v.id === p.vaultId)?.name || "Unknown"}</td>
                      <td className="py-4 px-6">{p.spendLimit} ETH</td>
                      <td className="py-4 px-6 text-muted-foreground">{new Date(p.expiry).toLocaleDateString()}</td>
                      <td className="py-4 px-6">
                        <Badge className="bg-primary/10 text-primary border-primary/20">Active</Badge>
                      </td>
                    </tr>
                  ))}
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
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted p-2 rounded-lg">
                        <Activity className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Permission Registered</p>
                        <p className="text-xs text-muted-foreground">EIP-7702 Delegation • 2 hours ago</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer" />
                  </div>
                ))}
              </div>
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
