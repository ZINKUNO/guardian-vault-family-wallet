import type React from "react"
import Link from "next/link"
import { Shield, Lock, Users, Clock, ArrowRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            <span>Built for MetaMask Advanced Permissions</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
            Inheritance without <br /> private keys.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Secure family assets using MetaMask Advanced Permissions — no multisig, no custody, no complexity. Delegate
            with limits, inherit with confidence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-12 px-8 text-lg" asChild>
              <Link href="/vault/new">Create Family Vault</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-lg bg-transparent">
              How it Works
            </Button>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Lock className="w-10 h-10 text-primary" />}
            title="Non-Custodial"
            description="Your assets stay in your smart account. You only grant execution permissions, never transfer ownership."
          />
          <FeatureCard
            icon={<Clock className="w-10 h-10 text-primary" />}
            title="Time-Bound Rules"
            description="Set automated triggers for asset release. If the emergency conditions are met, funds flow according to your rules."
          />
          <FeatureCard
            icon={<Users className="w-10 h-10 text-primary" />}
            title="Family Delegation"
            description="Grant granular permissions to family members with specific spend limits and expiry dates using ERC-7715."
          />
        </div>
      </section>

      {/* ERC-7715 Highlight */}
      <section className="container mx-auto px-4">
        <div className="bg-card border rounded-3xl p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Shield className="w-64 h-64 text-primary" />
          </div>
          <div className="max-w-2xl relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Powered by Advanced Permissions</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Instead of giving away private keys or dealing with multisig complexity, GuardianVault leverages ERC-7715
              to grant agents specific, limited rights to your vault.
            </p>
            <ul className="space-y-4 mb-10">
              <li className="flex items-start gap-3">
                <div className="mt-1 bg-primary/20 p-1 rounded">
                  <ArrowRight className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <span className="font-semibold block">Granular Spend Limits</span>
                  <span className="text-muted-foreground">Limit agents to specific tokens and amounts.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 bg-primary/20 p-1 rounded">
                  <ArrowRight className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <span className="font-semibold block">Revocable Any Time</span>
                  <span className="text-muted-foreground">
                    Maintain full control. Cancel any permission instantly from your wallet.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 bg-primary/20 p-1 rounded">
                  <ArrowRight className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <span className="font-semibold block">A2A Delegation Chaining</span>
                  <span className="text-muted-foreground">
                    Chain permissions between primary and verifier agents for maximum safety.
                  </span>
                </div>
              </li>
            </ul>
            <Button size="lg" asChild>
              <Link href="/permissions">Explore Permissions</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="bg-card/50 border-muted-foreground/10 hover:border-primary/50 transition-colors">
      <CardContent className="pt-8">
        <div className="mb-6">{icon}</div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}
