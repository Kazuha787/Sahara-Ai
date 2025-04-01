import inquirer from 'inquirer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';  // Import path here

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Banner show karne ke liye
import print_banner from './banner.js';
print_banner();

// Options show karna
async function mainMenu() {
    try {
        const answer = await inquirer.prompt([
            {
                type: "list",
                name: "choice",
                message: "Select an option:",
                choices: ["Daily Login", "Shard Claim", "Second Claim", "Balance",  "Exit"],
            },
        ]);

        switch (answer.choice) {
            case "Daily Login":
                import(path.join(__dirname, "src", "dailyLogin.js"));
                break;
            case "Shard Claim":
                import(path.join(__dirname, "src", "shardClaim.js"));
                break;
            case "2nd Claim":
                import(path.join(__dirname, "src", "secondClaim.js"));
                break;
            case "Balance":
                import(path.join(__dirname, "src", "Balance.js"));
                break;
            case "Exit":
                console.log("Exiting script...");
                process.exit();
                break;
        }


    } catch (error) {
        console.error("Error:", error);
    }
}

mainMenu();
