## TODO

- Fix copying unordered lists from Word. Each item wrapped inside paragraph node after pasting. Ordered lists works as expected.

Plate PRs:
- [x] Move email links validation to plate. Then remove `uui-editor/src/plate/plugins/linkPlugin/isUrl.ts`. https://github.com/udecode/plate/pull/2444
- [x] Fix caption width. Then update `uui-editor/src/plate/plugins/imagePlugin/ImageBlock.module.scss`. https://github.com/udecode/plate/pull/2448
- [x] Allow pasting links as url into highlighted text. Then update `uui-editor/src/plate/plugins/linkPlugin/linkPlugin.tsx`. https://github.com/udecode/plate/pull/2453
- [x] Create issue about copying table which has empty cells from Microsoft Excel. Then remove `uui-editor/src/plate/plugins/deserializeDocxPlugin/cleanHtmlEmptyElements.ts`. [Video](https://epam-my.sharepoint.com/personal/natallia_alieva_epam_com/_layouts/15/stream.aspx?id=%2Fpersonal%2Fnatallia%5Falieva%5Fepam%5Fcom%2FDocuments%2FMicrosoft%20Teams%20Chat%20Files%2F2023%2D04%2D11%5F11h58%5F43%2Emp4). https://github.com/udecode/plate/pull/2454
- [x] Move to plate single table cell copy | cut operation. Then remove `uui-editor/src/plate/plugins/tablePlugin/withOurTable.ts`. https://github.com/udecode/plate/pull/2455
- [x] Fix pasting tables from Word in Safari only. Then update or remove `uui-editor/src/plugins/deserializeDocxPlugin/cleanDocx.ts`. https://github.com/udecode/plate/pull/2458
- [x] Header style when pasting from word. https://github.com/udecode/plate/pull/2536
- [ ] Toggle between todo and list elements. https://github.com/udecode/plate/issues/2466
- [x] Create issue to improve removal last element in editor. [Video](https://epam-my.sharepoint.com/:v:/r/personal/natallia_alieva_epam_com/Documents/Microsoft%20Teams%20Chat%20Files/2023-02-08_12h08_43.mp4?csf=1&web=1&e=wT5iVq). Try to reproduce it on plate playground with our custom plugins. Investigation here
[https://github.com/epam/UUI/pull/1366](https://github.com/epam/UUI/pull/1366). Fix here https://github.com/epam/UUI/pull/1530. If last element is image, it keeps empty h1, instead of empty paragraph. Remove this `uui-editor/src/plugins/listPlugin/withList.tsx`
- [ ] Create issue about not removing paragraph with createSelectOnBackspacePlugin
- Table Cells Merging
    - Create issue about displaying merged cells correctly. Basically, blue resize borders broken.
    - Create issue about resizing merged cells `uui-editor/src/plate/plugins/tablePlugin/Resizable.tsx`. [Video](https://epam-my.sharepoint.com/personal/dzmitry_tamashevich_epam_com/_layouts/15/stream.aspx?id=%2Fpersonal%2Fdzmitry%5Ftamashevich%5Fepam%5Fcom%2FDocuments%2FMicrosoft%20Teams%20Chat%20Files%2FScreen%20Recording%202023%2D05%2D19%20at%2018%2E42%2E38%2Emov&referrer=Teams%2ETEAMS%2DELECTRON&referrerScenario=p2p%5Fns%2Dbim&ga=1)
    - Create issue about cells selection highlighting. Sometimes there is wrong cells selection. [Video](https://epam-my.sharepoint.com/:v:/p/dzmitry_tamashevich/Ec4ZOs-rATZHjFYZWVxjczEB649FCoYFKDV_x3RxZiWAGA?e=4hswgA)
    - Improve column removal if there is merged cells in the column. They should be divided or squeezed depending on particular case. [Video](https://epam-my.sharepoint.com/:v:/p/dzmitry_tamashevich/ESEWq--1q6dJl6AsQQChH-YB1_TtKjJtpW_W3kRhlpFZdw)
    - Division of merged cell should works correctly. [Video](https://epam-my.sharepoint.com/personal/natallia_alieva_epam_com/_layouts/15/stream.aspx?id=%2Fpersonal%2Fnatallia%5Falieva%5Fepam%5Fcom%2FDocuments%2FMicrosoft%20Teams%20Chat%20Files%2F2023%2D05%2D20%5F22h45%5F45%2Emp4&ga=1)
    - Add vertical cell division
