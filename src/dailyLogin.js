require('dotenv').config();
const { JsonRpcProvider, ethers } = require('ethers');
const kleur = require("kleur");
const fs = require('fs');
const moment = require('moment-timezone');
const fetch = require('node-fetch').default; // Corrected import for node-fetch

// RPC Providers
const rpcProviders = [  
  new JsonRpcProvider('https://testnet.saharalabs.ai'), 
];

let currentRpcProviderIndex = 0;

function provider() {  
  return rpcProviders[currentRpcProviderIndex];  
}

function rotateRpcProvider() {  
  currentRpcProviderIndex = (currentRpcProviderIndex + 1) % rpcProviders.length;  
  return provider(); 
}

// Explorer base URL
const baseExplorerUrl = 'https://testnet-explorer.saharalabs.ai';

// Explorer URLs
const explorer = {
  get tx() {
    return (txHash) => `${baseExplorerUrl}/tx/${txHash}`;
  },
  get address() {
    return (address) => `${baseExplorerUrl}/address/${address}`;
  }
};

// Log helper
function appendLog(message) {
  fs.appendFileSync('log-sahara.txt', message + '\n');
}

// Function to generate random transaction value
function getRandomTransactionValue() {
  const min = 0.000001;  // Minimum value for transaction
  const max = 0.00001;   // Maximum value for transaction
  return Math.random() * (max - min) + min;
}

// Function to generate a random Ethereum address
function generateRandomAddress() {
  const randomPrivateKey = ethers.Wallet.createRandom().privateKey; // Generate a random private key
  const wallet = new ethers.Wallet(randomPrivateKey);
  return wallet.address;  // Return the generated address
}

// Function to add delay between transactions
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Single transaction for each private key
async function sendTransaction(privateKey) {
    const wallet = new ethers.Wallet(privateKey, provider());
    
    // Display loading with color and emoji
    console.log(kleur.cyan(`🚀 Start Transaction for Wallet ${wallet.address}...`));

    // Get the current nonce before sending the transaction (to avoid mismatch)
    const nonce = await provider().getTransactionCount(wallet.address, 'latest');  // Use 'latest' to ensure the correct nonce

    const randomAddress = generateRandomAddress();  // Generate a random address

    const tx = {
        to: randomAddress,  // Use the random generated address as the recipient
        value: ethers.parseEther(getRandomTransactionValue().toFixed(8)),  // Randomized ETH value
        nonce: nonce,  // Set the correct nonce
    };

    try {
        const signedTx = await wallet.sendTransaction(tx);
        const txHash = signedTx.hash;
        const receipt = await waitForTransactionConfirmation(txHash);  // Wait for transaction confirmation
        const successMessage = `[${timelog()}] ✅ Transaction Confirmed: ${explorer.tx(receipt.hash)}`;
        console.log(kleur.green(successMessage));
        appendLog(successMessage);
    } catch (error) {
        const errorMessage = `[${timelog()}] ❌ Error processing wallet: ${error.message}`;
        console.log(kleur.red(errorMessage));
        appendLog(errorMessage);
    }
}

// Function to wait for transaction confirmation (with retry)
async function waitForTransactionConfirmation(txHash) {
    let attempts = 0;
    while (attempts < 10) {  // Retry up to 10 times
        try {
            const receipt = await provider().getTransactionReceipt(txHash);
            if (receipt) {
                return receipt;  // Transaction confirmed, return the receipt
            }
        } catch (error) {
            // Handle potential errors from RPC provider
            console.log(kleur.yellow(`[${timelog()}] ⏳ Waiting for transaction ${txHash} to be mined...`));
        }

        // Wait before retrying
        await delay(5000);  // 5 seconds delay between attempts
        attempts++;
    }

    throw new Error(`Transaction ${txHash} could not be confirmed after multiple attempts`);
}

// Time logging function
function timelog() {
  return moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
}

// Run transactions for wallets in batches of 10
async function runTransaction() {
    // Read private keys from privatekeys.txt file
    const privateKeys = fs.readFileSync('privatekeys.txt', 'utf-8').split('\n').map(line => line.trim()).filter(line => line !== '');

    const totalWallets = privateKeys.length;
    console.log(kleur.magenta(`🌍 Detected ${totalWallets} wallets in privatekeys.txt.`));

    let batchSize = 100;  // Process 10 wallets at a time
    let batches = Math.ceil(totalWallets / batchSize);  // Total number of batches

    for (let batch = 0; batch < batches; batch++) {
        const start = batch * batchSize;
        const end = Math.min(start + batchSize, totalWallets);
        const currentBatch = privateKeys.slice(start, end);

        console.log(kleur.cyan(`📦 Processing Batch ${batch + 1} of ${batches}...`));

        const batchPromises = currentBatch.map(async (privateKey, index) => {
            try {
                await sendTransaction(privateKey);
                console.log('');
                await delay(2000);  // Delay 2 seconds between transactions to prevent nonce issues
            } catch (error) {
                const errorMessage = `[${timelog()}] ❌ Error processing wallet ${start + index + 1}: ${error.message}`;
                console.log(kleur.red(errorMessage));
                appendLog(errorMessage);
            }
        });

        // Wait for all transactions in this batch to finish
        await Promise.all(batchPromises);
    }

    console.log(kleur.green("✅ All batches completed."));
}

// Main function to start the transaction process
async function main() {
    await runTransaction();  // Run transactions for wallets in batches of 10
    console.log(kleur.green("🎉 All transactions completed."));
}

main();
