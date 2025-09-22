@echo off
npm run build:h5&&cd docs&&npx cross-env NODE_ENV=production webpack --config build/webpack.doc.prd.js
xcopy dist\h5 docs\dist /s
echo 'copy is complete'
pause
