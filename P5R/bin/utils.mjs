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

export function getPersonaContent(info, template, keys) {
  let content = template;
  [...keys, 'skills'].forEach((k) => {
    content = content.replaceAll(
      `{${k}}`,
      Array.isArray(info[k]) ? info[k].join(', ') : info[k] ?? '-',
    );
  });
  return content + '\n';
}

export const personaPath = `/personas/{group}#{name}`;
export const skillPath = `/skills/{group}#{name}`;
export const attributePath = `/特性#{name}`;

export function obj2Array(obj) {
  const result = [];
  for (const k in obj) {
    result.push(obj[k]);
  }
  return result;
}

export function createReg(k) {
  const regCn = `[^\\u4e00-\\u9fa5]`;
  return new RegExp(`(${regCn})${k}(${regCn})|^${k}(${regCn})|(${regCn})${k}$|^${k}$`, 'gm');
}
