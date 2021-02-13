const img2LeafletTile = require('../lib');
const path = require('path');

const inputPath = path.join(__dirname, 'in/input2.png');
const outputPath = path.join(__dirname, 'output2');

const zoomLevels = [
    [1, 512], // 512 x 512
];

img2LeafletTile({
  inputFile: inputPath,
  outputFolder: outputPath,
  zoomLevels: zoomLevels,
  shouldLog: true, // log info
});
