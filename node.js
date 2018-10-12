const R = require("ramda");

function TagObjectGenerator(initialId) {
    this.nextId = initialId || 1;
    this.tagNames = [];
    this.tags = [];
}

TagObjectGenerator.prototype.generateTag = function(name) {
    
    if (this.tagNames.includes(name)) {
        return R.find(R.propEq('name', name))(this.tags)
    } else {
        tag = {id: this.nextId ++, name: name};
        this.tagNames.push(name)
        this.tags.push(tag)
        return tag
    }

}

var TagGenerator = new TagObjectGenerator();
var tag1 = TagGenerator.generateTag('Python')
var tag2 = TagGenerator.generateTag('javascript')
var tag3 = TagGenerator.generateTag('javascript')

console.log(TagGenerator.tagNames)