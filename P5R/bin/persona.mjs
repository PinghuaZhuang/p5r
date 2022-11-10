#!/usr/bin/env zx
import { findFilesSync, resolve, options } from './utils.mjs';

let id = 0;

const allPersona = {};

const personaTemplate = fs.readFileSync(resolve('../template/personas.md'), options);

// |LV|名称|技能（习得等级）|特性|物|枪|火|冰|电|风|念|核|祝|咒|电刑|警报电刑|装备类型|技能|
const keys =
'level name firstSkill characteristic |物|枪|火|冰|电|风|念|核|祝|咒| electrocute alarmlectrocute equipType otherSkills'.split(
  /[\s\|]+/,
);

async function toJson(fileUrl) {
  const content = fs.readFileSync(fileUrl, options);
  const group = path.basename(fileUrl, path.extname(fileUrl));

  // 装换为 markdown 表格数据
  const markdownContent = content
    .replace(/DLC\s+/g, 'DLC,')
    .replace(/\n\s*\n/g, '\n')
    .replace(/[^\S\r\n]{2}(\S)/g, ',$1')
    .replace(/\s*\n,/g, ',')
    .replace(/([^\S\r\n]\S+?),/g, '$1|')
    .replace(/[^\S\r\n]+/g, '|')
    .replace(/^([^\|\s])/gm, '|$1')
    .replace(/\s*\|DLC\|/gm, '|DLC,')
    .replace(/([^\||\s])$/gm, '$1|')
    .replace(/\|$/m, '|技能|\n|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|');

  // await fs.writeFile(resolve(`../docs/${path.basename(fileUrl, path.extname(fileUrl))}.md`), markdownContent, options);

  // 装换为 json 数据
  const personasStr = markdownContent
    .split(/\r?\n/)
    .filter((o) => o)
    .map((o) => o.replace(/^\|(.*)\|$/, '$1'))
    .splice(2);
  const personas = personasStr.reduce((_personas, cur) => {
    const persona = cur.split('|').reduce((map, o, index) => {
      map[keys[index]] = o.trim();
      return map;
    }, {});
    persona.skills = persona.otherSkills?.split(',') ?? [];
    persona.skills.unshift(persona.firstSkill);
    persona.id = id++;
    persona.group = group;

    if (persona.name == null) {
      console.warn(`有面具的数据错误.`);
    }
    if (allPersona[persona.name]) {
      console.warn(`有面具重复. ${persona.name} ${fileUrl}`);
    }
    allPersona[persona.name] = persona;
    // allPersona[persona.id] = persona;
    _personas.push(persona);
    return _personas;
  }, []);

  await fs.writeFile(resolve(`../../public/personaInfo/${group}.json`), JSON.stringify(personas), options);

  return {
    group,
    personas,
  };
}

await Promise.all(
  findFilesSync(resolve('../persona/text')).map(async (file) => {
    const { group, personas } = await toJson(file);
    console.log(`parse ${path.basename(file)} success.`, group, personas.map(o => o.name).join(','));

    const dir = resolve(`../../src/docs/personas`);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }

    // 按照类型生成 md
    await fs.writeFile(path.join(dir, `${group}.md`), `---
title: ${group}
group:
  title: personas
  order: 0
---

${personas.reduce((result, cur) => result + getPersonaContent(cur), '')}
    `);
  }),
);

await fs.writeFile(resolve(`../../public/personaInfo/personas.json`), JSON.stringify(allPersona), options);

function getPersonaContent(info) {
  let content = personaTemplate;
  [...keys, 'skills'].forEach((k) => {
    content = content.replaceAll(`{${k}}`, info[k] ?? '-');
  });
  return content + '\n';
}
