const hre = require("hardhat");

async function main() {
  // 1. Deploy UserProfile contract
  console.log("Deploying UserProfile contract...");
  const UserProfile = await hre.ethers.getContractFactory("UserProfile");
  const userProfile = await UserProfile.deploy();
  await userProfile.waitForDeployment();
  const userProfileAddress = await userProfile.getAddress();
  console.log("UserProfile deployed to:", userProfileAddress);

  // 2. Deploy JobMarketplace contract
  console.log("Deploying JobMarketplace contract...");
  const JobMarketplace = await hre.ethers.getContractFactory("JobMarketplace");
  const jobMarketplace = await JobMarketplace.deploy(userProfileAddress); // Pass UserProfile address
  await jobMarketplace.waitForDeployment();
  const jobMarketplaceAddress = await jobMarketplace.getAddress();
  console.log("JobMarketplace deployed to:", jobMarketplaceAddress);

  console.log("Deployment complete.");
  console.log("UserProfile Address:", userProfileAddress);
  console.log("JobMarketplace Address:", jobMarketplaceAddress);
}

main().catch((error) => {
  console.error("Error during deployment:", error);
  process.exitCode = 1;
});
