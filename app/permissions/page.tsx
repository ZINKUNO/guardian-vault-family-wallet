"use client"

import { useState, useEffect } from "react"
import { Key, User, Clock, DollarSign, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

export default function PermissionsPage() {
  const [vaults, setVaults] = useState<any[]>([])
  const [selectedVault, setSelectedVault] = useState<string>("")
  const [agentAddress, setAgentAddress] = useState("")
  const [spendLimit, setSpendLimit] = useState("")
  const [expiry, setExpiry] = useState("365")
  const [isGranting, setIsGranting] = useState(false)
  const [granted, setGranted] = useState(false)

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("guardian_vaults") || "[]")
    setVaults(stored)
    if (stored.length > 0) setSelectedVault(stored[0].id)
  }, [])

  const handleGrant = async () => {
    if (!selectedVault || !agentAddress || !spendLimit) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to grant permissions.",
        variant: "destructive",
      })
      return
    }

    setIsGranting(true)

    // Simulate ERC-7715 walletClient.requestExecutionPermissions()
    await new Promise((resolve) => setTimeout(resolve, 2500))

    const newPermission = {
      id: Math.random().toString(36).substring(7),
      vaultId: selectedVault,
      agentAddress,
      spendLimit,
      expiry: new Date(Date.now() + Number.parseInt(expiry) * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
      createdAt: new Date().toISOString(),
    }

    const existing = JSON.parse(localStorage.getItem("guardian_permissions") || "[]")
    localStorage.setItem("guardian_permissions", JSON.stringify([...existing, newPermission]))

    setIsGranting(false)
    setGranted(true)

    toast({
      title: "Permission Granted",
      description: "ERC-7715 Advanced Permission has been successfully registered.",
    })
  }

  if (granted) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-xl text-center">
        <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Permission Active</h1>
        <p className="text-muted-foreground mb-10">
          The Primary Executor Agent now has granular rights to manage assets in your vault within the specified limits.
        </p>
        <div className="flex flex-col gap-3">
          <Button onClick={() => setGranted(false)} className="h-12">
            Grant Another Permission
          </Button>
          <Button variant="outline" asChild className="h-12 bg-transparent">
            <a href="/dashboard">View Dashboard</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-primary/10 p-3 rounded-2xl">
          <Key className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Grant Permissions</h1>
          <p className="text-muted-foreground">Delegate secure execution rights using ERC-7715.</p>
        </div>
      </div>

      {vaults.length === 0 ? (
        <Card className="bg-card/50 border-dashed">
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Vaults Found</h3>
            <p className="text-muted-foreground mb-6">
              You need to create a family vault before you can grant permissions.
            </p>
            <Button asChild>
              <a href="/vault/new">Create Vault</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-card/50 border-primary/20 shadow-xl shadow-primary/5">
          <CardHeader>
            <CardTitle>Permission Details</CardTitle>
            <CardDescription>Grant an agent the right to execute transactions on behalf of your vault.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Select Vault</Label>
              <Select value={selectedVault} onValueChange={setSelectedVault}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a vault" />
                </SelectTrigger>
                <SelectContent>
                  {vaults.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="agent">Primary Agent Address</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="agent"
                  className="pl-10"
                  placeholder="0x..."
                  value={agentAddress}
                  onChange={(e) => setAgentAddress(e.target.value)}
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                This address will be authorized to execute under ERC-7715.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="limit">Spend Limit (ETH)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="limit"
                    className="pl-10"
                    placeholder="max amount"
                    type="number"
                    value={spendLimit}
                    onChange={(e) => setSpendLimit(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiry">Period (Expiry)</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Select value={expiry} onValueChange={setExpiry}>
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 Days</SelectItem>
                      <SelectItem value="90">90 Days</SelectItem>
                      <SelectItem value="365">1 Year</SelectItem>
                      <SelectItem value="730">2 Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-6 border-t">
            <Button
              className="w-full h-12 text-lg shadow-lg shadow-primary/20"
              onClick={handleGrant}
              disabled={isGranting}
            >
              {isGranting ? "Requesting Permissions via MetaMask..." : "Grant Advanced Permission"}
            </Button>
            <p className="text-xs text-center text-muted-foreground px-4">
              By clicking grant, you are authorizing the agent to spend up to the limit from your Smart Account vault.
              This action is auditable and revocable.
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
