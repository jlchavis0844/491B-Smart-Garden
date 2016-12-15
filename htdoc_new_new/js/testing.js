function getReportFunction(things) {
	var user= document.getElementById("user").value;
	var password = document.getElementById("password").value;
	var gardenName = document.getElementById("name").value;
	//var lengthOfReport = document.getElementById("period").value;
	var period = document.forms[0];
	var endDate = new Date(document.getElementById("date").value);
	var startDate = new Date();

	if (lengthOfReport[0].checked){
		startDate.setDate(endDate.getDate() - 365);
	}
	else if (lengthOfReport[1].checked){
		startDate.setDate(endDate.getDate() - 30);
	}
	else if (lengthOfReport[2].checked){
		startDate.setDate(endDate.getDate() - 7 );
	}
	//	startDate.setDate(endDate.getDate() - 365);

   //document.getElementById(things).innerHTML = user + password + name + date;
 //  document.getElementById(things).innerHTML = "http://76.94.123.147:49180/getGardenData.php?user=".concat(user)+"&password=".concat(password)+
 //  	"&gardenName=".concat(name)+"&=".concat(startDate)+" 00:00:00&max=".concat(endDate)+" 00:00:00";
   	//http://76.94.123.147:49180/getGardenData.php?user=testUser&password=password1&gardenName=Garden1&startDate=2016-09-28&endDate=2016-10-02
   //	document.getElementById(things).innerHTML = minDate
   document.getElementById(things).innerHTML = startDate + " - " + endDate;
}

function convertDate(date){

	return "-"+"-";
}