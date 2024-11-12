/*
function getNameFromAuth() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            // Do something for the currently logged-in user here: 
            console.log(user.uid); //print the uid in the browser console
            console.log(user.displayName);  //print the user name in the browser console
            userName = user.displayName;

            //method #1:  insert with JS
            //document.getElementById("name-goes-here").innerText = userName;    

            //method #2:  insert using jquery
            //$("#name-goes-here").text(userName); //using jquery

            //method #3:  insert using querySelector
            document.querySelector("#name-goes-here").innerText = userName

        } else {
            // No user is signed in.
            console.log("No user is logged in");
        }
    });
}
getNameFromAuth(); //run the function
*/

function insertNameFromFirestore() {
    // Check if the user is logged in:
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log(user.uid); // Let's know who the logged-in user is by logging their UID
            currentUser = db.collection("users").doc(user.uid); // Go to the Firestore document of the user
            currentUser.get().then(userDoc => {
                // Get the user name
                let userName = userDoc.data().name;
                console.log(userName);
                //$("#name-goes-here").text(userName); // jQuery
                document.getElementById("name-goes-here").innerText = userName;
            })
        } else {
            console.log("No user is logged in."); // Log a message when no user is logged in
        }
    })
}
//insertNameFromFirestore();


// Function to read the quote of the day from the Firestore "quotes" collection
// Input param is the String representing the day of the week, aka, the document name
function readQuote(day) {
    db.collection("quotes").doc(day)                                                         //name of the collection and documents should matach excatly with what you have in Firestore
        .onSnapshot(dayDoc => {                                                              //arrow notation
            console.log("current document data: " + dayDoc.data());                          //.data() returns data object
            document.getElementById("quote-goes-here").innerHTML = dayDoc.data().quote;      //using javascript to display the data on the right place

            //Here are other ways to access key-value data fields
            //$('#quote-goes-here').text(dayDoc.data().quote);         //using jquery object dot notation
            //$("#quote-goes-here").text(dayDoc.data()["quote"]);      //using json object indexing
            //document.querySelector("#quote-goes-here").innerHTML = dayDoc.data().quote;

        }, (error) => {
            console.log("Error calling onSnapshot", error);
        });
}
//readQuote("monday");   //calling the function

//-----------------------------------------------
// Create a "max" number of listing document objects
//-----------------------------------------------
function writeListings(max) {
    //define a variable for the collection you want to create in Firestore to populate data
    var listingsRef = db.collection("listings");
    listingsRef.add({
        //id: "1", // This was causing the doc ID to now show up
        name: "Microwave Link Antennas",
        details: "Directional parabolic antennas in the microwave spectrum, for long distance point-to-point links at high data rates.",
        image: "images/Zaldiaran_-_Antenas_01.square.jpg",
        items: 39817,          //number value
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    listingsRef.add({
        //id: "2",
        name: "Cellular Antennas",
        details: "4G and 5G sector antennas for providing cellular coverage.",
        image: "images/Sector_antennas_on_roof.square.jpg",
        items: 19372,          //number value
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    listingsRef.add({
        //id: "3",
        name: "VHF/UHF Antennas",
        details: "Dual-band VHF and UHF antennas for two-way radio, television, and air traffic communications.",
        image: "images/Sector_antennas_on_roof.square.jpg",
        items: 13812,          //number value
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
}

//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("listingCardTemplate"); // Retrieve the HTML element with the ID "listingCardTemplate" and store it in the cardTemplate variable. 

    db.collection(collection).get()   //the collection called "listings"
        .then(allListings => {
            //var i = 1;  //Optional: if you want to have a unique ID for each listing
            allListings.forEach(doc => { //iterate thru each doc
                console.log(doc)
                console.log(doc.data())

                var docID = doc.id;
                var title = doc.data().name;       // get value of the "name" key
                var details = doc.data().details;  // get value of the "details" key
                var image = doc.data().image;
                var items = doc.data().items;
                let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                //update title and text and image
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-text').innerHTML = details;
                newcard.querySelector('.card-img-top').src = image;
                newcard.querySelector('.items').innerText = items;

                //Optional: give unique ids to all elements for future use
                newcard.querySelector('.card').setAttribute("id", "card-" + docID);
                // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
                // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

                newcard.querySelector('a').setAttribute("href", "/eachListing.html?docID=" + docID);

                newcard.querySelector('i').id = 'save-' + docID;   //guaranteed to be unique
                newcard.querySelector('i').onclick = () => saveBookmark(docID);

                console.log(newcard)

                //attach to gallery, Example: "listings-go-here"
                document.getElementById(collection + "-go-here").appendChild(newcard);

                currentUser.get().then(userDoc => {
                    //get the user name
                    var bookmarks = userDoc.data().bookmarks;
                    if (bookmarks.includes(docID)) {
                        document.getElementById('save-' + docID).innerText = 'bookmark';
                    }
                })

                //i++;   //Optional: iterate variable to serve as unique ID
            })
        })
}

//displayCardsDynamically("listings");  //input param is the name of the collection

//Function that calls everything needed for the main page  
function doAll() {
    // figure out what day of the week it is today
    const weekday = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const d = new Date();
    let day = weekday[d.getDay()];

    // the following functions are always called when someone is logged in
    readQuote(day);
    insertNameFromFirestore();
    displayCardsDynamically("listings");
}
doAll();

//-----------------------------------------------------------------------------
// This function is called whenever the user clicks on the "bookmark" icon.
// It adds the listing to the "bookmarks" array
// Then it will change the bookmark icon from the hollow to the solid version. 
//-----------------------------------------------------------------------------
function saveBookmark(listingDocID) {
    currentUser.get().then(userDoc => {
        const bookmarks = userDoc.data().bookmarks
        if (bookmarks.includes(listingDocID)) {
            currentUser.update({
                bookmarks: firebase.firestore.FieldValue.arrayRemove(listingDocID)
            })
                .then(function () {
                    console.log("bookmark has been removed for " + listingDocID);
                    let iconID = "save-" + listingDocID
                    document.getElementById(iconID).innerText = 'bookmark_border';
                })
                .catch(function (error) {
                    console.error("Error removing bookmark:", error)
                    alert("Error removing bookmark, see console.")
                })
        } else {
            // Manage the backend process to store the listingDocID in the database, recording which listing was bookmarked by the user.
            currentUser.update({
                // Use 'arrayUnion' to add the new bookmark ID to the 'bookmarks' array.
                // This method ensures that the ID is added only if it's not already present, preventing duplicates.
                bookmarks: firebase.firestore.FieldValue.arrayUnion(listingDocID)
            })
                // Handle the front-end update to change the icon, providing visual feedback to the user that it has been clicked.
                .then(function () {
                    console.log("bookmark has been saved for " + listingDocID);
                    let iconID = 'save-' + listingDocID;
                    //console.log(iconID);
                    //this is to change the icon of the listing that was saved to "filled"
                    document.getElementById(iconID).innerText = 'bookmark';
                })
                .catch(function (error) {
                    console.error("Error adding bookmark:", error)
                    alert("Error adding bookmark, see console.")
                })
        }
    })
}

