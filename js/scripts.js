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
        var list = document.getElementsByTagName("ul")[0];
        for(var i = 0; i < results.length; i++){
            var li = document.createElement("li");
            li.appendChild(document.createTextNode(results[i].get("title")));
            list.appendChild(li);
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
