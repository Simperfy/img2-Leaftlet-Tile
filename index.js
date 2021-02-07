const sharp = require('sharp');
const fs = require('fs');
const { loggerConfig } = require('./util');


function img2LeafletTile ({inputFile, outputFolder, dimension = 256, shouldLog = false}) {
  // Config
  const logger = loggerConfig(shouldLog);

  const cropDimensionWidth = dimension;
  const cropDimensionHeight = dimension;
  // ./Config

  logger('Creating output folder.\n');
  fs.mkdirSync(outputFolder, {recursive: true});

  const paddedOutput = `${outputFolder}/padded.png`;

  let x = 0;
  let y = 0;

  let xLimit = 0;
  let yLimit = 0;

  const image = sharp(inputFile);

// Set limit
  const paddedImage = image.metadata().then((metadata) => {
    logger(`Input fileName: ${inputFile}`);
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
      background: {r: 0, g: 0, b: 0, alpha: 0}
    })
  });

  paddedImage.then((image) => image.toFile(paddedOutput)).then((_) => {
    const newImage = sharp(paddedOutput);

    logger('\n');
    logger('Total row: ' + xLimit / cropDimensionWidth);
    logger('Total col: ' + yLimit / cropDimensionHeight);

    let counter = 0;
    const pendingPromises = [];

    for (let a = 0; a < xLimit / cropDimensionWidth; a++) {
      for (let b = 0; b < yLimit / cropDimensionHeight; b++) {
        const folder = `${outputFolder}/0/${a}/`
        const filename = `${b}.png`;
        const output = folder + filename;

        fs.mkdirSync(folder, {recursive: true});
        x = a * cropDimensionWidth;
        y = b * cropDimensionHeight;
        ++counter;

        const m = newImage.extract({
          left: x,
          top: y,
          width: cropDimensionWidth,
          height: cropDimensionHeight
        }).toFile(output);

        pendingPromises.push(m);
      }
    }

    Promise.all(pendingPromises).then((_) => {
      logger('\n');

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
}

module.exports = img2LeafletTile;
