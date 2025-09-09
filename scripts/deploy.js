const { ethers } = require("hardhat");

async function main() {
  console.log("开始部署 LuckyToken 合约...");

  // 获取部署者账户
  const [deployer] = await ethers.getSigners();
  console.log("部署账户:", deployer.address);

  // 部署合约
  const LuckyToken = await ethers.getContractFactory("LuckyToken");
  console.log("正在部署合约...");
  
  const luckyToken = await LuckyToken.deploy();
  // await luckyToken.deployed();

  // 等待部署完成（新版本语法）
  await luckyToken.waitForDeployment();

  // 获取合约地址（新版本语法）
  const contractAddress = await luckyToken.getAddress();

  console.log("\n🎉 部署成功!");
  console.log("合约地址:", contractAddress);
  
  // 获取基本信息
  const name = await luckyToken.name();
  const symbol = await luckyToken.symbol();
  const totalSupply = await luckyToken.totalSupply();
  
  
  console.log("\n📊 代币信息:");
  console.log("- 名称:", name);
  console.log("- 符号:", symbol);
 

  console.log("\n📝 验证合约命令:");
  console.log(`npx hardhat verify --network sepolia ${contractAddress}`);
  
  console.log("\n🔗 查看合约:");
  console.log(`https://sepolia.etherscan.io/address/${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("部署失败:", error);
    process.exit(1);
  });