const fs=require('fs'),path=require('path'),cp=require('child_process');
function walk(p){return fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(p,e.name)):[path.join(p,e.name)])}
for(const f of walk('dist').filter(f=>f.endsWith('.js'))){cp.execFileSync(process.execPath,['--check',f]);for(const m of fs.readFileSync(f,'utf8').matchAll(/from\s+["']([^"']+)["']/g))if(!fs.existsSync(path.resolve(path.dirname(f),m[1])))throw Error('Missing import '+m[1])}console.log('PASS syntax and module paths');
