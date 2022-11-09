import path from 'path';

export function findFilesSync(startPath, reg) {
  let result = [];

  function finder(_path) {
    let files = fs.readdirSync(_path);

    files.forEach((val, index) => {
      let fPath = path.join(_path, val);
      let stats = fs.statSync(fPath);

      if (stats.isDirectory()) finder(fPath);

      if (stats.isFile()) {
        result.push(fPath);
      }
    });
  }

  finder(startPath);
  return result;
}

export function resolve(url) {
  return path.resolve(__dirname, url);
}

export const options = {
  encoding: 'utf8',
};
