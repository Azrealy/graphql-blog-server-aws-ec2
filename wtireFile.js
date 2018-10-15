fs = require('fs');
fs.writeFile('helloworld.txt', 'Hello World!', function (err) {
    if (err) 
        return console.log(err);
    console.log('Wrote Hello World in file helloworld.txt, just check it');
});

var fs = require('fs')
var logger = fs.createWriteStream('log.txt', {
  flags: 'w+' // 'a' means appending (old data will be preserved) 'w' will truncated file data if exists.
})

logger.write('some data \n') // append string to your file
logger.write('more data \n') // again
logger.write('and more \n') //