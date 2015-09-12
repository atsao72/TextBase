function createBook(title) {
  var Book = Parse.Object.extend("Book");
  var book = new Book();
  var array = [];
  book.set("title", title);
  book.set("array", array);

  book.save(null, {
    success: function(book) {
      // Execute any logic that should take place after the object is saved.
      alert('New object created with objectId: ' + book.id);
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
function getBookId(){
    document.getElementById('bookId').value = bookId;
}

// function loadReviews() {
//   var id = parseBookId():
//
//   var Book = Parse.Object.extend("Book");
//   var query = new Parse.Query(Book);
//   query.get(id, {
//   success: function(result) {
//     alert(result.get("title"));
//   },
//   error: function(error) {
//       window.open ('bookList.html','_self',false);
//       res.send(error.description);
//   }
// }

function loadResults(){
    var searchString = parseBookId();
    searchString = searchString.replace(/%27/g, "'");
    searchString = searchString.replace(/\+/g, " ");

    var Book = Parse.Object.extend("Book");
    var query = new Parse.Query(Book);
    query.equalTo("title", searchString);
    query.find({
    success: function(results) {
        for(var i = 0; i < results.length; i++){
            var div = document.getElementById("bookEntry");
            var h1 = document.getElementById("title");
            h1.innerHTML = results[i].get("title");
            bookId = results[i].id;
            /*var p1 = document.getElementById("author");
            var authorsStr = "";
            for(int j = 0; j < results[i].get("authors").length; i++){
                authorsStr = authorsStr + ", " + results[i].get("authors")[j];
            }
            p1.innerHTML = authorsStr;
            var p2 = document.getElementById("course");
            p2.textContent = results[i].get("course");
            var p3 = document.getElementById("college");
            var schoolStr = "";
            for(int j = 0; j < results[i].get("schools").length; i++){
                authorsStr = authorsStr + ", " + results[i].get("schools")[j];
            }
            p3.textContent = schoolStr*/
        }
    },
    error: function(error) {
alert("Failed");
        res.send(error.description);
    }
});
}

function search() {
    var Book = Parse.Object.extend("Book");
    var query = new Parse.Query(Book);
    query.equalTo("title", document.getElementById("searchBar").value);
    query.find({
    success: function(results) {
    },
    error: function(error) {
        window.open ('bookList.html','_self',false);
        res.send(error.description);
    }
});

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
        var bookId = parseBookId();

        var Book = Parse.Object.extend("Book");
        var query = new Parse.Query(Book);
        query.get(bookId, {
          success: function(object) {
              var array = object.get("reviews");
              array.push(review.id);
              object.set("reviews", array);
              object.save(null, {
                  success: function(object){
                      alert('Thank you for reviewing this textbook!');
                  },
                  error: function(object,error){
                  }
              });
          },

          error: function(object, error) {
          }
        });

      },
      error: function(review, error) {
      }
    });
}

function updateBookId() {
  var bookId = parseId();
  document.getElementById('bookId1').value = bookId;

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
