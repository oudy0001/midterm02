var map, home, contact, mapIcon, homeIcon, style, 
    contactNameOutput, contactNumber1Output, contactNumber2Output, styleString = "",
    pages, DisplayPage = "",
    brwoserAnimationSupport = ["-webkit-"],
    RandomContactBtn, touch, myElement, loadCount = 0, WAIBtn,
    FlagCanCreation = false,
    canvas, context, output, img, wrapper, waitingMessage,
    waitMessageOut, timeout = 3000, 
    StoredContacts = [], storedContacString = "", 
    tempJSON, contactString = "", NewMap, contactListItems
    newLatitude = 0, newLongitude = 0, tappedContactId = 0, setCoordinatesFlag = false;


var tempLocalStorage=[{"name" : "john", "number" : 1},{"name" : "bob", "number" : 2},{"name" : "jullio", "number" : 3},{"name" : "alexander", "number" : 4},{"name" : "kieth", "number" : 5},{"name" : "pim", "number" : 6},{"name" : "case", "number" : 7},{"name" : "lani", "number" : 8},{"name" : "peter", "number" : 9},{"name" : "paul", "number" : 10},{"name" : "mario", "number" : 11},{"name" : "douche", "number" : 12}];



function prep(){
    loadCount++;
    if(loadCount === 2){
        setupApp();
    }
}

document.addEventListener("DOMContentLoaded", prep);
document.addEventListener("deviceready", prep);

function setupApp() {
    touch = detectTouchSupport() ? "touchend" : "click";
    pages = document.getElementById("pages");
    style = document.getElementById("style");
    map = document.getElementById("map");
    home = document.getElementById("home");
    contact = document.getElementById("contact");
    mapIcon = document.getElementById("mapIcon");
    homeIcon = document.getElementById("homeIcon");
    contactOutput = document.getElementById("contactOutput");
    RandomContactBtn = document.getElementById("btn");
    myElement = document.getElementById('myElement');
    wrapper = document.getElementById("MapWrapper");
    contactNameOutput = document.getElementById("contactNameHolder");
    contactNumber1Output = document.getElementById("contactNumberHolder1");
    contactNumber2Output = document.getElementById("contactNumberHolder2");
    
    
    homeIcon.addEventListener(touch, homeFunction, false);
    mapIcon.addEventListener(touch, mapFunction, false);
    
    //Tries to get contacts right away
    getOrUseContacts();
    
}

function tappedList(ev){
    var contactName = ev.target.innerHTML;
    
        for(var i = 0; i < StoredContacts.length; i++){
            if(StoredContacts[i].name == contactName ){
                tappedContactId = i;
                if(StoredContacts[i].longatude == null){
                    setContactCoords();
                    setCoordinatesFlag = true;
                }else{
                    newMarkerOverloaded(StoredContacts[i].latatude, StoredContacts[i].longatude);
                }
                break;
            }
        }
    }
  
function loadMap () {
    waitMessageOut = document.getElementById("waitMessageOut");
    waitMessageOut.innerHTML = "Trying to get your location!";

    //position stuff
    if (navigator.geolocation) {
        var params = {
            enableHighAccuracy: true,
            timeout: 36000,
            maximumAge: 60000
        };
        navigator.geolocation.getCurrentPosition(reportPosition, gpsError, params);

    } else {
        alert("Sorry, but your browser does not support location based awesomeness.");
    }
}

function getOrUseContacts(){
    
    //getting localstorage
    storedContacString = localStorage.getItem("midterm-oudy0001");
    try{
            StoredContacts = JSON.parse(storedContacString);
    }catch(e){}
    storedContacString = JSON.stringify(storedContacString);
    if (storedContacString !== null && storedContacString !== 'undefined' && StoredContacts !== null) {
        console.log(storedContacString);
        console.log(storedContacString === null);
        console.log(StoredContacts);
        
        //This wont work because "cannot read property of null"
        for(var i=0; i < StoredContacts.length; i++){
            listContacts(StoredContacts[i].name, i, StoredContacts[i].phoneNumbers[0].value, StoredContacts[i].phoneNumbers[1].value);
            outputListContacts();
        } 
    }else {
        console.log(storedContacString);
        console.log(storedContacString == null);
        console.log(StoredContacts);
        randomContactFunction();
    }
    
}

function gpsError(error) {
    var errors = {
        1: 'Permission denied',
        2: 'Position unavailable',
        3: 'Request timeout'
    };
    alert("Error: " + errors[error.code]);
}

function setContactCoords(){
    if(setCoordinatesFlag == true){
        google.maps.event.addListener(NewMap, "click", makeshiftParser);
//        StoredContacts[tappedContactId].latatude = newLatitude;
//        StoredContacts[tappedContactId].longatude = newLongitude;
        setCoordinatesFlag = false;
    }
//    alert
};

    //ghetto parser
function makeshiftParser(ev){
        var latlong = JSON.stringify(ev.latLng);
        var tempParseConstructor = "";
        for(var i = 0; i < latlong.length; i++){
            switch (latlong[i]){
                    case ("0","1"): case "2": case "3": case "4": case "5": case "6": case "7": case "8": case "9": case ".": case "-": case ",":
                    tempParseConstructor += latlong[i];
                    break;
                    default:
                    break;
            }
        }
        var tempNewLong = "";
        var tempNewLat = "";
        var ConstructorOnLatitude = true;
        for(var i = 0; i < tempParseConstructor.length; i++){
            if(ConstructorOnLatitude == true){
                if(tempParseConstructor[i] == ","){
                    ConstructorOnLatitude = false;
                }else{
                tempNewLat += tempParseConstructor[i];
                }
            }else{
                tempNewLong += tempParseConstructor[i];
            }
        }
        
        newLatitude = parseFloat(tempNewLat);
        newLongitude = parseFloat(tempNewLong);
        var mapOutput = document.getElementById("MapOutput");
        mapOutput.innerHTML = newLatitude;
        mapOutput.innerHTML += newLongitude;
        
    }

function reportPosition (position) {

    function positionInfo(ev){	
            //add an infoWindow
            var myHtml = '<h2>Your Current Location</h2>';
            var iw = new google.maps.InfoWindow({
                content: myHtml
            });
            iw.open(NewMap, marker);
    }
    var mapOptions ={
          center:new google.maps.LatLng(position.coords.latitude,position.coords.longitude),
          zoom:14,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
    var marker;

    NewMap =new google.maps.Map(document.getElementById("theMap"), mapOptions);
//    newMap2 = NewMap;

        marker = new google.maps.Marker({
            position: new google.maps.LatLng(position.coords.latitude,position.coords.longitude),
        });
        marker.setMap(NewMap);
    
        google.maps.event.addListener(marker, touch, positionInfo);

        google.maps.event.addListener(NewMap, "click", newMarker);
//        google.maps.event.addListener(NewMap, "click", function(){newMarkerOverloaded(45.35467851585811, -75.74828624725342);});
        google.maps.event.addListener(NewMap, "click", setContactCoords);
    
    return NewMap;
    
}

function newMarker(ev){
    if(setCoordinatesFlag == true){
            var m = new google.maps.Marker({
                position: ev.latLng
            });
            m.setMap( NewMap );
            makeshiftParser(ev);
//        alert();
        StoredContacts[tappedContactId].longatude = ev.latLng.k;
        StoredContacts[tappedContactId].latatude = ev.latLng.D;
        storedContacString = JSON.stringify(StoredContacts);
        localStorage.setItem("midterm-oudy0001", storedContacString);
    }
}

//I would be using this to show the marker of the clicked contact (and it works when you set the coorindates manually but like I said the JSON seems to be messing with my commputer
function newMarkerOverloaded(Lat, Long){
    setTimeout(function(Lat, Long){
    var LatLong = new google.maps.LatLng(Lat,Long);
    
    var marker = new google.maps.Marker({
        position: LatLong
    });
    marker.setMap(NewMap);
}, 300)}

function homeFunction() {
    
    DisplayPage = "home";
    mapIcon.className = "";
    homeIcon.className = "active";
    if (home.classList.contains("active")) {} else {
        var active = pages.querySelector(".active");
            map.className = "slideOutLeft";
            home.className = "slideInRight active";
            contact.className = "hidden";
    }

}

function mapFunction() {
    
    loadMap();
    DisplayPage = "map";
    mapIcon.className = "active";
    homeIcon.className = "";
        var active = pages.querySelector(".active");
            map.className = "slideInLeft active";
            home.className = "slideOutRight";
            contact.className = "none";
}

function randomContactFunction() {
    RandomContactBtn.innerHTML = "Please Wait";

    var options = new ContactFindOptions();
    options.filter = "";
    options.multiple = true;
    var fields = ["displayName", "name"];
    navigator.contacts.find(fields, onSuccess, onError, options);
}

function onSuccess(matches) {
    contactString = "";
    var loopControlNumber = 0;
    if(matches.length > 12){
        loopControlNumber = 12;
    }else{
        loopControlNumber = matches.length;
    }
    for(var i = 0; i < 12; i++){
        var randomNumber = Math.random() * (matches.length - 1);
        var randomInt = Math.round(randomNumber);
        var randomContact = matches[randomInt].displayName;
        try {
            var contactNumber = matches[randomInt].phoneNumbers[0].value;
        } catch (error) {
        }
        if(randomContact !== null && randomContact !== "undefined"){
            listContacts(randomContact, i, matches[randomInt].phoneNumbers[0].value, matches[randomInt].phoneNumbers[1].value);
        }else{
            i--;
            //so that the loop ignores the error and eventually gets 12 after all the errors
        }
    
    }

}

function listContacts(contactName, contactIdNumber, PhoneNumber1Number, PhoneNumber2Number){
    
     if(PhoneNumber1Number == null && PhoneNumber1Number == "undefined"){
            PhoneNumber1Number = 0;
        }
        
     if(PhoneNumber2Number == null && PhoneNumber2Number == "undefined"){
            PhoneNumber1Number = 0;
        }
    
        tempJSON = {
            "name" : contactName, "id" : contactIdNumber, "Phone1" : PhoneNumber1Number, "Phone1" : PhoneNumber2Number
        }
        contactString += '<li class="contactlist" data-id"' + contactIdNumber + '" >' + contactName + "</li>";
    
    //Hammer events
    listContacts.hammeredContacts = new Hammer(contactOutput, {});
    var singleTap = new Hammer.Tap({ event: 'tap' });
    var doubleTap = new Hammer.Tap({event: 'doubletap', taps: 2 });
    listContacts.hammeredContacts.add([doubleTap, singleTap]);
    doubleTap.requireFailure(singleTap);
    
		listContacts.hammeredContacts.on("tap", function(ev){
      //single tap
            
    var contactNnumber = ev.target.getAttribute("data-id");
    //here
        for(var i = 0; i < StoredContacts.length; i++){
            if(StoredContacts[i].id == contactNnumber ){
                contactNameOutput.innerHTML = StoredContacts[i].name;
                contactNumber1Output.innerHTML = StoredContacts[i].Phone1;
                contactNumber2Output.innerHTML = StoredContacts[i].Phone2;
                
                break;
            }
        }
        });
    listContacts.hammeredContacts.on("doubletap", function(ev){
      //double tap
        tappedList(ev);
        mapFunction();
    }); 
    
}

function outputListContacts(){
        contactOutput.innerHTML += contactString;
}

function onError(contactError) {
    alert('Contacts could not be used');
}

//Touch check function curtesy of Steve G
function detectTouchSupport() {
    msGesture = navigator && navigator.msPointerEnabled && navigator.msMaxTouchPoints > 0 && MSGesture;
    touchSupport = (("ontouchstart" in window) || msGesture || (window.DocumentTouch && document instanceof DocumentTouch));
    return touchSupport;
}
