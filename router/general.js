const express = require("express");
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const axios = require("axios/dist/node/axios.cjs"); // node

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
	new Promise((resolve, reject) => {
		try {
			resolve(books);
		} catch (error) {
			reject(error);
		}
	})
		.then((books) => {
			res.status(200).json(books);
		})
		.catch((error) => {
			res.status(500).json({ message: error });
		});
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", (req, res) => {
	// Create a new promise
	new Promise((resolve, reject) => {
		// Get the book that matches the ISBN
		const isbn = req.params.isbn;
		const book = Object.values(books).filter((book) => book.ISBN === isbn);
		if (book.length > 0) {
			// If the book is found, resolve the promise with the book
			resolve(book);
		} else {
			// If the book is not found, reject the promise with an error message
			reject("Book not found");
		}
	})
		.then((book) => {
			// Send the book as a response
			res.status(200).json(book);
		})
		.catch((error) => {
			// Send an error response
			res.status(404).json({ message: error });
		});
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
	//Write your code here
	const author = req.params.author;
	new Promise((resolve, reject) => {
		const authorBooks = Object.values(books).filter(
			(book) => book.author === author
		);
		if (authorBooks.length > 0) {
			resolve(authorBooks);
		} else {
			reject("Book not found");
		}
	})
		.then((authorBooks) => {
			res.status(200).json(authorBooks);
		})
		.catch((error) => {
			res.status(404).json({ message: error });
		});
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
	//Write your code here
	const title = req.params.title;
	new Promise((resolve, reject) => {
		const titleBooks = Object.values(books).filter(
			(book) => book.title === title
		);
		if (titleBooks.length > 0) {
			resolve(titleBooks);
		} else {
			reject("Book not found");
		}
	})
		.then((titleBooks) => {
			res.status(200).json(titleBooks);
		})
		.catch((error) => {
			res.status(404).json({ message: error });
		});
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
