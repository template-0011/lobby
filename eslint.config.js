import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ["dist","**/dist/**","node_modules","**/node_modules/**","public","**/public/**",".husky","**/.husky/**",".vscode","**/.vscode/**",".idea","**/.idea/**","*.sh","**/*.sh/**","*.md","**/*.md/**","src/assets","src/assets/**",".eslintrc.cjs","**/.eslintrc.cjs/**",".prettierrc.cjs","**/.prettierrc.cjs/**",".stylelintrc.cjs","**/.stylelintrc.cjs/**"],
  formatters: true,
  unocss: true,
})
