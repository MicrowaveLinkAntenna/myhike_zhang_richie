//----------------------------------------------------------
// This function is the only function that's called.
// This strategy gives us better control of the page.
//----------------------------------------------------------
function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            insertNameFromFirestore(user);
            getBookmarks(user)
        } else {
            console.log("No user is signed in");
        }
    });
}
doAll();

//----------------------------------------------------------
// Wouldn't it be nice to see the User's Name on this page?
// Let's do it!  (Thinking ahead:  This function can be carved out, 
// and put into script.js for other pages to use as well).
//----------------------------------------------------------//----------------------------------------------------------
function insertNameFromFirestore(user) {
    db.collection("users").doc(user.uid).get().then(userDoc => {
        console.log(userDoc.data().name)
        userName = userDoc.data().name;
        console.log(userName)
        document.getElementById("name-goes-here").innerHTML = userName;
    })

}

const listingCardGroup = document.getElementById("listingCardGroup")

//----------------------------------------------------------
// This function takes input param User's Firestore document pointer
// and retrieves the "saved" array (of bookmarks) 
// and dynamically displays them in the gallery
//----------------------------------------------------------
function getBookmarks(user) {
    db.collection("users").doc(user.uid).get()
        .then(userDoc => {

            // Get the Array of bookmarks
            var bookmarks = userDoc.data().bookmarks;
            console.log(bookmarks);

            // Get pointer the new card template
            let cardTemplate = document.getElementById("savedCardTemplate");

            // Iterate through the ARRAY of bookmarked listings (document ID's)
            bookmarks.forEach(thisListingID => {
                console.log(thisListingID);
                db.collection("listings").doc(thisListingID).get().then(doc => {
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

                    //Finally, attach this new card to the gallery
                    listingCardGroup.appendChild(newcard);
                })
            });
        })
}
