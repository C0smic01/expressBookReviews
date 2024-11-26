const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", async (req, res) => {
    const findUser = (username) => {
        return users.find(user => user.username === username);
    };

    try {
        const {username, password} = req.body;
        const foundUser = findUser(username);
        
        if (foundUser) {
            return res.json("Username existed");
        }
        
        users.push({"username": username, "password": password});
        return res.json("User created");
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error!!" });
    }
});

public_users.get('/', async (req, res) => {
    return res.json(books);
});

public_users.get('/isbn/:isbn', async (req, res) => {
    const filter = (book_isbn) => {
        let filtered_books = [];
        let keys = Object.keys(books);  

        for (let i = 0; i < keys.length; i++) {
            let id = keys[i];
            if (books[id].isbn === book_isbn) {
                filtered_books.push(books[id]);
            }
        }
        return filtered_books;
    };

    const filtered_books = filter(req.params.isbn);
    return res.json(filtered_books);
});
  
public_users.get('/author/:author', async (req, res) => {
    const filter = (author) => {
        let filtered_books = [];
        let keys = Object.keys(books);  

        for (let i = 0; i < keys.length; i++) {
            let id = keys[i];
            if (books[id].author === author) {
                filtered_books.push(books[id]);
            }
        }
        return filtered_books;
    };

    const filtered_books = filter(req.params.author);
    return res.json(filtered_books);
});

public_users.get('/title/:title', async (req, res) => {
    const filter = (title) => {
        let filtered_books = [];
        let keys = Object.keys(books);  

        for (let i = 0; i < keys.length; i++) {
            let id = keys[i];
            if (books[id].title === title) {
                filtered_books.push(books[id]);
            }
        }
        return filtered_books;
    };

    const filtered_books = filter(req.params.title);
    return res.json(filtered_books);
});

public_users.get('/review/:isbn', async (req, res) => {
    const filter = (isbn) => {
        let reviews = [];
        let keys = Object.keys(books);  

        for (let i = 0; i < keys.length; i++) {
            let id = keys[i];
            if (books[id].isbn === isbn) {
                reviews.push(books[id].reviews);
            }
        }
        return reviews;
    };

    const reviews = filter(req.params.isbn);
    return res.json(reviews);
});

module.exports.general = public_users;
