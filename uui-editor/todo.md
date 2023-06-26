## TODO

Plate issues to create:
- Move to plate email links validation `uui-editor/src/plate/plugins/linkPlugin/isUrl.ts`
- Allow pasting links as url into highlighted text, but not replacing that text with text link.
- Create issue about copying table which has empty cells from Microsoft Excel. The problem here `packages/core/src/plugins/html-deserializer/utils/cleanHtmlEmptyElements.ts`. `ALLOWED_EMPTY_ELEMENTS` should be extended with `TD` and `TH` on plate side.  [Video](https://epam-my.sharepoint.com/personal/natallia_alieva_epam_com/_layouts/15/stream.aspx?id=%2Fpersonal%2Fnatallia%5Falieva%5Fepam%5Fcom%2FDocuments%2FMicrosoft%20Teams%20Chat%20Files%2F2023%2D04%2D11%5F11h58%5F43%2Emp4)

```
const ALLOWED_EMPTY_ELEMENTS = ['BR', 'IMG'];
```
- Move to plate single table cell copy | cup operation. It should be pasted as a text.
- Fix pasting tables from Word in Safari only. Root cause in `cleanDocx.ts`, `copyBlockMarksToSpanChild()` function.
- Create issue about copying unordered lists from Word. Each item wrapped inside paragraph node after pasting. Ordered lists works as expected.
- Create issue about displaying merged cells correctly. Basically, blue resize borders broken.
- Squeezing viewport does not updates caption width of an image. Solution: `figcaption { max-width: 100%; }`
- Toggle between todo and list elements
- Header style when pasting from word.
- Create issue about cells selection highlighting. Sometimes there is wrong cells selection. [Video](https://epam-my.sharepoint.com/:v:/p/dzmitry_tamashevich/Ec4ZOs-rATZHjFYZWVxjczEB649FCoYFKDV_x3RxZiWAGA?e=4hswgA)
- Improve column removal if there is merged cells in the column. They should be divided or squeezed depending on particular case. [Video](https://epam-my.sharepoint.com/:v:/p/dzmitry_tamashevich/ESEWq--1q6dJl6AsQQChH-YB1_TtKjJtpW_W3kRhlpFZdw)
- Division of merged cell should works correctly. [Video](https://epam-my.sharepoint.com/personal/natallia_alieva_epam_com/_layouts/15/stream.aspx?id=%2Fpersonal%2Fnatallia%5Falieva%5Fepam%5Fcom%2FDocuments%2FMicrosoft%20Teams%20Chat%20Files%2F2023%2D05%2D20%5F22h45%5F45%2Emp4&ga=1)
- Create issue about resizing merged cells `uui-editor/src/plate/plugins/tablePlugin/Resizable.tsx`. [Video](https://epam-my.sharepoint.com/personal/dzmitry_tamashevich_epam_com/_layouts/15/stream.aspx?id=%2Fpersonal%2Fdzmitry%5Ftamashevich%5Fepam%5Fcom%2FDocuments%2FMicrosoft%20Teams%20Chat%20Files%2FScreen%20Recording%202023%2D05%2D19%20at%2018%2E42%2E38%2Emov&referrer=Teams%2ETEAMS%2DELECTRON&referrerScenario=p2p%5Fns%2Dbim&ga=1)
- Create issue to improve list plugin. Now it causes bug with separator. [Video](https://epam-my.sharepoint.com/:v:/r/personal/natallia_alieva_epam_com/Documents/Microsoft%20Teams%20Chat%20Files/2023-02-08_12h08_43.mp4?csf=1&web=1&e=wT5iVq). Investigation here
[https://github.com/epam/UUI/pull/1366](https://github.com/epam/UUI/pull/1366)
- Add vertical cell division