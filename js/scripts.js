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
  bookId = parseId();
  var Book = Parse.Object.extend("Book");
  var query = new Parse.Query(Book);
  query.get(bookId, {
    success: displayTextbookData,
    error: function(error) {
      alert(error);
    }
  });
}

numRec = 0;
function displayTextbookData(result) {
  var title = result.get("title"); // string
  var authors = result.get("authors"); // array
  var course = result.get("course"); // string
  var schools = result.get("schools"); // array
  var reviewsIds = result.get("reviews"); // array
  document.getElementById("title").innerHTML = '"' + title + '"';

  var Review = Parse.Object.extend("Review");
  var query = new Parse.Query(Review);
  var numTotal = reviewsIds.length;
  for (var i = 0; i < reviewsIds.length; i++) {
    query.get(reviewsIds[i], {
      success: showReview,
      error: function(error) {
        alert(error);
      }
    });
  }
  setTimeout(function(){
    document.getElementById("percentageText").innerHTML = numRec + " out of " + numTotal + " reviewers said the book was necessary for success in the class";
    document.getElementById("prog").value = numRec;
    document.getElementById("prog").max = numTotal;
    numRec = 0;
  }, 1000);


  // numRec = 0;
}

function showReview(review) {
  var element = document.getElementById("body");
  var isNess = review.get("isNecessary");
  var node;
  var rec = document.createElement("div");
  if (isNess) {
    node = document.createTextNode("Would recommend buying the book");
    rec.style.color = "green";
    numRec = numRec + 1;
  } else {
    node = document.createTextNode("Would NOT recommend buying the book");
    rec.style.color = "red";
  }
  rec.appendChild(node);
  var dateString = review.get("date");
  var year = dateString.substring(dateString.length - 4, dateString.length);
  var month = dateString.split("/")[0];
  var date = document.createTextNode(numToMonth(Number(month)) + " " + year);
  var ital = document.createElement("i");
  ital.appendChild(date);
  var datePar = document.createElement("p");
  datePar.appendChild(ital);
  datePar.style.fontSize = "12pt";
  var gpaHolder = document.createElement('p');
  var gpaText = document.createTextNode("Grade received: " + review.get("grade"));
  gpaHolder.appendChild(gpaText);
  gpaHolder.style.fontSize = "12pt";
  var description = document.createElement("p");
  var desText = document.createTextNode(review.get("review"));
  description.appendChild(desText);
  element.appendChild(rec);
  element.appendChild(datePar);
  element.appendChild(gpaHolder);
  element.appendChild(description);
  var line = document.createElement("hr");
  element.appendChild(line);

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
            var button = document.getElementById("readReviews");
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

function cancelReview(){
    var url = "review.html?book=" + reviewObject.id;
    window.open(url, "_self", false);
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

function numToMonth(num) {
  switch (num) {
    case 1:
      return "January";
      break;
    case 2:
      return "February";
      break;
    case 3:
      return "March";
      break;
    case 4:
      return "April";
      break;
    case 5:
      return "May";
      break;
    case 6:
      return "June";
      break;
    case 7:
      return "July";
      break;
    case 8:
      return "August";
      break;
    case 9:
      return "September";
      break;
    case 10:
      return "October";
      break;
    case 11:
      return "November";
      break;
    case 12:
      return "December";
      break;
    default:
      return "Error getting month";
  }
}
