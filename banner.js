const chalk = require('chalk');

function printBanner() {
  const bannerColor = chalk.cyan;  // You can change this color to whatever you prefer
  
  console.log(bannerColor.bold(`╔════════════════════════════════════════════════════╗`));
  console.log(bannerColor.bold(`║               SAHARA-AI AUTO BOT                   ║`));
  console.log(bannerColor.bold(`║          Automate Your Sahara-Ai Testnet           ║`));
  console.log(bannerColor.bold(`║    Developed by: https://t.me/Offical_Im_kazuha    ║`));
  console.log(bannerColor.bold(`║    GitHub: https://github.com/Kazuha787            ║`));
  console.log(bannerColor.bold(`╠════════════════════════════════════════════════════╣`));

  // ASCII Art in the same color
  console.log(bannerColor(`║                                                    ║`));
  console.log(bannerColor(`║  ██╗  ██╗ █████╗ ███████╗██╗   ██╗██╗  ██╗ █████╗  ║`));
  console.log(bannerColor(`║  ██║ ██╔╝██╔══██╗╚══███╔╝██║   ██║██║  ██║██╔══██╗ ║`));
  console.log(bannerColor(`║  █████╔╝ ███████║  ███╔╝ ██║   ██║███████║███████║ ║`));
  console.log(bannerColor(`║  ██╔═██╗ ██╔══██║ ███╔╝  ██║   ██║██╔══██║██╔══██║ ║`));
  console.log(bannerColor(`║  ██║  ██╗██║  ██║███████╗╚██████╔╝██║  ██║██║  ██║ ║`));
  console.log(bannerColor(`║  ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ║`));

  // Closing line
  console.log(bannerColor(`║                                                    ║`));
  console.log(bannerColor.bold(`╚════════════════════════════════════════════════════╝`));
}

module.exports = printBanner;
