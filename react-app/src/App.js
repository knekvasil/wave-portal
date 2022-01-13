import "./App.css";

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./utils/wave-portal.json";

function App() {
	const [CurrentAccount, setCurrentAccount] = useState("");
	const [CurrentWaveCount, setCurrentWaveCount] = useState("");

	const contractAddress = "0x03beDA57d3c3031Ca9eCa81CC5be72b77286A574";
	const contractABI = abi.abi;

	async function checkIfWalletIsConnected() {
		try {
			const { ethereum } = window;

			if (!ethereum) {
				console.log("Make sure you have metamask!");
				return;
			} else {
				console.log("We have the ethereum object ", ethereum);
			}

			const accounts = await ethereum.request({ method: "eth_accounts" });

			if (accounts.length !== 0) {
				const account = accounts[0];
				console.log("Found an authorized account:", account);
				setCurrentAccount(account);
			} else {
				console.log("No authorized account found");
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function connectWallet() {
		try {
			const { ethereum } = window;

			if (!ethereum) {
				alert("Get MetaMask!");
				return;
			}

			const accounts = await ethereum.request({
				method: "eth_requestAccounts",
			});

			console.log("Connected", accounts[0]);
			setCurrentAccount(accounts[0]);
		} catch (error) {
			console.log(error);
		}
	}

	async function getTotalWaveCount() {
		try {
			const { ethereum } = window;

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const wavePortalContract = new ethers.Contract(
					contractAddress,
					contractABI,
					signer
				);

				let count = await wavePortalContract.getTotalWaves();
				console.log("Retrieved total wave count...", count.toNumber());
				setCurrentWaveCount(count.toNumber());
			} else {
				console.log(
					"Ethereum object does not exist + wave count could not be grabbed!"
				);
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function wave() {
		try {
			const { ethereum } = window;

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const wavePortalContract = new ethers.Contract(
					contractAddress,
					contractABI,
					signer
				);

				let count = await wavePortalContract.getTotalWaves();
				console.log("Retrieved total wave count...", count.toNumber());

				const waveTxn = await wavePortalContract.wave();
				console.log("Mining...", waveTxn.hash);

				await waveTxn.wait();
				console.log("Mined -- ", waveTxn.hash);

				count = await wavePortalContract.getTotalWaves();
				console.log("Retrieved total wave count...", count.toNumber());

				getTotalWaveCount();
			} else {
				console.log("Ethereum object does not exist!");
			}
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		checkIfWalletIsConnected();
		getTotalWaveCount();
	}, []);

	return (
		<div className="App">
			<div className="header">👋 Hey there!</div>

			<div className="bio">Connect your Ethereum wallet and wave at me!</div>

			<button className="waveButton" onClick={wave}>
				Wave at Me
			</button>

			<p>I have been waved at: {CurrentWaveCount} times!</p>
		</div>
	);
}

export default App;
