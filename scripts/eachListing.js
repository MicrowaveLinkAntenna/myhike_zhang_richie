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

function saveListingDocumentIDAndRedirect() {
    let params = new URL(window.location.href) //get the url from the search bar
    let ID = params.searchParams.get("docID");
    localStorage.setItem('listingDocID', ID);
    window.location.href = 'review.html';
}

function populateReviews() {
    console.log("test");
    let listingCardTemplate = document.getElementById("reviewCardTemplate");
    let listingCardGroup = document.getElementById("reviewCardGroup");

    let params = new URL(window.location.href); // Get the URL from the search bar
    let listingID = params.searchParams.get("docID");

    // Double-check: is your collection called "Reviews" or "reviews"?
    db.collection("reviews")
        .where("listingDocID", "==", listingID)
        .get()
        .then((allReviews) => {
            reviews = allReviews.docs;
            console.log(reviews);
            reviews.forEach((doc) => {
                var comment = doc.data().comment;
                var application = doc.data().application;
                var causedInterference = doc.data().causedInterference;
                var time = doc.data().timestamp.toDate();
                var rating = doc.data().rating; // Get the rating value
                console.log(rating)

                console.log(time);

                let reviewCard = listingCardTemplate.content.cloneNode(true);
                reviewCard.querySelector(".time").innerHTML = new Date(
                    time
                ).toLocaleString();
                reviewCard.querySelector(".comment").innerText = comment;
                reviewCard.querySelector(".application").innerText = application;
                reviewCard.querySelector(".caused-interference").innerText = causedInterference;

                // Populate the star rating based on the rating value

                // Initialize an empty string to store the star rating HTML
                let starRating = "";
                // This loop runs from i=0 to i<rating, where 'rating' is a variable holding the rating value.
                for (let i = 0; i < rating; i++) {
                    starRating += '<span class="material-icons">star</span>';
                }
                // After the first loop, this second loop runs from i=rating to i<5.
                for (let i = rating; i < 5; i++) {
                    starRating += '<span class="material-icons">star_outline</span>';
                }
                reviewCard.querySelector(".star-rating").innerHTML = starRating;

                listingCardGroup.appendChild(reviewCard);
            });
        });
}

populateReviews();