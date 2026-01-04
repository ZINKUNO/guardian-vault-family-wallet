# 🛡️ GuardianVault  
**Permissioned Family Wallet Sharing for Inheritance & Emergency Planning**

GuardianVault is a family-oriented, non-custodial smart wallet system that enables **secure inheritance planning and emergency fund access** using **MetaMask Advanced Permissions (ERC-7715)**.  
It replaces blind trust and private-key sharing with **time-bound, revocable, agent-based permissions**.

Built for the **MetaMask Advanced Permissions Dev Cook-Off Hackathon**.

---

## 🚨 Problem Statement

Crypto wallets today are fundamentally **single-user systems**:

- ❌ If the owner is unavailable or deceased, funds are often **lost forever**
- ❌ Sharing private keys is dangerous and irreversible
- ❌ Multisig wallets are complex and not family-friendly
- ❌ No transparent, automated way to handle emergencies or inheritance

**Families need a safer, human-centric solution.**

---

## ✅ Our Solution — GuardianVault

GuardianVault introduces **permission-based family vaults** powered by **MetaMask Smart Accounts and ERC-7715 Advanced Permissions**.

Instead of sharing private keys:
- Users define **clear rules**
- Grant **limited permissions** to on-chain agents
- Funds are released **only when conditions are met**

All actions are **non-custodial, auditable, and revocable**.

#### Create Vault
<img width="1441" height="938" alt="swappy-20260104-140825" src="https://github.com/user-attachments/assets/d6069351-ff88-4a47-982d-6fdb4d84c0a0" />

### Advance Permission(ERC-7715)
<img width="1482" height="938" alt="image" src="https://github.com/user-attachments/assets/8e609a6c-4adc-414b-8862-aec9e072ac2d" />

### DashBoard
<img width="1422" height="940" alt="swappy-20260104-141021" src="https://github.com/user-attachments/assets/bc3a6100-5779-4d11-b98b-acd0da13e0ad" />

---

## 🧠 Key Features

### 🔐 Permissioned Family Vaults
- Create shared vaults for:
  - Inheritance planning
  - Emergency fund access
  - Family fund management
- Define beneficiaries and allocation rules

### ⏳ Advanced Permissions (ERC-7715)
- Time-bound permissions
- Amount-limited spending
- Token-specific (ERC-20)
- Contract-scoped execution
- Fully revocable anytime

### 🤖 Agent-Based Automation
- **Executor Agent** executes transfers
- **Verifier Agent (optional)** approves actions
- Enables **Agent-to-Agent (A2A)** security flow
- No agent ever has full wallet access

### 📊 Full Transparency with Envio
- Index vault creation events
- Track permission grants & revocations
- Monitor fund releases in real time
- Visual permission trees for auditability

---

## 🔄 How GuardianVault Works (Flow)

<img width="1408" height="937" alt="swappy-20260104-134426" src="https://github.com/user-attachments/assets/6ef14da5-dc84-40ae-8ad9-1e514007f487" />


---

## 🦊 MetaMask Advanced Permissions Usage

GuardianVault uses **MetaMask Smart Accounts Kit** and **ERC-7715** to:

- Grant agents permission to spend **only specific ERC-20 tokens**
- Enforce **maximum spend limits**
- Restrict execution to **GuardianVault contracts**
- Automatically expire permissions after a defined time
- Allow instant permission revocation by the user

This ensures:
> **Automation without custody**

---

## 📈 Envio Integration

Envio is used to index and query:

- Vault creation events
- Permission grants & revocations
- Agent execution history
- Fund release events

This enables:
- Real-time family dashboards
- Transparent audit trails
- Historical permission visualization

---

## 🛠️ Tech Stack

### Frontend
- Next.js
- MetaMask SDK
- Tailwind CSS

### Smart Contracts
- Solidity
- ERC-4337 Smart Accounts
- ERC-7715 Advanced Permissions

### Indexing & Infra
- Envio
- Sepolia Testnet (EIP-7702 compatible)

### Agents
- Node.js off-chain agents
- Executor & Verifier agents

---

## 🚀 Getting Started

### 1️⃣ Bootstrap Project
```bash
npx @metamask/create-gator-app@latest
```
2️⃣ Install Dependencies
```npm install```

3️⃣ Run Locally
```npm run dev```

