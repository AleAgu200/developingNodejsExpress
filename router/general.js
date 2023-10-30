const express = require("express");
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();
const registerUser = (username, password) => {
	let user = users.find((user) => user.username === username);
	if (user) {
		return false;
	}
	users.push({ username, password });
	return true;
};
public_users.post("/register", (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	if (!username || !password) {
		return res.status(400).json({ message: "Invalid credentials" });
	}
	if (registerUser(username, password)) {
		return res.status(200).json({ message: "User successfully registered" });
	} else {
		return res.status(208).json({ message: "User already exists" });
	}
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
	//get all the books from booksdb and return it to the user
	return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
	//Write your code here
	//get the book that matches the ISBN
	const isbn = req.params.isbn;
	const book = Object.values(books).filter((book) => book.ISBN === isbn);
	if (book) {
		return res.status(200).json(book);
	} else {
		return res.status(404).json({ message: "Book not found" });
	}
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
	//Write your code here
	const author = req.params.author;
	const authorBooks = Object.values(books).filter(
		(book) => book.author === author
	);
	if (authorBooks) {
		return res.status(200).json(authorBooks);
	} else {
		return res.status(404).json({ message: "Book not found" });
	}
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
	//Write your code here
	const title = req.params.title;
	const titleBooks = Object.values(books).filter(
		(books) => books.title === title
	);
	if (titleBooks) {
		return res.status(200).json(titleBooks);
	} else {
		return res.status(404).json({ message: "Book not found" });
	}
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
	//Write your code here
	const isbn = req.params.isbn;
	const book = Object.values(books).filter((book) => book.ISBN === isbn);
	if (book) {
		return res.status(200).json(book);
	} else {
		return res.status(404).json({ message: "Book not found" });
	}
});

module.exports.general = public_users;
