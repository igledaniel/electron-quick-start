const request = require('request');

//Retrieve full WOF record given the WOF id.
function query(options, callback) {
  let { host, id } = options;

  // set default host
  host = host || 'https://whosonfirst.mapzen.com';

  let strId = new String(id);
  let subPath = new Array();

  while (strId.length){
    let part = strId.substr(0, 3);
    subPath.push(part);
    strId = strId.substr(3);
  }

  subPath = subPath.join("/");
  const query = `${host}/data/${subPath}/${id}.geojson`;

  request.get(query, (err, res) => {
    if (err) {
      return callback(err);
    }

    var results = JSON.parse(res.body);
    callback(null, results);
  });
}

module.exports = query;
