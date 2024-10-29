function displayListingInfo() {
    let params = new URL(window.location.href); //get URL of search bar
    let ID = params.searchParams.get("docID"); //get value for key "id"
    console.log(ID);

    // doublecheck: is your collection called "Reviews" or "reviews"?
    db.collection("listings")
        .doc(ID)
        .get()
        .then(doc => {
            console.log(doc)
            let thisListing = doc.data();
            console.log(thisListing)
            listingName = thisListing.name;

            // only populate title, and image
            document.getElementById("listingName").innerHTML = listingName;
            document.getElementById("listingDetails").innerHTML = thisListing.details;
            let imgEvent = document.querySelector(".listing-img");
            imgEvent.src = thisListing.image
        });
}
displayListingInfo();

