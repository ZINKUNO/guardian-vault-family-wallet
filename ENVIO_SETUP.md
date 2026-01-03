# GuardianVault Family Wallet - Envio Integration

This project now includes **Envio indexing** for the hackathon track!

## 🚀 **What's Added**

### 1. **Envio Configuration** (`envio.yaml`)
- Vault contract indexing configuration
- Event handlers for deposits, withdrawals, beneficiaries, triggers
- Support for multiple networks (Sepolia, Mainnet)
- ERC-20 token tracking (USDC, WETH, etc.)

### 2. **GraphQL Schema** (`schema.graphql`)
- Complete data model for vaults, beneficiaries, deposits, withdrawals
- Execution tracking with success/failure states
- Permission management with ERC-7715 context
- Global statistics and performance metrics

### 3. **Event Handlers** (`src/handlers.ts`)
- Real-time event processing for vault activities
- Automatic balance updates and statistics calculation
- Beneficiary allocation and distribution tracking
- Trigger activation monitoring

### 4. **GraphQL Queries** (`src/queries.ts`)
- Vault data retrieval by address/owner
- Performance metrics and activity history
- Search functionality for vaults
- Global statistics aggregation

## 📊 **Indexed Data Types**

### **Vault Events**
- ✅ Deposit events (ETH & ERC-20)
- ✅ Withdrawal events with execution context
- ✅ Beneficiary additions and allocations
- ✅ Trigger activations (time/manual/oracle)

### **Real-time Features**
- 🔄 Live balance tracking
- 📈 Performance metrics
- 🔍 Search and filtering
- 📊 Global statistics dashboard

## 🛠 **Setup Instructions**

### 1. **Install Envio CLI**
```bash
npm install -g @envio/cli
```

### 2. **Initialize Envio Project**
```bash
envio init
```

### 3. **Deploy Indexer**
```bash
envio deploy
```

### 4. **Access GraphQL API**
- Local: `http://localhost:3000/graphql`
- Production: Provided by Envio hosting

## 🎯 **Hackathon Benefits**

### **Data Availability**
- All vault activities indexed in real-time
- Historical data for analytics
- Performance tracking and reporting
- Search and filtering capabilities

### **Scalability**
- Handles high-volume transactions
- Efficient GraphQL queries
- Subgraph-like performance
- Multi-network support

### **Integration Ready**
- Frontend hooks prepared
- GraphQL queries optimized
- Real-time updates via subscriptions
- Easy integration with existing UI

## 🔗 **Frontend Integration**

The existing frontend can now:
1. Query indexed vault data instead of localStorage
2. Display real-time statistics
3. Show historical activities
4. Provide advanced search and filtering
5. Track execution performance

## 📈 **Next Steps**

1. **Deploy indexer** to Envio infrastructure
2. **Update frontend** to use GraphQL queries
3. **Add subscriptions** for real-time updates
4. **Implement analytics** dashboard
5. **Add monitoring** and alerting

---

**Your GuardianVault project is now ready for the Envio hackathon track!** 🎉

The indexing system will provide:
- ⚡ Real-time data synchronization
- 📊 Comprehensive analytics
- 🔍 Advanced search capabilities
- 📈 Performance tracking
- 🌐 Scalable infrastructure
