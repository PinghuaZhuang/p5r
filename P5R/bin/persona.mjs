#!/usr/bin/env zx
import { findFilesSync, resolve, options } from './utils.mjs';

let id = 0;

async function toJson(fileUrl) {
  const content = fs.readFileSync(fileUrl, options);

  // 装换为 markdown 表格数据
  const markdownContent = content
    .replace(/DLC[^\S\r\n]+/g, 'DLC,')
    .replace(/\n\s*\n/g, '\n')
    .replace(/[^\S\r\n]{2}(\S)/g, ',$1')
    .replace(/\s*\n,/g, ',')
    .replace(/([^\S\r\n]\S+?),/g, '$1|')
    .replace(/[^\S\r\n]+/g, '|')
    .replace(/^([^\|\s])/gm, '|$1')
    .replace(/([^\||\s])$/gm, '$1|')
    .replace(/\|$/m, '|技能|\n|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|');

  await fs.writeFile(resolve('../docs/恶魔.md'), markdownContent, options);

  // 装换为 json 数据
  const personasStr = markdownContent
    .split(/\r?\n/)
    .filter((o) => o)
    .map((o) => o.replace(/^\|(.*)\|$/, '$1'))
    .splice(2);
  // |LV|名称|技能（习得等级）|特性|物|枪|火|冰|电|风|念|核|祝|咒|电刑|警报电刑|装备类型|技能|
  const keys =
    'level name firstSkill characteristic |物|枪|火|冰|电|风|念|核|祝|咒| electrocute alarmlectrocute equipType otherSkills'.split(
      /[\s\|]+/,
    );
  const personas = personasStr.reduce((_personas, cur) => {
    const persona = cur.split('|').reduce((map, o, index) => {
      map[keys[index]] = o;
      return map;
    }, {});
    persona.skills = persona.otherSkills?.split(',') ?? [];
    persona.skills.unshift(persona.firstSkill);
    persona.id = id++;
    _personas.push(persona);
    return _personas;
  }, []);

  await fs.writeFile(
    resolve(`../../public/personaInfo/${path.basename(fileUrl, path.extname(fileUrl))}.json`),
    JSON.stringify(personas),
    options,
  );
}

await Promise.all(
  findFilesSync(resolve('../persona/text')).map(async (file) => {
    await toJson(file);
    console.log(`parse ${path.basename(file)} success.`);
  }),
);
