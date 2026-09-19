# Outcom

**Prove the work. Earn the reward.**

Outcom is an outcome-based hiring protocol that lets companies evaluate talent through real work instead of relying solely on resumes, interviews, and referrals.

Companies create and fund Work Trials with **USDC**. Candidates complete the defined work and submit verifiable evidence such as GitHub repositories, deployed applications, transaction links, and supporting documentation.

**GenLayer** evaluates the submitted evidence against the Work Trial's requirements and Definition of Done. Once the outcome is verified, the system can settle the configured reward for the candidate and referrer.

WorkTrial is built around **Solana**, with **LayerZero** used for cross-chain communication.

---

## How It Works

```text
Employer
   │
   │ Creates + funds Work Trial
   ▼
WorkTrial
   │
   │ Candidate selected
   ▼
Candidate completes work
   │
   │ Submits evidence
   ▼
GenLayer Outcome Verification
   │
   │ PASS / FAIL
   ▼
Relayer
   │
   │ Cross-chain message
   ▼
Solana Settlement
   │
   ├── Candidate reward
   └── Referral reward
          │
          ▼
   Verified Reputation
```

The important distinction is that **applying does not mean starting the work**.

Multiple candidates can apply to a Work Trial, but the employer selects the candidate or finalists who actually proceed with the work.

---

## Core Concept

A Work Trial defines three things:

### 1. Requirements

What the candidate must deliver.

Example:

* Solana integration
* USDC payment functionality
* Transaction confirmation
* Error handling
* Documentation

### 2. Definition of Done

The objective conditions that determine whether the work is complete.

For example:

* GitHub repository submitted
* Application deployed
* Required functionality working
* Transactions verifiable on-chain
* Documentation included
* No critical runtime errors

### 3. Reward

The amount paid when the required outcome is successfully verified.

Rewards are denominated in **USDC** and can be divided between the candidate and referrer.

Example:

```text
Total Reward       500 USDC

Candidate           450 USDC
Referrer             50 USDC
```

---

# Architecture

Outcom consists of four main layers.

```text
┌───────────────────────────────┐
│           Frontend            │
│      Candidate / Employer     │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│            Backend            │
│    Application + API Logic    │
└───────────────┬───────────────┘
                │
        Evidence submission
                │
                ▼
┌───────────────────────────────┐
│          GenLayer             │
│      Outcome Verification     │
└───────────────┬───────────────┘
                │
          Verification
          payload / result
                │
                ▼
┌───────────────────────────────┐
│           Relayer             │
│ Cross-chain message handling  │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│            Solana             │
│       Reward settlement       │
└───────────────────────────────┘
```

---

# Frontend

The frontend provides the user-facing Outcom experience.

Main areas include:

* Discover Work Trials
* Work Trial details
* Candidate applications
* Candidate workspace
* Evidence submission
* Verification status
* Employer dashboard
* Applicant management
* Reward information
* Reputation
* Leaderboard
* Wallet interactions

A candidate moves through the following lifecycle:

```text
OPEN
  ↓
APPLIED
  ↓
SELECTED
  ↓
IN PROGRESS
  ↓
READY TO SUBMIT
  ↓
UNDER REVIEW
  ↓
VERIFIED / REJECTED
  ↓
REWARDED
```

Applicants who are not selected do not need to complete the Work Trial.

---

# Backend

The backend supports the application layer between the frontend and the protocol components.

It is responsible for handling application-level operations such as:

* Work Trial data
* Candidate applications
* Candidate selection
* Evidence submissions
* Verification state
* Communication between the frontend and protocol services
* Relayer coordination

The backend does not replace the on-chain settlement layer.

Protocol-critical outcomes and reward settlement are handled through the blockchain and verification infrastructure.

---

# GenLayer Outcome Verification

GenLayer is responsible for determining whether submitted evidence satisfies the Work Trial's predefined requirements.

The repository contains an **OutcomeVerifier** Intelligent Contract.

The verifier stores a Work Trial's:

* Definition of Done
* Requirements
* Candidate wallet
* Referrer wallet
* Submitted evidence
* Verdict
* Score
* Verification reasoning
* Settlement payload

### Evidence

Candidates can submit:

* GitHub repository URL
* Deployed application URL
* Additional supporting URL

The verifier retrieves the relevant web content and evaluates it against the Work Trial specification.

The verification process uses GenLayer's non-deterministic execution and Equivalence Principle to reach a consistent outcome.

The resulting verdict is:

```text
PASS
```

or

```text
FAIL
```

A successful verification produces a settlement payload containing the relevant Solana addresses, score, trial ID, and pass/fail result.

---

# OutcomeVerifier Contract

The main contract operations are:

### `set_trial()`

Creates or updates the verification criteria for a Work Trial.

Only the contract administrator can configure trials.

### `submit_and_verify()`

Submits candidate evidence and runs the verification process.

The function:

1. Loads the Work Trial
2. Validates the submitted evidence
3. Fetches evidence from the provided URLs
4. Evaluates the evidence against the requirements
5. Reaches a GenLayer consensus decision
6. Generates a settlement payload
7. Stores the verification result

### `get_trial_status()`

Returns the current verification state of a Work Trial.

### `list_trial_ids()`

Returns the configured Work Trial IDs.

---

# Solana

Solana acts as the settlement layer for Outcom.

See the Repo for the solana program that escrows the reward <a href='https://github.com/Emman442/Outcom-solana-program'>here </a>

The Solana side is responsible for the on-chain reward flow and user-facing blockchain interactions.

USDC is used as the primary reward asset.

The protocol is designed so that a successful verified outcome can result in:

```text
Verified Outcome
       │
       ▼
Reward Settlement
       │
       ├── Candidate
       │
       └── Referrer
```

Solana also provides the verifiable transaction history that candidates can use as evidence of completed work.

---

# LayerZero

Outcom uses **LayerZero** for cross-chain communication.

LayerZero connects the protocol's verification and settlement components without requiring the entire application to exist on a single chain.

The relayer coordinates the cross-chain message flow between the relevant components.

Conceptually:

```text
GenLayer
   │
   │ Verified outcome
   ▼
Relayer
   │
   │ LayerZero message
   ▼
Solana
   │
   ▼
USDC Settlement
```

LayerZero is therefore treated as infrastructure for the protocol rather than as part of the core hiring experience.

---

# Relayer

The relayer connects the verification layer with the blockchain settlement layer.

Its responsibilities include:

* Monitoring verification results
* Reading successful verification payloads
* Preparing cross-chain messages
* Sending the required LayerZero message
* Coordinating settlement on the destination chain
* Tracking transaction/message status

This allows the application to keep the user experience simple while the underlying protocol handles the cross-chain communication.

---

# Verification Payload

A successful verification generates a payload containing information required by the Solana settlement flow.

The current verifier encodes:

```text
Trial ID
Candidate Solana public key
Referrer Solana public key
Verification score
Pass / Fail status
```

The Solana public keys are converted from Base58 into their 32-byte representation before being included in the payload.

---

# Example Work Trial

### Build a Solana Payment Integration

**Reward**

500 USDC

**Candidate Reward**

450 USDC

**Referral Reward**

50 USDC

### Requirements

* Solana integration
* USDC transfer functionality
* Transaction confirmation
* Error handling
* Responsive interface

### Definition of Done

* Public GitHub repository
* Deployed application
* Working payment flow
* Verifiable Solana transactions
* Documentation
* No critical bugs

A selected candidate completes the work and submits:

```text
GitHub Repository
        +
Deployed Application
        +
Supporting Evidence
```

The verifier evaluates the evidence.

If the requirements are satisfied:

```text
PASS
  ↓
Verification Payload
  ↓
Relayer
  ↓
LayerZero
  ↓
Solana
  ↓
USDC Reward
```

---

# Why WorkTrial?

Traditional hiring often asks candidates to prove their ability through:

* CVs
* interviews
* credentials
* references
* portfolios

WorkTrial introduces another primitive:

> **Prove that you can actually do the work.**

The result is a hiring system where successful work can become a verifiable reputation signal.

A candidate's history can contain:

```text
18 Verified Work Trials
14 Successful Outcomes
$8,420 USDC Earned
94 Reputation
```

This reputation can be associated with the candidate's on-chain identity and used across future opportunities.

---

# Repository Structure

The repository is organized around the main components of the protocol.

```text
Outcom/
│
├── frontend/
│   └── Outcom user interface
│
├── backend/
│   └── Application/API services
│
├── contracts/
│   └── GenLayer Intelligent Contracts
│
├── relayer/
│   └── Cross-chain verification and settlement coordination
│
└── README.md
```

The exact implementation and deployment configuration for each component lives inside its respective directory.

---

# Getting Started

Clone the repository:

```bash
git clone https://github.com/Emman442/Outcom
cd outcom
```

Install the dependencies for the individual application components according to their respective package configuration.

The project requires configuration for the relevant:

* Solana network
* USDC mint/address
* GenLayer contract
* LayerZero configuration
* Relayer
* Backend
* Frontend

Create the required environment files for each component before starting the application.

---

# Development Flow

For local development, the recommended flow is:

```text
1. Start the backend
        ↓
2. Start the frontend
        ↓
3. Configure the GenLayer verifier
        ↓
4. Configure Solana settlement
        ↓
5. Start the relayer
        ↓
6. Create a Work Trial
        ↓
7. Submit candidate evidence
        ↓
8. Verify the outcome
        ↓
9. Process cross-chain message
        ↓
10. Settle the reward
```

---

# Status

Outcom is an experimental protocol demonstrating **outcome-based hiring with AI verification, on-chain settlement, and portable reputation**.

The current implementation focuses on the core loop:

**Work → Evidence → Verification → Settlement → Reputation**

---

## Built With

* **Solana** — on-chain settlement
* **USDC** — rewards and payments
* **GenLayer** — AI-powered outcome verification
* **LayerZero** — cross-chain communication
* **Outcom Frontend** — candidate and employer experience
* **Backend** — application and coordination layer
* **Relayer** — verification-to-settlement bridge

---

## Important Links

Checkout The solana Program for Outcom here: https://github.com/Emman442/Outcom-solana-program

Checkout the Solana Deployment for Outcom on Devnet: https://explorer.solana.com/address/DMbLxuGRQdtYwhsXTGdp1qAKbzzR7jiR3gvvttgU36Tj?cluster=devnet

Checkout the Repository for the relayer: https://github.com/Emman442/outcom-relayer
