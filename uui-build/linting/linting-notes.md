### Checking for issues

Use ```yarn eslint``` and ```yarn stylelint``` tasks to check for issues. <br>
>Note: <br>
Rules mentioned in "uui-build/linting/utils/rulesToBeFixed.js" aren't checked in certain cases. This is done by purpose, 
so that we have opportunity to fix such rules iteratively.

| Rules checked                                         | Use cases                                                                     |
|:------------------------------------------------------|:------------------------------------------------------------------------------|
| All                                                   | <ul><li>eslint/stylelint yarn tasks (not in CI)</li><li>in IDE</li></ul>      |
| Partially<br/>(except rules from "rulesToBeFixed.js") | <ul><li>eslint/stylelint yarn tasks (in CI)</li><li>pre-commit hook</li></ul> |
 
### Fixing "rulesToBeFixed.js"
- Remove the rule from "rulesToBeFixed.js"
- Run the corresponding ```yarn``` task. The report will be generated under "./.reports"
- Review the report - find all files with issues related to this rule
- Fix the issues



