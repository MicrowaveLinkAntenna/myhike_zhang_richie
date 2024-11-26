//---------------------------------
// Your own functions here
//---------------------------------


function sayHello() {
    //do something
}
//sayHello();    //invoke function

//------------------------------------------------
// Call this function when the "logout" button is clicked
//-------------------------------------------------
function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log("logging out user");
    }).catch((error) => {
        // An error happened.
    });
}


firebase.auth().onAuthStateChanged(user => {
    if (user) {
        //Global variable pointing to the current user's Firestore document
        const currentUser = db.collection("users").doc(user.uid); //global
        console.log(currentUser);
    } else {
        // No user is signed in.
        console.log("No user is signed in");
        //window.location.href = "login.html";
    }
});
