const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user. Either username or password not provided!" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
    new Promise((resolve, reject) => {
        resolve(books); // Simulating an async operation
    })
    .then((data) => res.status(200).json(data)) // Send response after Promise resolves
    .catch((err) => res.status(500).json({ error: "Something went wrong!" }));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;

    new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]); // Simulating an async operation
        } else {
            reject("ISBN book not found!");
        }
    })
    .then((data) => res.status(200).json(data)) // Send the book details if found
    .catch((error) => res.status(404).json({ message: error })); // Handle errors
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
    const author = req.params.author;

    new Promise((resolve, reject) => {
        let foundBooks = Object.values(books).filter(book => book.author === author);

        if (foundBooks.length > 0) {
            resolve(foundBooks);
        } else {
            reject("No books found by this author!");
        }
    })
    .then((data) => res.status(200).json(data)) // Send books if found
    .catch((error) => res.status(404).json({ message: error })); // Handle errors
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
    const title = req.params.title;

    new Promise((resolve, reject) => {
        let foundBooks = Object.values(books).filter(book => book.title === title);

        if (foundBooks.length > 0) {
            resolve(foundBooks);
        } else {
            reject("No books found by this title!");
        }
    })
    .then((data) => res.status(200).json(data)) // Send books if found
    .catch((error) => res.status(404).json({ message: error })); // Handle errors
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).json({ message: "ISBN book not found!" });
    }

    res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
