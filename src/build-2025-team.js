/* eslint-disable */
const fs   = require('fs');
const path = require('path');
const csv  = require('csv-parser');       // npm i csv-parser

const results = [];
const imgDir  = 'public/images/2025';     // 头像相对 public 的目录
const outFile = 'src/data/team-2025.json';

// 1. 读 CSV
fs.createReadStream('members.csv')
  .pipe(csv())
  .on('data', (row) => results.push(row))
  .on('end', () => {
    // 2. 按部门聚合
    const deptMap = {};
    results.forEach(r => {
      const dept = r['你所属的部门是？（必填）'];
      const name = r['你的名字是？（必填）'];
      const quote = r['你的寄语or简介？（必填）'];
      // 头像文件名 = 最后一列“提交者”对应图片文件
      const rawPhoto = r['请上传你的照片（必填）'] || '';
      const avatarFile = rawPhoto.split('_')[0] || '';
      // 在 images/2025 里找匹配文件
      const files = fs.readdirSync(imgDir);
      const target = files.find(f => f.startsWith(r['提交者（自动）']));
      const avatar = target ? `/images/2025/${target}` : '/images/placeholder.png';

      if (!deptMap[dept]) deptMap[dept] = [];
      deptMap[dept].push({ name, quote, avatar });
    });

    // 3. 组装符合 data.js 的结构
    const structure = {
      year: '2025',
      departments: Object.entries(deptMap).map(([name, members]) => ({ name, members }))
    };

    // 4. 写 JSON
    fs.writeFileSync(outFile, JSON.stringify(structure, null, 2));
    console.log(`✅ 已生成 ${outFile}`);
  });