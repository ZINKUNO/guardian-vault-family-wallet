"use client";

/**
 * VaultDashboard Component
 * 
 * Real-time Vault Dashboard displaying comprehensive vault information:
 * 
 * Sections:
 * 1. VAULT OVERVIEW - Name, address, balance, owner, created date
 * 2. ACTIVE PERMISSIONS - Table with agent permissions, allowances, status, revoke actions
 * 3. BENEFICIARIES - List of beneficiaries with allocation percentages
 * 4. TRIGGER STATUS - Trigger type, status, countdown, manual trigger button
 * 5. EXECUTION HISTORY - Timeline of permission grants, triggers, transfers, revocations
 * 6. AGENT STATUS - Primary and Verifier agent information
 * 
 * Real-time Updates:
 * - Uses wagmi's useContractRead for balance polling
 * - Polls every 30 seconds (can be configured)
 * - WebSocket connection for instant updates (advanced - TODO)
 * 
 * @param vaultId - Vault ID to display dashboard for
 */

import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, Clock, AlertTriangle, CheckCircle, Activity, Users, Copy, ExternalLink, Database } from 'lucide-react';
import { useTriggerSystem } from '@/hooks/useTriggerSystem';
import { useRevokePermission } from '@/hooks/useRevokePermission';
import { useEnvioVaults, useEnvioStats } from '@/hooks/useEnvio';

/**
 * Permission Interface
 */
interface Permission {
    id: string;
    agentAddress: string;
    agentType: 'Primary' | 'Verifier';
    tokenType: 'ETH' | 'USDC';
    maxAmount: string;
    remainingAllowance: string;
    expiresAt: number;
    status: 'active' | 'revoked' | 'expired';
}

interface Beneficiary {
    address: string;
    allocation: number; // percentage
    received: string;
}

interface HistoryEvent {
    id: string;
    type: 'permission_granted' | 'trigger_activated' | 'transfer_executed' | 'permission_revoked';
    timestamp: number;
    txHash?: string;
    description: string;
}

export function VaultDashboard({ vaultId }: { vaultId: string }) {
    const { address } = useAccount();
    const [activeTab, setActiveTab] = useState("overview");
    const [useEnvio, setUseEnvio] = useState(true);

    // Envio Data
    const { vaults: envioVaults, loading: envioLoading } = useEnvioVaults(address);
    const { stats: globalStats } = useEnvioStats();

    // Mock Vault Data - Fallback
    const mockVault = {
        name: "Family Inheritance Vault",
        address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        balance: "10.5",
        owner: address,
        createdAt: Date.now() - 10000000,
        triggerType: 'time' as const,
        triggerTimestamp: Date.now() + 86400000 * 89
    };

    // Determine which data to use
    const indexedVault = envioVaults?.find(v => v.id.toLowerCase() === vaultId.toLowerCase() || v.id.toLowerCase() === mockVault.address.toLowerCase());

    // Merge Envio data with mock for UI display
    const vault = (useEnvio && indexedVault) ? {
        ...mockVault,
        address: indexedVault.id,
        balance: (Number(indexedVault.balance) / 1e18).toFixed(4),
        isTriggered: indexedVault.isTriggered,
        lastActivity: Number(indexedVault.lastActivity) * 1000
    } : mockVault;

    // Mock Permissions & Beneficiaries (In real app, these would also come from Envio)
    const [permissions, setPermissions] = useState<Permission[]>([
        {
            id: "p1",
            agentAddress: "0x123...abc",
            agentType: "Primary",
            tokenType: "ETH",
            maxAmount: "5.0",
            remainingAllowance: "5.0",
            expiresAt: Date.now() + 86400000 * 90,
            status: "active"
        }
    ]);

    const beneficiaries: Beneficiary[] = indexedVault?.beneficiaries?.map((b: any) => ({
        address: b.address,
        allocation: b.percentage,
        received: (Number(b.receivedAmount) / 1e18).toString()
    })) || [
            { address: "0xBen1...111", allocation: 60, received: "0" },
            { address: "0xBen2...222", allocation: 40, received: "0" }
        ];

    // Mock History
    const history: HistoryEvent[] = [
        { id: "h1", type: "permission_granted", timestamp: Date.now() - 500000, description: "Permission granted to Primary Agent" }
    ];

    const { status: triggerStatus, activateManualTrigger } = useTriggerSystem(vault);
    const { revokePermission, isRevoking } = useRevokePermission();

    const handleRevoke = async (permId: string) => {
        // In real app: get delegation object for this permId
        // await revokePermission(delegation, vault.owner);
        console.log("Revoking permission:", permId);
        setPermissions(prev => prev.map(p => p.id === permId ? { ...p, status: 'revoked' } : p));
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // toast success
    };

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">{vault.name}</h1>
                        {indexedVault && (
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 flex gap-1 items-center">
                                <Database className="h-3 w-3" /> Indexed by Envio
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                        <span className="font-mono text-sm">{vault.address}</span>
                        <Button variant="ghost" size="icon" className="h-4 w-4" onClick={() => copyToClipboard(vault.address)}>
                            <Copy className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
                <div className="flex gap-4 items-center">
                    {globalStats && (
                        <div className="text-right hidden md:block border-r pr-4 border-border">
                            <p className="text-[10px] uppercase text-muted-foreground font-bold">Network TVL</p>
                            <p className="text-sm font-mono">{(Number(globalStats.totalValueLocked) / 1e18).toFixed(2)} ETH</p>
                        </div>
                    )}
                    <div className="flex flex-col items-end gap-1">
                        <Badge variant={triggerStatus.isTriggered ? "destructive" : "secondary"} className="text-lg px-4 py-1">
                            {triggerStatus.isTriggered ? "🔥 Triggered" : "🛡️ Secure"}
                        </Badge>
                        {indexedVault && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Activity className="h-2 w-2" /> Live Syncing
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-card/50 backdrop-blur border-primary/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{vault.balance} ETH</div>
                        {indexedVault && (
                            <p className="text-xs text-muted-foreground mt-1">
                                Total Deposited: {(Number(indexedVault.totalDeposited) / 1e18).toFixed(2)} ETH
                            </p>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Trigger Status</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {triggerStatus.isTriggered ? "Active" : "Pending"}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {triggerStatus.triggerType === 'time' && !triggerStatus.isTriggered
                                ? `${Math.floor(triggerStatus.remainingTime / 86400)} days remaining`
                                : "Manual trigger available"}
                        </p>
                        {triggerStatus.triggerType === 'manual' && !triggerStatus.isTriggered && (
                            <Button variant="destructive" size="sm" className="mt-2 w-full" onClick={activateManualTrigger}>
                                Simulate Emergency Trigger
                            </Button>
                        )}
                    </CardContent>
                </Card>

                {/* Active Agents Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{permissions.filter(p => p.status === 'active').length}</div>
                        <p className="text-xs text-muted-foreground">
                            Authorized for execution
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="permissions">Permissions</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Beneficiaries</CardTitle>
                            <CardDescription>
                                Allocation of funds upon trigger execution.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {beneficiaries.map((ben, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">{ben.address}</p>
                                            <p className="text-sm text-muted-foreground">Allocation: {ben.allocation}%</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Progress value={ben.allocation} className="w-[100px]" />
                                            <span className="text-sm font-bold">{ben.received} ETH Received</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="permissions" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Permissions</CardTitle>
                            <CardDescription>
                                Manage agent permissions and allowances.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Agent</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Token</TableHead>
                                        <TableHead>Allowance</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {permissions.map((perm) => (
                                        <TableRow key={perm.id}>
                                            <TableCell className="font-mono text-xs">{perm.agentAddress}</TableCell>
                                            <TableCell>{perm.agentType}</TableCell>
                                            <TableCell>{perm.tokenType}</TableCell>
                                            <TableCell>{perm.remainingAllowance} / {perm.maxAmount}</TableCell>
                                            <TableCell>
                                                <Badge variant={perm.status === 'active' ? 'default' : 'secondary'}>
                                                    {perm.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {perm.status === 'active' && (
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleRevoke(perm.id)}
                                                        disabled={isRevoking}
                                                    >
                                                        Revoke
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Execution History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[400px] w-full pr-4">
                                <div className="space-y-8">
                                    {history.map((event) => (
                                        <div key={event.id} className="flex">
                                            <div className="flex flex-col items-center mr-4">
                                                <div className="w-2 h-2 bg-primary rounded-full" />
                                                <div className="w-0.5 h-full bg-border my-1" />
                                            </div>
                                            <div className="pb-8">
                                                <p className="text-sm text-muted-foreground mb-1">
                                                    {new Date(event.timestamp).toLocaleString()}
                                                </p>
                                                <h4 className="text-base font-semibold">{event.description}</h4>
                                                {event.txHash && (
                                                    <a
                                                        href={`https://sepolia.etherscan.io/tx/${event.txHash}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-xs text-primary flex items-center gap-1 mt-1 hover:underline"
                                                    >
                                                        View on Etherscan <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
