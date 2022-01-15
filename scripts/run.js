// run.js

async function main() {
	const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
	const waveContract = await waveContractFactory.deploy();
	await waveContract.deployed();
	console.log("Contract deployed to:", waveContract.address);
	// console.log("Contract deployed by:", owner.address);

	let waveCount;
	waveCount = await waveContract.getTotalWaves();
	console.log(waveCount.toNumber());

	// Testing waves
	let waveTxn = await waveContract.wave("A message!");
	await waveTxn.wait();

	const [_, randomPerson] = await hre.ethers.getSigners();
	waveTxn = await waveContract.connect(randomPerson).wave("Another message");
	await waveTxn.wait();

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
