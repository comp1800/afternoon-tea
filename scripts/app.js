//-----------------------------------------------------------------------
// This file contains a collection of demo functions used for comp1800
//
// Uncomment/comment them as needed. 
//-----------------------------------------------------------------------


//-----------------------------------------------------
// This function adds a listener to the form
// When form is submitted, the values are extracted
// and written into the database
//------------------------------------------------------
function addListener() {
    document.getElementById("myform").addEventListener("submit", function (e) {
        // disable default form handling
        e.preventDefault();

        // grab what user typed
        var name = document.getElementById("name").value;
        var neighbourhood = document.getElementById("hood").value;
        var reason = document.getElementById("reason").value;

        // get pointers to the checkboxes
        var check1 = document.getElementById("check1");
        var check2 = document.getElementById("check2");

        //console.log(name);
        //console.log(neighbourhood);
        //console.log(check1.checked);
        //console.log(check2.checked);

        // write the values into new database document
        db.collection("shops")
            .add({ //using the add() function, auto-generated doc ID
                "name": name,
                "hood": neighbourhood,
                "reason": reason,
                "open-window": check1.checked, //boolean value
                "patio-seating": check2.checked //true if checked
            })
            .then(function () {
                console.log("write to shops successful!");
            })
    })
}
//addListener();

//--------------------------------------------------------
// This function reads the "shops" collection from database
// Then cycles thru the collection to
//   - create a DOM element
//   - put name of shop inside DOM
//   - attach this DOM to the display area for shops (id = "shops")
//---------------------------------------------------------
function displayShops() {
    db.collection("shops") //go to the shops collection
        .get() //get whole collection
        .then(function (snap) {
            snap.forEach(function (doc) { //cycle thru collection to get docs

                var n = doc.data().name; //extract the name field
                //console.log (n);

                //create a new div, with name field, attach it to the right slot
                item = document.createElement("div");
                item.innerText = n;
                $("#shops").append(item);

            });
        })
}
displayShops();

//--------------------------------------------------
// This function gets the collection of documents from the "quotes" collection,
// cycles through each document, and creates a "div" that contains the "message"
// field inside, and appends it to the display area of the document labelled by id.
//---------------------------------------------------
function getQuotes() {
    db.collection("quotes")
        .get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                var m = doc.data().message;
                var id = doc.id;
                //console.log(m);
                //console.log(id);
                $("#quotes-go-here").append("<div id='" + id + "'>" + m + "</div>");
            })
        })
}
//getQuotes();

//--------------------------------------------------
// This function gets the collection of documents from the "quotes" collection,
// cycles through each document, and creates a card. 
// 
// <div class="card" style="width: 18rem;">
//   <img class="card-img-top" src="..." alt="Card image cap">
//   <div class='card-body'>
//      <h5 class='card-title'>Card title</h5>
//      <p class='card-text'>Some quick example text.</p>
//      <a href='#' class='btn btn-primary'>Go somewhere</a>
//   </div>
// </div>
//
//---------------------------------------------------
function getQuotesIntoCards() {
    db.collection("quotes")
        .get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                var m = doc.data().message;
                //console.log(m);
                var d1 = $("#quotes-go-here").append(
                    "<div class='card' style='width: 18rem;'>" +
                    "<img class='card-img-top' src='images/blah.jpg' alt='Card image cap'>" +
                    "<div class='card-body'>" +
                    "<h5 class='card-title'>" + m + "</h5>" +
                    "<p class='card-text'>Some quick example text.</p>" +
                    "<a href='#' class='btn btn-primary'>Go somewhere</a>" +
                    "</div>" +
                    "</div)");
            })
        })
}
//getQuotesIntoCards();

//---------------------------------------------------
// This function checks to see if the user is sign in.
// If so, then you can go to the "users" collection,
// look for this person's document id (which would be authentication 
// object ("user")'s uid, and get that document.
// Now you can grab the name, or give a personalized greeting :)
//----------------------------------------------------
function getUser() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            //console.log("user is signed in");
            db.collection("users")
                .doc(user.uid)
                .get()
                .then(function (doc) {
                    var n = doc.data().name;
                    //console.log(n);
                    $("#username").text(n);
                })
        } else {
            console.log("no user is signed in");
        }
    })
}
getUser();

//---------------------------------------------------------------
// This function will check if the user is signed in.
// If yes, then 
//     1) the "login" text will change to "logout"
//     2) and, the href will go to "index.html" where any logged in 
//        users will be logged out.
//----------------------------------------------------------------
function disableLoginLink() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            //console.log("change it to logout");
            document.getElementById("loginlink").href = "index.html";
            document.getElementById("loginlink").innerHTML = "Logout";
        }
    })
}
disableLoginLink();

//------------------------------------------------
// Call this function at the begining of index.html
// to logout any users before you do anything else
//-------------------------------------------------
function logout() {
    console.log("logging out user");
    FirebaseAuth.getInstance().signOut();
}

//-------------------------------------------------
// This function gets 2 user inputs 
// grabs those values, and passes it to the next page,
// using two different methods
//-------------------------------------------------
function saveFruitsFromUser() {
    document.getElementById("myBtn").addEventListener('click', function () {
        var item1 = document.getElementById("fruit1").value;
        var item2 = document.getElementById("fruit2").value;

        // Method1:  pass via URL string
        window.location.href = "fruits.html?" + item1;

        // Method2:  pass in localStorage 
        // this is an object that can be accessed from next page
        // The format is key-value pair.
        localStorage.setItem("item2", item2);
    });
}
//saveFruitsFromUser();

function displayFruits() {
    // Method1:  get value passed through a string, then parse the string
    // value is visible in the browser search bar
    var queryString = decodeURIComponent(window.location.search);
    var queries = queryString.split("?"); //delimiter
    var item1 = queries[1]; //get what's after '?'
    //document.write("item1="+item1);
    //console.log(item1);
    $("#fruits-go-here").append('<p>' + item1 + '</p>');

    // Method2:  Use localStorage, which is accessible when active until session 
    var item2 = localStorage.getItem("item2");
    //document.write("item2=" + item2);
    console.log(item2);
    $("#fruits-go-here").append('<p>' + item2 + '</p>');
}
//displayFruits();

//--------------------------------------------------------------------
// Updates the authenticated user's "displayName"
//--------------------------------------------------------------------
function updateUserProfileAuth(name, email, address) {
    firebase.auth().onAuthStateChanged(function (user) {
        console.log("user is signed in: " + user.uid);
        console.log("old display name: " + user.displayName);
        user.updateProfile({
            displayName: name
        }).then(function () {
            console.log("updated authenticated user profile");
            console.log("new display name: " + user.displayName);
        }).catch(function (error) {
            console.log("authenticated user profile update failed");
        })
    })
}
//updateUserProfileAuth("Bill Gates");

//--------------------------------------------------------------------
// Updates the firestore user's "name", "phone", "address"
//--------------------------------------------------------------------
function updateUserProfileFirestore(name, phone, address) {
    firebase.auth().onAuthStateChanged(function (user) {
        console.log("user is signed in: " + user.uid);
        db.collection("users").doc(user.uid)
            .update({
                "name": name,
                "phone": phone,
                "address": address
            }).then(function () {
                console.log("updated users database");
            }).catch(function (error) {
                console.log("cannot update users database");
            })
    })
}
//updateUserProfileFirestore("Bill Gates", "phone", "Kingsway")

//---------------------------------------------------------------------
// Prints out the authenticated user object fields
//---------------------------------------------------------------------
function printUserAuth() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user != null) {
            console.log(user);
            name = user.displayName;
            email = user.email;
            photoUrl = user.photoURL;
            emailVerified = user.emailVerified;
            uid = user.uid; // The user's ID, unique to the Firebase project. Do NOT use
            // this value to authenticate with your backend server, if
            // you have one. Use User.getToken() instead.
            console.log(name);
            console.log(email);
            console.log(photoUrl);
            console.log(emailVerified);
            console.log(uid);
        }
    })
}
//printUserAuth();

//-------------------------------------------------------
// Assume the HTML has a text input for user to enter location, 
// and a "add" button
// This function will listen to the "add" button, then grab the location
// from the text input (id = "location")
// and save it to the database for the authenticated user.
//-------------------------------------------------------
function getLocationAndSave() {
    document.getElementById("addButton").addEventListener('click', function () {
        var location = document.getElementById("location").value;
        console.log(location);

        // if the current user is signed in, then save it to their document
        firebase.auth().onAuthStateChanged(function (user) {
            db.collection("users").doc(user.uid)
                .update({
                    "location": location
                })
        })
    })
}
getLocationAndSave();

//---------------------------------------
// replicate a collection of documents to a new location
//---------------------------------------
function replicateData(source, destination) {
    db.collection(source)
        .get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                console.log(doc.data());
                db.collection(destination).add(doc.data());
            })
        })
}
//replicateData("/quotes", "/quotes_new");

//------------------------------------------------
// Same as getRestaurantCards() above but added a div 
// inside for putting stars
//------------------------------------------------
function getRestaurantCardwithStars() {
    db.collection("shops")
        .get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                console.log(doc.data());
                var name = doc.data().name;
                var address = doc.data().hood;
                var d1 = $("#quotes-go-here").append(
                    "<div class='card' style='width: 18rem;'>" +
                    "<img class='card-img-top' src='images/blah.jpg' alt='Card image cap'>" +
                    "<div class='card-body'>" +
                    "<h5 class='card-title'>" + name + "</h5>" +
                    "<p class='card-text'>Some quick example text.</p>" +
                    "<a href='#' class='btn btn-primary'>Go somewhere</a>" +
                    "<div class='ratings'>" +
                    "* * * * * (stars go here)" +
                    "</div)" +
                    "</div>" +
                    "</div)");
            })
        })
}
//getRestaurantCardwithStars();

//------------------------------------------------------------------
//  This function creates a grid of 3 columns per row, 
//  based on a unknown number of items in the collection
//  Each column has a unique id "c1", "c2" etc. 
//------------------------------------------------------------------
/*
<div class="container">
    <div class="row">
        <div class="col">
             1 of 3
         </div>
         <div class="col">
             1 of 3
        </div>
        <div class="col">
            1 of 3
        </div>
    </div>
</div> 
*/
function createGrid(mycollection) {
    db.collection(mycollection)
        .get()
        .then(function (snap) {
            console.log(snap.size);
            console.log("create new container grid");
            console.log("create new row");

            var message =
                "<div class='container'>" +
                "<div class='row'>";

            for (var i = 1; i <= snap.size; i++) {
                console.log(i);
                console.log("create a column and one card");
                var cid = "c" + i;
                message = message +
                    "<div class='col' id=" + cid + ">" +
                    "</div>"
                if (!(i % 3)) {
                    console.log("end the row")
                    console.log("create new row");
                    message = message +
                        "</div>" +
                        "<div class='row'>"
                }
            }
            console.log("end the row");
            console.log("end container grid");

            message = message +
                "</div>" +
                "</div>"

            $("#restaurants-go-here").append(message);
        })
}
createGrid("restaurants");

//----------------------------------------------------------------------
//  This function adds the slots identified by "c1", "c2" etc.
//  with a bootrap card with information from the collection
//  Inserts a little heart beside restaurant name. 
//----------------------------------------------------------------------
function fillCards(mycollection) {
    db.collection(mycollection)
        .get()
        .then(function (snap) {
            var i = 0;
            snap.forEach(function (doc) {
                console.log(doc.data());
                var name = doc.data().name;
                var address = doc.data().hood;
                var image = doc.data().image;
                var id = doc.id;

                // This i is to get the bootstrap card that we created in our grid
                i = i + 1;
                var card = "#c" + i;
                console.log(card);

                //The following line adds the content for bootstrap card
                var d1 = $(card).append(
                    "<div class='card' style='width: 18rem;'>" +
                    "<img class='card-img-top' src='images/" + image + "' alt='Card image cap'>" +
                    "<div class='card-body'>" +
                    "<h5 class='card-title'>" + name +
                    " <i id='" + id + "' class='far fa-heart'> </i>" + //regular "hollow" heart
                    "</h5>" +
                    "<p class='card-text'> " + address + "</p>" +
                    "<a href='#' class='btn btn-primary'>Go Somewhere</a>" +
                    "<div class='ratings'>" +
                    "</div)" +
                    "</div>" +
                    "</div)");

                addListenerToggleHearts(id);
            })
        })
}
fillCards("restaurants");

//-------------------------------------------------------
// This helper function will add listener to the heart with "id"
// Then toggle the hearts from two font-awesome icons (full-heart and empty-heart)
// Depending on the toggle, update the faves array in database (add or remove)
//--------------------------------------------------------
function addListenerToggleHearts(id) {
    // When the Heart is clicked
    $("#" + id).click(function () { //add listener 

        // Toggle between the full-heart ("fas", solid), and the empty-heart ("far", regular outline heart)
        $(this).toggleClass("fas far");

        // If the "fas" (solid heart) class is here, then add to faves, else remove from faves
        if ($("#" + id).hasClass('fas')) {
            console.log("ON");
            // Save to database
            firebase.auth().onAuthStateChanged(function (user) {
                db.collection("users").doc(user.uid).update({
                    faves: firebase.firestore.FieldValue.arrayUnion(id)
                })
            })
        } else {
            console.log("OFF");
            // Remove from database
            firebase.auth().onAuthStateChanged(function (user) {
                db.collection("users").doc(user.uid).update({
                    faves: firebase.firestore.FieldValue.arrayRemove(id)
                })
            })
        }
    });
}


//--------------------------------------------------------------------------------
//  This function read the collection of restaurants,
//  Dynamically create a place to display each restaurant,
//  Put a "heart" (font-awesome icon) beside the name with "id" (document id of the restaurant)
//  Then, add a listener to the heart.
//  In the handler:  
//      - toggle between the full heart, and the outline heart
//      - if the full heart is chosen, then add to faves array
//      - otherwise, remove from faves array
//-------------------------------------------------------------------------------
function displayRestaurantsWithHeart() {
    db.collection("restaurants")
        .get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                var name = doc.data().name;
                var id = doc.id;
                //console.log(name);

                //Display restaurant name, followed by a heart fontawesome icon
                $("#restaurants-go-here")
                    .append("<p> " + name +
                        " <i id='" + id + "' class='fa heart fa-heart-o'> </i>"); //add heart class from fontawesome

                // When the Heart is clicked
                $("#" + id).click(function () { //add listener 

                    // Toggle between the full-heart ("fa-heart"), and the empty-heart ("fa-heart-o", outline heart)
                    $(this).toggleClass("fa-heart fa-heart-o");

                    // If the "fa-heart" class is here, then add to faves, else remove from faves
                    if ($("#" + id).hasClass('fa-heart')) {
                        console.log("ON");
                        // Save to database
                        firebase.auth().onAuthStateChanged(function (user) {
                            db.collection("users").doc(user.uid).update({
                                faves: firebase.firestore.FieldValue.arrayUnion(id)
                            })
                        })
                    } else {
                        console.log("OFF");
                        // Remove from database
                        firebase.auth().onAuthStateChanged(function (user) {
                            db.collection("users").doc(user.uid).update({
                                faves: firebase.firestore.FieldValue.arrayRemove(id)
                            })
                        })
                    }
                });
            })
        })
}
//displayRestaurantsWithHeart();

function userPost() {
    document.getElementById("myPostBtn").addEventListener('click', function () {

        firebase.auth().onAuthStateChanged(function (user) {

            // grab comment from input text box
            var comments = $("#comments1").val();
            console.log(comments);

            // replace the html content of an existing div
            $("#comments2").html(comments);
            // OR, dynamically create (append) a brand new div
            $("#comments2")
                .append("<div> The comment from " + user.displayName + " was: " + comments + "</div>");

            // write this comment to the database
            db.collection("comments")
                .add({
                    "comments": comments
                })
        })
    });
}
userPost();

function getUsersWithQuery() {
    db.collection("users")
        .where("soccer", "==", true)
        .get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                console.log("likes soccer: ", doc.data().name);
            })
        })
}
getUsersWithQuery();

//-----------------------------------------------------------------
// To let user upload a file to firebase storage service
// Assume there's an "upload file" button. 
//-----------------------------------------------------------------
function uploadUserProfilePic() {
    // Let's assume my storage is only enabled for authenticated users 
    // This is set in your firebase console storage "rules" tab
    firebase.auth().onAuthStateChanged(function (user) {
        // get Elements 
        var uploader = document.getElementById('uploader-progress');
        var fileButton = document.getElementById("fileButton");

        // listen for file selection
        fileButton.addEventListener('change', function (e) {
            var file = e.target.files[0];       // Get file with file browser
            var storageRef = firebase.storage().ref("images/" + user.uid + ".jpg");  // Get reference
            storageRef.put(file);    // Upload file

            // storage bucket plus folder plus image name, which is the user's doc id
            //var picref = "gs://mango-smoothie.appspot.com/images/"+user.uid + ".jpg";

            storageRef.getDownloadURL()
            .then(function(url){     // Get URL of the uploaded file
                console.log(url);    // Save the URL into users collection
                db.collection("users").doc(user.uid).update({
                    "profilePic": url
                })
            })
        })
    })
}
uploadUserProfilePic();

function displayUserProfilePic(){
    firebase.auth().onAuthStateChanged(function(user){
        db.collection("users").doc(user.uid)
        .get()
        .then(function(doc){
            var picUrl = doc.data().profilePic;
            console.log(picUrl);
            $("#mypic").append("<img src='" + picUrl + "'>")
        })
    })
}
displayUserProfilePic();
