
const readline = require('readline');
const fs = require('fs')
const rl = readline.createInterface({
    input: fs.createReadStream("tutorial.md"),
});
var tagsList = [{id: 1, name: "python"}, {id: 2, name: "javascript"}];
var lineCounter = 0;
var title = "a";
var description = "";
var image = "";
var content = "";
rl.on('line', function (line) {
    lineCounter ++;
    if ( lineCounter == 2) {
        title = line.split("title: ")[1];
    } else if (lineCounter == 3) {
        description = line.split("description: ")[1];
    } else if (lineCounter == 4) {
        image = line.split("image: ")[1];
    }
    content = content + line + "\n"
});
rl.on('close', function() {
    console.log(title, description, image, content);
    process.exit(0);
})

tagsList.forEach((tag) => console.log(tag))
var envContent = fs.readFileSync('./using-react-env.md', 'utf8')
console.log(envContent)