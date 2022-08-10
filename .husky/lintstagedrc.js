module.exports = {
  'src/**/*.{js,jsx,ts,tsx}': ['eslint --fix'],
  '{!(package)*.json,*.code-snippets,.!(browserslist)*rc}': ['prettier --write--parser json'],
  'package.json': ['prettier --write'],
  '*.{scss,less,styl,html}': [/*'stylelint --fix',*/ 'prettier --write'],
  '*.md': ['prettier --write'],
}
