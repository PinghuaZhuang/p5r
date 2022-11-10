#!/usr/bin/env zx
import { options, resolve, getPersonaContent, personaPath } from './utils.mjs';

const allSkillsContent = fs.readFileSync(resolve('../skills/全部.md'), options);

const skillTemplate = fs.readFileSync(resolve('../template/skill.md'), options);

const personasJson = fs.readFileSync(
  resolve('../../public/personaInfo/personas.json'),
  options,
);
const personasMap = JSON.parse(personasJson);

// | 中文名 | 属性 | 消耗 | 简介 | 获取 | 技能卡 | 备注 | 编号 |
const keys = 'name attribute deplete des get skillCard remark no'.split(
  /[\s\|]+/,
);

const allSkillsArr = allSkillsContent
  .split(/\r?\n/)
  .filter((o) => o)
  .map((o) => o.replace(/^\|(.*)\|$/, '$1'))
  .splice(2);

const allSkills = allSkillsArr.reduce((skills, cur) => {
  const skill = cur.split('|').reduce((map, o, index) => {
    map[keys[index]] = o.trim();
    return map;
  }, {});
  skills.push(skill);
  return skills;
}, []);

await fs.writeFile(
  resolve(`../../public/skills.json`),
  JSON.stringify(allSkills),
  options,
);

console.log(`parse skills success.`);

let allSkillsMd = allSkills.reduce(
  (result, cur) => result + getPersonaContent(cur, skillTemplate, keys),
  '',
);

for (const k in personasMap) {
  const persona = personasMap[k];
  allSkillsMd = allSkillsMd.replace(
    new RegExp(`([^\\u4e00-\\u9fa5])${k}([^\\u4e00-\\u9fa5])`, 'g'),
    `$1[${k}](${personaPath
      .replace(`{name}`, persona.name)
      .replace(`{group}`, persona.group)})$2`,
  );
}

await fs.writeFile(
  resolve(`../../docs/全部技能.md`),
  `---
title: 全部技能
order: 1
---

${allSkillsMd}
`,
  options,
);

// const groups = [];

// allSkills.for
