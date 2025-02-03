import React, { useState } from "react";
import { ethers } from "ethers";
import "../styles/ViewProfile.css";

interface ViewProfileProps {
  userAddress: string;
  profileContractAddress: string;
}

const abiUserProfile = [
  "function getProfile(address user) view returns (tuple(string name, string phone, string email, string[] languages, string[] programmingLanguages, string bio))",
];

const ViewProfile: React.FC<ViewProfileProps> = ({
  userAddress,
  profileContractAddress,
}) => {
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const provider = new ethers.BrowserProvider(window.ethereum as any, {
        chainId: 1337,
        name: "hardhat",
      });

      const contract = new ethers.Contract(
        profileContractAddress,
        abiUserProfile,
        provider
      );
      const fetchedProfile = await contract.getProfile(userAddress);

      setProfile({
        name: fetchedProfile.name,
        phone: fetchedProfile.phone,
        email: fetchedProfile.email,
        languages: fetchedProfile.languages,
        programmingLanguages: fetchedProfile.programmingLanguages,
        bio: fetchedProfile.bio,
      });
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to fetch profile.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setProfile(null);
  };

  return (
    <div>
      <button
        onClick={fetchProfile}
        disabled={loading}
        className="view-profile-button"
      >
        {loading ? "Loading..." : "View Profile"}
      </button>

      {isModalOpen && (
        <>
          <div className="modal-overlay" onClick={closeModal}></div>
          <div className="modal">
            <div className="modal-content">
              <h2>Profile</h2>
              {profile ? (
                <>
                  <p>
                    <strong>Name:</strong> {profile.name}
                  </p>
                  <p>
                    <strong>Phone:</strong> {profile.phone}
                  </p>
                  <p>
                    <strong>Email:</strong> {profile.email}
                  </p>
                  <p>
                    <strong>Languages:</strong> {profile.languages.join(", ")}
                  </p>
                  <p>
                    <strong>Programming Languages:</strong>{" "}
                    {profile.programmingLanguages.join(", ")}
                  </p>
                  <p>
                    <strong>Bio:</strong> {profile.bio}
                  </p>
                </>
              ) : (
                <p>Loading profile data...</p>
              )}
              <button onClick={closeModal} className="close-modal-button">
                Close
              </button>
            </div>
          </div>
        </>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ViewProfile;
