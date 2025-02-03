import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "../styles/JobMarket.css"; // Import the CSS file

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

interface JobMarketProps {
  account: string | null;
}

// Contract Address and ABI
const RAW_CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const CONTRACT_ADDRESS = ethers.getAddress(RAW_CONTRACT_ADDRESS);

const abi = [
  "function getAllJobs() view returns (tuple(uint256 id, address employer, string description, uint256 budget, bool isCompleted, (address bidder, uint256 amount, bool accepted)[] bids)[])",
  "function placeBid(uint256 jobId, uint256 amount) external",
  "function withdrawBid(uint256 jobId) external",
  "function acceptBid(uint256 jobId, uint256 bidIndex) external",
];

const JobMarket: React.FC<JobMarketProps> = ({ account }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [bidInputs, setBidInputs] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllJobs = async () => {
    if (!account) return;

    try {
      setLoading(true);
      setError(null);

      const provider = new ethers.BrowserProvider(window.ethereum as any, {
        chainId: 1337,
        name: "hardhat",
      });

      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
      const allJobs = await contract.getAllJobs();

      const formattedJobs = allJobs.map((job: any) => ({
        id: BigInt(job[0]),
        employer: job[1],
        description: job[2],
        budget: BigInt(job[3]),
        isCompleted: job[4],
        bids: job[5].map((bid: any) => ({
          bidder: bid[0],
          amount: BigInt(bid[1]),
          accepted: bid[2],
        })),
      }));

      setJobs(formattedJobs);
    } catch (err) {
      console.error("Error fetching all jobs:", err);
      setError("Could not fetch jobs. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  const placeBid = async (jobId: bigint, amount: bigint) => {
    if (!account) {
      alert("Please connect your wallet.");
      return;
    }

    try {
      setLoading(true);

      const provider = new ethers.BrowserProvider(window.ethereum as any, {
        chainId: 1337,
        name: "hardhat",
      });
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      const tx = await contract.placeBid(jobId, amount);
      await tx.wait();

      alert("Bid placed successfully!");
      setBidInputs((prev) => ({ ...prev, [Number(jobId)]: "" }));
      fetchAllJobs();
    } catch (err) {
      console.error("Error placing bid:", err);
      alert("Failed to place bid. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const withdrawBid = async (jobId: bigint) => {
    if (!account) {
      alert("Please connect your wallet.");
      return;
    }

    try {
      setLoading(true);

      const provider = new ethers.BrowserProvider(window.ethereum as any, {
        chainId: 1337,
        name: "hardhat",
      });
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      const tx = await contract.withdrawBid(jobId);
      await tx.wait();

      alert("Bid withdrawn successfully!");
      fetchAllJobs();
    } catch (err) {
      console.error("Error withdrawing bid:", err);
      alert("Failed to withdraw bid. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const acceptBid = async (jobId: bigint, bidIndex: number) => {
    if (!account) {
      alert("Please connect your wallet.");
      return;
    }

    try {
      setLoading(true);

      const provider = new ethers.BrowserProvider(window.ethereum as any, {
        chainId: 1337,
        name: "hardhat",
      });
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      const tx = await contract.acceptBid(jobId, bidIndex);
      await tx.wait();

      alert("Bid accepted successfully!");
      fetchAllJobs();
    } catch (err) {
      console.error("Error accepting bid:", err);
      alert("Failed to accept bid. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (account) {
      fetchAllJobs();
    }
  }, [account]);

  return (
    <div className="job-market-container">
      <h1 className="job-market-title">Job Market</h1>

      {loading && <p className="loading-message">Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && jobs.length === 0 && !error && <p>No jobs available.</p>}

      {jobs
        .filter((job) => !job.bids.some((bid) => bid.accepted))
        .map((job) => {
          const isEmployer =
            job.employer.toLowerCase() === account?.toLowerCase();
          const hasActiveBid = job.bids.some(
            (bid) => bid.bidder.toLowerCase() === account?.toLowerCase()
          );

          return (
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
                job.bids.map((b, i) => (
                  <div key={i}>
                    <span>
                      {b.bidder} offered {ethers.formatEther(b.amount)} ETH
                      {b.accepted && <span> (Accepted)</span>}
                    </span>
                    {isEmployer && !b.accepted && (
                      <button
                        className="job-card-button"
                        onClick={() => acceptBid(job.id, i)}
                      >
                        Accept Bid
                      </button>
                    )}
                  </div>
                ))
              )}

              {!isEmployer && !job.isCompleted && (
                <div className="job-actions">
                  {!hasActiveBid ? (
                    <>
                      <input
                        type="number"
                        placeholder="Your bid in ETH"
                        className="bid-input"
                        value={bidInputs[Number(job.id)] || ""}
                        onChange={(e) =>
                          setBidInputs((prev) => ({
                            ...prev,
                            [Number(job.id)]: e.target.value,
                          }))
                        }
                      />
                      <button
                        className="job-card-button"
                        onClick={() =>
                          placeBid(
                            job.id,
                            BigInt(
                              ethers.parseEther(
                                bidInputs[Number(job.id)] || "0"
                              )
                            )
                          )
                        }
                      >
                        Place Bid
                      </button>
                      <button
                        className="job-card-button"
                        onClick={() => placeBid(job.id, job.budget)}
                      >
                        Apply Now
                      </button>
                    </>
                  ) : (
                    <button
                      className="job-card-button"
                      onClick={() => withdrawBid(job.id)}
                    >
                      Withdraw Bid
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default JobMarket;
