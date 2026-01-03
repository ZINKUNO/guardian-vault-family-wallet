"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Shield, ArrowLeft, Plus, Trash2, Info, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { useWallet } from "@/hooks/use-wallet"
import { ConnectButton } from "@rainbow-me/rainbowkit"

export default function CreateVaultPage() {
  const router = useRouter()
  const { address, isConnected } = useWallet()
  const [vaultName, setVaultName] = useState("")
  const [beneficiaries, setBeneficiaries] = useState([{ address: "", name: "" }])
  const [assetType, setAssetType] = useState("eth")
  const [emergencyRule, setEmergencyRule] = useState("90")
  const [isDeploying, setIsDeploying] = useState(false)

  const addBeneficiary = () => {
    setBeneficiaries([...beneficiaries, { address: "", name: "" }])
  }

  const removeBeneficiary = (index: number) => {
    if (beneficiaries.length > 1) {
      setBeneficiaries(beneficiaries.filter((_, i) => i !== index))
    }
  }

  const updateBeneficiary = (index: number, field: "address" | "name", value: string) => {
    const newBeneficiaries = [...beneficiaries]
    newBeneficiaries[index][field] = value
    setBeneficiaries(newBeneficiaries)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected || !address) {
      alert("Please connect your wallet first")
      return
    }

    setIsDeploying(true)

    // Simulate deployment delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newVault = {
      id: Math.random().toString(36).substring(7),
      name: vaultName,
      owner: address,
      beneficiaries: beneficiaries.filter(b => b.address && b.name), // Filter empty beneficiaries
      assetType: assetType || "eth",
      emergencyRule: emergencyRule || "90",
      balance: "0.00",
      status: "active",
      createdAt: new Date().toISOString(),
    }

    const existingVaults = JSON.parse(localStorage.getItem("guardian_vaults") || "[]")
    localStorage.setItem("guardian_vaults", JSON.stringify([...existingVaults, newVault]))

    setIsDeploying(false)
    router.push(`/vault/${newVault.id}`)
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="flex items-center gap-4 mb-8">
        <div className="bg-primary/10 p-3 rounded-2xl">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Family Vault</h1>
          <p className="text-muted-foreground">Set up your permissioned inheritance structure.</p>
        </div>
      </div>

      {!isConnected && (
        <Alert className="mb-8 bg-destructive/10 border-destructive/20">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertTitle className="text-destructive">Wallet Connection Required</AlertTitle>
          <AlertDescription className="text-destructive/80 flex items-center justify-between">
            <span>You must connect your wallet before creating a vault.</span>
            <ConnectButton chainStatus="icon" showBalance={false} />
          </AlertDescription>
        </Alert>
      )}

      {isConnected && address && (
        <Alert className="mb-8 bg-primary/10 border-primary/20">
          <Shield className="h-4 w-4 text-primary" />
          <AlertTitle className="text-primary">Wallet Connected</AlertTitle>
          <AlertDescription className="text-primary/80">
            Creating vault for:{" "}
            <span className="font-mono font-semibold">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8">
          {/* General Info */}
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle>Vault Details</CardTitle>
              <CardDescription>Give your vault a name and select the primary asset type.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vault-name">Vault Name</Label>
                <Input
                  id="vault-name"
                  placeholder="e.g. Smith Family Trust"
                  value={vaultName}
                  onChange={(e) => setVaultName(e.target.value)}
                  required
                  disabled={!isConnected}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="asset-type">Asset Type</Label>
                <Select value={assetType} onValueChange={setAssetType} disabled={!isConnected}>
                  <SelectTrigger id="asset-type">
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                    <SelectItem value="usdc">USD Coin (USDC)</SelectItem>
                    <SelectItem value="wbtc">Wrapped Bitcoin (WBTC)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Beneficiaries */}
          <Card className="bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Beneficiaries</CardTitle>
                <CardDescription>Add family members who will receive inheritance.</CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addBeneficiary}
                className="bg-transparent"
                disabled={!isConnected}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {beneficiaries.map((b, index) => (
                <div key={index} className="flex gap-4 items-end">
                  <div className="flex-1 space-y-2">
                    <Label className="sr-only">Name</Label>
                    <Input
                      placeholder="Name"
                      value={b.name}
                      onChange={(e) => updateBeneficiary(index, "name", e.target.value)}
                      required
                      disabled={!isConnected}
                    />
                  </div>
                  <div className="flex-[2] space-y-2">
                    <Label className="sr-only">Wallet Address</Label>
                    <Input
                      placeholder="0x..."
                      value={b.address}
                      onChange={(e) => updateBeneficiary(index, "address", e.target.value)}
                      required
                      disabled={!isConnected}
                    />
                  </div>
                  {beneficiaries.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeBeneficiary(index)}
                      disabled={!isConnected}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Emergency Rule */}
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle>Inheritance Trigger</CardTitle>
              <CardDescription>Define when the permissions for agents become active.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emergency-rule">Inactivity Period (Days)</Label>
                <Select value={emergencyRule} onValueChange={setEmergencyRule} disabled={!isConnected}>
                  <SelectTrigger id="emergency-rule">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 Days</SelectItem>
                    <SelectItem value="90">90 Days</SelectItem>
                    <SelectItem value="180">180 Days</SelectItem>
                    <SelectItem value="365">1 Year</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-2">
                  Permissions will be granted to agents if no activity is detected for this duration.
                </p>
              </div>

              <Alert className="bg-primary/5 border-primary/20">
                <Info className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary">Demo Note</AlertTitle>
                <AlertDescription className="text-primary/80">
                  For this hackathon demo, you can trigger this manually from the agent dashboard.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="pt-6 border-t">
              <Button type="submit" className="w-full h-12 text-lg" disabled={isDeploying || !isConnected}>
                {isDeploying
                  ? "Deploying Smart Account Vault..."
                  : isConnected
                    ? "Deploy Vault"
                    : "Connect Wallet to Deploy"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  )
}
