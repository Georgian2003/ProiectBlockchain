import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navigation.css";

interface NavigationProps {
  account: string | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  account,
  connectWallet,
  disconnectWallet,
}) => {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
        borderBottom: "1px solid #ccc",
      }}
    >
      {/* Link-uri de navigare */}
      <div>
        <Link to="/" style={{ marginLeft: "1rem" }}>
          Profile
        </Link>
        <Link to="/job-market" style={{ marginLeft: "1rem" }}>
          Job Market
        </Link>
        <Link to="/my-jobs" style={{ marginLeft: "1rem" }}>
          My Jobs
        </Link>
      </div>

      {/* Contul conectat */}
      <div>
        {account ? (
          <>
            <span>{account}</span>
            <button onClick={disconnectWallet} style={{ marginLeft: "1rem" }}>
              Logout
            </button>
          </>
        ) : (
          <button onClick={connectWallet}>Login</button>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
