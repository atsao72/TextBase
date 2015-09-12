function createBook(title) {
  var Book = Parse.Object.extend("Book");
  var book = new Book();

  book.set("title", title);

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

function loadResults(){
    var locate = window.location
    document.searchResult.input.value = locate
    var text = document.searchResult.input.value

    function delineate(str)
    {
        theleft = str.indexOf("=") + 1;
        theright = str.length;
        return(str.substring(theleft, theright));
    }
    searchString = delineate(text);
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
