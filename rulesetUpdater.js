const cpx = require('cpx');
const fs = require('fs');
const path = require('path');

let importPath = process.argv[2];
let destFolder = './rulesets';

if(!fs.existsSync(importPath)) {
    throw `Provided importPath of "${importPath}" doesn't exist!`;
}

const copyFileAtLocation = (srcBase, srcPath, srcFile, destFilePrefix, destPath) => {
    let fullSrc = path.join(srcBase, srcPath, srcFile);
    if(!fs.existsSync(fullSrc)) {
        throw `File ${fullSrc} doesn't exist!`;
    }
    let fullDestOrig = path.join(destPath, srcFile);
    let fullDest = path.join(destPath, `${destFilePrefix}${srcFile}`);
    cpx.copySync(fullSrc, destPath);
    fs.renameSync(fullDestOrig, fullDest);
    console.log(`Created ${fullDest}`);
};

copyFileAtLocation(importPath, 'user/mods/Piratez/Ruleset', 'Piratez.rul', '', destFolder);
copyFileAtLocation(importPath, 'user/mods/Piratez/Ruleset', 'Piratez_lang.rul', '', destFolder);
copyFileAtLocation(importPath, 'standard/xcom1', 'research.rul', 'xcom1.', destFolder);
copyFileAtLocation(importPath, 'standard/xcom1', 'manufacture.rul', 'xcom1.', destFolder);
copyFileAtLocation(importPath, 'standard/xcom1', 'facilities.rul', 'xcom1.', destFolder);
copyFileAtLocation(importPath, 'standard/xcom1', 'items.rul', 'xcom1.', destFolder);
copyFileAtLocation(importPath, 'standard/xcom1/Language', 'en-US.yml', 'xcom1.', destFolder);
