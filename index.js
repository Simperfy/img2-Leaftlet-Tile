const sharp = require('sharp');
const fs = require('fs');
const { loggerConfig } = require('./util');


async function img2LeafletTile ({inputFile, outputFolder, zoomLevels = [], shouldLog = false}) {
  if (zoomLevels.length <= 0) throw new Error('Please provide zoomLevels array');

  const logger = loggerConfig(shouldLog);

  for (const zoomLevel of zoomLevels) {
    const dimension = zoomLevel[1];

    const cropDimensionWidth = dimension;
    const cropDimensionHeight = dimension;

    let x = 0;
    let y = 0;
    const z = zoomLevel[0];

    let xLimit = 0;
    let yLimit = 0;

    logger('Creating output folder.\n');
    fs.mkdirSync(outputFolder, {recursive: true});

    const paddedOutput = `${outputFolder}/padded_${z}.png`;

    let image = sharp(inputFile);

  // Set limit
    const metadata = await image.metadata();
    logger(`Input fileName: ${inputFile}`);
    logger(`Input dimension: ${metadata.width} x ${metadata.height}`);
    const padX = getPadding(metadata.width, cropDimensionWidth);
    const padY = getPadding(metadata.height, cropDimensionHeight);

    logger("Crop Dimension: ", dimension);
    logger("added X padding: ", padX);
    logger("added Y padding: ", padY);
    xLimit = metadata.width + padX;
    yLimit = metadata.height + padY;

    logger(`New dimension: ${xLimit} x ${yLimit}`);

    const paddedImage = image.extend({
        top: 0,
        left: 0,
        right: padX,
        bottom: padY,
        background: {r: 0, g: 0, b: 0, alpha: 0}
      });

    image = await paddedImage.toFile(paddedOutput);

    const newImage = sharp(paddedOutput);
    const pendingPromises = [];

    logger('\n');
    logger('Total row: ' + xLimit / cropDimensionWidth);
    logger('Total col: ' + yLimit / cropDimensionHeight);

    let counter = 0;

    for (let a = 0; a < xLimit / cropDimensionWidth; a++) {
      for (let b = 0; b < yLimit / cropDimensionHeight; b++) {
        const folder = `${outputFolder}/${z}/${a}/`
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

    await removePaddedFile(pendingPromises, paddedOutput, counter);
  }


  async function removePaddedFile(pendingPromises, paddedOutput, counter) {
    Promise.all(pendingPromises).then((_) => {
      logger('\n');

      fs.unlink(paddedOutput, (err) => {
        if (err) throw err;
        logger('Cleaning up files.');
      });

      logger(`Generated ${counter} files.`);

      return true;
    });
  }

  function getPadding(dimension, cropDimension) {
    if (dimension % cropDimension === 0) return 0

    return cropDimension - (dimension % cropDimension);
  }
}

module.exports = img2LeafletTile;
