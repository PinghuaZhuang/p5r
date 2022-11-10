#!/usr/bin/env zx
import { options, resolve } from './utils.mjs';

const allSkillsContent = fs.readFileSync(resolve('../skills/全部.md'), options);

const allSkillsArr = allSkillsContent
  .split(/\r?\n/)
  .filter((o) => o)
  .map((o) => o.replace(/^\|(.*)\|$/, '$1'))
  .splice(2);

// | 中文名 | 属性 | 消耗 | 简介 | 获取 | 技能卡 | 备注 | 编号 |
const keys = 'name attribute deplete des get skillCard remark no'.split(/[\s\|]+/);

const allSkills = allSkillsArr.reduce((skills, cur) => {
  const skill = cur.split('|').reduce((map, o, index) => {
    map[keys[index]] = o.trim();
    return map;
  }, {});
  skills.push(skill);
  return skills;
}, []);

await fs.writeFile(resolve(`../../public/skills.json`), JSON.stringify(allSkills), options);

console.log(`parse skills success.`);
