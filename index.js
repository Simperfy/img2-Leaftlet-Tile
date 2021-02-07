const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { loggerConfig } = require('./util');

// Config
logger = loggerConfig(true);

const input = path.join(__dirname, 'in/dog.jpg');
const paddedOutput = path.join(__dirname, 'out/padded.png');

const cropDimensionWidth = 256;
const cropDimensionHeight = 256;
// ./Config

let x = 0;
let y = 0;

let xLimit = 0;
let yLimit = 0;

const image = sharp(input);

// Set limit
const paddedImage = image.metadata()
.then((metadata) => {
  logger(`Input dimension: ${metadata.width} x ${metadata.height}`);
  const padX = getPadding(metadata.width, cropDimensionWidth);
  const padY = getPadding(metadata.height, cropDimensionHeight);

  logger("added X padding: ", padX);
  logger("added Y padding: ", padY);
  xLimit = metadata.width + padX;
  yLimit = metadata.height + padY;

  logger(`New dimension: ${xLimit} x ${yLimit}`);

  return image.extend({
    top: 0,
    left: 0,
    right: padX,
    bottom: padY,
    background: { r: 0, g: 0, b: 0, alpha: 0 }
  })
});

paddedImage.then((image) => image.toFile(paddedOutput))
.then((_) => {
  const newImage = sharp(paddedOutput);

  logger('\n');
  logger('total row: ' + xLimit/cropDimensionWidth);
  logger('total col: ' + yLimit/cropDimensionHeight);

  let counter = 0;
  const pendingPromises = [];

  for (let a = 0; a < xLimit/cropDimensionWidth; a++ ) {
    for (let b = 0; b < yLimit/cropDimensionHeight; b++ ) {
      const folder = `out/0/${a}/`
      const filename = `${b}.png`;
      const output = folder+filename;

      /* fs.mkdir(folder, { recursive: true }, (err) => {
        if (err) throw err;

        x = a * cropDimensionWidth;
        y = b * cropDimensionHeight;
        ++counter;

        const m = newImage
        .extract({ left: x, top: y, width: cropDimensionWidth, height: cropDimensionHeight })
        .toFile(output);

        pendingPromises.push(m);
      }); */

      fs.mkdirSync(folder, { recursive: true });
      x = a * cropDimensionWidth;
      y = b * cropDimensionHeight;
      ++counter;

      const m = newImage
      .extract({ left: x, top: y, width: cropDimensionWidth, height: cropDimensionHeight })
      .toFile(output);

      pendingPromises.push(m);
    }
  }

  Promise.all(pendingPromises).then((_) => {
    fs.unlink(paddedOutput, (err) => {
      if (err) throw err;
      logger('Cleaning up files.');
    });

    logger(`Generated ${counter} files.`);
  });
});

function getPadding(dimension, cropDimension) {
  if (dimension % cropDimension === 0) return 0

  return cropDimension - (dimension % cropDimension);
}
