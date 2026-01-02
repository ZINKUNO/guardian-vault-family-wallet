"use client"

import Link from "next/link"
import { Shield, LayoutDashboard, PlusCircle, Key } from "lucide-react"
import { ConnectButton } from "@rainbow-me/rainbowkit"

export function Navbar() {
  return (
    <header className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <Shield className="w-8 h-8 text-primary" />
          <span>GuardianVault</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/dashboard" className="hover:text-primary transition-colors flex items-center gap-1.5">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link href="/vault/new" className="hover:text-primary transition-colors flex items-center gap-1.5">
            <PlusCircle className="w-4 h-4" />
            Create Vault
          </Link>
          <Link href="/permissions" className="hover:text-primary transition-colors flex items-center gap-1.5">
            <Key className="w-4 h-4" />
            Permissions
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ConnectButton chainStatus="icon" showBalance={false} />
        </div>
      </div>
    </header>
  )
}
