$('#index').on('pageinit', function(){
	//code needed for home page goes here
	clearAllData.addEventListener("click", clearData);
	Business.addEventListener("click", getData);
	Education.addEventListener("click", getData);
	Family.addEventListener("click", getData);
	Vacation.addEventListener("click", getData);
	Other.addEventListener("click", getData);
});	
		
$('#addItem').on('pageinit', function(){
	delete $.validator.methods.date;
	var myForm = $('#addTripForm');
	myForm.validate({
		invalidHandler: function(form, validator) {
		},
		submitHandler: function() {
			var data = myForm.serializeArray();
			storeData(data);
		}
	});
	
	//any other code needed for addItem page goes here
	
	// loops through form and resets values
	resetFormButton.addEventListener("click", resetForm);
	function resetForm () {
		var radioButtons = radios.getElementsByTagName("input");
		for (var i = 0; i < radioButtons.length; i++) {
			$(radioButtons[i]).removeAttr('selected');
		}
		var slider = document.getElementById("numPeople");
		slider.value = "1";
	}
	
});

$('#browse').on('pageinit', function(){
	getData(true);
});

$('#search').on('pageinit', function(){
	getData(false);
});

//The functions below can go inside or outside the pageinit function for the page in which it is needed.

var autoFillData = function (){
	for(var n in json) {
		var id = Math.floor(Math.random()*1000000);
		localStorage.setItem(id, JSON.stringify(json[n]));
	}	 
};

var getData = function(browsing){
	if (localStorage.length === 0) {
		alert("There are no saved trips, so default data was added.");
		autoFillData();
	}

	// figure out where these entries are going to be appended (search or browse page)
	if (browsing) {
		var appendLocation = document.getElementById('browseTripList');
		catFilter = this.id;
		appendLocation.innerHTML = "";
	} else {
		var appendLocation = document.getElementById('searchTripList');
		appendLocation.innerHTML = "";
	}
	
	
	// make collapsible mini's for each trip entry
	for (var i = 0, j = localStorage.length; i < j; i++) {
		var key = localStorage.key(i);
		var value = localStorage.getItem(key);
		var obj = JSON.parse(value);
		
		// check for browsing and filter
		if (browsing) {
			if (obj.type[1] === catFilter) {
				goodToGo = true;
			} else {
				goodToGo = false;
			}
		} else {
			goodToGo = true;
		}
		
		if (goodToGo) {
			// creates collapsible for trip data
			var makeEntry = document.createElement('div');
			makeEntry.setAttribute("data-role", "collapsible");
			makeEntry.setAttribute("data-mini", "true");
			appendLocation.appendChild(makeEntry);
			var makeH3 = document.createElement('h3');
			makeH3.innerHTML = obj.dest[1] + " - " + obj.date[1];
			makeEntry.appendChild(makeH3);
			makeEntry.setAttribute("id", key);	
			
			/*// Add image based on trip type
			var newImg = document.createElement('img');
			newImg.setAttribute("src", "img/" + obj.method[1] + ".png");
			newImg.setAttribute("class", "methodIcon");
			makeSubDiv.appendChild(newImg);
			*/
			
			// Create List of Trip Details
			var makeList = document.createElement('ul');
			makeEntry.appendChild(makeList);
			for (var k in obj) {
				var makeLi = document.createElement('li');
				makeList.appendChild(makeLi);
				var optSubText = obj[k][0]+ " " + obj[k][1];
				makeLi.innerHTML = optSubText;
			}
			
			// Create Links to Edit/Delete
			var buttonHolder = document.createElement('div');
			buttonHolder.setAttribute("class", "ui-grid-a");
			var editButtonDiv = document.createElement('div');
			editButtonDiv.setAttribute("class", "ui-block-a");
			var editButton = document.createElement('a');
			editButton.setAttribute("data-role", "button");
			editButton.setAttribute("href", "#addItem");
			editButton.innerHTML = "Edit";
			editButton.key = key;
			var removeButtonDiv = document.createElement('div');
			removeButtonDiv.setAttribute("class", "ui-block-b");
			var removeButton = document.createElement('a');
			removeButton.setAttribute("data-role", "button");
			removeButton.setAttribute("href", "#");
			removeButton.innerHTML = "Remove";
			removeButton.key = key;
			makeEntry.appendChild(buttonHolder);
			buttonHolder.appendChild(editButtonDiv);
			buttonHolder.appendChild(removeButtonDiv);
			editButtonDiv.appendChild(editButton);
			removeButtonDiv.appendChild(removeButton);
			// editButton.addEventListener("click", editTrip);
			removeButton.addEventListener("click", removeTrip);
			$(makeEntry).trigger('create');
		}
		$(appendLocation).trigger('create');
	}
};

var storeData = function(data, key){
	if (!key) {
		var id = Math.floor(Math.random()*1000000);
	} else {
		var id = key;
	}
	var trip = {};
			trip.type = ["Trip Type: ", data[0].value];
			trip.method = ["Travel Method: ", data[1].value];
			trip.dest = ["Destination: ", data[2].value];
			trip.date = ["Date: ", data[3].value];
			trip.people = ["Number of People: ", data[4].value];
			trip.notes = ["Notes: ", data[5].value];
		
		// Save data into local storage, use Stringify to convert object to string
		localStorage.setItem(id, JSON.stringify(trip));
		alert("Trip Saved!");
}; 

var	removeTrip = function (){
	var ask = confirm("Are you sure you want to remove this trip?");
	if (ask) {
		localStorage.removeItem(this.key);
		divToRemove = document.getElementById(this.key);
		window.location.reload();
	} else {
		alert("Trip was not removed.");
	}		
};
					
var clearData = function(){
	if (localStorage.length === 0) {
			alert("There are no saved trips to clear.");
		} else {
			localStorage.clear();
			alert("All saved trips have been cleared.");
			window.location.reload();
			return false;
		}
};


