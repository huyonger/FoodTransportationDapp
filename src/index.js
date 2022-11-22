import Web3 from "web3";
import FoodTransportationContract from "../../build/contracts/FoodTransportation.json";

const App = {
	web3: null,
	account: null,
	meta: null,

	start: async function () {
		const { web3 } = this;
		try {
			// get contract instance
			// const networkId = await web3.eth.net.getId();
			// const deployedNetwork = metaCoinArtifact.networks[networkId];
			this.meta = new web3.eth.Contract(FoodTransportationContract.abi, "0x1baf67c3f4f79058e6d902834354bc976e499626");

			// get accounts
			const accounts = await web3.eth.getAccounts();
			this.account = accounts[0];

			this.addNewLocation("青椒肉丝", "学一", "胡勇");
		} catch (error) {
			console.log(error);
			console.error("Could not connect to contract or chain.");
		}
	},

	getLocationNum: async function () {
		const { getLocationNum } = this.meta.methods;
		const num = await getLocationNum().call();
		const LocationNumElement = document.getElementsByClassName("location_num")[0];
		LocationNumElement.innerHTML = num;
	},

	getFoodName: async function () {
		const { getFoodName } = this.meta.methods;
		const foodName = await getFoodName().call();
		const FoodNameElement = document.getElementsByClassName("food_name")[0];
		FoodNameElement.innerHTML = foodName;
	},

	getLocation: async function (num) {
		const { getLocation } = this.meta.methods;
		const location = await getLocation(num).call();
		return location;
	},

	addNewLocation: async function (food, locationName, transPerson) {
		const { addNewLocation } = this.meta.methods;
		await addNewLocation(food, locationName, transPerson).send({
			from: this.account,
		});
	},
};

window.App = App;

window.addEventListener("load", function () {
	if (window.ethereum) {
		// use MetaMask's provider
		App.web3 = new Web3(window.ethereum);
		window.ethereum.enable(); // get permission to access accounts
	} else {
		console.warn("No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live");
		// fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
		App.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
	}

	App.start();
});
