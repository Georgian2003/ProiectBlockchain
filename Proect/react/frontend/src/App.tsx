import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ethers } from "ethers";
import Home from "./pages/Home";
import JobMarket from "./pages/JobMarket";
import MyJobs from "./pages/MyJobs";
import Navigation from "./components/Navigation";
import "./styles/App.css"; 

const App: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask is not installed!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(
        window.ethereum as ethers.Eip1193Provider
      );
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert("Could not connect to wallet.");
    }
  };


  const disconnectWallet = () => {
    setAccount(null);
  };

  return (
    <Router>
      <div className="app-container">
        <Navigation
          account={account}
          connectWallet={connectWallet}
          disconnectWallet={disconnectWallet}
        />

        {account ? (
          <Routes>
            <Route path="/" element={<Home account={account} />} />
            <Route
              path="/job-market"
              element={<JobMarket account={account} />}
            />
            <Route path="/my-jobs" element={<MyJobs account={account} />} />
          </Routes>
        ) : (
          <div className="welcome-container">
            <h1 className="welcome-title">Welcome to Job Marketplace</h1>
            <p className="welcome-description">
              Please connect your wallet to continue.
            </p>
            <button className="connect-button" onClick={connectWallet}>
              Connect Wallet
            </button>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;
