//import readline from "readline";
//import fs from "fs";
//import path from "path";
const fs = require("fs");
const readline = require("readline");
const R = require("ramda")

var tagsList = [{id: 1, name: "python"}, {id: 2, name: "javascript"}];


async function storeMarkdown(path, date, models, tags) {
    const rl = readline.createInterface({
        input: fs.createReadStream(path),
    });
    var lineCounter = 0;
    var markdown = {
        title: "",
        description: "",
        image: "",
        content: "",
        createAt: date.setSeconds(date.getSeconds() + 1),
    }
    var tagIds ;
    rl.on('line', function (line) {
        lineCounter ++;
        if ( lineCounter == 2) {
            markdown.title = line.split("title: ")[1];
        } else if (lineCounter == 3) {
            markdown.description = line.split("description: ")[1];  
        } else if (lineCounter == 4){
            tagIds = line.split(": ")[1].split(", ").map(tag => {
                m = R.find(R.propEq('name', tag))(tags)
                if (m) {
                    return m.id
                }
            })
        } else if (lineCounter == 5) {
            markdown.image = line.split("image: ")[1];
        } else if (lineCounter >= 7){
            markdown.content = markdown.content + line + "\n"
        }
        
    });
    rl.on('close', function() {
        console.log(markdown, tagIds)
        process.exit(0);
    })
}
date = new Date()
storeMarkdown("tutorial.md", date, tagsList)