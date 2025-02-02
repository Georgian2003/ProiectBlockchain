// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./UserProfile.sol";

contract JobMarketplace {
    struct Job {
        uint256 id;
        address payable employer;
        string description;
        uint256 budget;
        bool isCompleted;
        Bid[] bids;
    }

    struct Bid {
        address payable bidder;
        uint256 amount;
        bool accepted;
    }

    uint256 public jobCounter;
    mapping(uint256 => Job) public jobs;

    address public owner; // Owner of the contract
    uint256 public commissionPercentage = 5; // Default commission
    UserProfile public userProfileContract; // Reference to the UserProfile contract

    event JobPosted(uint256 jobId, address employer, uint256 budget);
    event BidPlaced(uint256 jobId, address bidder, uint256 amount);
    event BidAccepted(uint256 jobId, address bidder, uint256 amount);
    event BidWithdrawn(uint256 jobId, address bidder, uint256 amount);
    event CommissionUpdated(uint256 newCommission);

    // Modifier to restrict access to the contract owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

    // Constructor to initialize owner and reference the UserProfile contract
    constructor(address userProfileAddress) {
        owner = msg.sender;
        userProfileContract = UserProfile(userProfileAddress);
    }

    // Postează un job
    function postJob(string memory _description) external payable {
        require(msg.value > 0, "Must send some ETH as budget.");

        jobCounter++;
        Job storage newJob = jobs[jobCounter];
        newJob.id = jobCounter;
        newJob.employer = payable(msg.sender);
        newJob.description = _description;
        newJob.budget = msg.value;
        newJob.isCompleted = false;

        uint256 commission = calculateCustomCommission(msg.value); // Using the custom commission
        payable(owner).transfer(commission); // Send commission to the owner

        emit JobPosted(jobCounter, msg.sender, msg.value);
    }

    // Plasează un bid
    function placeBid(uint256 jobId, uint256 amount) external {
        require(jobs[jobId].employer != address(0), "Job does not exist.");
        require(!jobs[jobId].isCompleted, "Job already completed.");

        Job storage job = jobs[jobId];
        require(amount > 0, "Bid must be > 0");
        require(amount <= job.budget, "Bid must be <= job budget");

        job.bids.push(Bid({
            bidder: payable(msg.sender),
            amount: amount,
            accepted: false
        }));

        emit BidPlaced(jobId, msg.sender, amount);
    }

    // Acceptă un bid
    function acceptBid(uint256 jobId, uint256 bidIndex) external {
        require(jobs[jobId].employer != address(0), "Job does not exist.");
        require(!jobs[jobId].isCompleted, "Job already completed.");
        require(jobs[jobId].employer == msg.sender, "Only employer can accept bid.");

        Job storage job = jobs[jobId];
        require(bidIndex < job.bids.length, "Invalid bid index.");

        Bid storage chosenBid = job.bids[bidIndex];
        require(!chosenBid.accepted, "Bid already accepted.");
        require(chosenBid.amount <= job.budget, "Amount exceeds job budget.");

        chosenBid.accepted = true;
        job.isCompleted = true;

        // Transferă suma către bidder
        chosenBid.bidder.transfer(chosenBid.amount);

        // Returnează diferența (dacă a licitat mai puțin)
        uint256 leftover = job.budget - chosenBid.amount;
        if (leftover > 0) {
            job.employer.transfer(leftover);
        }

        emit BidAccepted(jobId, chosenBid.bidder, chosenBid.amount);
    }

    // Retrage un bid
    function withdrawBid(uint256 jobId) external {
        Job storage job = jobs[jobId];
        require(job.employer != address(0), "Job does not exist.");
        require(!job.isCompleted, "Job already completed.");

        uint256 bidIndex = 0;
        bool bidFound = false;

        for (uint256 i = 0; i < job.bids.length; i++) {
            if (job.bids[i].bidder == msg.sender) {
                bidIndex = i;
                bidFound = true;
                break;
            }
        }

        require(bidFound, "No bid found for the caller.");

        uint256 bidAmount = job.bids[bidIndex].amount;
        job.bids[bidIndex] = job.bids[job.bids.length - 1];
        job.bids.pop();

        emit BidWithdrawn(jobId, msg.sender, bidAmount);
    }

    // Obține toate joburile
    function getAllJobs() public view returns (Job[] memory) {
        Job[] memory allJobs = new Job[](jobCounter);
        for (uint256 i = 1; i <= jobCounter; i++) {
            allJobs[i - 1] = jobs[i];
        }
        return allJobs;
    }

    // Funcție de tip pure pentru calcularea comisionului standard (5%)
    function calculateCommission(uint256 amount) public pure returns (uint256) {
        return (amount * 5) / 100;
    }

    // Funcție pentru calcularea comisionului bazat pe valoarea setată de owner
    function calculateCustomCommission(uint256 amount) public view returns (uint256) {
        return (amount * commissionPercentage) / 100;
    }

    // Funcție pentru ca ownerul să actualizeze valoarea comisionului
    function setCommissionPercentage(uint256 newPercentage) external onlyOwner {
        require(newPercentage <= 100, "Commission cannot exceed 100%");
        commissionPercentage = newPercentage;

        emit CommissionUpdated(newPercentage);
    }

    // Funcție de tip private pentru verificări interne
    function hasBidFromUser(Job storage job, address user) private view returns (bool) {
        for (uint256 i = 0; i < job.bids.length; i++) {
            if (job.bids[i].bidder == user) {
                return true;
            }
        }
        return false;
    }
}
