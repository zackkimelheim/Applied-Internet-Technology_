// TODO: add your JavaScript here!

function main(){
const url = 'http://localhost:3000/api';
const placesList = document.querySelector('#places-list');

//Filter Button being clicked
const filterBtn = document.querySelector('#filterBtn');
filterBtn.addEventListener('click', function(evt){
	evt.preventDefault();

	const req = new XMLHttpRequest();
	req.addEventListener('load', function(){
		if (req.status >= 200 && req.status < 400) {
			const places = JSON.parse(req.responseText);
      //console.log(places);
			generateRestaurantList(places, true);
		}
	});

	const locationFilter = document.querySelector('#location-filter');
	const cuisineFilter = document.querySelector('select#cuisine-filter');

  let url2 = 'http://localhost:3000/api/places?';
  url2 += "cuisine=" + (document.getElementById('cuisine-filter').value || "") + '&';
	url2 += "location=" + (document.getElementById('location-filter').value || "") + '&';

  req.open('GET', url2, true);
	req.send();
});

//Add Button being clicked
const add_btn = document.querySelector('#addBtn');
add_btn.addEventListener('click', function(e){
	e.preventDefault();
	const name = document.querySelector('#name');
	const location = document.querySelector('#location');
	const cuisine = document.querySelector('select#cuisine-add');

	const newRestaurant = {
		name: name.value,
		cuisine: cuisine.value,
		location: location.value,
	};

  //console.log(newRestaurant);

	postRestaurant(newRestaurant, function(){
		generateRestaurantList([newRestaurant], false);
		resetInput();
	});
});


function generateRestaurantList(places,append){

	if (append) {
		placesList.innerHTML = ''; //only reset it if we are filtering, do not reset it when we are adding
	}

  for(let i = 0; i < places.length; i++){
		let tr = document.createElement("tr");

		let td1 = document.createElement("td");
		td1.textContent = places[i].name;
		tr.appendChild(td1);

    let td2 = document.createElement("td");
		td2.textContent = places[i].cuisine;
		tr.appendChild(td2);

    let td3 = document.createElement("td");
		td3.textContent = places[i].location;
		tr.appendChild(td3);

		document.getElementById("places-list").appendChild(tr);
	}
}


function postRestaurant(restaurant,cb){
	const req = new XMLHttpRequest();
	req.addEventListener('load', function(){
		if (req.status >= 200 && req.status < 400) {
			if(cb){
        cb();
      }
		}
	});
	req.open('POST', `${url}/places/create`, true);
  //req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
	req.send(JSON.stringify(restaurant));
}

function resetInput(){
	document.querySelector('#name').value = '';
	document.querySelector('#location').value = '';
	document.querySelector('select#cuisine-add').value = 'Chinese';
}

}

document.addEventListener("DOMContentLoaded", main);
