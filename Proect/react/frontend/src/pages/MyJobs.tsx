import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import ViewProfile from "../components/ViewProfile";
import "../styles/MyJobs.css";

interface Bid {
  bidder: string;
  amount: bigint;
  accepted: boolean;
}

interface Job {
  id: bigint;
  employer: string;
  description: string;
  budget: bigint;
  isCompleted: boolean;
  bids: Bid[];
}

interface MyJobsProps {
  account: string | null;
}

//  Adresa contractului JobMarketplace
const RAW_CONTRACT_ADDRESS_JOB = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const CONTRACT_ADDRESS_JOB = ethers.getAddress(RAW_CONTRACT_ADDRESS_JOB);

//  Adresa contractului UserProfile
const RAW_CONTRACT_ADDRESS_PROFILE =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const CONTRACT_ADDRESS_PROFILE = ethers.getAddress(
  RAW_CONTRACT_ADDRESS_PROFILE
);

const abiJobMarketplace = [
  "function getAllJobs() view returns (tuple(uint256 id, address employer, string description, uint256 budget, bool isCompleted, (address bidder, uint256 amount, bool accepted)[])[])",
  "function postJob(string memory _description) external payable",
  "function acceptBid(uint256 jobId, uint256 bidIndex) external",
  "function setCommissionPercentage(uint256 newPercentage) external",
  "function owner() view returns (address)",
];

const MyJobs: React.FC<MyJobsProps> = ({ account }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  const fetchJobsAndApps = async () => {
    if (!account) return;

    try {
      setLoading(true);
      setError(null);

      const provider = new ethers.BrowserProvider(window.ethereum as any, {
        chainId: 1337,
        name: "hardhat",
      });
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS_JOB,
        abiJobMarketplace,
        provider
      );

      const results = await contract.getAllJobs();

      const normalizedJobs: Job[] = results.map((job: any) => ({
        id: BigInt(job[0]),
        employer: job[1].toLowerCase(),
        description: job[2],
        budget: BigInt(job[3]),
        isCompleted: job[4],
        bids: job[5].map((bid: any) => ({
          bidder: bid[0].toLowerCase(),
          amount: BigInt(bid[1]),
          accepted: bid[2],
        })),
      }));

      //  Filtrare: utilizatorul vede doar joburile unde este implicat
      const filteredJobs = normalizedJobs.filter(
        (job: Job) =>
          job.employer === account?.toLowerCase() ||
          job.bids.some((bid: Bid) => bid.bidder === account?.toLowerCase())
      );

      setJobs(filteredJobs);

      // Verifică dacă utilizatorul este proprietarul contractului
      const ownerAddress = await contract.owner();
      setIsOwner(ownerAddress.toLowerCase() === account?.toLowerCase());
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Could not fetch your jobs. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const acceptBid = async (jobId: bigint, bidIndex: number) => {
    if (!account) {
      alert("Please connect wallet first.");
      return;
    }

    try {
      setLoading(true);

      const provider = new ethers.BrowserProvider(window.ethereum as any, {
        chainId: 1337,
        name: "hardhat",
      });
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS_JOB,
        abiJobMarketplace,
        signer
      );

      const tx = await contract.acceptBid(jobId, bidIndex);
      await tx.wait();

      alert("Bid accepted successfully!");
      fetchJobsAndApps(); // Refresh UI
    } catch (err) {
      console.error("Error accepting bid:", err);
      alert("Failed to accept bid. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (account) {
      fetchJobsAndApps();
    }
  }, [account]);

  return (
    <div className="my-jobs-container">
      <h1 className="my-jobs-title">My Jobs & Applications</h1>

      <div className="actions">
        <button
          className="create-job-button"
          onClick={() => setModalOpen(true)}
        >
          Create Job
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && jobs.length === 0 && !error && (
        <p>No jobs or applications found.</p>
      )}

      {jobs.map((job: Job) => (
        <div key={job.id.toString()} className="job-card">
          <p>
            <strong>ID:</strong> {job.id.toString()}
          </p>
          <p>
            <strong>Description:</strong> {job.description}
          </p>
          <p>
            <strong>Budget:</strong> {ethers.formatEther(job.budget)} ETH
          </p>
          <p>
            <strong>Employer:</strong> {job.employer}
          </p>
          <p>
            <strong>Completed:</strong> {job.isCompleted ? "Yes" : "No"}
          </p>

          <h4>Bids:</h4>
          {job.bids.length === 0 ? (
            <p>No bids yet.</p>
          ) : (
            job.bids.map((b: Bid, idx: number) => (
              <div className="bid-entry" key={idx}>
                <span className="bid-info">
                  - {b.bidder} offered {ethers.formatEther(b.amount)} ETH
                  {b.accepted && <span> (Accepted)</span>}
                </span>
                <div className="bid-actions">
                  {account?.toLowerCase() === job.employer.toLowerCase() &&
                    !job.isCompleted &&
                    !b.accepted && (
                      <button
                        className="accept-bid-button"
                        onClick={() => acceptBid(job.id, idx)}
                      >
                        Accept Bid
                      </button>
                    )}
                  <ViewProfile
                    userAddress={b.bidder}
                    profileContractAddress={RAW_CONTRACT_ADDRESS_PROFILE}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  );
};

export default MyJobs;
