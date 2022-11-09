#!/usr/bin/env zx

const options = {
  encoding: 'utf8',
};
const content = fs.readFileSync(path.resolve(__dirname, '../persona/text/恶魔.txt'), options);

const markdownContent = content
  .replace(/DLC[^\S\r\n]+/g, 'DLC,')
  .replace(/\n\s*\n/g, '\n')
  .replace(/[^\S\r\n]{2}(\S)/g, ',$1')
  .replace(/\s*\n,/g, ',')
  .replace(/([^\S\r\n]\S+?),/g, '$1|')

  .replace(/[^\S\r\n]+/g, '|')
  // .replace(/([^\|])\n/g, '|\n|')
  .replace(/^([^\|\s])/gm, '|$1')
  .replace(/([^\||\s])$/gm, '$1|')
  .replace(/\|$/m, '|技能|\n|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|');

await fs.writeFile(path.resolve(__dirname, '../docs/恶魔.md'), markdownContent, options);

const personsStr = markdownContent.split(/\r?\n/).filter(o => o).map(o => o.replace(/^\|(.*)\|$/, '$1')).splice(2);
// |LV|名称|技能（习得等级）|特性|物|枪|火|冰|电|风|念|核|祝|咒|电刑|警报电刑|装备类型|技能|
const keys = 'level name firstSkill characteristic |物|枪|火|冰|电|风|念|核|祝|咒| electrocute alarmlectrocute equip otherSkills'.split(/[\s\|]+/);
const personas = personsStr.reduce((_personas, cur) => {
  const person = cur.split('|').reduce((map, o, index) => {
    map[keys[index]] = o;
    return map;
  }, {});
  _personas.skills = person.otherSkills.split(',');
  _personas.skills.unshift(person.firstSkill);
  _personas.push(person);
  return _personas;
}, [])

await fs.writeFile(path.resolve(__dirname, '../persona/json/恶魔.json'), JSON.stringify(personas), options);
