const fs = require('node:fs');
/** Regression adapter only: production loads native ES modules directly. */
function flattenSource() {
 const order=['dist/js/state/app-state.js',...JSON.parse(fs.readFileSync('tests/module-order.json','utf8'))];
 return order.map(file=>fs.readFileSync(file,'utf8').replace(/^import[\s\S]*?;\n/gm,'').replace(/^export /gm,'')).join('\n');
}
module.exports={flattenSource};
