$('#home').on('pageinit', function(){
	//code needed for home page goes here
});	
		
$('#addItem').on('pageinit', function(){

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
	
});

//The functions below can go inside or outside the pageinit function for the page in which it is needed.

var autofillData = function (){
	 
};

var getData = function(){

};

var storeData = function(data){
	var id = Math.floor(Math.random()*1000000);
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

var	deleteItem = function (){
			
};
					
var clearData = function(){

};


