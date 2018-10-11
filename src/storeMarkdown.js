//import readline from "readline";
//import fs from "fs";
//import path from "path";
const fs = require("fs");
const readline = require("readline");
const R = require("ramda")

const storeMarkdown = async (path, date, models, tags) => {
    const rl = readline.createInterface({
        input: fs.createReadStream(path),
    });
    var lineCounter = 0;
    var markdown = {
        title: "",
        description: "",
        image: "",
        content: "",
        createdAt: date.setSeconds(date.getSeconds() + 1),
    }
    var tagIds ;
    rl.on('line', function (line) {
        lineCounter ++;
        if ( lineCounter == 2) {
            markdown.title = line.split(/^title: /)[1];
        } else if (lineCounter == 3) {
            markdown.description = line.split(/^description: /)[1];  
        } else if (lineCounter == 4){
            tagIds = line.split(/^tags: /)[1].split(/, /).map(tag => {
                const result = R.find(R.propEq('name', tag))(tags)
                if (result) {
                    return result.id
                }
            })
        } else if (lineCounter == 5) {
            markdown.image = line.split(/^image: /)[1];
        } else if (lineCounter >= 7){
            markdown.content = markdown.content + line + "\n"
        }
        
    });
    rl.on('close', async function() {
        const post = await  models.Post.create(markdown)
        await post.setTags(tagIds)
    })
}

export default storeMarkdown;