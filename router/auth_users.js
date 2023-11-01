const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const authenticatedUser = (username, password) => {
	//returns boolean
	//write code to check if username and password match the one we have in records.
	let user = users.find(
		(user) => user.username === username && user.password === password
	);
	if (user) {
		return true;
	}
	return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
	//Write your code here
	const username = req.body.username;
	const password = req.body.password;

	if (!username || !password) {
		return res.status(400).json({ message: "Invalid credentials" });
	}
	if (authenticatedUser(username, password)) {
		let accessToken = jwt.sign(
			{
				data: password,
			},
			"access",
			{ expiresIn: 60 * 60 }
		);
		req.session.authorization = { accessToken, username };
		return res.status(200).json({ message: "User successfully logged in" });
	} else {
		return res
			.status(208)
			.json({ message: "Invalid credentials, check username and password" });
	}
});

// Add a book review
regd_users.put("/review/:isbn", (req, res) => {
	const isbn = req.params.isbn;
	const user = req.session.authorization.username;
	const review = req.body.review;
	const book = Object.values(books).filter((book) => book.ISBN === isbn)[0];
	if (book) {
		if (Object.values(book.reviews).filter((review) => review.user === user)) {
			book.reviews.user = user;
			book.reviews.review = review;

			console.log(JSON.stringify(books)); // Access the book object directly using the ISBN

			return res.status(200).json({
				message: "This user has already reviewed this book, updating content",
			});
		} else {
			book.reviews[`${Object.keys(book.reviews).length + 1}`] = {
				user,
				review,
			};
			return res.status(208).json({
				message: "Review added successfully",
			});
		}
	}

	return res.status(404).json({ message: "Book not found" });
});

regd_users.delete("/review/:isbn", (req, res) => {
	const isbn = req.params.isbn;
	const user = req.session.authorization.username;
	const book = Object.values(books).filter((book) => book.ISBN === isbn)[0];
	if (book) {
		if (Object.values(book.reviews).filter((review) => review.user === user)) {
			delete book.reviews.review;
			delete book.reviews.user;
			return res.status(200).json({ message: "Review deleted successfully" });
		} else {
			return res.status(208).json({
				message: "This user has not reviewed this book",
			});
		}
	}
});

module.exports.authenticated = regd_users;
module.exports.users = users;
