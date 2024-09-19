# Book Search Engine

## Description

The Book Search Engine allows avid readers to search for books, create an account, log in, and save books for future reference. Using the Google Books API, the application presents book search results, each including a title, author, description, image, and a link to the Google Books website. Logged-in users can save books to their account and manage their saved book list. This project demonstrates the use of React, GraphQL with Apollo Server, and MongoDB for user authentication and data management.

## Table of Contents

- [Description](#description)
- [Instructions](#instructions)
- [Required Packages](#required-packages)
- [Installation](#installation)

## Instructions

1. **Search for Books**:
   - From the homepage, use the input field to search for books by title, author, or keyword.
   - Results will include each book’s title, author, description, image, and a link to the book’s page on Google Books.

2. **Account Creation and Login**:
   - Click on the Login/Signup button to create an account or log in.
   - Toggle between the options to either sign up or log in.
     - **Sign up**: Provide a username, email, and password to create your account.
     - **Login**: Provide your email and password to access your account.

3. **Save Books**:
   - While logged in, use the "Save" button next to a book in the search results to save it to your account.
   - Visit your "Saved Books" page to view and manage the books you’ve saved.

4. **Manage Saved Books**:
   - On your saved books page, you can view all saved books and remove any book from your list by clicking the "Remove" button.

5. **Logout**:
   - To log out of your account, click the "Logout" button. You’ll be returned to the homepage and can still search for books without saving them.

## Required Packages

- **React.js**: Front-end framework.
- **GraphQL with Apollo Server**: For handling API queries and mutations.
- **MongoDB and Mongoose**: For database management.
- **JWT (JSON Web Token)**: For user authentication.
- **Google Books API**: For book search data.
- **bcrypt**: For securely hashing passwords.
  
## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/crob127/Book-Search-21.git
    ```

2. Navigate to the project directory:
    ```bash
    cd Book-Search-21
    ```

3. Install the required dependencies:
    ```bash
    npm install
    ```

4. Set up your environment variables:
   - Create a `.env` file in the root directory with the following variables:
     ```env
     MONGODB_URI=mongodb://localhost:27017/booksearch
     JWT_SECRET=your_secret_key
     ```

5. Start the server:
    ```bash
    npm start
    ```

6. Open the application in your browser at `http://localhost:3000`.

7. Create an account or log in, search for books, and start managing your book list!

