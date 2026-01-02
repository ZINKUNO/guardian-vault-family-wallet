"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Shield, ArrowLeft, Wallet, Clock, Users, History, Key, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

export default function VaultPage() {
  const { id } = useParams()
  const router = useRouter()
  const [vault, setVault] = useState<any>(null)
  const [permissions, setPermissions] = useState<any[]>([])

  useEffect(() => {
    const storedVaults = JSON.parse(localStorage.getItem("guardian_vaults") || "[]")
    const foundVault = storedVaults.find((v: any) => v.id === id)
    if (foundVault) {
      setVault(foundVault)
      const storedPerms = JSON.parse(localStorage.getItem("guardian_permissions") || "[]")
      setPermissions(storedPerms.filter((p: any) => p.vaultId === id))
    }
  }, [id])

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
            <Button variant="outline" className="bg-transparent">
              Deposit
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
                    <span className="font-medium text-orange-500">{vault.emergencyRule} Days</span>
                  </div>
                  <Progress value={20} className="h-2" />
                  <p className="text-[10px] text-muted-foreground text-center italic">
                    Last activity detected 18 days ago. Permission remains locked.
                  </p>
                </div>
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
                    {permissions.map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-4 border rounded-xl bg-card/30">
                        <div className="space-y-1">
                          <p className="text-sm font-medium flex items-center gap-2">
                            Spend Limit: {p.spendLimit} ETH
                            <Badge className="text-[9px] h-4 py-0 bg-primary/10 text-primary border-none">
                              Primary Agent
                            </Badge>
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">Agent: {p.agentAddress}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium">Expires</p>
                          <p className="text-xs text-muted-foreground">{new Date(p.expiry).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
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
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-xs space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1" />
                    <div>
                      <p className="font-medium">Vault Created</p>
                      <p className="text-muted-foreground">Smart account initialized</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1" />
                    <div>
                      <p className="font-medium">Beneficiaries Added</p>
                      <p className="text-muted-foreground">{vault.beneficiaries.length} members registered</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
