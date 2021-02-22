# img2-Leaftlet-Tile
A library for converting images to leaflet tiles

# Installation
`npm i img2-leaflet-tiles`

# Usage
> Recommended to use .png
```js
const img2LeafletTile = require('img2-leaflet-tiles');
const path = require('path');

const inputPath = path.join(__dirname, 'input/input.png'); // path to input image
const outputPath = path.join(__dirname, 'output1'); // path to folder output

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
```

# Example
sample input:

<img src="https://user-images.githubusercontent.com/28738855/108728062-2998ef00-7564-11eb-9dc8-6a5e0163022b.png" width="650" height="300">

sample output:

<img src="https://user-images.githubusercontent.com/28738855/108722354-05d2aa80-755e-11eb-99ef-d4f7c36f8be4.png" width="650" height="300">

# License
Distributed under the MIT License. See LICENSE for more information.

# Acknowledgements
[Google Maps](https://www.google.com/maps) - for sample input
