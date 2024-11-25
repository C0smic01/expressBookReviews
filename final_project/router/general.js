const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    function findUser (username) {
        for (let i = 0; i < users.length; i++)
        {
            if (username === users[i].username)
            {
                return users[i];
            }
        }
    }
    try {
        const {username, password} = req.body;
        const foundUser = findUser(username);
        if (foundUser)
        {
            res.json("Username existed");
        }
        else
        {
            users.push({"username": username, "password": password});
            res.json("User created");
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error!!" });
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    function filter(book_isbn) {
        let filtered_books = [];
        let keys = Object.keys(books);  

        for (let i = 0; i < keys.length; i++)
        {
            let id = keys[i];
            if (books[id].isbn === book_isbn)
            {
                filtered_books.push(books[id]);
            }
        }
        return filtered_books;
    }

    filtered_books = filter(req.params.isbn);
    res.json(filtered_books);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    function filter(author) {
        let filtered_books = [];
        let keys = Object.keys(books);  

        for (let i = 0; i < keys.length; i++)
        {
            let id = keys[i];
            if (books[id].author === author)
            {
                filtered_books.push(books[id]);
            }
        }
        return filtered_books;
    }

    filtered_books = filter(req.params.author);
    res.json(filtered_books);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    function filter(title) {
        let filtered_books = [];
        let keys = Object.keys(books);  

        for (let i = 0; i < keys.length; i++)
        {
            let id = keys[i];
            if (books[id].title === title)
            {
                filtered_books.push(books[id]);
            }
        }
        return filtered_books;
    }

    filtered_books = filter(req.params.title);
    res.json(filtered_books);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    function filter(isbn) {
        let reviews = [];
        let keys = Object.keys(books);  

        for (let i = 0; i < keys.length; i++)
        {
            let id = keys[i];
            if (books[id].isbn === isbn)
            {
                reviews.push(books[id].reviews);
            }
        }
        return reviews;
    }

    reviews = filter(req.params.isbn);
    res.json(reviews);
});

module.exports.general = public_users;
