"use client"

import { useState, useEffect } from "react"
import { Zap, AlertTriangle, CheckCircle2, Terminal, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "@/hooks/use-toast"

export default function AgentPage() {
  const [permissions, setPermissions] = useState<any[]>([])
  const [triggerActive, setTriggerActive] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [logs, setLogs] = useState<string[]>(["> Agent initialized", "> Waiting for ERC-7715 context..."])

  useEffect(() => {
    const storedPerms = JSON.parse(localStorage.getItem("guardian_permissions") || "[]")
    setPermissions(storedPerms)
    if (storedPerms.length > 0) {
      addLog(`> Found ${storedPerms.length} active permissions`)
    }
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

  const handleExecute = async (p: any) => {
    setIsExecuting(true)
    addLog(`> Initiating ERC-7715 execution for vault ${p.vaultId}...`)

    // Simulate complex A2A flow
    await new Promise((r) => setTimeout(r, 1500))
    addLog("> Requesting re-delegation check from Verifier Agent...")
    await new Promise((r) => setTimeout(r, 1500))
    addLog("> Verifier Agent confirmed. Submitting UserOperation...")
    await new Promise((r) => setTimeout(r, 2000))

    addLog(`> SUCCESS: Released ${p.spendLimit} ETH to beneficiary`)
    addLog(`> Transaction: 0x${Math.random().toString(16).substring(2, 12)}...`)

    setIsExecuting(false)
    toast({
      title: "Assets Released",
      description: `Successfully executed release of ${p.spendLimit} ETH.`,
    })
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Zap className="w-8 h-8 text-primary" />
            Agent Actions
          </h1>
          <p className="text-muted-foreground">Simulate emergency execution and A2A permission flows.</p>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-4 py-1 text-sm">
          Agent Status: Operational
        </Badge>
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
              permissions.map((p) => (
                <Card key={p.id} className="bg-card/50">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <Badge variant="outline" className="text-[10px]">
                        {p.id}
                      </Badge>
                      {triggerActive && <Badge className="bg-emerald-500 text-white">Ready</Badge>}
                    </div>
                    <CardTitle className="text-lg">Vault Release</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Spend Limit:</span>
                      <span className="font-bold">{p.spendLimit} ETH</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Beneficiary:</span>
                      <span className="font-mono text-[10px]">0x71C...49b2</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button
                      disabled={!triggerActive || isExecuting}
                      onClick={() => handleExecute(p)}
                      className="w-full"
                    >
                      {isExecuting ? (
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
              ))
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
              {logs.map((log, i) => (
                <div
                  key={i}
                  className={
                    log.includes("SUCCESS")
                      ? "text-emerald-500"
                      : log.includes("TRIGGER")
                        ? "text-orange-500"
                        : "text-zinc-400"
                  }
                >
                  {log}
                </div>
              ))}
              {isExecuting && <div className="text-primary animate-pulse">{">"} Processing transaction...</div>}
            </CardContent>
            <CardFooter className="border-t border-zinc-800 py-3 bg-zinc-950/50">
              <p className="text-[10px] text-zinc-500 italic">
                Logs represent simulated on-chain agent interactions using ERC-7715 context.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
