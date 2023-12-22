window.onload = async function() {
    async function loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(ethereum);
            try {
                await ethereum.enable();
            } catch (error) {
                console.error(error);
            }
        } else if (window.web3) {
            window.web3 = new Web3(web3.currentProvider);
        } else {
            console.error("Non-Ethereum browser detected. You should consider trying MetaMask!");
            return;
        }
    }

    async function updateGasEstimation() {
        await loadWeb3();

        const tokenName = document.getElementById("tokenSelector").value;

        let tokenABI, tokenAddress;

        if (tokenName === "Token1") {
            const { Token1ABI, Token1Address } = await import('./Token1.js');
            tokenABI = Token1ABI;
            tokenAddress = Token1Address;
        } else if (tokenName === "Token2") {
            const { Token2ABI, Token2Address } = await import('./Token2.js');
            tokenABI = Token2ABI;
            tokenAddress = Token2Address;
        } else if (tokenName === "Token3") {
            // Add import for Token3.js if needed
        } else {
            console.error("Invalid token selection");
            return;
        }

        // Set the "selected" attribute based on the selected token
document.getElementById("tokenSelector").value = tokenName;
        const contract = new web3.eth.Contract(tokenABI, tokenAddress);

        const accounts = await web3.eth.getAccounts();
        const senderAddress = accounts[0];

        

        try {
            // Prompt MetaMask for gas estimation without submitting the transaction
            const gasEstimate = await contract.methods.transfer(senderAddress, 1).estimateGas({ from: senderAddress, gasPrice: '0x' });

            // Get the gas price from MetaMask
            const gasPrice = await web3.eth.getGasPrice();

            // Convert gas estimate to SepoliaETH
            const gasInSepoliaETH = web3.utils.fromWei(gasEstimate.toString(), 'ether');

            // Calculate the expected time (in seconds) for 1 token transfer
            const expectedTime = Math.ceil(gasEstimate / 21000) * 15; // Assuming a block time of 15 seconds

            // Calculate cost in USD (static gas price for demonstration)
            const gasPriceInWei = web3.utils.toBN(gasPrice);
            const gasUsedInWei = web3.utils.toBN(gasEstimate);
            const costInWei = gasPriceInWei.mul(gasUsedInWei);
            const costInEth = web3.utils.fromWei(costInWei, 'ether');
            const ethToUsdRate = 2000; // Replace with the current ETH to USD rate
            const costInUsd = costInEth * ethToUsdRate;

         // Update the UI
         document.getElementById("gasValue").innerText = gasInSepoliaETH;
         document.getElementById("timeValue").innerText = expectedTime + " seconds";
         document.getElementById("costValue").innerText = costInUsd.toFixed(2) + " USD";
     }catch (error) {
            console.error("Error estimating gas:", error);
        }
    }

    async function transferToken() {
        await loadWeb3();

        // Rest of your code remains unchanged
    }

    // Call updateGasEstimation initially when the page loads
    updateGasEstimation();
}
