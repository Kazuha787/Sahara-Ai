require('dotenv').config();
const { JsonRpcProvider, ethers } = require('ethers');
const kleur = require("kleur");
const fs = require('fs');
const moment = require('moment-timezone');

// RPC Providers
const rpcProviders = [
    new JsonRpcProvider('https://testnet.saharalabs.ai'),  // Sahara Testnet RPC
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

// Function to read private keys from the file
function readPrivateKeys() {
    return fs.readFileSync('privatekeys.txt', 'utf-8').split('\n').map(line => line.trim()).filter(line => line !== '');
}

// Function to check wallet balance (native currency) on the Sahara blockchain
async function checkWalletBalance(privateKey) {
    const wallet = new ethers.Wallet(privateKey, provider());

    console.log(kleur.bold().blue(`🔍 Checking Balance for Wallet: ${kleur.bold().yellow(wallet.address)}...`));

    try {
        // Fetch wallet balance
        const balance = await provider().getBalance(wallet.address);
        const formattedBalance = ethers.formatUnits(balance, 18);  

        const successMessage = `✅ [${timelog()}] Wallet: ${kleur.green(wallet.address)} - Balance: ${kleur.yellow(formattedBalance)} ETH`;
        console.log(kleur.green(successMessage));
        appendLog(successMessage);
    } catch (error) {
        const errorMessage = `❌ [${timelog()}] Error checking balance for wallet ${kleur.red(wallet.address)}: ${kleur.red(error.message)}`;
        console.log(kleur.red(errorMessage));
        appendLog(errorMessage);
    }
}

// Time logging function
function timelog() {
    return moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
}

// Log helper
function appendLog(message) {
    fs.appendFileSync('log-sahara.txt', message + '\n');
}

// Function to add delay (in ms)
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Main function to check balances for all wallets
async function main() {
    console.log(kleur.bold().magenta("🚀 Sahara Testnet Wallet Balance Checker Started!"));
    
    const privateKeys = readPrivateKeys();
    const totalWallets = privateKeys.length;
    console.log(kleur.bold().cyan(`📜 Detected ${totalWallets} wallets in privatekeys.txt.`));

    for (let i = 0; i < totalWallets; i++) {
        const privateKey = privateKeys[i];
        await checkWalletBalance(privateKey);
        console.log('');
        await delay(2000);  // Delay between checks to avoid hitting rate limits
    }

    console.log(kleur.bold().green("✅ All balances checked. 🎉"));
}

// Run the script inside an async function wrapper
(async () => {
    await main();
})();
