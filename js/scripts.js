function goHome(){
    window.open("index.html", "_self", false);
}

function goAddBook(){
    window.open("addBook.html", "_self", false);
}

var reviewObject;
function updateReviewTitle(){
    bookId = parseId();
    var Book = Parse.Object.extend("Book");
    var query = new Parse.Query(Book);
    query.get(bookId, {
      success: function(object) {
          reviewObject = object;
          var bookTitle = object.get("title");
          var title = document.getElementById('leaveReviewTitle').innerHTML;
          document.getElementById('leaveReviewTitle').innerHTML = title + "\"" + bookTitle + "\"";
      },
      error: function(object, error) {
      }
    });
}

function addBook(){
    var title = document.getElementById('bookTitle').value;
    var authorArray = [document.getElementById('author').value];
    var course = document.getElementById('course').value;
    var schoolArray = [document.getElementById('school').value];
    createBook(title, authorArray, course, schoolArray);
}

function createBook(title, authors, course, schools) {
  var Book = Parse.Object.extend("Book");
  var book = new Book();
  book.set("title", title);
  book.set("authors", authors);
  book.set("course", course);
  book.set("schools", schools);
  book.set("reviews", []);
  book.save(null, {
    success: function(book) {
      var url = "review.html?book=" + book.id;
      window.open(url, "_self", false);
    },
    error: function(book, error) {
      // Execute any logic that should take place if the save fails.
      // error is a Parse.Error with an error code and message.
      alert('Failed to create new object, with error code: ' + error.message);
    }
});
}

function createCourse(title) {
  var Course = Parse.Object.extend("Course");
  var course = new Course();

  course.set("title", title);

  course.save(null, {
    success: function(course) {
      // Execute any logic that should take place after the object is saved.
      alert('New object created with objectId: ' + course.id);
    },
    error: function(course, error) {
      // Execute any logic that should take place if the save fails.
      // error is a Parse.Error with an error code and message.
      alert('Failed to create new object, with error code: ' + error.message);
    }
  });
}

var bookId;
function readReviews(){
    var url = "review.html?book=" + bookId;
    window.open(url, "_self", false);
}

function downloadBook() {
  var id = parseId();
  var Book = Parse.Object.extend("Book");
  var query = new Parse.Query(Book);
  query.get(id, {
    success: displayTextbookData,
    error: function(error) {
      alert(error);
    }
  });
}

function displayTextbookData(result) {
  var title = result.get("title"); // string
  var authors = result.get("authors"); // array
  var course = result.get("course"); // string
  var schools = result.get("schools"); // array
  var reviewsIds = result.get("reviews"); // array
  var element = document.getElementById("header");
  var titlediv = document.createElement("div");
  var node = document.createTextNode(title);
  titlediv.appendChild(node);
  element.appendChild(titlediv);
  var progress = document.createElement("progress");
  progress.setAttribute("value", "22");
  progress.setAttribute("max", "100");
  element.appendChild(progress);
  var br = document.createElement("br");
  element.appendChild(br);
  var percText = document.createElement("div");
  var node1 = document.createTextNode("of reviewers said the book was necessary for success in the class");
  element.appendChild(node1);
/**
<form method='LINK' action='leaveReview.html' id='reviewButton'/>
    <input id='bookId1' type='hidden' name='book'></input>
   <input id='leaveReview' type='submit' value='Review this textbook!' onclick='updateBookId();'></input>
</form>
*/
  var button = document.createElement("form");
  button.method = "LINK";
  button.action = "leaveReview.html";
  button.id = "reviewButton";
  var input1 = document.createElement("input");
  input1.id = "bookId1";
  input1.type = "hidden";
  input1.name = "book";
  var input2 = document.createElement("input");
  input2.id = "leaveReview";
  input2.type = "submit";
  input2.value = "Review this textbook!";
  input2.onclick = "updateBookId();";
  button.appendChild(input1);
  button.appendChild(input2);
  element.appendChild(button);


  var Review = Parse.Object.extend("Review");
  var query = new Parse.Query(Review);
  for (var i = 0; i < reviewsIds.length; i++) {
    query.get(reviewsIds[i], {
      success: showReview,
      error: function(error) {
        alert(error);
      }
    });
  }
}

function showReview(review) {
  var element = document.getElementById("body");
  var isNess = review.get("isNecessary");
  if (isNess) {
    var node = document.createTextNode("Would recommend buying the book");
    var para = document.createElement("p");
    para.appendChild(node);
    para.style.color = "green";
    var date = document.createTextNode(review.get("date"));
    var datePar = document.createElement("p");
    datePar.appendChild(date);
    var description = document.createElement("p");
    var desText = document.createTextNode(review.get("review"));
    description.appendChild(desText);
    element.appendChild(para);
    element.appendChild(datePar);
    element.appendChild(description);
    var line = document.createElement("hr");
    element.appendChild(line);
  } else {
    var node = document.createTextNode("Would NOT recommend buying the book");
    var para = document.createElement("p");
    para.appendChild(node);
    para.style.color = "red";
    var date = document.createTextNode(review.get("date"));
    var datePar = document.createElement("p");
    datePar.appendChild(date);
    var description = document.createElement("p");
    var desText = document.createTextNode(review.get("review"));
    description.appendChild(desText);
    element.appendChild(para);
    element.appendChild(datePar);
    element.appendChild(description);
    var line = document.createElement("hr");
    element.appendChild(line);
  }
}

function loadResults(){
    var searchString = parseId();
    searchString = searchString.replace(/%27/g, "'");
    searchString = searchString.replace(/%20/g, " ");
    var Book = Parse.Object.extend("Book");
    var query = new Parse.Query(Book);
    query.equalTo("title", searchString);
    query.find({
    success: function(results) {
        if(results.length == 0){
            var h1 = document.getElementById("title");
            h1.innerHTML = "No book with this title was found!";
            var p1 = document.getElementById("author");
            p1.innerHTML = "";
            var p2 = document.getElementById("course");
            p2.innerHTML = "";
            var p3 = document.getElementById("college");
            p3.innerHTML = "";
            var button = document.getElementById("leaveReview");
            button.value = "Add New Textbook";
            button.onclick = function(){goAddBook();}
        }
        for(var i = 0; i < results.length; i++){
            var h1 = document.getElementById("title");
            h1.innerHTML = results[i].get("title");
            bookId = results[i].id;
            var p1 = document.getElementById("author");
            var authorsStr = p1.innerHTML + ": ";
            var array = results[i].get("authors");
            for(var j = 0; j < array.length; j++){
                if(j == 0){
                    authorsStr = authorsStr + array[j];
                }
                else{
                    authorsStr = authorsStr + ", " + array[j];
                }
            }
            p1.innerHTML = authorsStr;
            var p2 = document.getElementById("course");
            p2.innerHTML = p2.innerHTML + ": " + results[i].get("course");
            var p3 = document.getElementById("college");
            var schoolStr = p3.innerHTML + ": ";
            array = results[i].get("schools");
            for(var j = 0; j < array.length; j++){
                if(j==0){
                    schoolStr = schoolStr + array[j];
                }
                else{
                    schoolStr = schoolStr + ", " + array[j];
                }
            }
            p3.innerHTML = schoolStr;
        }
    },
    error: function(error) {
alert("Failed");
        res.send(error.description);
    }
});
}

function search() {
    var searchString = document.getElementById('searchBar').value;
    var url = "bookList.html?input=" + searchString;
    window.open(url, "_self", false);
}

function submitReview(){
    var radios = document.getElementsByName('recommend');
    var didRecommend = false;
    for (var i = 0; i < radios.length; i++) {
        if (radios[0].checked) {
            didRecommend = true;
            break;
        }
    }

    var dateString;
    var month = document.getElementById("month");
    var monthStr = month.options[month.selectedIndex].text;
    var year = document.getElementById("year");
    var yearStr = year.options[year.selectedIndex].text;
    dateString = monthStr + "/" + yearStr;

    var Review = Parse.Object.extend("Review");
    var review = new Review();
    review.set("date", dateString);
    review.set("gpa", parseInt(document.getElementById("gpa").value));
    review.set("course", document.getElementById("course").value);
    review.set("review", document.getElementById("reviewText").value);
    review.set("isNecessary", didRecommend);
    review.save(null, {
      success: function(review) {
        var array = reviewObject.get("reviews");
        array.push(review.id);
        reviewObject.set("reviews", array);
        reviewObject.save(null, {
            success: function(object){
                alert('Thank you for reviewing this textbook!');
                window.open("index.html", "_self", false);
            },
            error: function(object,error){
            }
        });
      },
      error: function(review, error) {
      }
    });
}

function goReview() {
  var bookId = parseId();
  var url = "leaveReview.html?book=" + bookId;
  window.open(url, "_self", false);
}

function parseId() {
  var locate = window.location;
  document.searchResult.input.value = locate;
  var text = document.searchResult.input.value;

  function delineate(str)
  {
      theleft = str.indexOf("=") + 1;
      theright = str.length;
      return(str.substring(theleft, theright));
  }
  var bookId = delineate(text);
  return bookId;
}
