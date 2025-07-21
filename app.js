
class Book{

    constructor(title, author, isbn){

    this.title = title;
    this.author = author;
    this.isbn = isbn;
    }
}

// UI constuctor

class UI{

    addBookList(book){

        const list = document.querySelector("#book-list");

        // Add Book

        const row = document.createElement("tr");

        row.innerHTML = `<td>${book.title}</td>
                        <td>${book.author}</td>
                        <td>${book.isbn}</td>
                        <td class="delete">
                            <span class="btn btn-danger">X</span>
                        </td>`

        list.appendChild(row);
        }

        clearInputFields(){

            document.querySelector("#title").value = "";
            document.querySelector("#author").value = "";
            document.querySelector("#isbn").value = "";

        }

    clearList(list){

            document.querySelector("#book-list").innerHTML = "";
        }

    removeList(item){

        item.parentElement.remove();
        
    }

    showAlert(message, type){

        this.clearAlert();

        // create div element

        const div  = document.createElement("div");

        div.className = `alert alert-${type}`;

        div.innerText = message;

        document.querySelector(".show-alert").appendChild(div);

        let self = this;

        setTimeout(function(){

           const currentAlert = document.querySelector(".alert");

            if(currentAlert){

            currentAlert.remove();
        }
            self.clearAlert();

        }, 3000);
    }

    clearAlert(){

        const currentAlert = document.querySelector(".alert");

        if(currentAlert){

            currentAlert.remove();
        }
    }

}

class Storage{

    getBooks(){

        let books;

        if(localStorage.getItem("books") === null){

            books = [];
        } else{

            books = JSON.parse(localStorage.getItem("books"));
        }

        return books;

        
    }

    addBooks(book){

        const books = this.getBooks();

        books.push(book);

        localStorage.setItem("books", JSON.stringify(books));
    }

    removeBook(isbn){

        const books = this.getBooks();

        books.forEach(function(book, index){

            if(book.isbn === isbn){

                books.splice(index, 1);

            }
        })

        localStorage.setItem("books", JSON.stringify(books));
    }

    clearBook(){

        localStorage.removeItem("books");
    }

    displayBook(){

        const books = this.getBooks();

        books.forEach( function(book) {
            
            const ui = new UI();

            ui.addBookList(book);
        });
    }
}

const storage = new Storage;

document.addEventListener("DOMContentLoaded", storage.displayBook());




document.querySelector("#book-form").addEventListener("submit", function(e){

    const storage = new Storage();

    e.preventDefault();

    const ui = new UI();

    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const isbn = document.querySelector("#isbn").value;

    if(title === "" || author === "" || isbn === ""){

       ui.showAlert("Please fill all the fields", "danger");

        
    } else{


        let bookExist = false;

        const books = document.querySelectorAll("#book-list tr");

        for(const bookRow of books){

            const existingTitle = bookRow.querySelector("td:nth-child(1)").innerText;
            const existingIsbn = bookRow.querySelector("td:nth-child(3)").innerText;

            if(existingTitle === title || existingIsbn === isbn){

                bookExist = true;
                break;
            }
        }

        if(bookExist){

            ui.showAlert("Book with the same title and isbn they already exist", "danger");

        } else{

            const book = new Book(title, author, isbn);

            ui.addBookList(book);

            ui.showAlert("Book Added Successfully", "success");

            ui.clearInputFields();

            storage.addBooks(book);

        }

    }
})


document.querySelector("#clear").addEventListener("click", function(){

    const ui = new UI();

    const storage = new Storage();

    storage.clearBook();

    ui.clearList();

    ui.showAlert("Cleared Successfully", "success");

    
})

document.querySelector("#book-list").addEventListener("click", function(e){

    if(e.target.parentElement.classList.contains("delete")){

            const isbn = e.target.parentElement.previousElementSibling.innerText;

            const ui = new UI();

            const storage = new Storage;

            storage.removeBook(isbn);

            // removeItem

            ui.removeList(e.target.parentElement);

            ui.showAlert("Book Removed Successfully", "success");

        };

    


})