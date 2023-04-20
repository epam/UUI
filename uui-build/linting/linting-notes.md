### Checking for issues

Use ```yarn eslint``` and ```yarn stylelint``` tasks to check for issues. <br>
>Note: <br>
Rules mentioned in "uui-build/linting/utils/rulesToBeFixed.js" aren't checked in certain cases. This is done by purpose, 
so that we have opportunity to fix such rules iteratively.

| Which rules are checked                                | Use cases                                                                              |
|:-------------------------------------------------------|:---------------------------------------------------------------------------------------|
| All                                                    | <ul><li>yarn tasks (not in CI)</li><li>IDE</li></ul>                                   |
| Partially<br/>(except rules from "rulesToBeFixed.js")  | <ul><li>yarn tasks (in CI)</li><li>pre-commit hook</li><li>Local Dev server</li></ul>  |
 
### How to fix issue from "rulesToBeFixed.js"
- Remove the rule from "rulesToBeFixed.js"
- Run the corresponding ```yarn``` task. The report should be generated under "./.reports"
- Review the report - find all files with issues related to this rule
- Fix the issues



