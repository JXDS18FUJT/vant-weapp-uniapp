const fs = require('fs-extra')
const path = require('path')
const { exec } = require("child_process");

// 封装成 Promise，方便 await
function runCmd(cmd, cwd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd, shell: true }, (error, stdout, stderr) => {
      if (error) return reject(error);
      if (stderr) return reject(stderr);
      resolve(stdout);
    });
  });
}

async function main() {
  try {
    const res1 = await runCmd("npm run build:h5");
    console.log("命令1输出:", res1);

    const res2 = await runCmd("npx cross-env NODE_ENV=production webpack --config doc/build/webpack.doc.prd.js");
    console.log("命令2输出:", res2);

    console.log("✅ 两个命令都完成，输出成功！");
  } catch (err) {
    console.error("❌ 出错了:", err);
  }
}

main();
