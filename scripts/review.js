var listingDocID = localStorage.getItem("listingDocID");

function getListingName(id) {
    db.collection("listings")
        .doc(id)
        .get()
        .then((thisListing) => {
            console.log(thisListing)
            var listingName = thisListing.data().name;
            document.getElementById("listingName").innerHTML = listingName;
        });
}

getListingName(listingDocID);

// Add this JavaScript code to make stars clickable

// Select all elements with the class name "star" and store them in the "stars" variable
const stars = document.querySelectorAll('.star');

// Iterate through each star element
stars.forEach((star, index) => {
    console.log(star, index)
    // Add a click event listener to the current star
    star.addEventListener('click', () => {
        console.log(`Star ${index} clicked.`)
        // Fill in clicked star and stars before it
        for (let i = 0; i <= index; i++) {
            console.log(`fill #star${i}`)
            // Change the text content of stars to 'star' (filled)
            document.getElementById(`star${i}`).innerText = 'star';
        }
        for (let i = index + 1; i <= 4; i++) {
            console.log(`unfill #star${i}`)
            document.getElementById(`star${i}`).innerText = 'star_outline';
        }
    });
});

function writeReview() {
    console.log("Review submitted")
    let review = {
        listingDocID: listingDocID,
        userID: "",
        causedInterference: document.querySelector('input[name="caused-interference"]:checked').value,
        application: document.getElementById("application").value,
        comment: document.getElementById("comment").value,
        rating: 0,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }
    document.querySelectorAll('.star').forEach((star) => {
        // Check if the text content of the current 'star' element is equal to the string 'star'
        if (star.innerText === 'star') {
            review.rating++;
        }
    });

    console.log(review)

    var user = firebase.auth().currentUser;
    if (user) {
        var currentUser = db.collection("users").doc(user.uid);
        var userID = user.uid;

        review.userID = userID

        // Get the document for the current user.
        db.collection("reviews").add(review).then(() => {
            window.location.href = "thanks.html"; // Redirect to the thanks page
        });
    } else {
        console.log("No user is signed in");
        window.location.href = 'review.html';
    }
}
