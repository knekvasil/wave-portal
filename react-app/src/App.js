import "./App.css";

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./utils/wave-portal.json";

import { Form } from "react-bootstrap";
import ReactTextRotator from "react-text-rotator";

function App() {
	const textContent = [
		{ text: "How cool!", animation: "fade" },
		{ text: "Nice!", animation: "fade" },
		{ text: "Totally tubular!", animation: "fade" },
		{ text: "And how!", animation: "fade" },
		{ text: "Massive!", animation: "fade" },
		{
			text: "You gotta bump those numbers up, those are rookie numbers.",
			animation: "fade",
		},
		{ text: "Shaka brah!", animation: "fade" },
		{ text: "¡Qué guay!", animation: "fade" },
		{ text: "Cheers!", animation: "fade" },
	];

	const [CurrentAccount, setCurrentAccount] = useState("");
	const [AllWaves, setAllWaves] = useState([]);
	const [CurrentWaveCount, setCurrentWaveCount] = useState("");
	const [TransactionMessage, setTransactionMessage] = useState("");
	const [Loading, setLoading] = useState(Boolean);

	const contractAddress = "0x95B5B3918434a47C042F4B68993D287B7712cdA0";
	const contractABI = abi.abi;

	console.log(TransactionMessage);

	function handleChange(event) {
		setTransactionMessage(event.target.value);
	}

	async function getAllWaves() {
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

				const waves = await wavePortalContract.getAllWaves();

				let wavesCleaned = [];
				waves.forEach((wave) => {
					wavesCleaned.push({
						address: wave.waver,
						timestamp: new Date(wave.timestamp * 1000),
						message: wave.message,
					});
				});

				setAllWaves(wavesCleaned);
			} else {
				console.log("Ethereum object does not exist");
			}
		} catch (error) {
			console.log(error);
		}
	}

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

				// Loading for spinner
				setLoading(true);

				const waveTxn = await wavePortalContract.wave(TransactionMessage);
				console.log("Mining...", waveTxn.hash);

				await waveTxn.wait();
				console.log("Mined -- ", waveTxn.hash);

				setTransactionMessage("");
				setLoading(false);

				count = await wavePortalContract.getTotalWaves();
				console.log("Retrieved total wave count...", count.toNumber());

				getTotalWaveCount();
				getAllWaves();
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
		getAllWaves();
	}, []);

	return (
		<div className="px-4 py-5 my-5 text-center">
			<h1 className="display-5 fw-bold">Wave at Kalju</h1>
			<div className="row justify-content-center">
				<div className="col-5 mb-3">
					<p className="mt-3">
						👋 Hey there! Ever wanted to wave at someone through the blockchain?
						Now's your chance! Connect your Ethereum wallet and wave at me.
						Don't forget to write a message first!
					</p>
				</div>
			</div>

			{CurrentAccount ? (
				<button
					type="button"
					className="btn btn-primary btn-lg px-4 gap-3"
					onClick={wave}
				>
					Wave at me
				</button>
			) : (
				<button
					className="btn btn-secondary btn-lg px-4 gap-3"
					onClick={connectWallet}
				>
					Connect Wallet
				</button>
			)}

			<div className="row justify-content-center">
				<div className="col-7">
					<p className="mt-4">
						I've been waved at {CurrentAccount ? CurrentWaveCount : "x"}
						<b></b> times so far!{" "}
						<ReactTextRotator
							content={textContent}
							time={5000}
							startDelay={2000}
						/>
					</p>
				</div>
			</div>

			<div className="row justify-content-center">
				<div className="col-5 mb-5">
					<Form>
						<Form.Group controlId="form.Textarea">
							<Form.Label style={{ display: "flex" }}>
								<h4>Comment:</h4>
							</Form.Label>
							<Form.Control
								as="textarea"
								value={TransactionMessage}
								rows={3}
								onChange={handleChange}
								disabled={Loading === true ? true : false}
							/>
						</Form.Group>
					</Form>
				</div>
				<div className="col-8">
					{Loading && (
						<div className="d-flex justify-content-center mt-4">
							<div className="spinner-border mb-5" role="status"></div>
						</div>
					)}
					{AllWaves.slice(0)
						.reverse()
						.map((wave, index) => {
							return (
								<div
									className="card mt-2"
									key={index}
									style={{ boxShadow: "5px 5px #F1F5FF" }}
								>
									<div className="card-body">
										<div className="row">
											<div
												className="col-2"
												style={{ borderRight: "thick double #0d6efd" }}
											>
												<h5 className="card-title mb-5">Address:</h5>

												<h5 className="card-title mt-5">Message:</h5>
											</div>
											<div className="col-10">
												<h5 className="card-title">{wave.address}</h5>
												<h6 className="card-subtitle mb-4 text-muted">
													<b>just 👋 waved on</b>{" "}
													{wave.timestamp.toString().substring(0, 21)}
												</h6>
												<p className="card-text">{wave.message}</p>
											</div>
										</div>
									</div>
								</div>
							);
						})}
				</div>
			</div>
		</div>
	);
}

export default App;
