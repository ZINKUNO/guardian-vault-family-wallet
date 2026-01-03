"use client"

import { useState, useEffect } from "react"
import { Key, User, Clock, DollarSign, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { usePermissionRequest } from "@/hooks/usePermissionRequest"
import { useAccount } from "wagmi"
import { useSmartAccount } from "@/hooks/useSmartAccount"

export default function PermissionsPage() {
  const { address } = useAccount()
  const { isSmartAccount, upgradeRequired } = useSmartAccount()
  const { requestPermission, isLoading, error } = usePermissionRequest()
  
  const [vaults, setVaults] = useState<any[]>([])
  const [selectedVault, setSelectedVault] = useState<string>("")
  const [agentAddress, setAgentAddress] = useState("")
  const [spendLimit, setSpendLimit] = useState("")
  const [assetType, setAssetType] = useState<"ETH" | "USDC">("ETH")
  const [expiry, setExpiry] = useState("365")
  const [granted, setGranted] = useState(false)

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("guardian_vaults") || "[]")
    setVaults(stored)
    if (stored.length > 0) setSelectedVault(stored[0].id)
  }, [])

  // Check if wallet is connected and smart account is ready
  useEffect(() => {
    if (!address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to grant permissions.",
        variant: "destructive",
      })
    } else if (upgradeRequired) {
      toast({
        title: "Smart Account Required",
        description: "Please upgrade to MetaMask Smart Account to use this feature.",
        variant: "destructive",
      })
    }
  }, [address, upgradeRequired])

  const handleGrant = async () => {
    if (!address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      })
      return
    }

    if (upgradeRequired) {
      toast({
        title: "Smart Account Required",
        description: "Please upgrade to MetaMask Smart Account first.",
        variant: "destructive",
      })
      return
    }

    if (!selectedVault || !agentAddress || !spendLimit) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to grant permissions.",
        variant: "destructive",
      })
      return
    }

    // Validate agent address format
    if (!agentAddress.startsWith("0x") || agentAddress.length !== 42) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Ethereum address (0x...).",
        variant: "destructive",
      })
      return
    }

    // Get selected vault details
    const vault = vaults.find(v => v.id === selectedVault)
    if (!vault) {
      toast({
        title: "Vault Not Found",
        description: "Selected vault not found.",
        variant: "destructive",
      })
      return
    }

    try {
      // Calculate period duration (1 day in seconds)
      const periodDuration = 86400 // 1 day
      const durationDays = Number.parseInt(expiry)

      // Get first beneficiary address for the permission
      const beneficiary = vault.beneficiaries?.[0]?.address || address

      // Request permission via MetaMask
      const permissionResponse = await requestPermission({
        tokenType: assetType,
        amount: spendLimit,
        periodDuration: periodDuration,
        duration: durationDays,
        beneficiary: beneficiary,
        vaultName: vault.name,
        vaultId: selectedVault,
        agentAddress: agentAddress
      })

      if (!permissionResponse) {
        // Error already handled by hook
        return
      }

      // Store permission in localStorage
      const newPermission = {
        id: permissionResponse.permissionId,
        vaultId: selectedVault,
        agentAddress: agentAddress,
        spendLimit: spendLimit,
        assetType: assetType,
        expiry: new Date(permissionResponse.expiresAt).toISOString(),
        status: "active",
        createdAt: new Date(permissionResponse.createdAt).toISOString(),
        permissionsContext: permissionResponse.permissionsContext,
        delegationManager: permissionResponse.delegationManager,
        signedDelegation: permissionResponse.signedDelegation
      }

      const existing = JSON.parse(localStorage.getItem("guardian_permissions") || "[]")
      localStorage.setItem("guardian_permissions", JSON.stringify([...existing, newPermission]))

      setGranted(true)

      toast({
        title: "Permission Granted",
        description: "ERC-7715 Advanced Permission has been successfully registered.",
      })
    } catch (err: any) {
      console.error("Permission grant error:", err)
      toast({
        title: "Permission Request Failed",
        description: err.message || "Failed to grant permission. Please try again.",
        variant: "destructive",
      })
    }
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

            <div className="space-y-2">
              <Label htmlFor="assetType">Asset Type (Sepolia Testnet)</Label>
              <Select value={assetType} onValueChange={(value: "ETH" | "USDC") => setAssetType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select asset type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETH">ETH (Sepolia)</SelectItem>
                  <SelectItem value="USDC">USDC (Sepolia)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[10px] text-muted-foreground">
                Select the asset type for this permission on Sepolia testnet.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="limit">Spend Limit ({assetType})</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="limit"
                    className="pl-10"
                    placeholder="max amount"
                    type="number"
                    step="0.000001"
                    value={spendLimit}
                    onChange={(e) => setSpendLimit(e.target.value)}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Maximum amount the agent can spend in {assetType}.
                </p>
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
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
                <strong>Error:</strong> {error.message}
              </div>
            )}
            {upgradeRequired && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-sm text-yellow-600 dark:text-yellow-400">
                <strong>Smart Account Required:</strong> Please upgrade to MetaMask Smart Account to grant permissions.
              </div>
            )}
            <Button
              className="w-full h-12 text-lg shadow-lg shadow-primary/20"
              onClick={handleGrant}
              disabled={isLoading || !address || upgradeRequired}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Requesting Permissions via MetaMask...
                </>
              ) : (
                "Grant Advanced Permission"
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground px-4">
              By clicking grant, you are authorizing the agent to spend up to the limit from your Smart Account vault.
              This action is auditable and revocable. MetaMask will prompt you to approve the permission.
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
