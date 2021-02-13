const img2LeafletTile = require('../lib');
const path = require('path');

const inputPath = path.join(__dirname, 'in/input1.png');
const outputPath = path.join(__dirname, 'output1');

const zoomLevels = [
    [1, 2048], // 2048 x 2048
    [2, 1024], // 1024 x 1024
    [3, 512], // 512 x 512
    [4, 256], // 256 x 256
];

img2LeafletTile({
  inputFile: inputPath,
  outputFolder: outputPath,
  zoomLevels: zoomLevels,
  shouldLog: true, // log info
});
