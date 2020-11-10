
//--------------------------------------------------------
// This function will get two values:
// - one from URL string (visible in browser search bar)
// - one from localStorage (tied to computer/browser)
// Display them in the DOM
//--------------------------------------------------------
function displayFruits() {
    // Method1:  get value passed through a string, then parse the string
    var queryString = decodeURIComponent(window.location.search);
    var queries = queryString.split("?");   //delimiter
    var item1 = queries[1];                 //get what's after '?'
    console.log(item1);
    $("#fruits-go-here").append('<p>'+item1+'</p>');
    
    // Method2:  Use localStorage
    var item2 = localStorage.getItem("item2");
    console.log(item2);
    $("#fruits-go-here").append('<p>'+item2+'</p>');
}
displayFruits();