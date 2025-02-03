import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

interface JobListProps {
  contractAddress: string;
  account: string | null;
}

const abi = [
  "function getMyJobs() public view returns (tuple(uint256 id, address employer, string description, uint256 budget, bool isAuction, address auctionContract, bool isCompleted)[])",
];

const JobList: React.FC<JobListProps> = ({ contractAddress, account }) => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchJobs = async () => {
      if (!account) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const provider = new ethers.BrowserProvider(
          window.ethereum as ethers.Eip1193Provider
        );

        const contract = new ethers.Contract(contractAddress, abi, provider);

        const myJobs = await contract.getMyJobs();

        setJobs(myJobs);
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching your jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [account, contractAddress]);

  return (
    <div>
      <h2>My Jobs</h2>

      {loading && <p>Loading your jobs...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && jobs.length === 0 && !error && (
        <p>No jobs found for your address.</p>
      )}

      {jobs.map((job, index) => (
        <div
          key={index}
          style={{ border: "1px solid #ccc", margin: "8px 0", padding: "8px" }}
        >
          <h3>Job #{job.id.toString()}</h3>
          <p>Description: {job.description}</p>
          <p>Budget: {ethers.formatEther(job.budget.toString())} ETH</p>
          <p>Employer: {job.employer}</p>
          <p>Auction: {job.isAuction ? "Yes" : "No"}</p>
          <p>Completed: {job.isCompleted ? "Yes" : "No"}</p>
        </div>
      ))}
    </div>
  );
};

export default JobList;
