import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  networks: {
    hardhat: {
      chainId: 1337, // Setează explicit Chain ID pentru rețeaua Hardhat
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337, // Setează explicit Chain ID pentru localhost
    },
  },
};

export default config;
