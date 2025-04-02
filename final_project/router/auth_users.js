const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length == 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in, username or password not defined!" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});

    const isbn = req.params.isbn;
    //const bookreviews = books[isbn].reviews;

    const username = req.session.authorization.username;
    const userreview = req.body.review;

    if (!books[isbn]) {
        return res.status(404).json({ message: "ISBN book not found!" });
    }

    if (!userreview) {
        return res.status(404).json({ message: "Error adding review!" });
    }

    books[isbn].reviews[username] = userreview;

    return res.status(200).send("Review successfully added!");
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    //return res.status(300).json({message: "Yet to be implemented"});
  
      const isbn = req.params.isbn;
  
      const username = req.session.authorization.username;
      const userreview = req.body.review;

        if (!books[isbn]) {
            return res.status(404).json({ message: "ISBN book not found!" });
        }

        if (books[isbn].reviews[username]) {
            delete books[isbn].reviews[username];
            return res.status(200).send("Review successfully deleted!");
        } else {
            return res.status(404).json({ message: "No review found for logged in user!" });
        }
      
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
