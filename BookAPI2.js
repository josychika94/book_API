//I used advanced REST client to test this code
var bodyParser = require('body-parser'); //created to be able to use request.body

var express = require('express');
var app = express();
//var app = require('express')();

//adding middleware to the global express name space
app.use(bodyParser.json());

//CREATING A SERVER USING PORT 3000
var server = app.listen(3000, function(){ 
    console.log('Server is listening on 3000')
});

var library = new Library ('Buhari');

app.get('/', function(request, response){ //CREATING OUR DEFAULT ROUTE WHICH IS JUST "/"
    response.send(library.getBooks()); //REQUEST A REPONSE 
    
});
//a route for adding book
app.post('/api/addBook', function(request, response){ //CREATING THE SECOND ROUTE /API/BOOK
    let params = request.body;
    let book = new Book(params.name, params.author, params.year, Math.random);
    library.addBook(book);
    response.send(library.getBooks());
})
//a route for updating book
app.put('/api/updateBook', function(request, response){
    let id = request.query.id;
    let body = request.body;
    library.updateBook(id, new Book(body.name, body.author, body.year, id));
    response.send(library.getBooks());
})
//a route for getting book by id
app.get('/api/getBookById', function(request, response){
    let id = request.query.id;
    response.send(library.getBookById(id));
})
//a route for getting book by parameter
app.get('/api/getBookByParam', function(request, response){
    let param = request.query.value;
    response.send(library.getBooksByParam(param));
})
//a route for deleting book
app.delete('/api/deleteBook', function(request, response){
    let id = request.query.id;
    response.send(library.deleteBook(id));
})
//a route for borrowed books
app.get('/api/borrowBook', function(request, response){
    let id = request.query.id;
    response.send(library.borrowBook(id));
})

app.get('/api/returnBook', function(request, response){
    let id = request.query.id;
    response.send(library.returnBook(id));
})

app.get('/api/checkBorrowedBooks', function(request, response){
    response.send(library.checkBorrowedBooks());
})

//declaring a requiring the file system
var fs = require('fs');
//creating the book function
function Book(name, author, year, id){
    this.name = name;
    this.author = author;
    this.year = year;
    this.id = id;
}
//creating the library function
function Library(name){
    this.name = name;
    this.books = [];
    this.borrowedBooks = [];
}

Library.prototype.getLibrary = function(){
    return JSON.parse(fs.readFileSync('./data.json'));
}

Library.prototype.updateLibrary = function(){
    return fs.writeFileSync('./data.json', JSON.stringify(this.books));

}
// a method that adds book to the library
Library.prototype.addBook = function(book){
    this.books = this.getLibrary();
    this.books.push(book);
    this.updateLibrary(this.books);
};
//a method that gets all books from the library
Library.prototype.getBooks = function(){
    this.books = this.getLibrary();
    return this.books;
};
//a method that gets book using id 
Library.prototype.getBookById = function(id){
    this.books = this.getLibrary();
    for(let i = 0; i < this.books.length; i++){
        if(this.books[i].id == id){
            return this.books[i];
        }
    }
};
//a method that gets book using index
Library.prototype.getBookByIndex = function(id){
    this.books = this.getLibrary();
    for (let i = 0; i < this.books.length; i++){
        if(this.books[i].id == id){
            return i;
        }
    }
};
//a method for deleting book from the library
Library.prototype.deleteBook = function(id){
    let bookIndex = this.getBookByIndex(id);
    this.books.splice(bookIndex, 1);
    this.updateLibrary(this.books); 
};
//upadating method
Library.prototype.updateBook = function(id, updatedBooks){
    let index = this.getBookByIndex(id);
    this.books[bookIndex] = updatedBook;
    this.updateLibrary(this.books);
};

Library.prototype.getBooksByParam = function(param, value){
    this.books = this.getLibrary();
    let books = [];
    for(let i = 0; i < this.books.length; i++){
        if (this.books[i][param] == value){
            books.push(this.books[i]);
        }
    }
    return books;
};

Library.prototype.borrowBook = function(id){
    var book =  this.getBookById(id);
    this.borrowedBooks.push(book);
    fs.writeFileSync('./borrowedBooks.json', JSON.stringify(this.borrowedBooks));

    this.deleteBook(id);
   
}

Library.prototype.returnBook = function(id){
    this.borrowedBooks = JSON.parse(fs.readFileSync('./borrowedBooks.json'));
    for (let i = 0; i < this.borrowedBooks.length; i++){
        if(this.borrowedBooks[i].id == id){
            var book = this.borrowedBooks[i];
            var bookIndex = i;
        }
    }
   
    this.borrowedBooks.splice(bookIndex, 1);
    fs.writeFileSync('./borrowedBooks.json', JSON.stringify(this.borrowedBooks));

    var message = `You just returned ${book.title} by ${book.author} (${book.year}).`;
    return message;
}

Library.prototype.checkBorrowedBooks = function(){
    this.borrowedBooks = JSON.parse(fs.readFileSync('./borrowedBooks.json'));
    if (this.borrowedBooks.length < 1) return 'No books have been borrowed';
    else return this.borrowedBooks;
}

var newBook1 = new Book ('go', 'Chika', 2000, 1);
var newBook2 = new Book('what is your age', 'Chinonso', 2012, 5);

var newLib = new Library ('The Natural Library');

newLib.addBook(newBook2);

newLib.addBook(newBook1);



