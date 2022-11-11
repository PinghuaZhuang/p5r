#!/usr/bin/env zx
import {
  options,
  createReg,
  personaPath,
  resolve,
  skillPath,
} from './utils.mjs';

const personasJson = fs.readFileSync(
  resolve('../../public/personaInfo/personas.json'),
  options,
);
const personasMap = JSON.parse(personasJson);
const skillsJson = fs.readFileSync(
  resolve('../../public/skills.json'),
  options,
);
const skills = JSON.parse(skillsJson);

let geminiMd = fs.readFileSync(
  resolve('../../docs/Rank/力量-双子.md.orgin'),
  options,
);

// 替换成锚点
for (const k in personasMap) {
  const persona = personasMap[k];
  geminiMd = geminiMd.replace(
    new RegExp(k, 'g'),
    `[${k}](${personaPath
      .replace(`{name}`, persona.name)
      .replace(`{group}`, persona.group)})`,
  );
}

for (const k in skills) {
  const skill = skills[k];
  if (skill.name === '赛') continue;
  geminiMd = geminiMd.replace(
    new RegExp(skill.name, 'g'),
    `[${skill.name}](${skillPath
      .replace(`{name}`, skill.name)
      .replace(`{group}`, skill.attribute)})`,
  );
}

await fs.writeFile(resolve('../../docs/Rank/力量-双子.md'), geminiMd, options);
