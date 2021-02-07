const img2LeafletTile = require('./index');
const path = require('path');

const inputPath = path.join(__dirname, 'in/input.jpg');
const outputPath = path.join(__dirname, 'out');

img2LeafletTile({
  inputFile: inputPath,
  outputFolder: outputPath,
  dimension: 256, // tilemap size: 256 x 256
  shouldLog: true, // log output
});
