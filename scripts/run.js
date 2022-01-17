// run.js

async function main() {
	const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
	const waveContract = await waveContractFactory.deploy({
		value: hre.ethers.utils.parseEther("0.1"),
	});
	await waveContract.deployed();
	console.log("Contract deployed to:", waveContract.address);
	// console.log("Contract deployed by:", owner.address);

	let contractBalance = await hre.ethers.provider.getBalance(
		waveContract.address
	);

	console.log(
		"Contract balance:",
		hre.ethers.utils.formatEther(contractBalance)
	);

	let waveCount;
	waveCount = await waveContract.getTotalWaves();
	console.log(waveCount.toNumber());

	// Testing waves
	let waveTxn = await waveContract.wave("A message!");
	await waveTxn.wait();

	let waveTxn2 = await waveContract.wave("A second message!");
	await waveTxn2.wait();

	contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
	console.log(
		"Contract balance",
		hre.ethers.utils.formatEther(contractBalance)
	);

	let allWaves = await waveContract.getAllWaves();
	console.log(allWaves);
}

async function runMain() {
	try {
		await main();
		process.exit();
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
}

runMain();
