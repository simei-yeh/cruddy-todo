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
};
//use JSON.parse to read the file on hardrive and have it render back on to the client?????

exports.readAll = (callback) => {

  fs.readdir(exports.dataDir, (err, file) => {
    if (err) {
      console.log('error thrown');
      throw ('error');
    } else {
      // console.log(file);
      if (file.length === 0) {
        callback(null, []);
      } else {

        var data = [];
        // // var createArray = (data, (err, data) => {
        // //   if (err) {
        // //     throw err;
        // //   } else {
        _.map(file, (id, text) => {
          fs.readFile(`${exports.dataDir}/${id}`, (err, result) => {
            if (err) {
              callback(err);
              console.log('error thrown line 51');
            } else {
              console.log(result.toString());
              data.push( {'id': id.substring(0, id.length - 4), 'text': result.toString()});
              console.log(file);
              // callback(null, data);
            }
          });
        });
        console.log(data);
        // callback(null, data);
        // }
      }
      // return { id, text };
      // });
    }
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, result) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { 'id': id, 'text': result.toString() });
    }
  });
};

exports.update = (id, text, callback) => {
  fs.readFile (`${exports.dataDir}/${id}.txt`, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile ( `${exports.dataDir}/${id}.txt`, text, (err) => {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback(null, { 'id': id, 'text': text});
        }
      });
    }
  });
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  // callback(null, { id, text });
  // }

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
