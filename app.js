// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwAX7HPPzrEbRiDvS6KkVns8y2IEfVKCY",
  authDomain: "fir-2b9b9.firebaseapp.com",
  projectId: "fir-2b9b9",
  storageBucket: "fir-2b9b9.appspot.com",
  messagingSenderId: "929690840538",
  appId: "1:929690840538:web:8163dfad1b5b81e93c24e3",
  measurementId: "G-FKCSQWWHFX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Signup function
function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const name = document.getElementById("name").value;
  const role = document.querySelector("input[name='role']:checked")?.value;

  if (!email || !password) {
    alert("Please fill out both email and password fields.");
    return;
  }

  if (password.length < 6) {
    alert("Password should be at least 6 characters long.");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      console.log("User signed up:", user);

      // Save user data in Firestore
      await writeData(name, email, role);
      console.log("User stored in database.");

      alert("Sign up successful! Welcome, " + user.email);
      // Redirect after signup
      window.location.pathname = "users.html";
    })
    .catch((error) => {
      console.error("Error signing up:", error.code, error.message);
      alert("Error: " + error.message);
    });
}

// Function to write data to Firestore
async function writeData(name, email, role) {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      name,
      email,
      role,
    });
    console.log("Document written with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding document:", error);
  }
}

// Attach event listener to signup button
document.getElementById("signupButton")?.addEventListener("click", signup);

// Function to fetch all users
async function getAllUsers() {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

// Function to show all users in a table
async function showUsers() {
  const users = await getAllUsers();
  console.log("All users:", users);

  // Render users as a table
  const list = document.getElementById("users-list");
  if (list) {
    list.innerHTML = `
      <table border="1" cellspacing="0" cellpadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          ${users
            .map(
              (user) => `
            <tr>
              <td>${user.id}</td>
              <td>${user.name}</td>
              <td>${user.email}</td>
              <td>${user.role}</td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
    `;
  } else {
    console.error("Element with ID 'users-list' not found.");
  }
}

// Call showUsers to fetch and display users
showUsers();