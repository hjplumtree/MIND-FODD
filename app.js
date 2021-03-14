/** Firebase for later

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBMC1j0yp0D-sfKvFwi1Omg6gMrEyOZ5l8",
  authDomain: "mindfood-e4177.firebaseio.com/",
  projectId: "mindfood-e4177",
  storageBucket: "mindfood-e4177.appspot.com",
  messagingSenderId: "759366859255",
  appId: "1:759366859255:web:e26cc639a55644519916f2"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const preObject = document.getElementById('object');

// Create References
const dbRefObject = firebase.database().ref().child('object');

// Sync object changes
dbRefObject.on('value', snap => {
  preObject.innerText = JSON.stringify(snap.val(), null, 3);
});
*/


const newBook = document.querySelector(".newBook");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const addButtonDiv = document.querySelector(".addButtonDiv");
const title = document.querySelector("#title");
const author = document.querySelector("#author");
const radio = document.querySelectorAll('.modalBody input[type="radio"]');
const bookshelf = document.querySelector(".bookshelf");

let myLibrary = [];

function Book(title, author, read) {
  this.title = title;
  this.author = author;
  this.read = read;
}
addBookToLibrary("Ryoma", "Shiba", true);
addBookToLibrary("Tree", "Bernard Werber", false);
addBookToLibrary("Zero To One", "Peter Thiel", true);

function addBookToLibrary(title, author, read) {
  myLibrary.push({
    title,
    author,
    read: read,
  });
}

function showBooks() {
  bookshelf.innerHTML = "";
  myLibrary.forEach((book) => {
    bookshelf.innerHTML += `
    <li>
    <div class="bookCover">
    <div class="bookInfo">
    <p class="bookTitle">${book.title}</p>
    <p class="author">By ${book.author}</p>
    <p class="isRead">${book.read ? "HAVE" : "WILL"} READ</p>
    </div>
    <div class="settingButtons">
    <button type="button" class="status">STATUS</button>
    <button type="button" class="delete">DELETE</button>
    </div>
    </div>
    </li>`;
  });
  changeStatus();
  deleteBook()
}
showBooks();

const addButton = document.querySelector(".addButtonDiv button");
addButton.onclick = addNewBook;

function addNewBook() {
  checkValidate(title);
  checkValidate(author);
  checkValidate(radio);
  if (checkValidate(title) && checkValidate(author) && checkValidate(radio)) {
    putValues();
  }

  function putValues() {
    const checkedRadio = document.querySelector(
      '.modalBody input[type="radio"]:checked'
    );
    const trueOrFalse = checkedRadio.value === "have" ? true : false;
    addBookToLibrary(title.value, author.value, trueOrFalse);

    const li = document.createElement("li");
    li.innerHTML = `
    <li>
      <div class="bookCover">
        <div class="bookInfo">
          <p class="bookTitle">${title.value}</p>
          <p class="author">By ${author.value}</p>
          <p class="isRead">${trueOrFalse ? "HAVE" : "WILL"} READ</p>
        </div>
        <div class="settingButtons">
          <button type="button" class="status">STATUS</button>
          <button type="button" class="delete">DELETE</button>
        </div>
      </div>
    </li>`;
    bookshelf.appendChild(li);
    emptyValues();
    changeStatus();
    deleteBook()
  }

  function checkValidate(input) {
    const newSpan = document.createElement("span");
    newSpan.classList.add(".formTitles");
    if (input.type === "text") {
      const value = input.dataset.value;
      const previousNode = input.previousElementSibling;
      if (previousNode.children[0]) {
        previousNode.removeChild(previousNode.children[0]);
      }
      if (input.value === "") {
        newSpan.innerHTML = ` Please fill ${value}`;
        previousNode.appendChild(newSpan);
        return false;
      }
      return true;
    } else {
      const previousNode = input[0].previousElementSibling;
      if (previousNode.children[0]) {
        previousNode.removeChild(previousNode.children[0]);
      }
      if (!input[0].checked && !input[1].checked) {
        console.log("why");
        newSpan.innerHTML = ` Please check one`;
        previousNode.appendChild(newSpan);
        return false;
      }
      return true;
    }
  }
}

// 클릭되면
// 글자를 바꿔주고
// 저장을 위해 배열을 바꿔주면 완료

function changeStatus() {
  const statusButtons = document.querySelectorAll(".status");
  statusButtons.forEach((btn) => {
    btn.onclick = function (e) {
      const bookCover = e.target.parentNode.parentNode;
      let bookStatus = bookCover.children[0].children[2];
      
      if(bookStatus.textContent.slice(0,1) === 'H') {
        changeReadStatus(bookCover);
        bookStatus.textContent = 'WILL Read';
      } else {
        changeReadStatus(bookCover);
        bookStatus.textContent = 'HAVE Read';
      }
    };
  });
  function changeReadStatus(bookCover) {
    const title = bookCover.children[0].children[0].textContent;
    const author = bookCover.children[0].children[1].textContent.slice(3);
    myLibrary.forEach(ele => {
      if(ele.title === title && ele.author === author) {
        ele.read = !ele.read;
      }
    })
  }
}

function deleteBook() {
  const deleteButton = document.querySelectorAll('.delete');
  deleteButton.forEach(btn => {
    btn.onclick = function (e) {
      const bookCover = e.target.parentNode.parentNode;
      bookCover.parentNode.removeChild(bookCover);
    };
  });
}

close.onclick = function () {
  modal.style.display = "none";
};
newBook.onclick = function () {
  emptyValues();
  modal.style.display = "block";
};

function emptyValues() {
  if (title.value) {
    title.value = "";
  }
  if (author.value) {
    author.value = "";
  }
  const readStatus = document.querySelector(
    '.modalBody input[type="radio"]:checked'
  );
  if (readStatus) {
    readStatus.checked = false;
  }
}
// 클릭되면
// 전체 필드 확인
// 없으면 옆에 메시지 보여주기
// [완료]다시 클릭되면 또 확인하고
// 입력되면 modal 없애주기
// 오브젝트로 myLibrary 배열에 집어넣기
// 집어넣으면 modal창 종료
