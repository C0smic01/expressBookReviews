const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const JWT_SECRET = "secret";

let users = [];

const isValid = (username)=>{ //returns boolean
    for (let i = 0; i < users.length; i++)
    {
        if (users[i].username === username)
        {
            return true;
        }
    }
    return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    for (let i = 0; i < users.length; i++)
    {
        if (users[i].username === username && users[i].password === password)
        {
            return true;
        }
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    try {
        const {username, password} = req.body;
        if (!authenticatedUser(username, password))
        {
            return res.json({ message: "User is not registered!" });
        }
        return res.json({token: jwt.sign({user: username}, JWT_SECRET)})
    }
    catch (error)
    {
        return res.status(500).json({ message: "Internal Server Error!!" });
    }
});

const checkAuthentication = (req, res) => {
    let token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: "No token" });
    }
    if (token.startsWith('Bearer ')) {
        tokenValue = token.slice(7, token.length).trimLeft();
    }

    try {
        verificationStatus = jwt.verify(tokenValue, JWT_SECRET);
        if (!isValid(verificationStatus.username)) {
            return res.status(401).json({ message: "Please login" });
        }
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    checkAuthentication(req, res);

});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    checkAuthentication(req, res);
    let keys = Object.keys(books);
    for (let i = 0; i < keys.length; i++)
    {
        let id = keys[i];
        if (books[id].isbn === req.params.isbn)
        {
            books[id].reviews = {};
            return res.status(200).json({message: "Review deleted successfully"});
        }
    }
    return res.json({message: "No reviews found"});

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
