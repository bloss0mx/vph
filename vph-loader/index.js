const tempCompiler = require('./templateCompiler');

module.exports = function (source) {
  const transed = tempCompiler(source).replace(/\n/g, ' ').replace(/ +/, ' ');
  return `export default function(components){return ${transed}}`
}