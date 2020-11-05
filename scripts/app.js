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
            .add({      //using the add() function, auto-generated doc ID
                "name": name,
                "hood": neighbourhood,
                "reason": reason,
                "open-window": check1.checked,   //boolean value
                "patio-seating": check2.checked  //true if checked
            })
    })
}
addListener();

//--------------------------------------------------------
// This function reads the "shops" collection from database
// Then cycles thru the collection to
//   - create a DOM element
//   - put name of shop inside DOM
//   - attach this DOM to the display area for shops (id = "shops")
//---------------------------------------------------------
function displayShops(){
    db.collection("shops")                      //go to the shops collection
    .get()                                      //get whole collection
    .then (function(snap){
        snap.forEach(function(doc){             //cycle thru collection to get docs

            var n = doc.data().name;            //extract the name field
            console.log (n);

            //create a new div, with name field, attach it to the right slot
            item = document.createElement("div");
            item.innerText = n;
            $("#shops").append(item);

        });
    })
}
displayShops();