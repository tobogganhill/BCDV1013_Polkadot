import Web3 from 'web3';
import ContractABI from '../contract/ContractABI.abi.json';
// This function detects most providers injected at window.ethereum
import detectEthereumProvider from '@metamask/detect-provider';

let contract;
let posts = [];

// deployed contract address acquired from Remix
const contractAddress = '0x2E2Ed0Cfd3AD2f1d34481277b3204d807Ca2F8c2';
const connectWallet = async () => {
	const provider = await detectEthereumProvider();
	if (provider) {
		// provider === window.ethereum
		window.web3 = new Web3(ethereum);
		contract = new web3.eth.Contract(ContractABI, contractAddress);
		return true;
	} else {
		notification('MetaMask must be installed to run this DApp.');
		return false;
	}
};

const getPosts = async () => {
	const _count = await contract.methods.getPostCount().call();
	const _posts = [];
	for (let i = 1; i < _count; i++) {
		let _post = new Promise(async (res, err) => {
			let p = await contract.methods.displayPost(i).call();
			res({
				index: i,
				author: p[0],
				title: p[1],
				content: p[2],
			});
		});
		_posts.push(_post);
	}
	posts = await Promise.all(_posts);
	renderPosts();
};

function notification(_text) {
	document.querySelector('.alert').style.display = 'block';
	document.querySelector('#notification').textContent = _text;
}

function notificationOff() {
	document.querySelector('.alert').style.display = 'none';
}

function renderPosts() {
	document.getElementById('posts').innerHTML = '';
	posts.forEach((_post) => {
		const newDiv = document.createElement('div');
		console.log(itemTemplate(_post));
		newDiv.innerHTML = itemTemplate(_post);
		document.getElementById('posts').appendChild(newDiv);
	});
	notificationOff();
}

function itemTemplate(_post) {
	return `
	<div class="p-5 text-center bg-light">
    <h2 style="background-color:pink;">${_post.title}</h2>
	<h6 class="text-black">${_post.author}<br>${_post.content}</h6>
	</div>
    `;
}

document.querySelector('#addPost').addEventListener('click', async (e) => {
	try {
		let accounts = await web3.eth.getAccounts();
		const account = accounts[0];
		console.log('ACCOUNT: ' + account);
		const params = [
			document.getElementById('author').value,
			document.getElementById('title').value,
			document.getElementById('content').value,
		];

		notification('INTERACTING WITH MOONBASE ALPHA...');

		const result = await contract.methods
			.createPost(...params)
			.send({ from: account });
	} catch (error) {
		notification(`${error}`);
	}
	getPosts();
});

window.addEventListener('load', async () => {
	console.log('LOADING WALLET');
	const connection = await connectWallet();
});
