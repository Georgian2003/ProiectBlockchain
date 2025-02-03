import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "../styles/Home.css";

interface Profile {
  name: string;
  phone: string;
  email: string;
  languages: string[];
  programmingLanguages: string[];
  bio: string;
}

interface HomeProps {
  account: string | null;
}

const RAW_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const CONTRACT_ADDRESS = ethers.getAddress(RAW_CONTRACT_ADDRESS);

const userProfileAbi = [
  "function updateProfile(string,string,string,string[],string[],string) external",
  "function getProfile(address user) view returns (tuple(string name, string phone, string email, string[] languages, string[] programmingLanguages, string bio))",
];

const Home: React.FC<HomeProps> = ({ account }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<Profile>({
    name: "",
    phone: "",
    email: "",
    languages: [],
    programmingLanguages: [],
    bio: "",
  });
  const [balance, setBalance] = useState<string>("0");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchProfile = async () => {
    if (!account) return;
    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        userProfileAbi,
        provider
      );
      const result = await contract.getProfile(account);
      const fetchedProfile: Profile = {
        name: result[0],
        phone: result[1],
        email: result[2],
        languages: result[3],
        programmingLanguages: result[4],
        bio: result[5],
      };
      setProfile(fetchedProfile);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to fetch profile. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!account) {
      alert("Please connect your wallet.");
      return;
    }
    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        userProfileAbi,
        signer
      );
      const tx = await contract.updateProfile(
        form.name,
        form.phone,
        form.email,
        form.languages,
        form.programmingLanguages,
        form.bio
      );
      await tx.wait();
      alert("Profile updated successfully!");
      fetchProfile();
      setShowForm(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async () => {
    if (!account) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const balanceWei = await provider.getBalance(account);
      setBalance(ethers.formatEther(balanceWei));
    } catch (err) {
      console.error("Error fetching balance:", err);
    }
  };

  useEffect(() => {
    if (account) {
      fetchProfile();
      fetchBalance();
    }
  }, [account]);

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Job Marketplace</h1>
      {account && (
        <p className="home-account">Your connected wallet: {account}</p>
      )}
      <p className="home-balance">
        Balance: <span className="balance-amount">{balance} ETH</span>
      </p>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {profile && (
        <div className="profile-container">
          <h2>Your Profile</h2>
          <p>
            <strong>Name:</strong> {profile.name || "N/A"}
          </p>
          <p>
            <strong>Phone:</strong> {profile.phone || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {profile.email || "N/A"}
          </p>
          <p>
            <strong>Languages:</strong> {profile.languages.join(", ") || "N/A"}
          </p>
          <p>
            <strong>Programming Languages:</strong>{" "}
            {profile.programmingLanguages.join(", ") || "N/A"}
          </p>
          <p>
            <strong>Bio:</strong> {profile.bio || "N/A"}
          </p>
        </div>
      )}

      <button
        className="update-profile-button"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Hide Form" : "Update Profile"}
      </button>

      {showForm && (
        <div className="form-container">
          <h2>Update Your Profile</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateProfile();
            }}
          >
            <label>Name:</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <label>Phone:</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <label>Email:</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <label>Languages:</label>
            <input
              type="text"
              value={form.languages.join(", ")}
              onChange={(e) =>
                setForm({ ...form, languages: e.target.value.split(",") })
              }
            />
            <label>Programming Languages:</label>
            <input
              type="text"
              value={form.programmingLanguages.join(", ")}
              onChange={(e) =>
                setForm({
                  ...form,
                  programmingLanguages: e.target.value.split(","),
                })
              }
            />
            <label>Bio:</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
            <button type="submit">Save Changes</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Home;
