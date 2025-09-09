const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LuckyToken", function () {
  let luckyToken;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const LuckyToken = await ethers.getContractFactory("LuckyToken");
    luckyToken = await LuckyToken.deploy(owner.address);
    await luckyToken.deployed();
  });

  describe("部署", function () {
    it("应该设置正确的名称和符号", async function () {
      expect(await luckyToken.name()).to.equal("Lucky Token");
      expect(await luckyToken.symbol()).to.equal("LUCKY");
      expect(await luckyToken.decimals()).to.equal(18);
    });

    it("应该给所有者铸造初始供应量", async function () {
      const initialSupply = ethers.utils.parseEther("1000000");
      expect(await luckyToken.totalSupply()).to.equal(initialSupply);
      expect(await luckyToken.balanceOf(owner.address)).to.equal(initialSupply);
    });

    it("应该设置正确的所有者", async function () {
      expect(await luckyToken.owner()).to.equal(owner.address);
    });
  });

  describe("铸造", function () {
    it("所有者应该能够铸造新代币", async function () {
      const mintAmount = ethers.utils.parseEther("1000");
      
      await expect(luckyToken.mint(addr1.address, mintAmount))
        .to.emit(luckyToken, "TokensMinted")
        .withArgs(addr1.address, mintAmount);
        
      expect(await luckyToken.balanceOf(addr1.address)).to.equal(mintAmount);
    });

    it("非所有者不应该能够铸造代币", async function () {
      const mintAmount = ethers.utils.parseEther("1000");
      
      await expect(luckyToken.connect(addr1).mint(addr2.address, mintAmount))
        .to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("不应该超过最大供应量", async function () {
      const maxSupply = ethers.utils.parseEther("10000000");
      const currentSupply = await luckyToken.totalSupply();
      const excessiveAmount = maxSupply.sub(currentSupply).add(1);
      
      await expect(luckyToken.mint(addr1.address, excessiveAmount))
        .to.be.revertedWith("LuckyToken: exceeds max supply");
    });

    it("批量铸造应该正常工作", async function () {
      const recipients = [addr1.address, addr2.address];
      const amounts = [
        ethers.utils.parseEther("100"),
        ethers.utils.parseEther("200")
      ];
      
      await luckyToken.batchMint(recipients, amounts);
      
      expect(await luckyToken.balanceOf(addr1.address)).to.equal(amounts[0]);
      expect(await luckyToken.balanceOf(addr2.address)).to.equal(amounts[1]);
    });
  });

  describe("转账", function () {
    beforeEach(async function () {
      // 给addr1一些代币用于测试
      const mintAmount = ethers.utils.parseEther("1000");
      await luckyToken.mint(addr1.address, mintAmount);
    });

    it("应该能够转账代币", async function () {
      const transferAmount = ethers.utils.parseEther("100");
      
      await luckyToken.connect(addr1).transfer(addr2.address, transferAmount);
      
      expect(await luckyToken.balanceOf(addr2.address)).to.equal(transferAmount);
    });

    it("暂停时不应该能够转账", async function () {
      await luckyToken.pause();
      
      const transferAmount = ethers.utils.parseEther("100");
      
      await expect(luckyToken.connect(addr1).transfer(addr2.address, transferAmount))
        .to.be.revertedWith("Pausable: paused");
    });
  });

  describe("销毁", function () {
    it("应该能够销毁代币", async function () {
      const burnAmount = ethers.utils.parseEther("100");
      const initialBalance = await luckyToken.balanceOf(owner.address);
      
      await expect(luckyToken.burn(burnAmount))
        .to.emit(luckyToken, "TokensBurned")
        .withArgs(owner.address, burnAmount);
        
      expect(await luckyToken.balanceOf(owner.address))
        .to.equal(initialBalance.sub(burnAmount));
    });
  });

  describe("暂停功能", function () {
    it("所有者应该能够暂停和恢复合约", async function () {
      await luckyToken.pause();
      expect(await luckyToken.paused()).to.be.true;
      
      await luckyToken.unpause();
      expect(await luckyToken.paused()).to.be.false;
    });

    it("非所有者不应该能够暂停合约", async function () {
      await expect(luckyToken.connect(addr1).pause())
        .to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("合约信息", function () {
    it("应该返回正确的代币信息", async function () {
      const tokenInfo = await luckyToken.getTokenInfo();
      
      expect(tokenInfo.name_).to.equal("Lucky Token");
      expect(tokenInfo.symbol_).to.equal("LUCKY");
      expect(tokenInfo.decimals_).to.equal(18);
      expect(tokenInfo.maxSupply_).to.equal(ethers.utils.parseEther("10000000"));
      expect(tokenInfo.paused_).to.be.false;
    });
  });
});