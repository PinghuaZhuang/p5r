#!/usr/bin/env zx
import {
  options,
  resolve,
  getPersonaContent,
  personaPath,
  obj2Array,
  createReg,
} from './utils.mjs';

const allSkillsContent = fs.readFileSync(resolve('../skills/全部.md'), options);

const skillTemplate = fs.readFileSync(resolve('../template/skill.md'), options);
const attributeTemplate = fs.readFileSync(
  resolve('../template/attribute.md'),
  options,
);

const personasJson = fs.readFileSync(
  resolve('../../public/personaInfo/personas.json'),
  options,
);
const personasMap = JSON.parse(personasJson);

// | 中文名 | 属性 | 消耗 | 简介 | 获取 | 技能卡 | 备注 | 编号 |
const keys = 'name attribute deplete des get skillCard remark no'.split(
  /[\s\|]+/,
);

/* 生成 JSON */
/* ================================================= */
const allSkillsArr = allSkillsContent
  .split(/\r?\n/)
  .filter((o) => o)
  .map((o) => o.replace(/^\|(.*)\|$/, '$1'))
  .splice(2);

const datas = allSkillsArr.reduce((skills, cur) => {
  const skill = cur.split('|').reduce((map, o, index) => {
    map[keys[index]] = o.trim();
    return map;
  }, {});

  // 替换成锚点
  for (const k in personasMap) {
    const persona = personasMap[k];
    ['get', 'skillCard'].forEach((o) => {
      skill[o] = skill[o].replace(
        createReg(k),
        `$1$4[${k}](${personaPath
          .replace(`{name}`, persona.name)
          .replace(`{group}`, persona.group)})$2$3`,
      );
      if (typeof skill[o] !== 'string') {
        console.log(skill);
      }
    });
  }

  skills.push(skill);
  return skills;
}, []);

const allSkills = datas.filter((o) => o.attribute !== '特性');
const allAttribute = datas.filter((o) => o.attribute === '特性');

await fs.writeFile(
  resolve(`../../public/skills.json`),
  JSON.stringify(allSkills),
  options,
);
await fs.writeFile(
  resolve(`../../public/attribute.json`),
  JSON.stringify(allAttribute),
  options,
);
console.log(`parse skills success.`);

/* 面具 => 锚点 */
/* ================================================= */
let allSkillsMd = allSkills.reduce(
  (result, cur) => result + getPersonaContent(cur, skillTemplate, keys),
  '',
);

/* 全部技能.md */
/* ================================================= */
await fs.writeFile(
  resolve(`../../docs/全部技能.md`),
  `---
title: 全部技能
order: 1
---

# 全部技能

${allSkillsMd}
`,
  options,
);

/* 技能分组 */
/* ================================================= */
const groupMap = {};
allSkills.forEach((skill) => {
  const groupName = skill.attribute;
  if (groupMap[groupName] == null) {
    groupMap[groupName] = [];
    groupMap[groupName].groupName = groupName;
  }
  groupMap[groupName].push(skill);
});

await Promise.all(
  obj2Array(groupMap).map(async (group) => {
    const dir = resolve(`../../docs/skills`);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    return await fs.writeFile(
      path.join(dir, `${group.groupName}.md`),
      `# ${group.groupName}

${group.reduce(
  (result, cur) => result + getPersonaContent(cur, skillTemplate, keys),
  '',
)}`,
    );
  }),
);

/* 特性 */
/* ================================================= */
let attributeMd = allAttribute.reduce(
  (result, cur) => result + getPersonaContent(cur, attributeTemplate, keys),
  '',
);

await fs.writeFile(
  resolve(`../../docs/特性.md`),
  `---
title: 特性
order: 2
---

# 特性

${attributeMd}`,
);
