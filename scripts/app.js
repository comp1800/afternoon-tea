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
                var d1 = $("#quotes-go-here").append("<div class='card' style='width: 18rem;'>")
                var i = d1.append("<img class='card-img-top' src='...' alt='Card image cap'>");
                var d2 = d1.append("<div class='card-body'>")
                d2.append("<h5 class='card-title'>" + m + "</h5>");
                d2.append("<p class='card-text'>Some quick example text.</p>");
                d2.append("<a href='#' class='btn btn-primary'>Go somewhere</a>");
            })
        })
}
getQuotesIntoCards();


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
// This function is used to change the username and email of the logged in user
// Use authentication SDK functions to change the authenticated user
// 
// Input param:  name, email, address strings
//---------------------------------------------------------------------
function updateUserProfileAuth(name, email, address) {
    firebase.auth().onAuthStateChanged(function (user) {
        console.log("user is signed in: " + user.uid);
        console.log("old display name: " + user.displayName);
        user.updateProfile({
            displayName: name
        }).then(function () {
            console.log("updated authenticated user profile");
            console.log("new display name: " + user.displayName);
            updateUserProfileFirestore(name, email, address);
        }).catch(function (error) {
            console.log("authenticated user profile update failed");
        })
    })
}
updateUserProfileAuth("Bill Gates", "bill@bill.com", "Kingsway");

function updateUserProfileFirestore(name, elecmail, address) {
    firebase.auth().onAuthStateChanged(function (user) {
        console.log("user is signed in: " + user.uid);
        db.collection("users").doc(user.uid)
            .update({
                "name": name,
                "email": elecmail,
                "address": address
            }).then(function () {
                console.log("updated users database");
            }).catch(function (error) {
                console.log("cannot update users database");
            })
    })
}

function getUserProfile() {
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
getUserProfile();
