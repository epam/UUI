### Checking for issues

Use ```yarn eslint``` and ```yarn stylelint``` tasks to check for issues. <br>
Notes: 
- In CI, not all rules will be checked. It ignores rules mentioned in "uui-build/linting/utils/rulesToBeFixed.js". This is done by purpose, so that we have opportunity to fix certain rules iteratively.
- Locally, all rules will be checked. Report will be created at ".reports/eslint.html" and ".reports/stylelint.html"
- In IDE, all rules will be highlighted.

