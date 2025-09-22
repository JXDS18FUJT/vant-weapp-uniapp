/* eslint-disable */
var REGEXP = /{|}|"/g

function keys(obj) {
  return JSON.stringify(obj)
    .replace(REGEXP, '')
    .split(',')
    .map(function(item) {
      return item.split(':')[0];
    });
}
export default {
  keys
}
// module.exports.keys = keys;
