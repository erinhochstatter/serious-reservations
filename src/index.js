var $ = require("jquery");
var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");
require("./index.css");

var currentUID = null;
var signInButton = null;
var signOutButton = null;
initializeFirebase();

$( document ).ready(function() {
  // DOM Elements
  signInButton = $("#sign-in-button");
  signOutButton = $("#sign-out-button");
  signOutButton.hide();

  // Database References
  var restaurantRef = firebase.database().ref('/restaurantsPath/' + 1);

  // Bind Events
  $(signInButton).click(function () {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  });

  $(signOutButton).click(function () {
    firebase.auth().signOut();
  });

  // Listen for  state changes
  firebase.auth().onAuthStateChanged(onAuthStateChanged);
  restaurantRef.on("value", handleRestaurantChange, handleRestaurantError);
});

function initializeFirebase() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCbfgBYU2pqGyV3S8V_0nTnSXch0ANkGBk",
    authDomain: "reserv-c0a85.firebaseapp.com",
    databaseURL: "https://reserv-c0a85.firebaseio.com",
    projectId: "reserv-c0a85",
    storageBucket: "reserv-c0a85.appspot.com",
    messagingSenderId: "472264200270"
  };

  firebase.initializeApp(config);
}

/**
 * Triggers every time there is a change in the Firebase auth state (i.e. user signed-in or user signed out).
 */
function onAuthStateChanged(user) {
  // We ignore token refresh events.
  if (user && currentUID === user.uid) {
    signInButton.hide();
    return;
  }

  if (user) {
    currentUID = user.uid;
    var userNameLabel = $(".user-name");
    var usersPath = '/usersPath/' + user.uid;

    firebase.database().ref().update(
      {usersPath:
        {
        "displayName": user.displayName,
        "email": user.email,
        "photoURL": user.photoURL
      }
    });

    userNameLabel.text(user.displayName)

  } else {
    // Set currentUID to null.
    currentUID = null;
    signInButton.show();
    signOutButton.hide();
    // Display the splash page where you can sign-in.
  }
}

function handleRestaurantChange(snapshot) {
  var restaurantName = $(".restaurant-name");
  var restaurantDescription = $(".restaurant-description");
  var restaurant = snapshot.val();

  restaurantName.text(restaurant.name);
  restaurantDescription.text(restaurant.description);
}

function handleRestaurantError(error) {
  console.log("The read failed: " + errorObject.code);
}

// function writeNewRestaurant(name, description) {
//   // A restaurant entry.
//   var restaurantData = {
//     name: name,
//     description: description,
//   };
//
//   // Get a key for a new Restaurant.
//   // var newRestaurantKey = firebase.database().ref().child('restaurants').push().key;
//   //
//   // // Write the new restaurant's data simultaneously in the restaurants list and the user's restaurant list.
//   // var updates = {};
//   // updates['/restaurants/' + newRestaurantKey] = restaurantData;
//   // // this is what a join looks like?
//   // // updates['/user-restaurants/' + uid + '/' + newRestaurantKey] = restaurantData;
//   //
//   // return firebase.database().ref().update(updates);
// }