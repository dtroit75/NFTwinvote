# NFTwinvote

This TypeScript smart contract code implements a comprehensive system for managing proposals, user authentication, and real-time NFT (Non-Fungible Token) generation based on 
proposal votes within a specified timeframe.

This code provides a robust framework for managing proposals and facilitating community-driven decision-making processes while enabling real-time NFT generation 
for winning proposals, adding an innovative twist to traditional proposal management systems.

Requirements
Node.js
IC SDK


dfx is the tool you will use to interact with the IC locally and on mainnet.
If you don't already have it installed:

npm run dfx_install

Next you will want to start a replica, which is a local instance of the IC that you can deploy your canisters to:

npm run replica_start

If you ever want to stop the replica:

npm run replica_stop

Now you can deploy your canister locally:

npm install
npm run canister_deploy_local
