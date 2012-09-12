// Nick Stelzer
// VFW 1208 - Project 4
// August 16, 2012

// Waits until DOM is ready
window.addEventListener("DOMContentLoaded", function () {

	//getElementById Function
	function $(x) {
		var theElement = document.getElementById(x);
		return theElement;
	}
	
	// Create select field (dropdown list) element and populate with options
	function createTravelMethodList () {
		var formTag = document.getElementsByTagName("form"),
			selectLi = $('select'),
			makeSelect = document.createElement('select');
			makeSelect.setAttribute("id", "travelMethod");
		
		for (var i = 0, j=travelMethods.length; i < j; i++) {
			var makeOption = document.createElement('option');
			var optText = travelMethods[i];
			makeOption.setAttribute("value", optText);
			makeOption.innerHTML = optText;
			makeSelect.appendChild(makeOption);
		}
		selectLi.appendChild(makeSelect);
	}
	
	// Find value of selected Trip Type radio button
	function getTripType () {
		var radios = document.forms[0].tripType;

		for (var i = 0; i < radios.length; i++) {
			if (radios[i].checked) {
				tripTypeValue = radios[i].value;
			}
		}
	}
	
	// Updates the span tag showing value of slider
	function updatePeople () {
		$('people').innerHTML = $('numPeople').value
	}
	
	// Gather data from form field, store in object, then store in local storage
	function storeData (key) {
		if (!key) {
			var id = Math.floor(Math.random()*1000000);
		} else {
			var id = key;
		}
		getTripType();
		// Object properties contain array with form label and input value
		var trip = {};
			trip.method = ["Travel Method: ", $('travelMethod').value];
			trip.type = ["Trip Type: ", tripTypeValue];
			trip.dest = ["Destination: ", $('dest').value];
			trip.date = ["Date: ", $('date').value];
			trip.people = ["Number of People: ", $('numPeople').value];
			trip.notes = ["Notes: ", $('notes').value];
		
		// Save data into local storage, use Stringify to convert object to string
		localStorage.setItem(id, JSON.stringify(trip));
		alert("Trip Saved!");
	}
	
	// Write data from localStorage to browser
	function getData () {
		if (localStorage.length === 0) {
			alert("There are no saved trips, so default data was added.");
			autoFillData();
		}

		// figure out where these entries are going to be appended (search or browse page)
		if ((this.id === "mmSearchLink") || (this.id === "ftSearchLink1") || (this.id === "ftSearchLink2") || (this.id === "ftSearchLink3") || (this.id === "ftSearchLink4")) {
			var appendLocation = $('searchTripList');
			var browsing = false;
			$('searchTripList').innerHTML = "";
		} else {
			var appendLocation = $('browseTripList');
			var browsing = true;
			catFilter = this.id;
			$('browseTripList').innerHTML = "";
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
				editButton.addEventListener("click", editTrip);
				removeButton.addEventListener("click", removeTrip);
			}
		}
		
	}
	
	// edit the values stored for a trip
	function editTrip () {
		// Get data from selected trip from local storage
		var value = localStorage.getItem(this.key);
		var trip = JSON.parse(value);

		$('formTitle').innerHTML = "Edit Trip";
		
		$('travelMethod').value = trip.method[1];
		$('dest').value = trip.dest[1];
		$('date').value = trip.date[1];
		$('numPeople').value = trip.people[1];
		$('notes').value = trip.notes[1];

		var radios = document.forms[0].tripType;
		for (var i = 0; i < radios.length; i++){
			if (radios[i].value == "Business" && trip.type[1] == "Business") {
				radios[i].setAttribute("checked", "checked");
			} else if (radios[i].value == "Vacation" && trip.type[1] == "Vacation") {
				radios[i].setAttribute("checked", "checked");
			}
		}
		
		// Remove the initial listener from 'Add Trip' button
		addButton.removeEventListener("click", storeData);
		
		// Change 'Add Trip' button to 'Update Trip'
		$('addTrip').value = "Update Trip";
		var updateTrip = $('addTrip');
		updateTrip.addEventListener("click", validateForm);
		updateTrip.key = this.key;	// Saves key value as property of update button event
	}
	
	// clear data in localStorage
	function clearData () {
		if (localStorage.length === 0) {
			alert("There are no saved trips to clear.");
		} else {
			localStorage.clear();
			alert("All saved trips have been cleared.");
			window.location.reload();
			return false;
		}
	}	
	
	// Validate Form Fields
	function validateForm (e) {
		// Define elements to be checked
		var getDest = $('dest');
		var getDate = $('date');
		
		// Reset error messages
		errMsg.innerHTML = "";
		getDest.style.border = "";
		getDate.style.border = "";
		
		// Check elements and generate error messages
		var errorMessages = [];		
		if (getDest.value == "") {
			errorMessages.push("Please enter a destination.");
			getDest.style.border = "1px solid red";
		}
		if (getDate.value == "") {
			errorMessages.push("Please enter a date.");
			getDate.style.border = "1px solid red";
		}
		
		// Output 
		if (errorMessages.length != 0) {
			for (var i = 0, j = errorMessages.length; i < j; i++) {
				var errorOutput = document.createElement('li');
				errorOutput.innerHTML = errorMessages[i];
				errMsg.appendChild(errorOutput);
			}
			e.preventDefault();
			return false;
		} else {
			storeData(this.key);
		}
	}
	
	// Delete a saved trip
	function removeTrip () {
		var ask = confirm("Are you sure you want to remove this trip?");
		if (ask) {
			localStorage.removeItem(this.key);
			window.location.reload();
		} else {
			alert("Trip was not removed.");
		}
	}
	
	// Adds in 3 trips of data to local storage from json object (json.js)
	function autoFillData() {
		for(var n in json) {
			var id = Math.floor(Math.random()*1000000);
			localStorage.setItem(id, JSON.stringify(json[n]));
		}
	}
	
	// Variable defaults
	var travelMethods = ["Plane", "Train", "Car"],
		tripTypeValue,
		errMsg = $('errors')
	;
	createTravelMethodList();
	
	// Set Link & Submit Click Events
	var addButton = $('addTrip');
	addButton.addEventListener("click", validateForm);
	
	var peopleSlider = $('numPeople');
	peopleSlider.addEventListener("change", updatePeople);
	
	$('mmSearchLink').addEventListener("click", getData);
	$('ftSearchLink1').addEventListener("click", getData);
	$('ftSearchLink2').addEventListener("click", getData);
	$('ftSearchLink3').addEventListener("click", getData);
	$('ftSearchLink4').addEventListener("click", getData);
	$('clearAllData').addEventListener("click", clearData);
	$('Business').addEventListener("click", getData);
	$('Education').addEventListener("click", getData);
	$('Family').addEventListener("click", getData);
	$('Vacation').addEventListener("click", getData);
	$('Other').addEventListener("click", getData);
});