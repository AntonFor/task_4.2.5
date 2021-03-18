let input = document.querySelector('.form__input');
let form = document.querySelector('.form');
let list = document.querySelector('.form__autocomplete-list');
let container = document.querySelector('.container');

function autocomplete(data) {
	list.innerHTML = '';
	data.forEach(dataItem => {
		if ((dataItem.name).toUpperCase().search((input.value).toUpperCase()) === -1) return false;
		let item = document.createElement('div');
		item.className = 'autocomplete-item';
		item.innerText = dataItem.name;
		item.owner = dataItem.owner.login;
		item.stars = dataItem.stargazers_count;
		list.appendChild(item);
	});
	if (input.value == '') list.innerHTML = '';
}

function getRep(rep) {
	fetch(`https://api.github.com/search/repositories?q=${rep}&per_page=${5}`)
		.then(response => response.json())
		.then(rep => autocomplete(rep.items))
		.catch(err => console.log(err));
}

function debounceGetRep(fn) {
	let timeout;
	return function() {
		const fnCall = () => {
			fn.apply(this, arguments);
		}
		clearTimeout(timeout);
		timeout = setTimeout(fnCall, 1000);
	}
}

getRep = debounceGetRep(getRep);

input.addEventListener('input', function() {
	getRep(input.value);
})

list.addEventListener('click', function(e) {
	let repository = document.createElement('div');
	repository.className = 'repository';
	container.appendChild(repository);
	let repDescription = document.createElement('div');
	repository.appendChild(repDescription);
	let repCross = document.createElement('div');
	repCross.className = 'repository__cross';
	repository.appendChild(repCross);
	let name = document.createElement('p');
	name.className = 'repository__text';
	name.textContent = `Name: ${e.target.innerText}`;
	repDescription.appendChild(name);
	let owner = document.createElement('p');
	owner.className = 'repository__text';
	owner.textContent = `Owner: ${e.target.owner}`;
	repDescription.appendChild(owner);
	let stars = document.createElement('p');
	stars.className = 'repository__text';
	stars.textContent = `Stars: ${e.target.stars}`;
	repDescription.appendChild(stars);
	input.value = '';
	list.innerHTML = '';
})

container.addEventListener('click', function(e) {
	if (e.target.className === 'repository__cross') {
		e.target.parentNode.remove();
	}
})