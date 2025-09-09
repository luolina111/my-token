sepolia测试链 个人token合约

npx hardhat run scripts/deploy.js --network sepolia
.env配置私钥和infura PROJECT_ID

# 部署到 Sepolia 测试网
npx hardhat run scripts/deploy.js --network sepolia

# 验证合约
npx hardhat verify --network sepolia 合约地址