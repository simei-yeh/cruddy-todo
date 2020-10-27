const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

//take this js obj in memory and write it to a file - json.stringify

exports.create = (text, callback) => {

  counter.getNextUniqueId((err, id) => {
    if (err) {
      throw ('error');
    } else {

      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        if (err) {
          throw ('error');
        } else {
          callback(null, { id, text });
        }
      });
    }
  });

  // counter.getNextUniqueId((err, id) => {
  //   if (err) {
  //     throw ('Cannot create!');
  //   } else {
  //     // console.log(`${exports.dataDir}`, `${id}.txt`)
  //     fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
  //       if (err) {
  //         throw ('Cannot create, writeFile');
  //       } else {
  //         callback(null, { id, text });
  //       }
  //     });
  //   }
  // });
};
//use JSON.parse to read the file on hardrive and have it render back on to the client?????

exports.readAll = (callback) => {
  var data = _.map(items, (text, id) => {
    return { id, text };
  });
  callback(null, data);
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
