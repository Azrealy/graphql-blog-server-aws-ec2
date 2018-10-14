const R = require("ramda");

class TagsHelper {
  constructor(initialId) {
    this.nextId = initialId || 1;
    this.tags = [];
    this.tagNames = [];
  }

  generateTag(name) {

    if (this.tagNames.includes(name)) {
      return R.find(R.propEq('name', name))(this.tags)
    } else {
      const tag = { id: this.nextId++, name: name };
      this.tagNames.push(name)
      this.tags.push(tag)
      return tag
    }
  }
}

module.exports = TagsHelper
