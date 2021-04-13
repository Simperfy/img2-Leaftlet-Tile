export default function img2LeafletTile({
  inputFile,
  outputFolder,
  zoomLevels = [],
  shouldLog = false,
}: {
  inputFile: string;
  outputFolder: string;
  zoomLevels: [number, number, number?][];
  shouldLog?: boolean;
}): Promise<void>;
