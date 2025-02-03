import React from "react";

interface HomePageProps {
  connectWallet: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ connectWallet }) => {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Bun venit la Piața Joburilor Blockchain</h1>
      <p>Creează, aplică și gestionează joburi direct în blockchain!</p>
      <button onClick={connectWallet} style={{ marginTop: "2rem" }}>
        Conectează-te cu MetaMask
      </button>
    </div>
  );
};

export default HomePage;
