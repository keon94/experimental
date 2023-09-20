const fs = require('fs');

fs.writeFile("message.txt", "Hello World!", function(err) {
  if (err) {
    throw err;
  } else {
    console.log("The file was saved!");
  }
});

fs.readFile("message.txt", "utf8", function(err, data) {
  if (err) {
    throw err;
  } else {
    console.log(data);
  }
});