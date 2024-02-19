// cannister code goes here
import {
    Canister,
    Principal,
    Record,
    Result,
    Some,
    StableBTreeMap,
    Variant,
    Vec,
    ic,
    nat32,
    nat64,
    query,
    text,
    update,
  } from 'azle';
  import { v4 as uuidv4 } from 'uuid';

  // Define interfaces for Proposal and User
interface Proposal {
    id: text,
    description: text,
    votes: nat32,
    userId: Principal, // User ID associated with the proposal
};

interface User {
    id: Principal,
    username: text,
    password: text,
};

// Define a class to manage proposals
class ProposalManager {
    private proposals: Proposal[] = [];
    private proposalIdCounter: nat32 = 0;

    // Method to create a new proposal
    createProposal(user: User, description: text): Proposal {
        const newProposal: Proposal = {
            id: ++this.proposalIdCounter,
            description,
            votes: 0,
            userId: user.id // Store user ID associated with the proposal
        };
        this.proposals.push(newProposal);
        console.log(`Proposal created by ${user.username}: "${description}"`);
        return newProposal;
    }

    // Method to get all proposals
    getAllProposals(): Proposal[] {
        return this.proposals;
    }

    // Method to vote on a proposal
    voteOnProposal(user: User, proposalId: Principal, timestamp: nat64): void {
        const proposal = this.proposals.find(p => p.id === proposalId);
        if (proposal) {
            proposal.votes++;
            console.log(`Vote recorded by ${user.username} for Proposal ${proposalId}`);
            proposal.lastVoteTimestamp = timestamp; // Store the timestamp of the last vote
        } else {
            console.log(`Proposal ${proposalId} not found.`);
        }
    }

    // Method to delete a proposal
    deleteProposal(user: User, proposalId: Principal): void {
        const index = this.proposals.findIndex(p => p.id === proposalId && p.userId === user.id);
        if (index !== -1) {
            this.proposals.splice(index, 1);
            console.log(`Proposal ${proposalId} deleted successfully by ${user.username}.`);
        } else {
            console.log(`Proposal ${proposalId} not found or you don't have permission to delete.`);
        }
    }

    // Method to determine the proposal with the most votes within a 72-hour timeframe
    getWinningProposal(): Proposal | undefined {
        const currentTime = Date.now();
        const seventyTwoHoursAgo = currentTime - (72 * 60 * 60 * 1000); // 72 hours in milliseconds
        const proposalsWithinTimeframe = this.proposals.filter(p => p.lastVoteTimestamp && p.lastVoteTimestamp >= seventyTwoHoursAgo);
        if (proposalsWithinTimeframe.length === 0) {
            return undefined;
        }
        return proposalsWithinTimeframe.reduce((prev, current) => (prev.votes > current.votes ? prev : current));
    }
}

// Define a class to manage users
class UserManager {
    private users: User[] = [];
    private userIdCounter: nat32 = 0;

    // Method to register a new user
    registerUser(username: string, password: string): User {
        const newUser: User = {
            id: ++this.userIdCounter,
            username,
            password
        };
        this.users.push(newUser);
        console.log(`User ${username} registered successfully.`);
        return newUser;
    }

    // Method to authenticate a user
    authenticateUser(username: string, password: string): User | undefined {
        return this.users.find(user => user.username === username && user.password === password);
    }
}

// Simulate database interaction
class Database {
    // Simulate storing user data in memory
    private static users: User[] = [];
}

// Example usage
const userManager = new UserManager();
const proposalManager = new ProposalManager();

// Register users
const user1 = userManager.registerUser("user1", "password1");
const user2 = userManager.registerUser("user2", "password2");

// Authenticate users
const authenticatedUser1 = userManager.authenticateUser("user1", "password1");
const authenticatedUser2 = userManager.authenticateUser("user2", "password2");

if (authenticatedUser1 && authenticatedUser2) {
    // Create proposals
    const proposal1 = proposalManager.createProposal(authenticatedUser1, "Implement new feature");
    const proposal2 = proposalManager.createProposal(authenticatedUser2, "Optimize performance");
    const proposal3 = proposalManager.createProposal(authenticatedUser1, "Update UI design");

    // Vote on proposals
    proposalManager.voteOnProposal(authenticatedUser1, proposal1.id, Date.now());
    proposalManager.voteOnProposal(authenticatedUser2, proposal1.id, Date.now());
    proposalManager.voteOnProposal(authenticatedUser1, proposal2.id, Date.now());

    // Simulate a vote within the 72-hour timeframe
    const sixtyHoursAgo = Date.now() - (60 * 60 * 1000 * 60); // 60 hours ago
    proposalManager.voteOnProposal(authenticatedUser1, proposal3.id, sixtyHoursAgo);

    // Determine the winning proposal
    const winningProposal = proposalManager.getWinningProposal();
    if (winningProposal) {
        console.log(`The winning proposal is: "${winningProposal.description}" with ${winningProposal.votes} votes.`);
        // Check if the authenticated user is the owner of the winning proposal
        if (winningProposal.userId === authenticatedUser1.id) {
            console.log("You can generate an NFT for your winning proposal.");
            // Add logic to generate NFT
        } else {
            console.log("You did not win the proposal.");
        }
    } else {
        console.log("No winning proposal found within the 72-hour timeframe.");
    }
} else {
    console.log("Authentication failed.");
}
