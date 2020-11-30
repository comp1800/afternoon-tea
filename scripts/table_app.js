//------------------------------------------------------------------------
// This function is called ONLY ONCE to populate our restaurants database
//------------------------------------------------------------------------
function populateRestaurants(restaurant) {
    var newrest = {
        name: restaurant,
        numtables: 3
    }
    db.collection("Restaurants").doc(restaurant).set(newrest);
    db.collection("Restaurants").doc(restaurant).collection("tables")
        .add({
            seats: 5,
            slot1: true,
            slot2: true
        })
    db.collection("Restaurants").doc(restaurant).collection("tables")
        .add({
            seats: 4,
            slot1: true,
            slot3: true
        })
    db.collection("Restaurants").doc(restaurant).collection("tables")
        .add({
            seats: 4,
            slot2: true
        })
}
//populateRestaurants("Whitespot");


//--------------------------------------------------------------------------------------
// Create the framework of the card, with id's for where we want to stick things in
//--------------------------------------------------------------------------------------
function createGrid(restaurant) {
    console.log("inside createGrid");
    db.collection("Restaurants")
        .doc(restaurant)
        .collection("tables")
        .get()
        .then(function (snap) {
            console.log(snap.size);
            console.log("create new container grid");
            console.log("create new row");

            // start the grid and row
            var message =
                "<div class='container'>" +
                "<div class='row'>";

            // create one column for every table
            snap.forEach(function (doc) {
                console.log("create a column and one card");
                console.log(doc.id);
                var docid = doc.id;
                message = message +
                    "<div class='col text-center' id='card" +
                    docid // id's will be like "card34dfad324134"
                    +
                    "'>" +
                    "</div>";
            })
            console.log("end the row");
            console.log("end container grid");

            // end the grid and row
            message = message +
                "</div>" +
                "</div>";

            // attach grid to the right spot
            console.log(message);
            $("#cards-go-here").append(message);
        })
}
createGrid("Whitespot");

//------------------------------------------------------------------------
//  This function will dynamically created a circle (for the table)
//  and three buttons for the slots, and attach them into the grid slot
//  that was created with createGrid()
//------------------------------------------------------------------------
function displayAllTables(restaurant) {
    console.log(restaurant);
    db.collection("Restaurants")
        .doc(restaurant)
        .collection("tables")
        .get()
        .then(function (snap) { //snap is collection of tables
            snap.forEach(function (doc) {
                var seats = doc.data().seats;
                console.log(seats);

                // create the table-circles; use a button, but not connected to listener
                var t = $("<button type='button' class='btn btn-table'>" 
                + seats + " <i class='fas fa-chair'></i> </button><br>");

                // create the 3 time-slot buttons
                // data-toggle="modal" data-target="#exampleModal"
                // <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">

                var b1 = $("<button id='slot1" + doc.id +
                    "' type='button' class='btn btn-success center' " +
                    " data-toggle='modal' data-target='#myModal'" +
                    "style=''>4-6 PM</button><br>");
                var b2 = $("<button id='slot2" + doc.id +
                    "' type='button' class='btn btn-success center' " +
                    " data-toggle='modal' data-target='#myModal'" +
                    "style=''>6-8 PM</button><br>");
                var b3 = $("<button id='slot3" + doc.id +
                    "' type='button' class='btn btn-success center' " +
                    " data-toggle='modal' data-target='#myModal'" +
                    " style=''>8-10 PM</button><br>");

                // attached the table-circle, and 3 buttons to the right place, inside the cards
                $("#card" + doc.id).append(t);
                $("#card" + doc.id).append(b1).append(b2).append(b3);

                // Call the add listener funcion there to:
                //    Add listeners to each button.
                //    In the handler, update slots info in the database, then change colour of button
                //
                //$("#slot1"+doc.id).click()
                //$("#slot2"+doc.id).click()
                //$("#slot3"+doc.id).click()

                //addSlotListeners(restaurant);

            })
        });
}
displayAllTables("Whitespot");

function addSlotListeners(restaurant) {
    db.collection("Restaurants")
        .doc(restaurant)
        .collection("tables")
        .get()
        .then(function (snap) { //snap is collection of tables
            snap.forEach(function (doc) {
                $("#slot1" + doc.id).click(function () {
                    if (!doc.slot1) {
                        createModelBook("slot1", doc.id, restaurant, "Booking for 4-6pm?");
                    }
                })
                $("#slot2" + doc.id).click(function () {
                    if (!doc.slot2)
                        createModelBook("slot2", doc.id, restaurant, "Booking for 6-8pm?");
                })
                $("#slot3" + doc.id).click(function () {
                    if (!doc.slot3)
                        createModelBook("slot3", doc.id, restaurant, "Booking for 8-10pm?");
                })
            })
        })
}

function createModelBook(slot, idref, title, message) {
    console.log("inside createModalBook: " + slot + " and " + idref);
    var msg =
        "<div class='modal' id='exampleModal' tabindex='-1' role='dialog'>" +
        " <div class='modal-dialog' role='document'>" +
        " <div class='modal-content'>" +
        " <div class='modal-header'>" +
        " <h5 class='modal-title'>" + title + "</h5>" +
        "   <button type='button' class='close' data-dismiss='modal' aria-label='Close'>" +
        "         <span aria-hidden='true'>&times;</span>" +
        "       </button>" +
        "     </div>" +
        "    <div class='modal-body'>" +
        "       <p>" + message + "</p>" +
        "     </div>" +
        "    <div class='modal-footer'>" +
        "       <button type='button' class='btn btn-primary' id='saveconfirm'>Confirm</button>" +
        "       <button type='button' class='btn btn-secondary' data-dismiss='modal'>Cancel</button>" +
        "    </div>" +
        "  </div>" +
        "  </div>" +
        "</div>"

    var ref = slot + idref;
    console.log(ref);
    $("#modal-goes-here").append(msg);

    $("#saveconfirm").click(function (slot, idref) {
        alert("saving to database");
        db.collection("restaurants)")
            .doc(restaurant)
            .collection("tables")
            .doc(idref)
            .updated({
                slot: true
            })
    })
}

//------------------------------------------------------------------------------
// This function will read and cycle through all the tables in the restaurant
// and find out which slots are "true"(booked) to make them red.  Otherwise 
// default is green, for not booked. 
//------------------------------------------------------------------------------
function updateTableButtons(restaurant) {
    db.collection("Restaurants")
        .doc(restaurant)
        .collection("tables")
        .get() //gets a collection of tables
        .then(function (snap) {
            snap.forEach(function (doc) { //for each table
                console.log(doc.data());
                if (doc.data().slot1) {
                    console.log("turn this table red " + doc.id);
                    document.getElementById("slot1" + doc.id).style.backgroundColor = "red";
                }
                if (doc.data().slot2) {
                    console.log("turn this table red " + doc.id);
                    document.getElementById("slot2" + doc.id).style.backgroundColor = "red";
                }
                if (doc.data().slot3) {
                    console.log("turn this table red " + doc.id);
                    document.getElementById("slot3" + doc.id).style.backgroundColor = "red";
                }
            })
        })
}
updateTableButtons("Whitespot");