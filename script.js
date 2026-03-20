// --- CLIENT-SIDE LOGIN LOGIC ---
function loginUser() {
    // Get the input values from the HTML form
    const usernameInput = document.getElementById("username").value;
    const passwordInput = document.getElementById("password").value;
    
    // Get the paragraph element where we will show messages
    const messageDisplay = document.getElementById("message");
    messageDisplay.innerText = "Logging in...";
    messageDisplay.style.color = "blue";

    // Basic validation to ensure fields aren't empty
    if (usernameInput === "" || passwordInput === "") {
        messageDisplay.style.color = "red";
        messageDisplay.innerText = "Please enter both username and password.";
        return false; // Stop form submission
    }

    // Send data to the Backend Server
    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Server status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            messageDisplay.style.color = "green";
            messageDisplay.innerText = "Login Successful! Welcome, " + data.name;
            setTimeout(() => {
                alert("Welcome " + data.name + "!");
                window.location.href = "index.html";
            }, 500);
        } else {
            messageDisplay.style.color = "red";
            messageDisplay.innerText = data.message;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        messageDisplay.style.color = "red";
        messageDisplay.innerText = "Login Error: " + error.message;
    });

    // Return false to prevent the form from reloading the page
    return false;
}

// --- CLIENT-SIDE REGISTRATION LOGIC ---
function registerUser() {
    // Get the input values from the HTML form
    // Note: You will need HTML input fields with IDs "reg-username" and "reg-password"
    const usernameInput = document.getElementById("reg-username").value;
    const passwordInput = document.getElementById("reg-password").value;
    
    // Get the element where we will show messages (reusing the existing message element)
    const messageDisplay = document.getElementById("message");
    
    if (usernameInput === "" || passwordInput === "") {
        messageDisplay.style.color = "red";
        messageDisplay.innerText = "Please enter a username and password to register.";
        return false;
    }

    fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            messageDisplay.style.color = "green";
            messageDisplay.innerText = "Registration Successful! You can now log in.";
        } else {
            messageDisplay.style.color = "red";
            messageDisplay.innerText = "Registration Failed: " + data.message;
        }
    })
    .catch(error => console.error('Error:', error));
    return false;
}

// --- UI HELPER FUNCTIONS ---
function closeLogin() {
    // Clear input fields after successful login
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
}

