# 🛡️ Guardian Vault: Secure Family Asset Management

Guardian Vault is a next-generation family wealth management platform built on the cutting edge of Ethereum account abstraction. It leverages **MetaMask Smart Accounts (EIP-7702)** and **Advanced Permissions (ERC-7715)** to create a secure, automated, and user-friendly way to manage family assets.

## 🚀 The Problem
Managing family assets in Web3 is currently a choice between two extremes:
1. **Single-Owner Wallets**: High risk. If the owner loses their key or is unavailable, the family loses access to funds.
2. **Multisigs (Gnosis Safe)**: High friction. Requiring multiple family members (who may not be tech-savvy) to sign every transaction is impractical for daily or automated needs.

## 💡 The Solution: Guardian Vault
Guardian Vault introduces a "Delegated Automation" model. The vault owner (the "Guardian") can delegate specific, limited, and time-bound permissions to **Automated Agents**. These agents can perform predefined tasks—like distributing monthly allowances to children or executing emergency transfers—without the owner needing to be online for every transaction.

### Key Features
- **Smart Account Integration**: Automatically upgrades your MetaMask account to a Smart Account using EIP-7702.
- **Advanced Permissions (ERC-7715)**: Grant granular permissions to agents (e.g., "Transfer up to 0.5 ETH per month to these 3 addresses").
- **Automated Agents**: Hybrid smart accounts that act as executors, using granted permissions to perform vault actions.
- **Real-time Indexing**: Powered by **Envio**, providing a lightning-fast dashboard with full activity history and global stats.
- **Trigger System**: Time-based or manual triggers to activate specific vault distributions.

---

## 🛠️ Technical Architecture

The project is built with a modular architecture combining on-chain security with off-chain automation and indexing.

### 1. Smart Account & Permissions (The Core)
- **MetaMask Smart Accounts (EIP-7702)**: We use the latest MetaMask Flask features to upgrade standard EOAs into Smart Accounts. This allows the account to support complex logic like permission delegation.
- **ERC-7715 (Advanced Permissions)**: This is the "magic" that makes the vault work. Instead of giving an agent full control, the owner signs a permission object that specifies:
    - **Target**: The Guardian Vault contract.
    - **Value Limit**: Maximum amount the agent can move.
    - **Time Limit**: Expiration date of the permission.
    - **Context**: Specific functions the agent is allowed to call.

### 2. Indexing Layer (Envio)
We use **Envio (HyperIndex)** to ensure the dashboard is always in sync with the blockchain.
- **Real-time Sync**: Envio indexes `Deposit`, `Withdrawal`, `BeneficiaryAdded`, and `TriggerActivated` events.
- **GraphQL API**: The frontend queries Envio's hosted (or local) GraphQL endpoint to display:
    - Total Value Locked (TVL) across all vaults.
    - Individual vault balances and activity logs.
    - Beneficiary allocation status.
- **Performance**: By offloading data retrieval to Envio, the UI remains responsive even with complex historical data.

### 3. Agent System
- **Primary Executor**: A session-based agent that monitors triggers and executes distributions using ERC-7715 permissions.
- **Verifier Agent**: (Optional) An agent that validates conditions before the Primary Executor acts.

---

## 🏗️ Project Structure

```text
├── abis/                # Smart contract ABIs (Vault, ERC20)
├── app/                 # Next.js frontend (Dashboard, Vault Management)
├── components/          # UI Components (Shadcn/UI)
├── config.yaml          # Envio Indexer configuration
├── schema.graphql       # Envio data schema
├── src/                 # Envio event handlers
├── hooks/               # Custom React hooks (useSmartAccount, useVaultDeployment)
├── lib/                 # Core logic
│   ├── agents/          # Agent account creation and execution logic
│   ├── providers/       # Wagmi and Wallet providers
└── styles/              # Global styles and Tailwind config
```

---

## 🔧 How MetaMask Advanced Permissions Help
MetaMask's Advanced Permissions (ERC-7715) solve the "Trust vs. Automation" dilemma:
- **Zero-Trust Execution**: The agent never holds the owner's private key. It only holds a signed permission.
- **Granular Control**: The owner can revoke permissions at any time.
- **Non-Custodial**: Funds stay in the vault contract; the agent only has the power to move them according to the signed rules.

## 📊 How Envio Powers the Experience
Without Envio, the dashboard would have to scan thousands of blocks to find a user's vault activity, leading to a poor UX.
- **Fast Data**: Envio provides sub-second query times for vault history.
- **Global Stats**: We track aggregate data (Total Vaults, Total Deposits) across the entire protocol using Envio's `GlobalStats` entity.
- **Event-Driven UI**: The UI updates automatically as Envio indexes new blocks.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MetaMask Flask (for EIP-7702 and ERC-7715 support)
- Envio CLI (`npm install -g envio`)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/guardian-vault.git
   cd guardian-vault
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Envio indexer:
   ```bash
   envio dev
   ```
4. Run the frontend:
   ```bash
   npm run dev
   ```

### Deployment
- **Contracts**: Deploy `GuardianVault.sol` to Sepolia.
- **Indexer**: Deploy to Envio Hosted Service.
- **Frontend**: Deploy to Vercel.

---

## 🏆 Hackathon Proofs
- **EIP-7702 Implementation**: See `hooks/useSmartAccount.ts` for the delegation check logic.
- **ERC-7715 Implementation**: See `lib/agents/redelegatePermission.ts` for how permissions are structured and signed.
- **Envio Indexing**: See `schema.graphql` and `src/handlers.ts` for the indexing logic.

---

Built with ❤️ for the MetaMask & Envio Hackathon.
