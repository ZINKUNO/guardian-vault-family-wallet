import { useState, useEffect } from 'react';

const ENVIO_GRAPHQL_URL = process.env.NEXT_PUBLIC_ENVIO_URL || 'http://localhost:8080/v1/graphql';

export interface EnvioVault {
    id: string;
    name: string;
    owner: string;
    balance: string;
    totalDeposited: string;
    totalWithdrawn: string;
    isTriggered: boolean;
    lastActivity: string;
    beneficiaries: {
        address: string;
        percentage: number;
        receivedAmount: string;
    }[];
}

export function useEnvioVaults(ownerAddress?: string) {
    const [vaults, setVaults] = useState<EnvioVault[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchVaults = async () => {
        if (!ownerAddress) return;

        setLoading(true);
        try {
            const query = `
        query GetVaults($owner: String!) {
          Vault(where: {owner: {_eq: $owner}}) {
            id
            name
            owner
            balance
            totalDeposited
            totalWithdrawn
            isTriggered
            lastActivity
            beneficiaries {
              address
              percentage
              receivedAmount
            }
          }
        }
      `;

            const response = await fetch(ENVIO_GRAPHQL_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-hasura-admin-secret': 'testing' // Default for local Envio
                },
                body: JSON.stringify({
                    query,
                    variables: { owner: ownerAddress.toLowerCase() }
                })
            });

            const result = await response.json();
            if (result.errors) {
                throw new Error(result.errors[0].message);
            }

            setVaults(result.data.Vault);
        } catch (err: any) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVaults();
    }, [ownerAddress]);

    return { vaults, loading, error, refetch: fetchVaults };
}

export function useEnvioStats() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const query = `
          query GetGlobalStats {
            VaultStats_by_pk(id: "global") {
              totalVaults
              totalValueLocked
              totalDeposits
              totalWithdrawals
              activePermissions
              successfulExecutions
            }
          }
        `;

                const response = await fetch(ENVIO_GRAPHQL_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-hasura-admin-secret': 'testing'
                    },
                    body: JSON.stringify({ query })
                });

                const result = await response.json();
                setStats(result.data.VaultStats_by_pk);
            } catch (err) {
                console.error("Failed to fetch Envio stats:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return { stats, loading };
}
