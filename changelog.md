# 6.x.x - xx.xx.2025
**What's New**
* [MainMenu][Breaking Change]: converted to a functional component, removed `children` support, use `items` prop only, removed outdated customer logo(`customerLogoUrl`, `customerLogoLink`, `customerLogoHref`, `customerLogoBgColor`) and `isTransparent` props. Removed `Burger`, `renderBurger` prop, use `Burger` component instead. Removed `alwaysShowBurger` prop, use `Burger` component in items with `collapsedContainer: true/false` option. Removed `appLogoUrl`, `logoLink`, `onLogoClick` prop, use `MainMenuLogo` component instead. Removed `MainMenuDropdown` prop, use `MainMenuDropdown` as a component for 'More' container in items, see example [here](https://uui.epam.com/documents?id=mainMenu&mode=doc&category=components&theme=loveship#examples-mainMenu-Responsive)
    
  ```tsx
  // before
  
    <MainMenu
       cx={ css.menuContainer }
       renderBurger={ renderBurger }
       logoLink={ { pathname: '/' } }
       appLogoUrl="/static/logo.svg"
       onLogoClick={ onLogoClick }
    >
        <MainMenuButton caption="Home" />
    </MainMenu>
  
  // after
  
    <MainMenu
        cx={ css.menuContainer }
        items={ [
            {
                id: 'burger',
                priority: 100,
                collapsedContainer: true,
                render: (p) => <Burger key={ p.id } renderBurgerContent={ renderBurger } logoUrl="/static/logo.svg" />,
            },
            {
                id: 'logo',
                priority: 99,
                render: (p) => <MainMenuLogo key={ p.id } link={ { pathname: '/' } } onClick={ onLogoClick } logoUrl="/static/logo.svg"  />,
            },
            {
                id: 'home',
                render: (p) => <MainMenuButton key={ p.id } caption="Home" />,
                priority: 1,
            },
        ] }
    />
  ```


# 6.1.4 - 17.06.2025
**What's Fixed**
* [@epam/uui-test-utils]: fixed various of utils to work with React 18
* [PickerModal]: fixed `disableClear: true` behavior for `selectionMode: multi`, added `Clear` button functionality to `selectionMode: single`
* [PickerInput]: decreased default `maxItems` prop value from 100 to 20
* [PickerInput] Stop "Escape" key press event propagation when body is opened ([#2839](https://github.com/epam/UUI/pull/2839))
* [useLazyTree]: fixed tree structure update when getParentId function changes. When filter changes trigger tree refetch and affect getParentId logic (e.g., changing groupBy parameter), the tree now correctly clears its structure with updated hierarchy parameters instead of using stale getParentId function.
* [TreeState]: added optional `newParams` parameter to `clearStructure()` method to support updating tree parameters during structure clearing


# 6.1.2 - 30.05.2025

**What's Fixed**
* [MultiSwitch]: fixed `size` prop for 'Loveship' and 'Electric' skins

# 6.1.1 - 29.05.2025

**What's New**
* [uui-test-utils]: added global mock for "getBoundingClientRect" to "setupJsDom"
* [FiltersPanel]: added `renderFooter` prop for `DatePicker` and `RangeDatePicker` filters. Exported default implementation of UUI footers - `FilterDatePickerBodyFooter` and `FilterRangeDatePickerBodyFooter` components
* [DataTable]: added predicates functionality for column filters

**What's Fixed**
* [RangeDatePicker]: fixed switching of the calendar depending on which field(From/To) the action was on
* [RangeDatePicker]: immediately apply date entered in input if it is valid
* [PickerInput]: fixed returning to the previous focused element via shift+tab press
* [PickerInput]: fixed row focusing on search results
* [Rating]: fixed wrong rating calculations in 'block' container and 'sticky' value on hover
* [Modals]: change border radius to 12px in Electric theme
* [VerticalTabButton]: aligned paddings and gaps for all sizes according to the design
* [uuiApi]: .withOptions method now merges his options with default option from apiDefinitions
* [PickerModal]: disabled "Show only selected" when search is active
* [DataTable]: increased DnD area for rows, updated drag-and-drop styles for improved user experience
* [DnDContext]: fixed cursor visualization during drag and drop operations
* [NotificationCard]: added gap between content and actions
* [DataPickerFooter]: added gap between switch and action
* [ModalBlocker]: fixed stale closure in abort function when it is called on "Escape" key's press
* [IEditableDebouncer]: fixed `ref` forwarding, `ref` provided on the component forwarded to the `render` prop as a second param


# 6.1.0 - 08.05.2025

**What's New**
* Removed `react-test-renderer` deps from '@epam/uui-test-utils' package, since it crashes with React 18 and lower. If you are import 'renderer' from '@epam/uui-test-utils', replace it to the direct import from 'react-test-renderer' package.
* [DatePicker]: added `preventEmpty` prop to prevent picker form being empty. See example [here](https://uui.epam.com/documents?id=datePicker&mode=doc&category=components#examples-datePicker-PreventEmpty)
* [RangeDatePicker]:
  * added `preventEmptyFromDate` and `preventEmptyToDate` props to prevent the RangeDatePicker from having an empty 'from' or 'to' date. See example [here](https://uui.epam.com/documents?id=rangeDatePicker&mode=doc&category=components#examples-rangeDatePicker-PreventEmpty)
  * `RangeDatePickerValue` interface was moved to the @epam/uui-core package
* [AsyncDataSource]: added caching functionality, allowing two or more Views to reuse the same data.
* [MainMenu]: added `white` color for Loveship and Electric themes. It can be configured via `color` prop with `white` and `dark` value,  the `dark` is used by default.

**What's Fixed**
* [uuiContext]: Return `UuiContext.Provider` instead of new React 19 simple `UuiContext` usage, to fix compatibility with React 17
* [useForm]: fixed router blocking if `beforeLeave` props returned `false`. Previously router was blocked and immediately unblocked on any redirect, but we shouldn't block in at all in this case.
* [PickerInput]: fixed bug when selected item was applied value to the search after arrow keyboard navigation
* [NumericInput]: fixed `value` text color for `readonly` state
* [DatePicker]: removed focus from day/month/year item when user navigate to it by mouse

# 6.0.0 - 23.04.2025

**What's New**
* React 19 support:
    * UUI is now compatible with React 19. UUI site was reworked to work with React 19.
    * UUI packages still backward compatible with React 18
    * UUI templates updated to use React 19
    * @epam/uui-test-utils reworked to not use deprecated 'react-test-renderer', now we use '@testing-library/react' instead. It will cause different snapshots results via renderSnapshotWithContextAsync helper, so please update them.
* Introduced sizes and icons theming. This is essential for external customers support, as it allows them to use their own sizes and icons.
  * Be aware — API in the Beta stage, not stable, and might be changed in future versions, please don't rely on it without a critical necessity.
  * Sizes and styles of current EPAM themes(Loveship, Promo, Electric) remained the same. There are no changes required from your side.
* Updated icon pack: moon(outline/fill), sun(outline/fill), fcd (outline) icons were added
* [Dropdown]: reworked to FC, migrated from "react-popper" to "floating-ui/react"
  * [Breaking Change]: prop `modifiers` changed to `middleware` according to new "floating-ui" api, for more info see [docs](https://floating-ui.com/docs/migration#configure-middleware)
    ```
    // old
    <Dropdown
      modifiers={ [
        {
            name: 'offset',
            options: {
                offset: [10, 10]
            }
        }
      ] }
    >
    // new
    <Dropdown
      middleware={ [offset(10)] }
    >
    ```
  * added support for virtual elements, you can define them via `virtualTarget` prop
* [Tooltip]: reworked to FC, migrated from "react-popper" to "floating-ui/react"
  * [Breaking Change]: prop `modifiers` changed to `middleware` according to new "floating-ui" api, for more info see [docs](https://floating-ui.com/docs/migration#configure-middleware)
  * `offset` prop changed to accept `OffsetOptions` object. Old format with array(`[10, 10]`) was deprecated and will be removed in future versions.
* [SliderHandle]: migrated from "react-popper" to "floating-ui/react", changed signature of prop `offset` - see [docs](https://floating-ui.com/docs/offset).
* [PickerInput]:
    * `renderRow` prop type is changed, first param of the callback now has `PickerRenderRowParams` type
    * [DataPickerRow][Breaking Change]: added required `getName` prop. This prop also passed into first param of `renderRow` `PickerInput` prop callback.
    * [DataPickerRow]: added default implementation of `renderItem` callback
* [PickerList]:
    * [Breaking Change]: `renderRow` prop now affects only modal rows
    * [Breaking Change]: `PickerListItem` was renamed to `PickerListRow`
    * added `renderListRow` callback to customize list row without affecting row in modal
* [FlexRow][Breaking Change]: component was moved from `@epam/uui-components` to `@epam/uui`. Component refactored to CSS variables approach. `alignItems`, `justifyContent` props aligned with CSS.
* [ModalHeader][Breaking Change]: removed `margin`, `size`, `spacing`, `topShadow`, `columnGap`, `padding`, `vPadding` props, to set custom values use `cx` prop or global `uui-modal-header` class to change default values `--uui-modals-header-column-gap`, `--uui-modals-header-padding`, `--uui-modals-header-vertical-padding`.
* [ModalFooter][Breaking Change]: removed `borderBottom`, `margin`, `size`, `spacing`, `topShadow`, `columnGap`, `padding`, `vPadding` props, to set custom values use `cx` prop or global `uui-modal-footer` class to change default values `--uui-modals-footer-column-gap`, `--uui-modals-footer-padding`, `--uui-modals-footer-vertical-padding`.
* [DatePicker]: improved render performance for scroll actions.
* [TimePicker]: added `ref` prop.
* [NumericInput]: added `center` value for `align` prop

**What's Fixed**
* [NumericInput]: added right margin for arrows
* [MultiSwitch]: fixed `isReadonly` prop
* [FilterPanelItemToggler]: removed redundant left padding for postfix (align with figma design)
* [ColumnConfigModal]: fixed modal width according to design
* [DatePicker]: fixed type for `renderTarget` prop
* [RTE]: fixed minor toolbars issues
* [DataTable]: fixed bug when fixed column with `grow: 1` didn't fill all available space
* [Pickers]: scroll list to the top while start searching
* [PickerInput]: remove list bottom border in case if it does not have a footer
* [DatePickers]: fixed select of disabled dates via input
* [RangeDatePicker]: remove colons from input placeholders

# 5.13.2 - 04.03.2025
**What's Fixed**
* Fixed PickerInput and PickerToggler component typings for React 19
* [Text]: use .uui-typography-inline instead of .uui-typography class to not conflict with Text internal styles
* [RTE]: add scroll into placeholders list menu
* [PickerInput]: fixed bug when empty list appears in case topIndex + visibleCount was greater than total rows count

# 5.13.1 - 10.02.2025

**What's Fixed**
* Fixed usage of window reference for SSR
* [Dropdown]: fixed modal immediate close if it was open from DropdownMenu


# 5.13.0 - 30.01.2025
**What's New**
* Update UUI packages JS target from `ES6` to `ES2021`
* `PickerInputBaseProps` interface was moved from `@epam/uui-components` to `@epam/uui-core` package
* [MainMenuAvatar]: added `RawProps` prop
* [DropdownMenuBody]: added `maxHeight` prop
* [FiltersPanel]: added `minCharsToSearch` and `renderFooter` props for picker filter configuration


**What's Fixed**
* [useForm]: reset `serverValidationState` by valid form save action
* [PickerInput]: show 'N selected' instead of '+N' tag if `maxItems=0`
* [DropdownContainer]: autofocus first active element on dropdown open
* [PickerInput/FiltersPickerInput]: always show picker footer if picker has some selection
* [DropdownMenuButton]: fixed cropping of icons located to the right of the text
* [PresetsPanel]: added scroll to `More` dropdown
* [NotificationCard]: changed size of actions from '36' to '30'
* [CountIndicator]: text size increased from `8px` to `10px` for 12 size
* [MainMenuButton]: removed unnecessary `role` and `aria-haspopup` attributes ([#2733](https://github.com/epam/UUI/pull/2733))
* [MainMenuButton]: added `aria-current` attribute with value `page` for active links ([#2734](https://github.com/epam/UUI/pull/2734))
* [DataTableRow]: fixed `ref` prop
* [PickerInput]: fixed toggler selected value styles in case of single mode, `searchPosition !== input` and `minCharsToSearch > 0` and for case with `readonly=true` and `searchPosition !== input`


# 5.12.1 - 17.12.2024
**What's Fixed**
* Revert '[Svg]: don't set fill attribute if it's not provided' change from 5.12.0 version. Because it turned out that many users relied on the previous behavior where the fill attribute was cleared by default. If you need to render icon with built-in fill, please look at this issue comment - https://github.com/epam/UUI/issues/2684#issuecomment-2548751434


# 5.12.0 - 12.12.2024

**What's New**
* [ErrorPage]: added possibility to add message with support link for error pages(`500, 503, default` errors).
  For EPAM applications it's recommended to add following code to the root of your app to enable it:
  ```
    import { i18n } from '@epam/uui';

    i18n.errorHandler.supportMessage = (
        <>
            You can track the service availability at
            {' '}
            <a href={ `https://status.epam.com/?utm_source=${window.location.host}&utm_medium=ErrorPage&utm_campaign=StatusAquisitionTracking` }>status.epam.com</a>
        </>
    );
  ```
* Remove 'prop-types' from UUI packages dependencies. Remove `uuiContextTypes` interface, since it was needed for already outdated React context API.
* [DataTable]: added support of column groups in table header. Read more - https://uui.epam.com/documents?id=advancedTables&mode=doc&category=tables&theme=electric#table_with_header_groups
* [ErrorPage]: embed typography styles for error page texts
* [Alert]: small tweaks according to the design


**What's Fixed**
* [Dropdown][Tooltip]: Fixed a bug where the body overflowed if there was no space for the default or opposite placement.
  Now it tries other placements, e.g., if there's no space at the top or bottom, it will place the body on the right if there's enough space.
* [PickerInput]: fixed unnecessary api calls on body open with `minCharsToSearch` prop and search in body
* [RTE]: fixed image caption not being visible when RTE initially in readonly mode
* [DatePicker]: fixed body close if date picker input scrolled out from view
* [Modals]: prevent scrolling to the modal toggler because of focus return after modal close
* [RTE]: fixed scroll to the top of the editor after editor modal windows(Add image/link/video etc.) were close
* [RTE]: fixed error while merging cells without content
* [RTE]: fixed bug when files added from attachment button inserted in preview mode instead of attachment block
* [RTE]: fixed crash when removing the sole table row
* [Svg]: don't set fill attribute if it's not provided
* [Modals]: autofocus first active element on modal open. It's a temporary fix, because of bug in react-focus-lock lib(https://github.com/theKashey/react-focus-lock/issues/340). Ideally focus should move to the first active element only after 'Tab' key was pressed, we will come back to this solution when bug will be fixed.

# 5.11.0 - 15.11.2024

**What's New**
* [FlexRow][Breaking Change]: Only for `@epam/loveship` package. Now spacing default value works based on `columnGap` props. It shouldn't affect general cases, but previous spacing implementation require additional hack when it was needed to add negative margin value for container to remove corner paddings in multiline case. Now this hack should be removed, since `columnGap` implementation doesn't produce such bug for multiline.
* [useTableState][Breaking Change]: columns prop is removed, since it's not needed now. Just remove it from `useTableState` provided props.
* [useTableSate]: added `initialVisibleCount` prop
* [Button]: added size `60` to props
* [MultiSwitch]: added size `60` to props
* [Data Sources]: cursor-based pagination support. More details [here](http://uui.epam.com/documents?id=dataSources-lazy-dataSource&mode=doc&category=dataSources&theme=loveship#using_cursor-based_pagination)
* [TimelineScale]: added bottom/top month text customisation.
* [TimelineScale]: customisation of today line height was added.
* [Rating]: added to `@epam/uui`, skin packages now use `@epam/uui` implementation. Removed redundant(`filledStarIcon`, `emptyStarIcon`, `renderRating`, `from`, `to`) props for all packages, changed colors for empty & disabled stars for 'Promo' & 'Loveship' skins according [design](https://www.figma.com/design/M5Njgc6SQJ3TPUccp5XHQx/UUI-Components?node-id=18045-299767), added `icon` prop to have possibility to change default icon.

**What's Fixed**
* [TabButton][VerticalTabButton]: decreased paddings, added gaps `3px` between internal items for all sizes according to design
* [Tag]: Added gaps between internal items, changed padding according to design
* [Badge]: changed gaps & paddings according design, removed padding before first icon & after counter
* [VirtualList]: fixed estimatedHeight calculations in components with pagination
* [RTE]: fixed working of old iframe data structure with 'src' prop
* [VerticalTabButton]: reverted paddings & gaps to previous values for all sizes
* [RTE]: fixed migration of old table element data.cellSizes to the new colSizes format
* [PresetsPanel]: fixed 'Saved as new' action
* [PresetsPanel]: Fixed preset actions dropdown close on each rerender
* [Anchor, Badge, Button, LinkButton, IconButton, MainMenuButton, TabButton, Tag]: fixed `clickAnalyticsEvent` not being sent when `href` property used
* [ApiContext]: handle aborts during response read/parse phase (.json() and alike)

# 5.10.2 - 24.10.2024

**What's Fixed**

* [Text]: fixed bug when passed rawProps override Text internal styles
* [Modals]: fixed value for default modal width
* [RangeDatePicker]: fix inputs focus behavior. Fixed bug when date cannot be selected when another picker was previously focused
* [ColumnsConfigurationModal]: fixed vertical paddings
* [PickerInput]: hide clear button from footer in case `props.disableClear === true`
* [PickerInput]: fix unnecessary `onValueChange` call in case of entity mode and when provided entity was different from entity in `DataSource`.

# 5.10.1 - 16.10.2024

**What's Fixed**
* [DataPickerRow]: fixed default values for `padding` and `size` prop
* [TabButton]: fixed caption styles in case app apply `box-sizing: border-box` styles for all page elements.

# 5.10.0 - 11.10.2024

**What's New**
* [DataTable]:
  * [Breaking change]: reworked `isAlwaysVisible` column configuration prop. Now it's not make column fixed by default and doesn't forbid to unpin or reorder, it's only disallow to hide this column from table. If you need previous behavior, please use `isLocked` prop.
  * Added `isLocked` prop for column configuration. If `true` value provided, makes this column locked, which means that you can't hide, unpin or reorder this column. This column should always be pined.
* [DataTable]: `ColumnsConfigurationModal` updated modal width from 420px to 560px according design, 'disabled' state for locked columns is changed to 'readonly', added vertical paddings to multiline column names.
* [PickerInput]:
  * Added support of `minCharsToSearch` > 0 with `searchPosition = 'body'`.
  * Added renderEmpty prop to render custom empty block for depends on various reasons.
  * `renderNotFonud` prop is deprecated, please use `renderEmpty` instead
* Sass updated to the last version, warnings 'Mixed Declarations' fixed https://sass-lang.com/documentation/breaking-changes/mixed-decls/
* [Modals]: for mobile view (width is up to 720px) by default the modal position is fixed at the bottom edge of the screen
* [TabButton][VerticalTabButton]: decreased paddings & gaps for all sizes according to the design, changed the order of placing the icon to the left of the text and the count indicator, now the first icon then the count indicator

**What's Fixed**
* [Form]: fixed bug when `beforeLeave` modal appears in case of redirect in `onSuccess` callback
* [VirtualList]: fixed offsets counting if rows have different height

# 5.9.5 - 09.10.2024

**What's Fixed**
* [ArrayDataSource]: fixed initializing caches on data source creation.

# 5.9.4 - 26.09.2024

**What's Fixed**
* [useAsyncDataSource]: fixed refetching of data after deps change.

# 5.9.3 - 16.09.2024

**What's Fixed**

* [useForm]: fixed server validation error when a parent element of a child with an error is removed from the current state.

# 5.9.2 - 12.09.2024

**What's New**
* [RTE]: added `maxLength` prop
* [Text]: Added missing skin colors to 'Loveship' 'light' (night900) and dark (night50, night300, night400, night500, night600, night700, night800, night900) themes.


**What's Fixed**
* [RangeDatePicker]: fixed passing `id` prop to the first input in toggler
* [PickerInput]: fixed issue with clearing disabled (non-checkable) rows using backspace.
* [DataTableHeaderCell]: fixed text selection issue that occurred when clicking on resize, without preventing the event from bubbling.
* [useLazyTree]: fixed an issue where API calls were skipped during very fast scrolling.
* [RTE]: fixed serialization of empty lines in HTML, now </br> html tag is used
* [Text]: Tweak skin specific props to be equal to their semantic analogs


# 5.9.1 - 28.08.2024

**What's New**
* [LinkButton]: added `weight` and `underline` props
* [DataTable]: disable animation for loading skeletons due to performance issues
* [DatePickers]: added 'DDMMYYYY' format to the list of supported date formats for parsing user input
* Uploaded new version of icons pack:
  * icons added: action-clock_fast-fill, action-clock_fast-outline
  * icons updated (visual weight tweaked, icon size was slightly decreased): action-job_function-fill, action-job_function-outline, communication-mail-fill, communication-mail-outline

**What's Fixed**
* [DropdownMenu]: fixed disabled status of subMenu. If subMenu disabled it's won't open subMenuItems
* [DropdownMenu]: fixed error when using 2+ levels menu with closeOnMouseLeave=boundary
* [PickerInput]: fixed opening body by pressing 'Enter' key in mobile resolution(<768px)
* [Dropdown]: remove `mousemove` handler on component unmount
* [Pickers]: fixed bug when 'Clear All' button remains visible even after user clear all item by clicking on it. It was reproduced only if emptyValue=[] prop was passed.
* [AdaptivePanel]: fixed hiding items with the same priority as last hidden collapsed container
* [LinkButton]: tweak focus state style according to the design
* [Typography]: added focus for links


# 5.9.0 - 09.08.2024

**What's New**
* [Breaking change]: Typography in Electric theme h1 weight changed to 600, h2 weight changed to 400
* Icons pack updated:
  * [Breaking change]: visual weight tweaked for the following icons. Please review the places of this icons usage, after the update:
    * navigation-chevron_up_outline
    * navigation-chevron_down_outline
    * navigation-chevron_left_outline
    * navigation-chevron_right_outline
    * content-minus_outline
    * notification-done_outline
  * Icons added
    * Icon file-file_csv_fill
    * editor-headline_h4_outline
    * editor-headline_h5_outline
    * editor-headline_h6_outline
    * content-person_group_outline
* [DatePicker][RangeDatePicker]: improve a11y focus flow behavior. Now date picker body receive focus on open and return it back on input after close.
* [Timeline]:
  * Improved `Timeline`:
    * Updated `Timeline` design.
    * Added support for functional components.
    * Introduced a low-level `TimelineCanvas` component designed to render elements on the Timeline.
    * Enhanced customization options for `TimelineGrid` and `TimelineScale`.
    * Exposed default implementations for timeline grid/scale drawing phases via the `timelineGrid` and `timelineScale` libraries.
  * [Breaking Change]: Removed `BaseTimelineCanvasComponent`. Use `TimelineCanvas` instead. Now, TimelineCanvas should not be extended, instead, `draw` function should be passed to the props.
  * [Breaking Change]: Removed `TimelineScaleProps.shiftPercent`.
  * Added an example of Timeline usage with tables. [See demo here](https://uui.epam.com/demo?id=editableTable).
  * Added base component for universal drawing Timeline elements: `TimelineCanvas`.
  * Added the `useResizeObserver` hook, which provides the possibility to observe multiple elements' resizing.
  * Added the `useTimelineTransform` hook, which provides the possibility to receive the latest `TimelineTransform` instance from the `TimelineController`.
  * Made `TimelineGrid` customizable. Exposed default implementations of various parts of `TimelineGrid` drawing functionality, via the `timelineGrid` library.
  * Made `TimelineScale` customizable. Exposed default implementations of various parts of `TimelineScale` drawing functionality, via the `timelineScale` library.
  * Exposed default implementations of various parts of `Timeline` drawing functionality, via the `timelinePrimitives` library.
  * Added the `TimelineController.setViewportRange` function, which allows setting the `Viewport` by passing the right and left periods of the scale.
  * Added `computeSubtotals` and `createFromItems` to `Tree`.
* [DateTable]:
  * Added `renderHeaderCell` callback to the column configuration, it's allows to provide custom render for column header.
  * Added the `DataTableCellContainer` component - base wrapper for header and column cells
* [PickerInput]: hide picker footer while searching
* [PickerInput]: made tags in multi select smaller
* [Typography]: only for electric theme:
  * H1 weight changed from 600 to 400
  * H2 weight changed from 700 to 600


**What's Fixed**
* Simplify dayJs type imports to support earlier versions of Typescript
* [DataTable]: disable column focus and hover if `isReadonly={ true }` was provided in `rowOptions` for editable table
* [Badge]: center badge content, move left icons closer to the caption for wide badges
* [FileUpload]: fixed error icon color to uui-error-70
* [RTE]: fixed pasting lists from word
* [Tag]: fixed cross icon size according to the design


# 5.8.4 - 22.07.2024

**What's Fixed**
* [PickerInput]: fixed '+N' toggler tag tooltip content with custom `getName` callback

# 5.8.3 - 19.07.2024

**What's New**
* [ApiContext] Add `ResponseType` generic type for `processRequest` function, which defines the returned type of the function

**What's Fixed**
* [ApiContext] Combine user's headers with internal ones instead of replacing them when calling `processRequest` function
* [FiltersPanel]: set `undefined` value instead of `null` on clear action in numeric filter.
* [PickerList]: Fixed updating predefined checked values
* [Pickers]: fixed infinite updating if onValueChange is called in useEffect in case of React without concurrent rendering mode
* [LazyDataSource]: Fixed requesting already loaded data on scroll

# 5.8.2 - 11.07.2024

**What's New**
* [Pickers]: added current selection into `renderFooter` callback params.
* [RTE]: added possibility to customize set of available options for Header, Color and Note plugins

**What's Fixed**
* Fixed invalid mode for inline inputs
* [AnalyticContext]: fixed GA connection
* [Checkbox]: fixed icon size according design
* [RadioInput]: fixed caption line-height according design
* [Switch]: fixed caption size & line-height according design
* [PickerToggler]: changed padding for left icon, remove transparent for left/right icon in cell mode
* [TextArea]: removed maxLength prop override in cell mode
* [TabButton]: fixed counter color according to the design
* [DropdownSubMenu]: fixed `offset` value for `left-start` placement option
* [RTE]: removed loader after failed file upload


# 5.8.1 - 21.06.2024

**What's Fixed**
* [LazyDataSource]:
  * fixed reload data on DS deps change and fixed fetching minus count on scroll up
  * fixed updating itemsMap after setItems.

# 5.8.0 - 06.06.2024

**What's New**
* [Breaking change]: removed previously deprecated components:
  * removed `SnackbarCard` component in Loveship, use `NotificationCard` instead;
  * removed `ControlWrapper` component in Loveship and Promo;
* [Breaking change][Loveship]: removed previously deprecated props:
  * [All skins]:
    * [DropdownMenu]: all `DropdownMenu items` must be wrapped into `DropdownMenuBody`;
    * [DropdownContainer]: removed 'color' prop;
    * [TabButton][Tag][Badge][LinkButton][Button][MainMenuButton]: removed 'captionCx' prop. Please use 'cx' prop with cascading to 'uui-caption' global class;
    * [Text]: removed 'font' prop;
    * [IconContainer]: removed color prop. Define icon color by yourself, e.g. via cx or style prop;
    * [Avatar]: removed 'onClick' prop;
  * [Loveship]:
    * [LinkButton]: removed 'sun', 'cobalt', 'violet',  'fuchsia', 'white', 'night50', 'night100', 'night200', 'night300', 'night400', 'night500', 'night700', 'night800', 'night900' colors;
    * [Button]: removed 'night500', 'night600' colors, use 'neutral' instead;
    * [IconButton]: removed 'night200', 'night300', 'night400' colors;
    * [NotificationCard]: removed 'night600' color, use 'primary' instead;
    * [Tooltip]: removed 'night900' prop, use 'neutral' instead;
    * [Badge]:
      * removed 'semitransparent' fill value, use 'outline' instead;
      * removed shape prop, 'round' value will be used by default. If you use 'square' value, use `Tag` component instead;
      * removed '12' size;
    * [MultiSwitch]: removed 'night600' color value. Use 'gray' instead.
    * [RangeSlider]: removed 'color' prop;
  * [Promo]:
    * [LinkButton]: removed 'amber' color;
    * [Button]: removed 'gray50' color, use 'gray' instead;
    * [Badge]: removed 'semitransparent' fill value, use 'outline' instead;
    * [MultiSwitch]: removed 'gray60' color value. Use 'gray' instead.
    * [NotificationCard]: removed 'gray60' color, use 'primary' instead;
    * [Tooltip]: removed 'gray90' prop, use 'neutral' instead;
  * [uui-core]: helpers cleanup, removed following helpers: `LazyLoadedMap`, `browser`, `Debouncer`, `parseIconViewbox`, `parseStringToCSSProperties`, `getScreenSize` , `urlParser`, `batch`

* [useTree]: useTree hook is added.
  * [Features]:
    * [BaseListViewProps.showSelectedOnly]: The flow of rendering selected rows was changed. Previously, there was a separate flow of rendering selected rows, with using the `IDataSourceView.getSelectedRows` method. Currently, a new property, `showSelectedOnly`, was added. If this flag is turned on, selected rows are returned from `IDataSourceView.getVisibleRows`.
    * [Patch items in Lazy/Async/Array dataSources]: the possibility to add/move/delete items from Array/Async/Lazy DataSources was added. To provide this functionality, three options were added:
      * [BaseListViewProps.patch]: To add/move/delete some item from the existing dataset, it is required to pass that item via the `patch` map.
      * [BaseListViewProps.isDeleted]: To enable deleting of the items, it is required to specify getter of deleting state.
      * [BaseListViewProps.fixItemBetweenSortings]: If enabled, positions of items between sorting changes are fixed.
      * [BaseListViewProps.getNewItemPosition]: To specify the position an item to be moved, `getNewItemPosition` function may be provided. If not provided, new items will be placed at the top of the list. It can return a various of position configurations:
        * `PatchOrdering.TOP` - moves an element to the top of the children list;
        * `PatchOrdering.BOTTOM` - moves an element to the bottom of the children list;
        * By default, all new elements are placed to the top of the children list;
        * If `BaseListViewProps.getItemTemporaryOrder` returns some value for current item, that item is placed to the specific place and will not be included to the list of top/bottom children.
      * [BaseListViewProps.getItemTemporaryOrder]: To provide specific position for the item, it should be returned from `BaseListViewProps.getItemTemporaryOrder` function. This order can be placed to the patched item and generated by using `getOrderBetween` of the previous item temporary order or index and next item temporary order or index.
      * [BaseListViewProps.sortBy]: Items positions are frozen in the list while editing and reset on sorting change. To provide the correct sorting functionality for patched items (especially in LazyDataSources), it is required to provide access to the values of the fields, sorting is performed.
    * [ItemsMap]: immutable map with support of complex Ids was added. It should be used as an input of `patch` property, described above.
    * [useForm]: support of immutable/mutable maps was added.
    * [DataTable]: `rows` prop was added, along with `getRows`.
  * [Breaking changes]:
    * [useView]: `onValueChange` type was changed. Currently, it should support a state update callback((prevState: DataSourceState) => DataSourceState), instead of a new state value.
    * `IDataSource.getView` is deprecated. Use `IDataSource.useView` instead.
    * `IDataSourceView.activate` is deprecated. This functionality is built in `IDataSourceView.useView` hook.
    * `IDataSourceView.deactivate` is deprecated. This functionality is built in `IDataSourceView.useView` hook.
    * `IDataSourceView.getSelectedRows` is deprecated. Pass `showSelectedOnly = true` to `IDataSourceView.useView` options and access selected rows via `IDataSourceView.getVisibleRows()`.
    * `IDataSourceView.loadData` is deprecated.
    * `LazyListViewProps.legacyLoadDataBehavior` is deprecated.
* [useForm]:
  * added `setServerValidationState` callback to externally change server validation state
  * now it's possible to return the 'remain' value from the `beforeLeave` callback. In this case, the form will perform the redirect and then lock again afterward.
* [Modals]: added property `maxHeight` that equals `80dvh` in desktop mode and `100dvh` in mobile.
* [ColumnsConfigurationModal]: set `height` and `maxHeight` equals to `95dvh` and mobile breakpoint changed from `640px` to `720px` as in all other modals.
* [DatePicker][RangeDatePicker]: `renderDay` prop callback signature updated
* [PickerInput]: added property `renderTag` which can be used for rendering custom Tags in PickerInput toggler. Exposed `PickerTogglerTag` component, which is used in `PickerInput` for default for tag rendering.
* [PickerInput]: when using `maxItems` prop, selected values are only partially collapsed. Some(equal `maxItems` value) items remain visible, and the rest are collapsed into the "+N" view. Added tooltip with list of collapsed items to the "+N" tag
* [DataTable]:
  * isAlwaysVisible flag now makes column locked, which means that you can't hide, unpin or reorder this column. Usually applicable for such column without which table because useless.
    Note, that isAlwaysVisible column should be always fixed to any side of the table, if you didn't specify `column.fix` prop for such column, 'left' value will be used by default.
    Also, if you have a few isAlwaysVisible columns, it's necessary to place it together in the start or end(depends on `fix` prop) of columns array.
  * added property `columnsGap?: '12' | '24'`
  * added property headerSize?: '36' | '48'. In '48' size, column name can be braked in 2 lines text.
* [uui-editor]:
  * [Breaking change]: `plugins` prop now typed as `PlatePlugin[]`. YOu might need to change invocation of `baseMarksPlugin()` to `...baseMarksPlugin()`
  * `el.data.colSpan` and `el.data.rowSpan` removed from table cell node as it has duplicates: `el.colSpan` and `el.rowSpan`
  * `data.cellSizes` removed from table element as it has duplicate: `el.colSizes`
  * `data.align` removed from image element as it has duplicate: `el.align`
  * added html serialization for `separatorPlugin`
* [AdaptivePanel]: added property `itemsGap` to set gap between items in the AdaptivePanel. You can set any number or select a predefined value.
* [Avatar]: added 'number' type for `size` prop
* [LinkButton]:
  * added semantic 'accent','critical' and 'white' colors
  * 'contrast' color is deprecated and will be removed in future versions. Please use 'white' color value instead.
* [Button]: added 'white' color
* [IconButton]: added semantic Primary, Accent and Critical colors. Colors info, success, error, warning is deprecated, use new one instead.

**What's Fixed**
* [Tooltip][Dropdown]: fixed recalculation of boundary area(when we shouldn't close body) after target position was changed in closeOnMouseLeave="boundary" mode
* [DropdownMenu]: prevent page scrolling when navigation through menu items via keyboard up/down keys
* [useForm]:
  * fixed `beforeLeave` callback invocation in case of redirect at onSuccess callback
  * fixed `isInvalid`, `validationMessage` and `validationProps` value returned from hook in case of server validation. Before they have only client validation value, now it's merged with server validation
* [RangeDatePicker]: removed border-radius for borders between inputs
* [ControlGroup]: removed border-radius for borders between inputs
* [Accordion]: prevent page scrolling when open/close Accordion by space key
* [Slider]: fixed tooltip text calculation with step="0.1" value
* [PickerInput]:
  * fixed setting emptyValue in case of unselecting all picker items
  * don't close picker body on toggler click, if toggler has search value. Before, click on toggler leads to clearing search value
  * remove border radius for mobile view modal container
* [FiltersPanel]: fixed focus on search after body opening and focus on PickerToggler after closing body
* [RTE]:
  * fixed content jumps on editor focus
  * fixed delayed placeholder rendering
* [StatusIndicator]: style tweaks according to the design
* [Badge]: style tweaks according to the design
* [Tag]: style tweaks according to the design
* [Tooltip]: style tweaks according to the design
* [DatePicker][RangeDatePicker]: style tweaks according to design
* [Modals]: make border radius equal 6px for Loveship Light, Loveship Dark, Electric themes


# 5.7.2 - 12.04.2024

**What's Fixed**
* [IconButton]: Replace the `isDropdown` prop with `showDropdownIcon` to prevent the automatic appearance of the dropdown icon when using `IconButton` as the `Dropdown` target.
* [ApiContext]: Added possibility to send signal about success relogin via `localStorage`, due to old mechanism with `window.opener.postMessage` was broken on SSO side by security reasons .
  - To switch to the handling via `localStorage` replace code of `/auth/login` endpoint to `<html><script>window.localStorage.setItem("uui-auth-recovery-success", "true"); window.close();</script></html>`
* [VirtualList]: fixed scrolling on focus to the partially visible row.
  * [Breaking change]: scroll to the focused item is not managed by VirtualList anymore. To execute scroll to focused row, it is required to handle the change of focusIndex in key down handler and pass scrollTo with align = 'nearest' along with focusIndex as part of dataSourceState.

# 5.7.1 - 29.03.2024

**What's Fixed**

* [TabButton, VerticalTabButton]: set 18 icon size for all button sizes according to design
* [DataPickerMobileHeader]: changed close icon to match design
* [DataTableHeaderCell]: set 18 size for all icons by design

# 5.7.0 - 25.03.2024

**What's New**
* New Scaling Icons Approach:
  - Components now define the icon size based on their `props.size` value. You no longer need to pass an icon with an appropriate size for the component's size. The provided icon will now be scaled by the component itself.
  - Added a new icons pack, new icons placed under the '@epam/assets/icons' path. Old icons still exist under the '@epam/assets/icons/common' path.
  - This change doesn't require any immediate action from your side. You can continue using icons from the old icons pack. However, please note that icons which were passed to the components without adhering to the guidelines may now be scaled according to these guidelines.
* [DataTable]: Added possibility to pin columns to the right side of the table via columns config dialog
* [DataTable]: added 'Expand All/Collapse All' action in table header. They isn't rendered by default, to turn on pass `showFoldAll={ true }` to the DataTable props.
* [RTE]: added serializer/deserializer for MD format. Read more [here](https://uui.epam.com/documents?id=rteSerializers&category=richTextEditor&theme=electric#md_format).
* [RTE]: added `onFocus` prop
* [Modals]: now the Modals closed by default if the URL was changed. You can turn this off passing `disableCloseOnRouterChange={true}` prop to ModalBlocker component.
* [Modals]: added `maxHeight` prop
* [Paginator]: added `isDisabled` property
* [IconButton]: added property `size`
* [TimePicker]: added property `disableClear` to disable inputs' clear cross
* [FlexRow]: deprecated property `spacing`, it will be removed in future releases. Please use `columnGap` instead. `spacing` prop now works via `columnGap`.
* [FlexRow]: added property `topBorder` to add border on the top of the FlexRow
* [FileUpload]: move wordings to the i18n
* [ColumnsConfigurationModal]: small visual tweaks
* [Avatar]: changed default avatar img


**What's Fixed**
* [PickerInput]: fixed loading of selectedId with parents.
    * Fixed partially selected with predefined selected value.
    * Fixed fetching missing parents for selected element in PickerInput.
* [PickerInput]: fixed 'unknown records' removing
* [PickerInput]: Fixed focus reset after clicking outside
* [PickerInput]: fixed unnecessary PickerInput `onValueChange` calls on `dataSourceState` change(search, focusedIndex change) in single select with `valueType=entity`.
* [PickerList]: aligned caption by the left side in the footer.
* [DropdownContainer]: disable scroll to the focused element after dropdown close
* [DropdownContainer]: fixed warning about incorrect ref in React strict mode
* [Avatar]: change type of 'img' prop to also accept null value
* [RTE]: fixed table border rendering issues in Firefox
* [RTE]: fixed placeholder position in Safari
* [RTE]: fixed editor focusable area and appearing cursor on first click
* [RTE]: disable image resizing in readonly mode
* [RTE]: Fixed the position of the selected text toolbar within ShadowRoot for Chromium browsers.
* [DataTable]: prevent sorting change on column resize;
* [Blocker]: changed the exit animation duration from 1000ms to 200ms
* [ApiContext]: 'auth-lost' and 'connection-lost' errors in 'manual' error handling mode now handled by ApiContext itself
* [ApiContext]: add link to the login page in 'auth lost' modal
* [IconButton]: fixed property `isDropdown`;
* [Switch]: fixed property `isReadonly`;
* [TextArea]: fixed ability to scroll when `readonly` or `disable`;
* [Modals]: change 'accent' buttons to 'primary' in UUI built in modals
* [Badge]: small style tweaks according to the design
* [LayoutContext]: fixed uncontrolled accumulation of layers if using useLock hook. Added releaseLayer for manual notification close
* [DataTable]: added background(surface-main) for table container

# 5.6.2 - 15.03.2024

**What's Fixed**
* [PickerInput]: fixed toggler blur in case searchPosition = 'none'

# 5.6.1 - 19.02.2024

**What's Fixed**
* [LazyListView]: refetch on search clear.

# 5.6.0 - 08.02.2024

**What's New**
* Added 'Tokens' doc [page](https://uui.epam.com/documents?id=tokens&category=themes). It contains list of all core tokens with their value and description.
* prop `captionCX` is deprecated for the following components: `Button`, `LinkButton`, `Badge`, `Tag`, `TabButton`, `VerticalTabButton`, `MainMenuButton` and will be removed in future release. Please use `cx` prop to access caption styles and use cascading to change the styles for the `uui-caption` global class.
* [Breaking changes]:
    * [Badge]: can be a `span` element if `onClick` prop is not passed, consider it for DOM manipulation with this component.
    * [Tag]: can be a `span` element if  `onClick` props is not passed, consider it for DOM manipulation with this component.
    * [PickerInput]: in `selectionMode: multi` selected item `Tag` rendered as a `span`, consider it for DOM manipulation with this component.
    * [Button]: removed `count`, `dropdownIconPosition` props.
    * [TabButton]: removed `dropdownIconPosition` prop.
    * [VerticalTabButton]: removed `dropdownIconPosition` prop.
    * [LinkButton]: removed `onClear`, `clearIcon`, `count`, `dropdownIconPosition` props.
    * [MainMenuButton]: removed `onClear`, `clearIcon`, `isDisabled`, `dropdownIconPosition` props.
    * [Badge]: removed `dropdownIconPosition` prop.
    * [Tag]: removed `dropdownIconPosition` prop.
    * [Text]: removed color `brand`; Removed `--uui-text-brand` token from themes, use `--uui-text-primary` instead.
* Removed deprecated `MakeMeItem` and `InstanceItem` components from loveship.
* [TimePicker]: improve time picker input value parsing. Added ability to parse value in different formats, e.g.: `1.23pm` -> `01:23 PM`, `12/2` -> `12:02 AM`, `.25` -> `00:25`, `2350` -> `23:50` etc.
* Changes in `ICanBeInvalid` interface:
  * Extract `validationMessage` to the `IHasValidationMessage` interface
  * Extract validationProps into ValidationState interfaces
* [Text]: added `tertiary` color.
* [FlexRow]: added property `justify-content` it can be equals `'center' | 'space-between' | 'space-around' | 'space-evenly' | 'start' | 'end'`.
* [DropSpot]: changed type of the property `infoText` from string into ReactNode. Now you can pass your own realization of it, or pass string and use our.
* [Snackbar]: added 'Clear all notification' notification button while 2+ notifications displaying. To enable this behavior, exports Snackbar form @epam/uui package or skins.

**What's Fixed**
* [PickerInput]: fixed initialy selected items clear with LazyDatasoruce
* [PickerInput]: fixed partially selected mark for all chain of parent in single mode
* [RadiInput]: added native HTML `name` attribute for the input.
* [RadioGroup]: added native HTML `name` attribute for each group member.
* [Tooltip]: fixed vertical paddings according to the design.
* [SearchInput]: fixed `onCancel` prop. Now component can use provided callback, not only default implementation
* [useForm]: fixed `close` method to always return Promise
* [LinkButton]: fixed sky color in loveship dark theme
* [Badge]: fixed outline night600 color in loveship dark theme

# 5.5.3 - 07.02.2024

**What's Fixed**
* [APIContext]: fixed non-JSON error parsing (broken in 5.5.1)

# 5.5.1 - 01.02.2024

**What's New**
* [DataTable]: added `renderTooltip` prop to `DataColumnProps`, to be able to customize or disable table header tooltip
* [ApiContext]: added parseResponse callback to the ApiCallOptions. It can be used to define custom way of how to parse the response of the request.

**What's Fixed**
* [PickerInput]: fixed clear selection for single mode picker with lazy datasource

# 5.5.0 - 18.01.2024

**What's New**
* Added support of React 18 with concurrent rendering mode(i.e. react mounting via `createRoot`).
* Added semantic colors for components in 'Loveship' & 'Promo' skins. They can duplicate skin specific colors, so you can use both on your choose.
* [Pickers]: turn on flatten search results by default for all Pickers. Now for pickers with tree structure and in search mode, results will be shown as a flat tree, each item will have a subtitle with parents path.
* [DataTable]: Introduced focus manager api.
  Added ability to change focus on different cells using a keyboard in editable tables.
  See the example [here](https://uui.epam.com/demo?id=editableTable).
* [RadioInput]: removed 'theme' prop in loveship skin.
* [NumericInput]: size `48` is deprecated and will be removed in future releases. Please, use size `42` instead.
* [Badge]: in Loveship property `shape: square` was deprecated and will be removed in future releases. Please pay attention that `sguare` is default now. Use Tag component instead if you need 'square' appearance or use "round" value.
* [Badge]: in Loveship `size 12` is deprecated and will be removed in future release. Please, use size `18` instead.
* [NotificationCard]: color `gray60` in promo, and `night600` in loveship are deprecated and will be removed in future release.
* [Dropdown]: improve close on click outside dropdown logic.
* [FiltersPanel]: added `maxBodyHeight` prop for picker filters.
* [DataTable]: added `allowResizing` field for `DataColumnProps`, to be able to configure resizing for each column
* [ApiContext]: added possibility to provide your own fetcher for requests
* [PickerInput]: added `id` prop to add HTML ID attribute for the input.
* [DatePicker]: added `id` prop to add HTML ID attribute for the toggler input.
* [RangeDatePicker]: added `id` prop to add HTML ID attribute for the first input into toggler.
* [CountIndicator]: set color `info` by default.
* [FilterPanel]: in range numeric filter set mark 'from' input as invalid in case if value `from` bigger than value `to`.
* [Modals]: fixed `overflow: hidden` body style removing after closing first modals in case when multiple modals was opened. Now this style will be removed only when the last modal in stack was closed.

**What's Fixed**
* [LazyDataSource]: fixed cascade selection with not flatten search.
* [VirtualList]: fixed `onScroll` prop typing
* [PickerInput]: fixed closing picker body by checking some item in 'Show only selected' mode
* [ErrorHandling]: fixed notification errors handling for recovery status. Now notification will be shown only after recovery will be completed and request failed.
* [PresetPanel]: fixed the problem of creating duplicates of the new preset when clicking the accept button quickly.
* [CheckboxGroup]: added property `size` to set it for all group components. Added possibility to provide CheckboxProps for each item of group.
* [ApiContext]: file upload now handle JSON.parse errors.
* [useUUIError]: fixed subscribing for the contexts with React strict mode
* [NumericInput]: removed 'none' from size type.
* [DataPickerRow]: removed 'none' from size type.
* [RangeDatePicker]: fixed mounth/year selection blocker styles
* [NumericInput]: fixed placeholder appearing after removing value, if props.min > 0.
* [PickerInput]: clip selected value with ellipsis while overflow.
* [StatusIndicator]: small visual tweaks according to the design.
* [Tag]: small visual tweaks according to the design.
* [Badge]: small visual tweaks according to the design.
* [RTE]: extend clickable aria for the full height of editor.
* [RTE]: improve the link replacement logic

# 5.4.3 - 19.12.2023

**What's Fixed**
* [RTE]: fixed `onBlur` and `onKeyDown` props
* [Button]: fixed 'white' color on loveship


# 5.4.2 - 07.12.2023

**What's New**
* [FiltersPanel]: added `togglerWidth` prop, which configure `maxWidth` of filter toggler
* [Tag]: added additional colors in skins
* [Badge]: added new colors in skins:
  * Loveship: 'cyan' | 'mint'.
  * Promo: 'cyan' | 'mint'.
  * Electric: 'yellow'| 'orange' | 'purple' | 'cyan' | 'mint' | 'white' | 'night100' | 'night600'.
* [DropdownContainer]: `width` property now used as a default for `maxWidth`, if `maxWidth` is not provided.

**What's New**
* [LazyDataSource]: enabled `flattenSearchResults` by default
* [PickerInput]: Added subtitle for flatten search results as default behavior of `PickerInput`s.

**What's Fixed**
* [Tag]: fixed typings
* [Button]: fixed `rawProps` typings for `data-*` attributes
* [Paginator]: fixed `rawProps` typings
* [PickerInput]: added default `maxWidth={ 360 }` value for picker body
* [PickerInput]: Fixed clear checked before opening a picker body and if selectAll: false is provided.
    * Added `clearAllChecked()` method to `IDataSourceView` interface to support unchecking all without enabled `selectAll` flag.
    * Reduced amount of loaded data while clearing all checked elements in `cascadeSelection: false` mode.
* [LazyDataSource]: fixed showing placeholders on `clearCache`.
* [TextArea]: size `48` is deprecated and will be removed in future release. Please, use size `42` instead.
* [TextPlaceholder]: fixed animation performance issues
* [LazyListView]: fixed backgroundReload functionality.
    * Fixed showing blocker when filter/sorting changed.
    * Fixed showing placeholders while backgroundReload=true and placeholders should not appear.
* [icons]: Returned filled version for the following icons: communication-chat, flag, communication-mail, action-eye, action-eye-off, action-job_function, action-deleteforever, action-schedule.

# 5.4.1 - 30.11.2023

**What's New**
* [uui.epam.com](https://uui.epam.com/) site now fully support theming. You can choose preferred theme in app main menu.
* [Tag]:
  * rework according to the new design. Added new colors and new `solid` & `outline` mods;
  * [Breaking change]: for loveship package, changed default `size` from `18px` to `36px`.
* Upload new icons pack
    * [Breaking changes]:
        * 'action-update' icon was removed use 'navigation-refresh' instead
        * 'content-plus' icon was removed use 'action-add' instead
        * 'action-map_pin' icon was removed use 'communication-geo_tag' instead
        * 'table-info-outline' icon was removed use 'notification-info-outline' instead
        * 'action-chat' icon was removed use 'communication-chat' instead
        * 'not-recommended' icon was removed use 'blacklist' instead
        * 'copy-content' icon was removed use 'action-copy_content' instead
        * 'action-clock' icon was removed use 'action-schedule' instead
        * 'notification-close_popup' icon was removed use 'navigation-close' instead

**What's Fixed**
* [Calendar]: fixed disabled days text color
* [Text]:
  * fixed font-weight prop in skins.
  * fixed color values for semantic colors(info, warning, error, success) and for skin colors
* [TextPlaceholder]: improved animation
* [Panel]: fixed "background" property. Return `transparent` value by default.
* [MainMenu]: fixed colors for 'electric' theme

# 5.4.0 - 21.11.2023

**What's New**
* This release introduced stable Theming approach and theme css variables:
  * Theme css variable now assumed as a stable API, you can use them into your application styles.
  * A lot of components styles tweaks according to the design changes.
  * You can read more about Themes here - https://uui.epam.com/documents?id=themes

* New EPAM brand 'Electric' Theme and `@epam/electric` package. To start using Electric theme you need:
    * Add `@epam/electric` package to your project
    * Add `import '@epam/electric/styles.css'` to the root of your application
    * Add `import '@epam/assets/css/theme/theme_electric.css'` to the root of your application
    * Add `uui-theme-electric` class to the html body node
    * Import all necessary components from `@epam/electric` package.
* Added Dark theme for Loveship. To start using Dark Loveship theme you need to:
  * Add `import '@epam/assets/css/theme/theme_loveship_dark.css';` to the root of your application
  * Add `uui-theme-loveship_dark` class to the html body node.
* [Fonts]: Added `Source Sans Pro` font, which properly works with css `font-weight` and `font-style` rules.
    You can replace usages `Sans Semibold` font with `Source Sans Pro` and `font-weight: 600`, `Sans Italic`  with `Source Sans Pro` and `font-style: italic` etc.
    We also keep old font-faces and variables for backward compatibility. It's recommended to move to the new approach, since old one will be deprecated in feature.
* [skinContext]: removed skinContext from `UuiContexts`, it's not needed to provide it to the uui services, just remove its usage.
* [Typography]: removed typography mixins. Now typography applies via css classes. If you use mixins, replace it by adding `.uui-typography` class on the same node.
* [StatusIndicator]: added new `StatusIndicator` component.
* [CountIndicator]: added new `CountIndicator` component.
* [Badge] :
  * [Breaking change]: removed fill "white" and "none" modes, use `fill="outline"` + color instead them.
  * [Breaking change]:removed fill "transparent", use `StatusIndicator` component instead.
  * [Badge]: deprecated fill "semitransparent", it will be removed in future releases. Use `fill="outline'` instead.
* [LabeledInput]:
  * added `sidenote` and `footnote` props
  * added `maxLength` and `charCounter` props. You can use them for cases when you need to show a counter which indicates the limit of symbols in input.
  * added possibility to provide `validationMessage` as react node
* [TextArea][Breaking Change]: removed `maxLength` prop, use LabeledInput with `maxLength` and `charCounter={ true }` props instead.
* [CheckBox, PickerList, RichTextView, Switch, TabButton, VerticalTabButton, ScrollBars]: removed `theme` prop. Use Theming approach instead.
* [PresetsPanel]: added the ability to add a modal confirmation window when deleting a preset

**What's Fixed**
* [useForm]: don't reset `inChanged` flag in case when server validation fails
* [DataTableRow]: fixed `rawProps` prop
* [DropdownMenuButton]: use `isActive` prop in priority under router.isActive
* [PickerInput]: set `overflow: hidden;` on open for mobile
* [DataTable]: fix columns reorder when there are hidden columns
* [TextArea and TextInput]: fix `maxLength` for Android
* [DataTable]: fixed column order after pin action
* [PickerInput]: Disable select all button if list are empty, and it has no selection
* [DataTable]: added `role=table`
* [SlateEditor]: fixed image caption appearance after upload
* [DropdownMenu]: added `focusLock` prop

# 5.2.0 - 16.10.2023

**What's New**
* [useVirtualList]:
  * Breaking change: `scrollToIndex` prop was removed, use `scrollTo` instead.
  * Improved scrollTo functionality. Added configuration of scroll behavior and how to align item after scroll.
  * See the example [here](https://uui.epam.com/documents?id=virtualList#scroll_to_index)
* [DataTable]: added possibility to pin rows inside table. It allows you to make some rows sticky inside their parent group. Use `pin` callback in `getRowOptions` function for this. See the example [here](https://uui.epam.com/documents?id=advancedTables&category=tables#table_with_pinned_rows).
* [BaseListView]:
  * added `backgroundReload` property. If it is set to `true`, placeholders appear only on the first load and on fetching additional rows.
    Any filter/search/sorting change doesn't trigger placeholders' rendering. Old data is shown until new data is received. When reloading is started,
  * `getListProps` now returns `isReloading` flag, which signals that data is reloading.
* [DataTable][Pickers]: Added Blocker overlay while loading. It appears on initial render and filter, search, sort, page number, and size change.
* [InputAddon]: added InputAddon component that can be used in cases when you need to add prefix or suffix to the your component with ControlGroup.
* Use Vitest instead of Jest in Vite UUI template app

**What's Fixed**
* [UUI Contexts]: fixed context initialization for react 18 with strict mode
* [PickerItem]: fixed 'cx' prop
* [PickerInput]: remove the dropdown icon if `minCharsToSearch` prop is passed
* [PickerInput]: fixed paddings with multiline item text
* [PickerInput]: don't clear search on item check via keyboard
* [useUuiServices]: fixed `apiPingPath`, `apiReloginPath`, `apiServerUrl` props
* [AdaptivePanel]: fixed items width calculation in case of decimal values
* [useForm]: recover from `isInProgress=true` state if `onSave` is rejected
* [TabButton]: fixed notify dot, that it will not change button width
* [FiltersPanel]: fixed height of filter body in mobile view
* [ErrorHandler]: fixed image for 503 error code in loveship
* [DatePicker]: fixed crashes with different versions of dayjs
* [ModalWindow]: changed role attribute value from 'modal' to 'dialog'
* [DropdownMenuButton]: fixed icon color in  `isDisabled` state

# 5.1.3 - 31.08.2023

**What's New**
* Added focus state styles for Accordion, AvatarStack, Anchor, Badge, Button, Burger, Checkbox, Control Group, IconButton, LinkButton, MainMenu, RadioInput, Switch, TabButton, Tag. This focus styles works via :focus-visible pseudo class and will be applied only when using the keyboard.
* [FiltersPanel]: added possibility to provide your own custom filter
* [useForm]: `validate` callback now return new `validationState`
* [DropdownContainer]: improved keyboard support. Now DropdownContainer by default lock focus inside and return to the toggler by closing. Also implemented close by 'Esc'.

**What's Fixed**
* [PickerInput]: when `searchPosition=input` a cursor is placed in textbox once PickerInput is focused via Tab key.
* [PickerInput]: fix `searchPosition` when `editMode=modal`, it cannot be `input`.
* [useForm]: after calling validate callback, form switch to revalidating mode on fields change.
* [useForm]: fixed isChanged prop calculation, in case when form value returned to initial
* [useForm]: don't call `loadUnsavedChanges` callback when for was edited and then returned to the initial value
* [Accordion]: fixed outdated isOpen value of renderTitle and renderAdditionalItems callbacks in case when this.props.value provided
* [Burger]: fixed keyboard navigation
* [Badge]: fixed hover effects for non-clickable badges in loveship
* [SliderRating] fixed colors of icons when it's 2+ sliders on one page
* [LabeledInput]: fixed default Tooltip color
* [SlateEditor]: get zIndex from layer context for RTE toolbars
* [DataTable]: fixed columns resize

# 5.1.2 - 10.08.2023

**What's New**
* Added support of UUI library proper work in shadow-dom container
* [DropdownMenu]:
  - [Breaking change]: reworked component in loveship skin to be aligned with @epam/uui implementation and with design specs
* [Alert]: added size '36' option.
* [DropdownMenu]: added minWidth prop to set up minWidth to DropdownMenu container.
* [Avatar]: property `onClick` marked as @deprecated. It will be removed in future versions.
* [TimePicker]: rework styles for loveship. Size '48' was marked as deprecated and will be deleted in the future releases.
* [FileUpload]: file upload components was added to the Loveship skin.

**What's Fixed**
* [Button]: fixed disabled styles
* [FiltersPanel]: fixed wrong filter order calculation on new filter adding.
* [RangeDatePicker]: `presets.name` prop now accept ReactNode.
* [PickerInput]: fixed selected value displaying if item id equals zero or false.
* [ColumnsConfigurationModal]: fixed crashes when new column was added or deleted from columns array
* [ControlWrapper]: component was marked as deprecated and will be removed in feature releases.
* [InstanceItem]: component was marked as deprecated and will be removed in feature releases.
* [MakeMeItem]: component was marked as deprecated and will be removed in feature releases.
* [DraftRTE]: updated to the latest epam/assets package version
* [DataPickerFooter]: added export from loveship and promo packages
* [SlateEditor] fixed custom elements removal when they are last element in editor
* [DataTable]: fixed paddings for first cell in edit mode

# 5.1.1 - 27.07.2023

**What's New**
* [PickerInput]: Added highlighting of the search matching results.
* [PickerInput]: Added search result sorting by search relevance.
* [Tooltip][BreakingChange]: Removed prop `trigger`. Now tooltip always opens on hover, use dropdown for cases when you need to open body by click.
* [DataTable]: Added column description tooltip to table header. DataTable now has an optional property-callback 'renderColumnsConfigurationModal?: (props) => React.ReactNode' for render your custom ColumnsConfigurationModal.
* [ColumnsConfigurationModal]: Added 'renderItem?: (column) => React.ReactNode' optional property-callback for render your custom column name section.
* [ColumnsConfigurationModal]: Added 'getSearchFields?: (column) => string[];' optional callback to define columns to search in the ColumnsConfigurationModal. We use 'column.caption' by default.
* Added adapter for react-router 6.
    - Note: we strongly discourage the use of react-router 6, as it introduces too many breaking changes, and certain important features (like block and listen) are available only via unstable internal API.

**What's Fixed**
* [uui-editor]: reduced package size.
* [PickerInput]: fixed initialValue resetting in case of entity value type and async data source.
* [Button]: added missing styles for 'sun' color in loveship skin.
* [FilterPanel]: fixed RangeDatePicker 'to' value change.
* [FilterPanel]: added `maxItems` prop for filter config, this prop will configure how much items will be shown in filter toggler before collapsing in '+ n items'. Also improved selected items collapsing when they don't fit toggler width.
* [Rating]: fixed rating behavior with 0.5 step.
* [ColumnsConfigurationConfig]: change 'Apply' button color to the 'primary'
* [MainMenu]: fixed hover styles for nested menu items.
* [PickerInput]: reset 'Show only selected' to default value toggler on picker close.
* [DropdownMenu]: fixed button's heigth and submenu position.
* [LabeledInput]: changed `info` prop type from string to `ReactNode`.
* [DatePicker]: size '48' marked as @deprecated. It will be removed in future releases.
* [RangeDatePicker]: size '48' marked as @deprecated. It will be removed in future releases.
* [SnackbarCard]: component deprecated and will be deleted in a future releases. Please, use a NotificationCard instead it.

# 5.1.0 - 29.06.2023

**What's New**

**Rich Text Editor component update and improvements**

UUI `SlateEditor` was reworked and updated to the actual version of Slate.js framework.
During the update the previous code based of RTE almost completely rewritten due to a lot of breaking changes from Slate.js side. However, we put significant efforts to minimize breaking changes for our users. Therefore, update to the new version of `uui-editor` package should be seamless and easy.

List of changes:
* [Breaking change]: Changed RTE value format, now it's works with array instead of immutable.js object. Also, there are some additional changes inside slate value structure.
We make an automatic migration from old state format to the new one, so it's not required any additional actions from your side. But if you make some manipulations with value object on your side, it will cause issues, contact us if you faced with such case.
* Regarding the new value format it's not needed to convert value to JSON via `value.toJSON()` and `Value.fromJSON(value)` in your code.

* Added possibility to add caption for images
* Added possibility to insert new line after image/video/iframe
* Added images adjusting when width of RTE container is changing
* Added support of different spell checking extensions, like Grammarly
* Now visited links doesn't highlight with visited style in edit mode
* Long links now fit table cell width
* Improved content copying from Microsoft Word files
* Added autofocus on input in 'Add Link' modal
* A lot of issues and improvements from Slate.js version update
* Fixed page crash after delete horizontal line/separator
* Fixed adding list inside table
* Fixed text selection breaks if mouse cursor lands on toolbar
* Fixed reverse text in list in Safari
* Fixed color bar closing by color click
* Fixed sticky toolbar disappears after selecting any options in it in Safari
* Fixed link replacement without first deleting it
* Fixed error after setting list on empty line
* Fixed error after inserting a list previously cut from the editor


**What's Fixed**
* [PickerInput]: disabled 'Clear' button in footer in case when `disableClear` prop is `true`
* [TimePickerBody]: fixed the bug where `minutes` values that are not a multiple of  `minutesStep`, are not rounded up to a `step`
* [TextInput]: fixed incorrectly text color in disabled state in Safari
* [useTableState]: fixed checked state overriding to the initial value


# 5.0.1 - 13.06.2023

**What's New**
* [FiltersPanel]:
    * added picker title to the header in mobile view
    * added possibility to hide search for exact filter using `showSearch` prop in config
    * added 42 and 48 sizes

**What's Fixed**
* [PickerInput]: fixed `unknown` in a `single` selection mode while data is loading in `AsyncDataSource` and `LazyDataSource`, and removed error of missing ids if data is still loading
* [FiltersPanel]: fixed styles for body & toggler according to design
* [Pickers]:
  - rewritten `Pickers` to functional components;
  - moved from `getView`to `useView` hook;

* [DataSources][useView]:
  - [BreakingChange]: `useView` is not recreating view on `onValueChange` update anymore;
  - [BreakingChange]: added `deps` to `useView` as a last argument; changing the `deps` causes recreating of a `view`.

# 5.0.0 - 06.06.2023

**Themes**

This release introduces Themes support. `@epam/uui` package now contains components, which can be styled differently according to an applied Theme - a set of global CSS variables.

`@epam/promo` and `@epam/loveship` packages are re-built on top of `@epam/uui` package. This allows us to unify codebase, and reduce differences between 'loveship' and 'promo'. We also aligned APIs, functionality and visual appearance between 'promo' and 'loveship' skins, as a result, we removed or deprecated some props or their values.

Pay attention that this release requires some additional actions for the library to work properly.
You can find migration guide and full list of changes [here](https://github.com/epam/UUI/wiki/Migration-guide-to-UUI-v.5).

Note: Currently, we use Themes internally to implement Loveship and Promo. In future, we allow UUI users to build their own themes, and using Themes variables for customization. However, in this release we haven't yet finalized Themes APIs (CSS variables names). We can't yet recommend using Themes internals, e.g. override Themes CSS variables for customization.

**Testing facilities and documentation**
* Introduced new `@epam/uui-test-utils` package. It provides a set of helpers, utils and mocks which facilitate creation of unit tests for UUI components.
* Was added Testing [documentation](https://uui.epam.com/documents?id=testing-basics&category=testing). It contains general guidelines, best practices and tools which we are recommending to use for UUI components testing.
Also, it contains a Cookbook describing typical use cases with code examples as well as frequent questions & answers.

**DataSources documentation**
* Introduced the new [DataSources documentation](https://uui.epam.com/documents?id=dataSources-getting-started&category=dataSources), that covers a wide range of topics related to the DataSources, accompanied by illustrative examples.
  Note that this is the first revision of this doc, so we would appreciate your feedback and have plans to continuously improve this documentation.

**ESM modules support**
* EcmaScript modules (ESM) are now included into UUI packages. Usage of ESM should help to eliminate unused code via tree shaking. CommonJs modules will be published along with ESM in the same package for backwards compatibility.

**Other changes**
* We made UUI compatible with Vite build toolchain. You can find template project of UUI + Vite [here](https://github.com/epam/UUI/tree/develop/templates/uui-vite-template).
* The `@epam/assets` package and "assets" folders inside promo and loveship packages were cleaned up: some "*.scss" files were deleted. Please copy any missing files directly to your project if they are still needed.
* [useTableState]:
  - [BreakingChange]: removed `initialFilter` prop, if you need to provide any initial state for hook, pre-generate an url link with this state on you side.
  - added storing of sorting, columns config, and paging state into url
  - now hook accepts optional `IEditable` props, use them for cases when you need to store DataTableState by yourself. If passed it assumed that you will handle all state changes on your side and hook will not store any state into url.
* [ContextProvider]: removed support of legacy React context API, as it were announced in 4.1.0 version. `enableLegacyContext` prop was deleted.
* [ApiContext]: removed the code which handles `/auth/login` for the apps, which doesn't handle this themselves.
  If an app doesn't handle `/auth/login correctly`, this needs to be implemented implicitly. There are several options:
  - Handle /auth/login path server-side. Server should log in user (via redirects to SSO), and - after success, return the following HTML:
    `<script>window.opener && window.opener.postMessage("authSuccess", "*")</script>`
  - Handle /auth/login path client-side. The simplest method is to add the following to the index.js:
    `window.opener && window.location.pathname === '/auth/login' && window.opener.postMessage("authSuccess", "*");`
  - If an app implements UUI-based login pages, they need to run the following code after successful login:
    `window.opener && window.opener.postMessage("authSuccess", "*")`
* [DataTable]: deprecated column `shrink` property was removed, as it was announced in 4.9.0 version.
* [MainMenuDropdown]: added callback `renderBody` prop.
* [FiltersPanel]:
    - hide 'Add filter' button, if all filters `isAlwaysVisible`
    - added `presets` prop to rangeDatePicker filter
    - added `filter` prop for datePicker and rangeDatePicker filters
* [PickerInput]:
  - added `implicit` cascade selection mode. In this mode selecting a parent node means that all children are considered checked,
but only the checked parent is present in the Picker's value or DataSourceState.checked array.
  - now items which present in selection and doesn't exist in DataSource will be shown in picker as '[Unknown]'
  - added a default footer component for single pickers that includes a "Clear" button
* [DataSources]: DataSources internals are refactored, optimized, and prepared for further improvements
* [PresetsPanel]: added limitation for new preset input (max length 50)
* [DropdownMenu]: added a 400ms delay to the submenu's close and open triggers
* [ModalWindow]: added possibility to provide number for 'width' and 'height' props.
* [TimePicker]: added max values to hours and minutes inputs
* [Tooltip]: added possibility to pass rawProps to the tooltip body
* [RangeDatePicker]: added new `onOpenChange` prop
* [ErrorHandler]: now in Loveship used `NotificationCard` component instead of `SnackbarCard` for notification type errors
* [ErrorHandler]: added additional property `onNotificationError` to render notifications with custom markup and configured the notification duration.
* Added `inputCx` and `bodyCx` props for composed components like PickerInput and DatePickers

**What's Fixed**
* [PickerInput]:
    - fixed partially checked nodes in lazy lists
    - fixed single select dropdown body closing by the collapse icon if any value was selected.
    - fixed hover affect doesn't appear on "parent" node, in case when it's not selectable but foldable.
    - fixed single select window doesn't close by the collapse icon if any value was selected.
    - fixed renderToggler prop which was used with TextInput / SearchInput
    - fixed picker body closing by click on clear search icon
* [FilterPanel]:
    - fixed "show only selected" toggle not being visible, when selectAll was disabled via DataSource
    - fixed picker body closing by clicking close button or done in mobile view.
* [DataTable]:
  - fixed first column overlapping second column in case when content can't fit the column
  - set 'undefined' value instead of '[]' for sorting, when sorting removed from column
  - fixed mobile view column filter crashes and when column caption not a string
* [Tooltip]:
    - removed default 300px max-width value from styles, you can set max-with using property 'maxWidth'.
    - Fixed a white subpixel line on a tooltip arrow on browsers with zoom >100%.
* [PresetsPanel]: fixed scroll inside "N more" dropdown
* [Dropdown]: The delay to close/open the dropdown has been fixed. In previous version the closeDelay being overwritten constantly while the mouse was moving.
* [Button]: removed 'disabled' attribute if the Button/LinkButton/IconButton is disabled, because it will prevent all events and broke Tooltip at least.
* [RichTextView]: h1 font-size in promo skin changed from 36px to 42px.
* [FilterPanel]: fixed issue with "show only selected" toggle not being visible, when selectAll was disabled via DataSource

# 4.10.2 - 24.03.2023

**What's Fixed**
* [Form]: fixed isChanged calculation for already saved and then changed form
* [Dropdown]: fixed issue with '0' value for closeDelay prop
* [MainMenu]: fixed issue when menu resize caused removing body overflow for opened modals
* [TimePicker]: fixed body content alignment


# 4.10.1 - 10.03.2023

**What's New**
* Exposed our Rollup build toolchain from @epam/uui-build package that you be able to build and publish your own packages.

**What's Fixed**
* [Typography]: links now underlined
* [NumericInput]: prevented text selection by arrows click
* [NumericInput]: `formatter` prop replaced with custom `formatValue` function which converts given input into text instead of number
* [ButtonBase]: set `disabled` attribute for disabled buttons
* [NumericInput]: improved work with floating numbers
* [FilterPanel]: fixed predicate value change
* [FilterPanel]: fixed range date picker date selection
* [PickerList]: fixed default sorting
* [DataTable]: fixed first column content alignment

# 4.10.0 - 06.02.2023

**What's New**
* React v18 support. You can still use React v17 or lower, no changes required from your side.
* [Tooltip]: Tooltip component implemented based on Dropdown.
  - In accordance with this change, Tooltip received some Dropdown features, such as: `closeOnMouseLeave: 'boundary'`, `closeDelay` and `openDelay`
  - [BreakingChange]: Removed prop `trigger`. Now tooltip always opens on hover, use dropdown for cases when you need to open body by click.
  - [BreakingChange]: Removed prop `isVisible`. If you need to programmatically control the opening, use the value/onValueChange props.
* [PresetsPanel]: store sorting into preset
* [useTableState]: store sorting into url
* [FlexRow]: added Flexbox properties `columnGap` and `rowGap` to setting the spacing between children and rows in case of a FlexRow wrap
* [ColumnsConfigurationModal]: added functionality to deny applying the configuration without selected columns
* [Dropdown]: added `openDelay` and `closeDelay` prop, for dropdown which opens by hover
* [useTableState]: adding viewState into DataTableState and store it into presets
* [TimePicker]: change IEditable typing to accept null
* [PresetPanel]: fix copy link action on non-active preset


**What's Fixed**
* [VerticalTabButton]: fix text trimmed and text align
* [Switch]: remove margin-left when there is no label
* [Anchor][Button]: added `rel='noopener noreferrer'` where `target='_blank'`
* [PickerInput]: update correctly `dataSourceState` when programmatically handling previously loaded data, if API returns empty array
* [ColumnsConfigurationModal]: Removed disabling of a checkbox if a column has a `fix` property and fixed the problem with pinning the column after unpinning, if it has `fix` property in the column config.
* [NumericInput]: fixed `NumericInput` by preventing rounding up numbers if `formatOptions` are defined
* [Rating]: fixed loveship `Rating` color for selected stars
* [useTableState]: now correctly work with react-router baseUrl
* [RangeDatePicker]: move focus from 'to' value to 'from' value, in case when 'from' empty
* [DatePicker, RangeDatePicker]: use `props.format` value in priority over other acceptable formats
* [useForm]: fix close callback to work properly when lock doesn't exist
* [PresetPanel]: set minHeight: 60px for presets container

# 4.9.2 - 14.12.2022

**What's Fixed**
* [useForm] - allow to replace getMetadata prop after the first render


# 4.9.1 - 01.12.2022

**What's New**
* [LockContext]: reworked lock context:
  - make `tryRelease` method public
  - `tryRelease` argument in `acquire` now optional, if isn't passed release lock immediately on request
  - `withLock` now run passed action and get lock until action running
* [useForm]: added close method, which try to leave form and ask to save unsaved changes
* [DatePickers]: added support for typing value according predefined set of formats


**What's Fixed**
* fixed sans semi-bold font url
* [LazyDataSource]: fixed row handle check while tree wasn't initiated
* [NumericInput] prevent value change onScroll
* [NumericInput]: set empty string value on onBlur event in case of invalid input value
* [DND]: fixed container scrolling on element dragging
* [ApiContext]: fixed manual error handling for recovery errors

# 4.9.0 - 17.11.2022

**This release includes all changes from '4.9.0-rc.1' version**

**What's New**
* [ColumnsConfigurationModal]: redesign and rework logic, added possibility to pin columns from modal
* [PickerInput]: now we predefine search with selected value on picker open, but apply it to search on first change
* [ModalContext]: added argument to abort method


**What's Fixed**
* [RawProps]: fixed wrong type for HtmlDivElement
* [TableColumnFilters]: fixed scroll position in 'Show only selected' mode in Loveship
* [Checkbox]: added indeterminate state to the aria-checked attribute
* [Alert]: added min-width to prevent breaking it on extra small devices
* [useForm]: fixed form reset to initialValue after save. Fix value replacing if new 'props.value' was passed
* [LazyDataSource]: added 'null' type for 'parentId' and 'parent' properties in LazyDataSourceApiRequestContext
* [LazyDataSource]: fixed selectAll action for lazyDS with cascadeSelection = false
* [useForm]: re-create handleSave callback if 'props.save' functions is changed
* [DataTableRow]: added possibility to forward ref
* [PresetPanel]: bug and style fixes
* [FiltersPanel]: bug and style fixes


# 4.9.0-rc.1 - 24.10.2022

**What's New**

This release prepares UUI for full-featured editable tables support. Editable tables were possible before this - via hooking into renderRow, building a separate component for row, and certain tricks to re-render it w/o re-rendering whole table. However, this was a complex and feature-limited approach.

In this release, we add first-class support for editable cells, and adjust our infrastructure to support various other features to make DataTables editable. You can find example and documentation how to create editable table [here](https://uui.epam.com/documents?id=editableTables&mode=doc&skin=UUI4_promo&category=tables).

With this release you already can build editable tables. However, we are planning to improve certain parts in the future releases, e.g. simplify adding/removing/moving rows in tables.

* [Breaking Change]: DataSources and DataTables-related interfaces refactored:
  * DataTableRowProps type is moved from @epam/uui-components to @epam/uui-core
  * columns prop is moved from DataRowProps to DataTableRowProps interface
    * if you have your own DataTable implementation, you'd need to replace renderRow callback type to use the DataTableRowProps interface instead of DataRowProps
  * DataTableCell interface extended to support editable cells (backward compatible)

* ArrayDataSource - ```items``` prop value can now be updated dynamically.
  Prior to this fix, the only way to update ```items```, is to add them as `useArrayDataSource` dependencies. This forces DataSource to re-create everything, forcing re-render of all tables' rows. This was slow, especially if you need to make cells editable - i.e. re-render on each keystroke. Now, you can safely remove your items from deps: useArrayDataSource(..., ~~[items]~~), which will improve performance.
* DataSources: ```getRowOptions``` is called on each update, allowing to dynamically change rows behavior. For example, you can dynamically enable/disable checkboxes in Tables or PickerInputs.
* DataSources: getRowOptions - DataRowOptions now implements `IEditable<TItem>` interface. This allows to make rows editable, by passing value/onValueChange directly, or by using lens.toProps(): `getRowOptions(item) => lens.prop(item.id).toProps()`

* [Breaking Change]: DataTableCell layout reworked.
  * Cells and tables tweaked to support vertical borders, hover/focus border effects for editable cells
  * Now, cell content is rendered in flexbox context (was block). Please review cells layout (alignment and width of the cells content)
  * DataTableColumn - new prop: justifyContent, which sets appropriate flexbox property. Can be used to align items horizontally. If omitted, we use existing textAlign property to set it. I.e. you can still use textAlign: left/center/right to align textual cell content.
  * DataTableCell renders focus/hover effects (borders) on their own. We removed these effects from all inputs with mode='cell'.

* [Breaking Change]: DataTable columns widths props are simplified. Columns width are defined by width (in pixels), and (optionally) grow - which defines a part of empty space for column to occupy. Props affected:
  * shrink prop - marked @deprecated. It will be removed in future versions.
    'shrink' prop wasn't supported even before this change, so you can safely remove it from all columns.
    Column can't 'shrink' (become less than width), as we add horizontal scrolling instead of shrinking in case all columns doesn't fit.
  * 'width' prop is now required (was optional).
    If you didn't have 'width' on a column, most probably you mean width=0 and have grow=1 - to make the column to occupy all empty space. You can set width: 0 explicitly in such cases.
  * 'minWidth' prop now doesn't work as flex-item prop, it only serves as minimum width for manual column resizing. Default is minWidth = width.

* [Breaking Change]: DataSources doesn't work with array/object ids by-default. In certain cases, we used IDs like [123, 'group-row'] to handle scenarios when there are different types of entities, with overlapping ids. E.g. item groups, and actual records in grouping table case. They are no-longer supported by default.
  * If you use such ids, set `complexIds = true` prop when creating DataSource. In this case, DataSource will use JSON.stringify to use IDs as Map keys internally. This was default behavior prior this change, which has impact on performance, so it's made optional
  * number and string ids are supported correctly by default

* useForm now provides two new callbacks: setValue and replaceValue.
    They work the same way as setState of React.useState.
    Besides a plain new form value, both can accept a function `(currentValue: T) => T`. This option is useful if you want to use `useCallback` to memoize operations on the whole state of the form.
    setValue acts as a usual user-made change to a form - sets isChanged, creates undo checkpoint, etc.
    replaceValue doesn't update isChanged, and can be used for technical needs. E.g. to store values like 'currentTab' in the form state.

* Metadata<T> type - 'all' prop now infer the type of array element or object values (was typed as 'any')

* Lenses now memoizes all methods calls (.prop, .item, etc.).
    This allows to not re-create onValueChange callbacks on re-renders.
    In turn, it opens a way to use React.memo/shouldComponentUpdate optimization for IEditable components.

* [PresetsPanel]: Added new `PresetsPanel` component, which allows you to save your current filtration into presets and manage them. See demo [here](https://uui.epam.com/demo?id=filteredTable).

* [AdaptivePanel]: Added new `AdaptivePanel` component. This component helps you to layout elements inside container and hide items by their priorities if they didn't fit.
* [MainMenu]: reworked based on `AdaptivePanel`, now you can provide menu elements in new format via `items` prop. But we also left working old approach with children, so no action is required from your side.

* [Numeric Input] - reworked to display number is locale format (e.g. with decimal and thousands separators) while not being edited.
  * Formatting can be disabled with the `disableLocaleFormatting` prop
  * min/max are no longer required. By default, NumericInput only accepts positive whole numbers.
  * A lot of display options are now possible via NumberFormatOptions: currencies, units, flexible min/max fractional digits limits, etc.
  * See more at the [docs page](https://uui.epam.com/documents?id=numericInput&mode=doc&skin=UUI4_promo&category=components)

* [RangeDatePicker]: Added onFocus and onBlur props
* [PickerInput]: added ability to pass rawProps to modal window
* [Modals]: added `disableCloseByEsc` prop to `ModalBlocker`
* [Accordion]: API improvements, added opportunity to overwrite title.
* [DropdownMenuButton]: added possibility to provide onClick for icon
* [FilterToolbar][Breaking change]: renamed `FilterToolbar` component to `FilterPanel`
* [FilterPanel]: added numeric filter type
* [FilterPanel]: improvements and bugfixes
* Build target for packages is changed from ES5 to ES6. This shouldn't affect existing apps, as most app builds into ES5 anyway, including the latest CRA.
* [ModalContext]: added argument to abort method


**What's Fixed**
* Fixed `rawProps` prop typings
* [DndActor]: improved 'inside' position calculation
* [useForm]:
  * fixed revert/undo/redo behavior after save
  * `onValueChange` now triggers internal validation logic (as with changes made with lenses)
  * refactored to remove unnecessary re-renders in some cases
  * ArrayDataSource/ArrayListView now generates row indexes starting from 0 (was from 1)
* [Button]: Added default type 'button' for all buttons.
* [RangeDatePicker]: fixed styles for presets block
* [Datepicker]: fixed unnecessary onValueChange calls
* [LabeledInput]: changed paddings for validationMessage
* [PickerInput]: fixed issues with focusing at PickerToggler
* [NumericInput]: added behavior for input without value and with min prop on focus lost
* [MainMenu]: fixed styles for non-clickable elements
* [ErrorHandler]: fixed context listeners unsubscribing on second render
* [ColumnConfigurationModal]: fix column dnd on first position
* [TabButton]: reworked notify dot styles, placed after caption element, change paddings
* [PickerInput]: fixed row selecting by 'enter' pressing

# 4.8.5 - 15.09.2022

**What's Fixed**
* [RTE]: fix readonly mode
* [ErrorHandler]: fix 'dark' theme error container styles

# 4.8.4 - 09.09.2022

**What's Fixed**
* [RTE]: fix wrong image size on first render
* [RTE]: fix cursor jumping on new text typing in chrome 105+ version
* [RTE]: fix image reducing to the minimum size when trying to resize it without focus on it

# 4.8.3 - 01.09.2022

**What's Fixed**
* [PickerInput]: disabled elements in multi-picker no longer can be deleted with cross at tag in the input. Before this fix, cross icon was visible, and clicking it caused crash
* [LazyDataSource]: Select All now selects only currently visible items. Prior the fix, all items which was loaded before (e.g. with other/no filters) was selected.
* [useVirtual]: Improved visible range computation:

  Virtual lists now adjust visible area in fixed-sized 'blocks'. E.g. topIndex, visibleCount, and from/count in LazyDataSource requests will be always divisible by Block Size. This helps to avoid cases when only several rows are requested on small scrolls. This also can help with pageNo/pageSize-oriented API. Block size defaults to 20, and configurable with `blockSize` prop.

  We also render more rows above and below visible area to avoid blank areas and loading rows when scrolling at normal speed. This is also configurable with `overdrawRows` setting (defaults to 20, meaning at least 20 rows above/below the visible area are rendered)

  This change also fixes the problem when lazy-loading stops, while the end of the list is not reached.
* [FilterPanel]: fix filter toggler value if selected item id === 0
* [FilterPanel]: fix add new filter error after all filters was cleared
* [FilterPanel]: remove filter value when uncheck filter from 'Add filter' dropdown

# 4.8.2 - 22.08.2022

**What's New**
* [FilterPanel]: add possibility to add predicates for filters. For this provide `predicates` array in `TableFiltersConfig`.
* [DataTable]: add possibility to reset sorting to default value

**What's Fixed**
* [PickerInput]: fix input with minCharsToSearch props. Fix toggler input size in 'multi' mode

# 4.8.1 - 10.08.2022

**What's New**
* Add `rawProps` prop for the rest part of the components
* Updated icon pack
* [PickerItem]: add possibility to pass icon
* [FiltersPanel]: add possibility to provide your own `renderRow` callback
* [DatePicker]: add `placement` props
* [DataTable]: add default 'not results found' state
* [PickerModal]: add default 'not results found' state
* [FilterToolbar]: small improvements and bugfixes


**What's Fixed**
* [PickerInput]: rework styles for selected value in toggler
* [DataTable]: fix table rerender when columns prop changed
* [NumericInput]: don't allow '+' and 'e' symbols
* [LinkButton]: fix focus state
* [RangeDatePicker]: fix error when preset is `null`
* [NotificationCard]: rework styles


# 4.8.0 - 21.07.2022

**What's New**
* Added new `FiltersToolbar` component, which creates table filtration toolbar according to the `TableFiltersConfig` object. See demo here - https://uui.epam.com/demo?id=filteredTable
* [Form]: implement possibility to run form validation on field change, for this pass `validationOn: 'change'` to form props
* [DropdownContainer]: reworked styles, add possibility to show arrow tip
* [Anchor]: implement open Anchor links with Ctrl or Command in new window
* [PickerInput]: add 'fixedBodyPosition' prop, to have possibility to fixed body on initial position in case when toggler moved
* [FileUpload]: rework error states

**What's Fixed**
* [DropSpot]: fix drag&drop area view
* [NumericInput]: fix arrows layout hidden when input disabled or readonly
* [DropdownMenu]: fixed item active state
* [Avatar]: fix ref receiving
* [RTE]: remove unnecessary editor state update on image load
* [PickerInput]: remove close icon from tag in disabled/readonly mode
* [PickerInput]: change styles for search in body
* [Badge]: fixed semitransparent hover colors
* [Tooltip]: change tooltip logic, when the new children is passed. Fixed loop, when a lot of listeners was attached
* [RangeDatePicker]: fix preset styles
* [MainMenuButton]: reworked styles for dropdown items

# 4.7.1 - 06.06.2022

**What's New**
* [Buttons and Anchors]: support SPA links opening in new window when Ctrl/Command key pressed

**What's Fixed**
* [DropSpot]: fix dnd behavior when user drag&drop file out of drag area
* [PickerInput]: fix the second line tag margin in multi mode
* [NumericInput]: hide arrows when input disabled or readonly
* [DataTable]: added missing sizes styles for header
* [ErrorHandler]: return getDefaultErrorPageProps and recoveryWordings export from loveship
* [useForm]: handle rejected promise after save
* [Burger]: fix scroll on body when burger closes
* [VirtualList]: fix auto scroll onHover on top or bottom item

# 4.7.0 - 30.05.2022

**What's New**
* Added new hook - `useTableState`, which helps to organize table state management with filters, presets and storing it into URL. See demo here - https://github.com/epam/UUI/blob/main/app/src/demo/table/FilteredTable.tsx.

  Note: this hook in WIP stage now, so there may be some changes in api and functionality

* [uuiRouter][Breaking Change]: added 'query' param parse/stringify handling inside `uuiRouter`. If you use some helpers for this, like 'qhistory', please remove it, now it will work out of the box with uuiRouter
* [ICanFocus]: implement ICanFocus interface in TextInput, NumericInput, PickerInput, Checkbox, DatePicker. Fix focus/blur behavior for PickerInput.
* [MultiSwitch]: added 'gray' color style
* [VirtualList]: add vertical flex context for scroll container
* [ArrayDataSource]: check parent if all siblings is checked


**What’s Fixed**
* [Badge]: fix layout for 'transparent' fill
* [Paginator]: fix layout in loveship
* [DataTableRow]: fix 'area-expended' value
* [DataTable]: fix no results block layout
* [useForm]: update initialForm value in case when new prop.value received, after successful save and revert action
* [MainMenuBurger]: set overflow: hidden on body when burger opens to prevent scroll
* [PickerItem]: fix paddings for text
* [DataPicker]: fix outdated picker value  after invalid date was typed in input
* [ArrayDataSource]: fix selectAll checkbox behavior in case when all row checkboxes disabled
* [Alert]: fix paddings
* [Paginator]: fix focus hold after page change


# 4.6.3 - 27.04.2022

**What's New**
* [uui-db]:
  * dbRef.save() now returns a Promise. It also passes thru errors returned from savePatch() method. This opens ways for a custom error handling, or to execute certain actions after saving changes.
  * auto-save scheduling is refactored. How it can batch sync commits, and throttles calls more accurately. We don't expect breaking changes, however you might want to double-check this.
  * records deletion support. To enable deletion, set 'deleteFlag' prop in Table metadata. E.g. deleteFlag: 'isDeleted'. Deleted records will be removed from tables when committing changes setting this flag. The flag will be passed as is to dbRef.savePatch, it's up to application to decide how to handle it while saving changes to server.
* [VirtualList]: added `scrollToIndex` property for `DataTableState`. Use it for manual scrolling to some index in the list. For example for scrolling to top of the DataTable on filter or page change.
* [Timeline]: more customization options: renderOnTop callback, most render-methods made protected to allow overrides

**What’s Fixed**
* [LazyListView]: fix indent for flat lists
* [MainMenu]: fix MainMenu responsive

# 4.6.2 - 20.04.2022

**What's New**
* [PickerInput]: add prop onClose to renderFooter callback
* [PickerModal]: add success & abort props to renderFooter callback
* [RTE]: added scrollbars prop to RTE to support internal and external scrollbars
* [MainMenu]: update styles in loveship
* [ApiContext] allow to customize /auth/login and /auth/ping endpoint addresses
* [ModalBlocker]: add possibility to disable focus locking inside modal

**What’s Fixed**
* [MainMenuIcon]: wrap into forwardRef
* [Anchor]: wrap with forwardRef
* [Tables]: set minimal flex-grow: 1 for scrolling section, to stretch it in case when all columns grow is not set or has '0' value
* [ErrorHandler]: change errors image source from http to https
* [Timeline] fixed issues when user zooms in/out in browser
* [DataTable]: fix column width in case when in columnsConfig there are columns only minWidth
* [PickerInput]: fix focus in readonly mode
* [ErrorHandler]: fixed am issue, which causes page re-render on errors
* [ErrorHandler]: fix error codes handling in loveship
* [RTE]: fix the position of the placeholder to match the position of the inner text
* [DataPickerRow]: do not call onFocus callback when it's not passed
* [PickerModal]: fixed issue when search is not working if 'Show only selected' applied
* [Button]: fixed text color for "fill:light" props in Promo skin
* [LazyDataSource]: fix indent for nested children

# 4.6.1 - 22.03.2022

**What’s Fixed**
* [MainMenu]: fix 'More' dropdown crashing in loveship
* [PickerInput]:  fix autofocus on search in loveship
* [PickerInput]: fix crashing by clicking on'Show only selected' toggle
* [Table]: fix row width for columns with minWidth value

# 4.6.0 - 14.03.2022

**What's New**
* `@epam/uui` package was moved to the `@epam/uui-core`. We re-export `@epam/uui-core` form `@epam/uui`, so no need to replace imports in your code.
* Remove deprecated react `findDomNode` usage:
  * Breaking changes:
    * [Dropdown]: need to pass `ref` from `renderTarget` callback params to the target node
    * [DndActor]: need to pass `ref` from `render` callback params to the rendered root node
    * [Tooltip]: children should accept `ref` prop
* Stronger types for `rawProps` prop for all components. Now it's accept only `React.HTMLAttributes<T>` and `data-${string}` attributes.
* [PickerInput], [TextInput]: Added prefix and suffix props
* [SlateEditor]: added ScrollBars to Editor
* [NumericInput]: added 'cell' mode

**What’s Fixed**
* [PickerToggler]: Remove redundant toggler focusing on tag clear
* [PickerToggler]: If not enought chars clear picker input on blur
* [PickerInput]: don't close picker in case when you remove search value
* [PickerInput]: don't load list on PickerInput mount
* [NumericInput]: Fixed handling float numbers
* [Form]: release Lock on form unmount
* [LazyDataSource]: rework cascade selection logic


# 4.5.4 - 10.02.2022

**What’s Fixed**
* [DataTable]: bug fixes
* [NumericInput] doesn't allow entering letters in safari
* [Portal]: fix portal crashing when it's try to remove portal child from root and root doesn't already exist in DOM
* [FileUpload]: update labels
* [Tree]: Re-create dataSource based on new props
* [Text]: add typography class to have possibility use Anchor inside Text with skin styles
* [FileCard]: fix progress behavior, remove extension from name
* [Form]: fix isChanged reset to false on form revert

# 4.5.3 - 20.01.2022

**What’s Fixed**
* [DataTable]: bug fixes
* [DataPickerFooter]: remove switch duplication in loveship
* [Badge]: removed redundant prop font for Badge

# 4.5.2 - 18.01.2022

**What's New**
* [Form]: Add isBeforeLeave param to onSuccess callback
* [MainMenuSearch]: add IEditableDebouncer
* [PickerInput]: add hideShowOnlySelected props for DataPickerFooter component
* [ModalFooter]: add cx prop

**What’s Fixed**
* [DataTable]: bug fixes
* [PickerModal]: renderFooter props type fix
* [DnD]: fix drag ending on not draggable element

# 4.5.1 - 12.01.2022

**What's New**
* [LazyDataSource]: add logic for check/uncheck parents if all/no siblings checked in cascadeSelection mode
* [NotificationCard]: Added rawProps

**What’s Fixed**
* [DataTable]: Fix styles for loveship skin, fix columns layout
* [PickerInput]: fix picker body closing on mobile after opening keyboard
* [PickerInput]: Fix placeholder ending for single selection mode
* [ContextProvider]: revert history in ContextProvider
* [PickerToggler]: don't crash when onClick props is not passed

# 4.5.0 - 23.12.2021

**What's New**
* [Breaking Change]: Changed VirtualList component api. Introduced new useVirtualList hook.
    More information here - https://uui.epam.com/documents?category=components&id=virtualList#advanced

* Improved SSR support and introduced uui next.js app template. More information here - https://github.com/epam/UUI/tree/main/templates/uui-nextjs-template.
* Added rawProps attribute to ModalHeader, ModalFooter, PickerInput, RangeDatePicker, DatePicker, TimePicker. Removed 'id' prop from PickerInput, DatePicker, TimePicker.
* [FileCard]: Added extension to file card. Bugfixes.
* [ArrayDataSource, LazyDataSource]: Added disableSelectAll attribute
* [RTE]: Added isEditorEmpty helper. Bugfixes.

**What’s Fixed**
* [DataPickerRow]: Fix tick icon alignment
* [MainMenu]: remove fill style from burger icons source
* [PickerInput]: fix bug when picker value === 0
* [DropdownMenu]: fix reset fonts for DropdownMenuButton
* [DropdownMenu]: Don't focus the first action in dropdown menu on menu opening
* [LockContext]: fix typings for 'release' method
* [BurgerButton]: fix BurgerButton icon color if isActiveLink=true

# 4.4.0 - 07.12.2021

**What's New**
* [Drag&Drop]: added mobile devices support
* [ErrorHandler]: added to 'promo' skin
* [PickerInput]: add possibility to pass icon to the toggler
* [DropSpot]: move wordings to the i18n

**What’s Fixed**
* [Router]: remove history types dependency from UUI, fix types for location.state
* [TextPlaceholder]: fix placeholder visibility for Safari
* [Form]: fix lens batch updates
* [Checkbox]: added default value, fixed alignment for label
* [ApiContext]: fix bug when 'connection lost' modal was shown on canceled fetch request
* [IconButton]: fix the IconButton color on focus when the button is disabled
* [SearchInput]: fix accept and cancel icons visibility when onAccept and onCancel callback are passed and value is empty
* [BurgerButton]: fix styles

# 4.3.0 - 25.10.2021

**What's New**
* [Lens][BreakingChange]: now if your get value from non-exist nested object field you will receive 'undefined' instead of 'null'
* [DataPickerFooter][Breaking Change]: changed DataPickerFooterProps interface.
* [Form]: introduced new useForm() hook
* [RouterContext]: extended Link interface by 'key', 'hash', 'state' fields
* [SlateEditor]: added onBlur and onKeyDown props

**What’s Fixed**
* [SlateRTE]: don't keep source formatting background-color when paste html in editor
* [Tag, Badge]: reworked styles according design
* [MainMenu]: reworked styles according design in Promo skin
* [DataTable]: added work of renderNoResultsBlock props without default behavior
* [Accordion]: remove overflow: hidden; style from body

# 4.2.7 - 13.10.2021

**What's New**
* [PickerModal, PickerList]: add disallowClickOutside prop
* [DataTableCell]: removed labelColor prop and reusePadding from Loveship & Promo skins, reworked html structure

**What’s Fixed**
* [Button]: fix tooltip on disabled button
* [PickerInput]: fix picker closing by clicking on toggler arrow
* [PickerInput]: fix selected item color when searchPosition='none'
* [Modals]: fix mobile view
* [SlateEditor]: add 'null' type for value prop

# 4.2.6 - 07.10.2021

**What’s Fixed**
* [ArrayListView, LazyListView]: fix checkbox behavior in parent row of tree-table when child is checked and disabled, and selectAll checkbox behavior if there are some disabled rows in list;
* [Form]: fix form validation after beforeLeave modal save action;
* [TimePicker]: fix incorrect onClear behaviour;
* [SliderRating]: improve performance; fix invalid behavior of reverting back to selected value after mouse leave;
* [PickerInput]: close picker body when user lose focus from input;
* [PickerInput]: fix 'body' scroll in mobile view;

# 4.2.5 - 28.09.2021

**What's New**
* rework keyboard and focus/blur functionality in pickers
* [VerticalTabButton]: added new component for vertical tabs
* [DropdownMenu]: added keyboard support in Promo skin

**What’s Fixed**
* [PickerInput]: improve mobile view
* [Modals]: improve mobile view
* [PickerInput]: fix dropdown icon click handler
* [LabeledInput]: remove children wrapping into label tag. Added htmlFor prop for linking label and control in forms.

# 4.2.4 - 17.09.2021

**What’s Fixed**
* [Table]: fix row checkbox selection if row is link

# 4.2.2 - 17.09.2021

**What's New**
* [ProgressBar]: implemented a new component to make possibility display a determinate progress bar with different sizes striped animation
* [IndeterminateBar]: implemented a new component to make possibility display indeterminate progress with different sizes.
* [IndicatorBar]: implemented a new component to use as the top indicator of page loading. Has a fixed size and can be determinate or indeterminate.

**What’s Fixed**
* [PickerInput]: fix size of PickerToggler in size-24 loveship skin
* [MainMenu]: Do not render logo if url is not provided
* [DatePicker]: fix validation date onBlur
* [DatePicker]: fix calling onValueChange 2 times on date selection
* [DropdownMenu]: fix 'style' prop from DropdownMenuContainer
* [MainMenuSearch]: fix 'cx' prop
* [RadioInput]: fix applying border color for invalid RadionInput in promo skin
* [Table]: fix row checkbox selection if row is link
* [CheckBox]: fix invalid style
* [DropdownMenuButton]: remove default value for target prop
* [Dropdown]: fix onClose handler if you manage dropdown state by yourself
* [Modals]: fix modal blocker container adjustment on mobile view


# 4.2.1 - 31.08.2021

**What's New**
* [PickerInput]: improve adaptation for mobiles
* [Modals]: lock focus inside modal window

**What’s Fixed**
* fix styles issues with some components in Safari

# 4.2.0 - 23.08.2021

**What's New**
* Improved accessibility and keyboard support for a lot of components
* Replace Moment by Dayjs
* Added mobile view for Pickers
* [AnalyticsContext] [Breaking Change]: Removed amplitude client from UUI and implemented IAnalyticsListener to pass any analytics client from client side. If you use Amplitude into your project, now you need to create IAnalyticsListener and add it to the Analytic Context. See the example [here](https://uui.epam.com/documents?category=contexts&id=analyticsContext);
* [DropdownMenu] Implement DropdownMenu component in UUI4[Promo].

  DropdownMenu allows you to create vertical menus with a nested structure that pops up on hover or click (default is on hover).
  The main possibilities:

        - render menu item with an icon in the left or right position ('left' as default).
        - highlight menu item as selected passing 'isSelected' prop.
        - render you own custom component as DropdownMenu item.
        - to splite items as a group.
* [AvatarStack]: add possibility render custom avatar by the prop renderItem
* [FlexRow]: add more sizes for vPadding prop


**What’s Fixed**
* [Badge]: fix cursor pointer if badge is clickable.
* [PickerInput]: fix paddings for the PickerItem, so that if the value is too long the item looks with indented.
* [MainMenuSearch]: fix passing 'onAccept' prop from MainMenuSearch to TextInput
* [VirtualList]: replace legacy react-custom-scrollbars by react-custom-scrollbars-2
* [PickerInput]: fix pass the mode prop to PickerToggler so that apply correct style according to the mode
* [Button]: fix the text color for the button so that the text and border color are the same color
* [TextArea]: fix scrolling jump after typing when received autosize prop
* [VirtualList]: fix the width for container

# 4.1.1 - 05.07.2021

**What’s Fixed**
fix bug when enzyme includes in result build bundle
fix UUI context multiple creation
[NumericInput]: fix calculation with floating point numbers
[Typography]: fix global margin and padding for tags and elements
[PickerInput]: fix paddings for the PickerItem, so that if the value is too long the item looks with indented.

# 4.1.0 - 30.06.2021

**What’s New**
* [DataSources][Breaking Change]: Added required 'deps' argument for all DataSources hooks. Please review all your dataSources hooks usage and decide which deps do you need or set '[]'.
* [React Context]: added support for new React Context API. Consider switching to new context APIs in your components (or keep using the global ctx variable pattern). In class components you can use "static contextType = UuiContext", in function components you can use the hook "useUuiContext". Legacy context API still works in parallel with the new API. We'll keep support for legacy context API for at least 3 month (can be extended if projects would ask to prolong the support). You can explicitly disable legacy contexts with enableLegacyContexts={ false } prop on the ContextProvider. It is recommended if you don't use legacy contexts
* removed legacy lifecycle methods
* [NumericInput]: Now NumericInput supports transfer of formatter function. The function responds to the onBlur action.
* [PickerInput]: pass onFocus and onBlur in props

**What’s Fixed**
* Update packages and fixed warnings
* [LinkButton]: fix hover styles for disabled button
* [PickerInput]: fix the switching of opening / closing a portal with a list when clicking on PickerInput when there is a search value so that you can copy or correct the search value
* [PickerInput]: fix clear icon in PickerInput when searchPosition is 'body' and there are no selected items.
* [PickerInput] fix: incorrect search behavior in 'show only selected' mode
* [TextPlaceholder]: fix displaying 0000 if the Redacted font is not loaded yet
* [DataTable]: add 'Reset to default' button in ColumnsConfigurationModal for the loveship
* [TextInput]: add 'undefined' to input IEditable interface
* [LazyListView]: update checked lookup when value.checked is changed
* [AnaltyticsContext]: add missed type for public property
* [VirtualList]: Fixed issue with dynamic items heights
* [PickerList]: fixed sorting direction
* [LazyDataSource]: exactRowsCount is now returned when known

# 4.0.0 - 07.05.2021

**What’s New**
* [LazyDataSource] now supports nesting (grouping, trees) with lazy loading.

  Quick start:
    - pass the ```getChildCount(item): number``` prop. It should return an either:

        - exact number of item's children (a server can return this as an parent's field)
        - a guessed/average number of children (e.g. 1) (this can result more API calls if items are unfolded by default)

    - update the 'api' callback to accept a second argument. When children are needed, we'll pass a parent entity in this new argument.
      Change your callback to perform request to server to retrieve children.

        - if you have different server APIs for parent and children, just tweak your 'api' callback like this:
            ```
            api: (rq, ctx) => {
                if (!ctx.parent)
                    return callParentApi(rq);
                else
                    return callChildrenApi(rq);
            }
            ```

        - if you want to retrieve children as parent's field, you can return them in api callback directly from parent's field, like: ```Promise.resolve({ items: ctx.parent.chidren, count: ctx.parent.children.length })```

    * [Breaking Change] Item lists caching is moved from LazyDataSource to LazyTreeView.
      Items by ID cache is still in the LazyDataSource.
      We also stoped caching any previous loads of lists.
      This means that:
        - there can be a bit more load on server
        - there can be issues, if you rely on LazyDataSource internal cache somehow

    * [Breaking Change] LazyDataSource's 'cacheSize' prop is removed.
      There's no more lists cache in the LazyDataSource (except the items by id cache)

    * [Breaking Change] DataSources and DataSourceView internal APIs changed.
      BaseDataSourceProps, [Lazy|Array]DataSourceParams, [Lazy|Array]DataSourceOptions, [Lazy|Array]ViewParams, [Lazy|Array]ViewOptions interfaces are merged into [Lazy|Array]DataSourceProps and [Lazy|Array]ViewProps.
      Applications which implements it's own DataSources, or leverage on these interfaces somehow, might need to update.

    * [Breaking Change] LazyDataSource always query from the start.
      Before, it was able to query the middle of the list, without querying start items.
      This can't be supported for 2-nd level of lists, and we don't see much use of this feature.
      Contact us if you really need this behavior.

    * [Breaking Change] LazyDataSource's generic parameters order changed from TItem, TFilter, TId, to a common TItem, TId, TFilter.

* DataRowProps - extended with 'isLastChild' and 'path' props.
  isLastChild is true, if this row is the last of it's parent's children.
  Path prop contains all row's parents' ids and isLastChild prop.

  These props are required to implement tree components, which renders lines connecting children with parents.

  Both Lazy and ArrayDataSources supports these new props.

* [Forms] Forms validation - better cross-fields dependencies.
  'validate' function in Metadata now receives all parent objects in path as argument.
  Each validator receives N arguments - first is the value itself, then it's container, and down to the root object.
  You can use this to make validation dependencies between items. For example:
  ```
    const value = { array: [{ id: 100, name: 'abc' }, { id: 101, name: 'bcd' }] };
    const nameValidator = (name, item, array) => [item.id > 100 && name.length < 2 && "Items with ID > 100 should have names longer than 2"];
    const meta = { array: { all: { props: { name: { validators: [nameValidator] }}}}};
  ```

* [Form]: Added server validation mechanism. If you need to get form validation state from server-side, your onSave api should return object like `{ validation?: ICanBeInvalid }`

* [Tables]: Added columns resizing and reordering possibility:
    * Added 'allowColumnsReordering' and 'allowColumnsResizing' props to the DataTable and DataTableHeaderRow.
    * Columns config was moved to the DataTable value.
    * [Breaking Change]: Removed 'settingKey' prop form DataTable, if you are using it for storing your columns in localStorage — implement it manually on your side via ```svc.uuiUserSettings``` context.

* [Tooltip] & [Dropdown]: Popper.js updated to v.2.x, added 'hide' modifier to hide body when target scrolled outside view
    * [Breaking Change]: In Popper 2 modifiers is now an array of objects, instead of an object where each property was the modifier name in the previous version. [More information.](https://popper.js.org/docs/v2/migration-guide/)

* [Promo]: Added 'cell' mode for components which can be placed in table row
* [Accordion]: Added "padding" and "renderAdditionalItems" props
* [AnalyticContext]: add ip anonymization for google analytic
* [AnalyticsContext]: add includeReferrer: true, includeUtm: true, saveParamsReferrerOncePerSession: false options for amplitude
* [TimePicker]: added handling of invalid values, added placeholder
* [SlateRTE]: show image toolbar on image isFocused
* [PickerInput]: added PickerItem component, added 48 size, refactored footers according design, changed default prop 'minBodyWidth' to 360
* [DataTableCell]: added prop alignAddons to align checkbox & folding arrows to the top or center
* [Badge]: added transparent and semitransparent fill; Added more sizes;

**What’s Fixed**
* [LabeledInput]: fixed a bug of cropping the text of the label when it is located to the left, when the child has a width of 100% in the styles
* [ErrorHandler]: reset api error when router is changed
* [DatePicker]: fixed handling of invalid value input when filter is active
* [Tooltip]: remove pointer-events: none; from tooltip content container
* [RadioInput]: fixed RadioInput point position when zoom is active
* [TextInput] & [SearchInput]: fixed losing focus after click on 'cancel' icon
* [PickerInput]: set clickable modifier on picker body
* [DatePicker]: set clickable modifier on datePicker body
* [Table]: fixed alignment in the table row from the center to top
* [PickerInput]: fixed PickerInput behavior in entity mode and with custom id
* [PickerInput]: fix removing 'N items selected' tag when disableClear=true
* [Accordion]: fixed style according design Siarhei_Dzeraviannik 3/30/21, 12:46 PM
* [RTE]: fixed image/pfd/video block inserting into text paragraph, when it delete all text and return it back when image was deleted
* fixed contrast colors in loveship variables
* fixed line-heights & font-sizes according design
* fixed some typings

# 3.47.4 - 23.02.2021

**What’s Fixed**
* [Blocker][Promo]: fixed typings, added export
* [ReactRouter3]: fix listen method
* [Form]: fix form typings
* [MainMenu]: fix BurgerButton styles
* [MainMenu]: add onLogoClick prop


# 3.47.3 - 16.02.2021

**What’s New**
* [Blocker]: added to Promo skin
* [Fonts]: added fonts smoothing antialiased
* [Assets]: updated icons set
* [Accordion]: removed borderBottom prop, added the ability to control the state of opening/closing a component, fixed opened state style for loveship skin


**What’s Fixed**
* [LockContext]: make required to pass lock in release method
* [ErrorHandler]: fixed wrong error for JS exception
* [LockContext]: Fix block method - pass correct location into listner
* [Form]: Fix new value setting, when for isChanged and beforeLeave is null
* [LockContext]: fixed behavior when tryRelease reject promise, but lock anyway has been released
* [Form]: change isChange prop calculation


# 3.47.2 - 04.02.2021

**What’s New**
* [ContextProvider]: make 'loadAppContext' and 'apiDefinition' props is not required
* [TimePicker]: removed dropdown Icon
* [SlateRTE]: rework toolbars - some actions moved to the bottom toolbar and it always visible when editor in focus
* [SlateRTE]: added placeholderPlugin
* [TextArea]: added onFocus prop
* [ModalHeader]: added cx prop

**What’s Fixed**
* [Tree]: fixed infinite rendering
* [Spinner]: change spinner styles from inline-block to Flex
* [ArrayListView]: fixed checked ids order in value, now it equal to user select order
* [ArrayListView]: now View doesn't check children which is not passed search or filter in cascadeSelection mode
* [RangeDatePickerBody]: fixed vertical body alignment
* [ErrorPages]: change error image size
* [FlexRow]: fix defolts for 'alignItems' prop
* [DataTable]: pass column cx prop into DataTableCell
* [MultiSwitch]: Fixed selected item styles
* [LockContext]: throw error if trying to release 'null' or 'undefined' lock

# 3.47.1 - 25.01.2021

**What’s Fixed**
* [Form]: fix typings; Fix bug when form tried to release lock when lock didn't exist
* [Spinner]: change spinner styles from inline-block to Flex


# 3.47.0 - 21.01.2021

**What’s New**
* [Breaking Change]: SlateRTE now doesn't depend on skin packages. Provide skinContext prop into ContextProvider, if you are using SlateRTE.
   You can import skin context from your skin package, for example: ```import { skinContext } from '@epam/loveship';```

* [Analytics]: Added integration with Amptitude. Add simple way to send track onClick and onChange events, by passing ```clickAnalyticsEvent``` and ```getValueChangeAnalyticsEvent``` props to components. For more information go to the [analyticsContext doc](https://uui.epam.com/documents?category=contexts&id=analyticsContext) .

* [ModalContext]: added parameters argument to show method
* [FileUpload]: add 'single' prop for single file upload possibility
* [Form]: return Promise from save callback


**What’s Fixed**
* [Lens]: fixed .defalut() method logic in case when value is 'false'
* [VirtualList]: fixed scroll bars styles according design
* [ScrollBars]: refactored styles for thumb
* [ScrollBars]: added height inheritance for scroll thumb
* [Burger]: updated close icon, updated style for fader
* [dnd]: fixed bug when you try to drop item on element which don't accept drop, but his parent accept it and onDrop triggered only on child element


# 3.46.3 - 12.01.2021

**What’s New**
* [Breaking Change] UUI and edu-core-rouing packages doesn't depend on react-router and history directly anymore.
    As yarn/npm uses both your App's and UUI required versions, the version of history and react-router in your app can be changed after updating.
    This can affect your app. You can check version with ```yarn why history``` and ```yarn why react-router``` before and after update.

    This change is required to not interfere with app's versions of the router and history.
    ContextProvider still requires history object to be passed. It should have a 'IHistory4' interface - a minimal subset of the History v4 API.

    edu-core-rouing package is kept to support history and router v3 (Learn still uses them)

    Internally, we use a wrapper/proxy implementations for IRouterContext, that adapts interfaces of different history versions to our interface.
    In future, this allows us to support different routing libraries, by providing a different IRouterContext implementation.
* [Form]: added possibility to turn off locks in form by passing 'beforeLeave={ null }' prop
* [ColumnPickerFilter]: add posibility to turn on search
* [ModalWindow]: borders in header and footer are disabled by default, added the appearance of borders on scroll


**What’s Fixed**
* [PickerInput][Promo]: removed inner shadows in DataPickerBody
* [Button][Loveship]: samall fixes fill light style
* [SlateRTE]: fixed sidebar visibility on first renderCell
* [Dropdown]: fixed dropdown click outside behavior, when ckicking on dropdown with higer zIndex


# 3.46.2 - 23.12.2020

**What’s New**
* [ModalContext]: extend IModalContext interface
* [LabeledInput]: added isOptional prop which added 'This field is optional' text
* [LabeledInput]: added required asterisk mark if isRequired: true prop is propvided

**What’s Fixed**
* [DatePicker]: fixed incorrect year Switch
* [SlateEditor]: replace attachment file name input to simple text in readonly mode
* [Alert]: change cross icon


# 3.46.1 - 25.11.2020

**What’s Fixed**
* [Modals]: fixed 'cross' icon


# 3.46.0 - 24.11.2020

**What’s New**
* [Breaking Change][Assets]: updated colors variables in accordance with loveship package. Please review your colors variables which are imported from @epam/assets package. Use this migration guide - https://paper.dropbox.com/doc/imvp8VeR1R3zKYmWghE5o;
* [Switch]: added ''-clickable' class
* [MainMenu]: added logoWidth prop
* [Form]: add onSuccess and onError props
* [UUI]: update history package


**What’s Fixed**
* [dnd]: fix dnd scroll behaviour
* [PickerInput]: fixed issue when last element is not displayed in case when picker have only 21 row
* [PickerInput]: now picker closed when isDisabled prop have true value
* [PickerToggler]: fixed isDropdown prop
* [RangeDatePicker]: change displayedDate according to the focus part on picker opening


# 3.45.3 - 10.11.2020

**What’s New**
* [AsyncDataSource]: Added 'reload' functionality
* [Modal]: add closing by 'Escape' key
* [FileUpload]add fileUpload components to 'PROMO' skin

**What’s Fixed**
* [NumericInput]: fixed increase/decrease handlers
* [DataTable]: style fixes for 'Not results found' block
* [PickerInput][Promo]: fixed styles in disabled state
* [PickerToggler][Promo]: fixed indent between tags
* [ModalHeader][Promo]: set borderBottom prop to true as default
* [MainMenuAvatar][Promo]: fixed non-correct bg color in hover and active states whith active isDropdown prop
* [Alert]: remove icon wrapper when icon not passed


# 3.45.2 - 27.10.2020

**What’s New**
* [Breaking Change][Loveship][Alert]: removed type prop, added posibility to configure color, icon and other props by yourself. Added separate SuccessAlert, ErrorAlert and ect. components with predefided set of props. Removed fixed width.
* [LazyDataSource]: Added maxCacheSize prop
* [PROMO]: rework components shadows
* [Tree]: rework Tree component
* [Notification Context]: reject promise when notification closed by timeout

**What’s Fixed**
* [TabButton]: fixed indent beetwen icon and counter
* [MainMenuIcon]: fixed cx prop
* [DatePickers]: fixed selected value in 'month' and 'year' mode

# 3.45.1 - 14.10.2020

**What’s New**
* [SliderRating]: added possibility to provide our own icons
* [SlateRTE]: set attachment icon according with file extention

**What’s Fixed**
* [NumericInput]: fixed nehavior when input shows placeholder when initial value is 0

# 3.45.0 - 08.10.2020

**What’s New**
* [MainMenuButton]: add cx prop
* [Tooltip]: add white color to PROMO
* [Tables]: added to PROMO skin
* [DatePicker]: added renderFooter prop to loveship & promo skin

**What’s Fixed**
* Change scss modules imports approach. Packages size has been reduced.
* [SlateRTE]: minor styles and icons fixes
* [Lens]: run custom validator in priority over isRequired and ect. validation
* [SlateRTE]: allow full screen in videos
* [PickerInput]: fixed keyboard navigation
* [TimePicker]: fixed invalid value errors
* [Loveship]: minor colors change
* [NotificationCard]: minor styles changes

# 3.44.2 - 25.09.2020

**What’s New**
* [NotificationContext]: added new methods in typings

**What’s Fixed**
* [SlateRTE]:remove loveship dependency usage and fix build error
* [ModalHeader]: change borderBottom default condition

# 3.44.1 - 23.09.2020

**What’s New**
* [SlateEditor]: redesign
* [RangeDatePicker]: pass cx prop to picker body container
* [DatePicker and TimePicker]: added to PROMO skin
* [DataTable]: added no results block and appropriate prop renderNoResultsBlock

**What’s Fixed**
* [MainMenuAvatar]: changed arrow triangle to folding arrow in mainMenu promo
* [DataTable]: fix styles for config icon
* [VirtualList]: fixed scrollbar apearing on 100%+ browser zoom
* [Dropdown]: fix bug with SFC as a target

# 3.44.0 - 31.08.2020

**What’s New**
* [MainMenu]: redesign
* [MainMenu]: added customerLogoLink and customerLogoHref props
* [Tag]: added Tag components and use it in PickerInput
* [Draft-rte]: add clear format button
* [MainMenuSearch]: added cx

**What’s Fixed**
* [DatePickerBody]: Fix incorrect selected date changing. Divide selectedDate setter and displayedDate setter

# 3.43.4 - 24.08.2020

**What’s New**
* [Blocker]: added possibility to define renderSpinner functionality
* [BaseRangeDatePicker] add placement prop
* [PROMO]: Add form component
* [ApiContext]: add request abort supporting

**What’s Fixed**
* [PickerInput]: fixed clear selection for lazyDS
* [PickerInput]: retunr mode prop

# 3.43.3 - 31.07.2020

**What’s New**
* [SliderRating]: Added 18 and 24 size
* [VirtualList]: add scroll to focusedItem on mount

# 3.43.2 - 20.07.2020

**What’s New**
* [DataTable]: passed topIndex value to virtualList
* [PickerInput]: added renderFooter prop for PickerInput

**What’s Fixed**
* [RangeDatePicker]: fixed incorrect focus change, when changing only dislayedDate


# 3.43.1 - 13.07.2020

**What’s New**
* [Accordion]: added to loveship package
* [Error Pages]: added dark theme for error pages
* [TimePicker]: added 24h mode
* [DatePicker]: removed dropdown icon

**What’s Fixed**
* [PickerInput]: remove dropdownIcon, when minCharsToSearch prop is passed
* [Slate]: sanitize link and iframe url to prevent xss

# 3.43.0

* Refactor and redesign 'cell' mode for form components
* [Slate]: move cx to the container
* [Slate]: chage code block type from 'Block' to 'Mark'
* [Slate]: fixed placeholder visibility
* [RangeDatePicker]: Added possibility to select 1 day range
* [Button]: fixed zero count bug
* [ErrorHandler & ErrorPage]: added cx prop


# 3.42.4
* Added NotificationCard and Alert components for PROMO skin
* [Slate]: added real file size string for attachments
* [Slate]: fixed editor focus loosing by columns resizing

# 3.42.3
* [Tables]: Added isHiddenByDefault option in columns configuration
* [Tables]: Added settingsKey prop in DataTable component, which define which localStorage key use for get/set user columns config
* [DatePicker]: fixed incorrect input typing behavior
* [TextPlaceholder]: Change default color from night50 to night100
* [Promo]: Add TabButton components
* [ArrayListView] : add possibility to 'select all' when search applied
* [PickerInput]: fixed bug with calling onValueChange for each dsSate change in entity mode

# 3.42.2
* [TextPlaceholder]: Disabled animation in Firefox, because it caused performance issues
* [RadioInput]: fixed dark theme styles

# 3.42.1
* [TabButton]: Redesign, add counter and notification mark
* [TextPlaceholder]: add cx prop

# 3.42.0

* [Breaking Change]: Updated colors palette to matсh design specification.
   - Color names stayed the same, only hex changed;
   - New colors variables moved to @epam/loveship from @epam/assets. Old variables stayed in @epam/assets.
     So, if you use our variables in your project, and now don't ready to do this migration, just leave import from @epam/aseets in your styles.
     If you want to use new colors, please import styles from '@epam/loveship/assets/styles';
   - Pay additional attention on components where you pass color by props, for example `<Text color='night400'>`, especially for gray scale colors(probably you will not face a problems with not gray scale colors).
     Because, almost all 'night' colors changed their tone and sometimes you will need to use another color instead you have before.
     If you have questions, which color to use - please contact your project designer or use this guide:
     https://paper.dropbox.com/doc/--A1NdX6WtujbRU1oJEYkcIehTAg-imvp8VeR1R3zKYmWghE5o

* [PickerModal]: fixed renderFilter functionality;
* [Avatar]: change http to https from avatar placeholder URL;
* [VirtualList]: disable default browser x-overscroll behavior;
* [Tables/Pickers]: added 'link' option for DataRowOptions;

# 3.41.2

* [IconContainer]: Added for loveship and promo skin;
* [Context]: force setState batching for handlers update;
* [PickerModal]: added picker 'View' for renderFooter callback;
* [Pickers]: added 'sorting' prop, by which you can specify sorting filed for picker rows;
* [Tables]: removed ArrayDataColumnProps interface, use DataColumnProps instead;
* Change Roboto Condensed font src to epam cnd;


# 3.41.1

* [PickerList]: Fix renderRow prop
* [PickerInput]: added getSearchFields prop
* [Slate]: added cx prop


# 3.41.0

* Customizable client-side errors: throw new UuiError with parameters to customize error page.
* Refactor lodash to per method packages
* [DataTableHeaderRow] - correctly show sorting icons if sorting.direction == null
* [TextPlaceholder] - changed animation (not bound to element size anymore)
* [Modals]: Fixed auth-lost modal title message
* [NumericInput]: Fixed incorrect value changing from keyboard
* [PickerInput]: added isFoldedByDefault prop
* [TextInput]: fixed double update of onChange handler
* [LazyListView]: removed rowsByKey cache. LazyDataSource.clearCache method should work correctly.
* [ListViews]: set default value for 'options'
* [Dnd]: Fixed dnd behavior on page with scroll. Added unsubscription from listeners in DragGhost.

# 3.40.1

* [Breaking Changes]:
  - [PickerInput]: Now searchPosition: 'body' is default behavior. Earlier it was searchPosition: 'Input';

* Added locaclization for all packages. Each package have i18n.ts file, with all end-user UI strings, you can export it into your project and redifine strings for your locale;
* Removed JQuery from packages dependecy;
* [Slate]: Fixed bug with incorrect cursor behavior in Firefox;
* [PickerInput]: Added autofocus prop;
* [PickerInput]: Fixed bug with selecting item with id === 0;


# 3.40.0

* New **PROMO** skin components
* **DataSources rework**:
  - DataSources are now plain classes, not React components. DataSources no longer handles DataRows generation, events, and UI updates - they are just boxes with some cached / pre-computed data.
    This simplifies a lot:
      - you can create and store instances where convenient. For example, it's ok to create global instances of certain data sources, which wouldn't update often - like locations for pickers.
      - this leads to simpler APIs. For example, in Pickers instead of tricky `getDataSource = { props => <ArrayDataSource {...props } /> }` API, you just pass your DataSource: `dataSource = {{ myDataSource }} `

  - Introduced a new concept - View. Having a DataSource, component can create a View with `dataSource.getView`. Views are created per-component, allowing multiple components to share the same DataSource. They handle all component-depended logic - DataRows generation, according to search/filter/folding/selection in DataSourceState, UI updates, event handling. If you use existing components, you usually don't need to deal with Views directly, as they are created internally by components themselves. However, if you want to build your components, or just access data inside DataSources directly, they can be useful. See more in examples.

  - A set of react hooks now available: useLazyDataSource, useArrayDataSource, useAsyncDataSource, and IDataSource.useView. They create appropriate DataSources and manages subscription/unsubscription/refresh for you. While DataSources can still be used directly, please prefer hooks for Functional Components.

  - Breaking changes:

    - DataSources should be created outside the picker. With either `myDataSource = new ArrayDataSource()`, or with new useArrayDataSource() hook.

    - DataSources are passed to components with `dataSource = {{ myDataSource }} ` instead of `getDataSource = { props => <ArrayDataSource {...props } /> }`

    - some options, like getRowOptions, getSearchFields, cascadeSelection, isFoldedByDefault are moved to Views. In case of Pickers, you can pass them directly to Picker props, instead of DataSource props.

    - SortBy callback removed from columns config. By default, sorting applies by the column 'key' field.
    If you need another behavior, pass sortBy callback to the View.

    - filters removed from ArrayDataSource. Instead, you can use `getFilter` option on ArrayListView.
* Bug fixes and clear warnings


# 3.33.2

* [Dropdown]: Fixed issue with z-index: 0 prop value
* [DatePicker]: Fixed localization

# 3.33.1

* [Button]:removed pointer-events: none for disabled mode
* [DatePicker]: Fixed incorrect week days order
* Added export i18n from uui-components

# 3.33.0

* [DatePicker]: fixed wrong calendar display value when user type date from keyboard
* [DatePicker]: added possibility to pass placeholder
* [DatePicker]: added possibility to customize day in picker by passing renderDay prop
* [Switch] fixed issue with swich input focus in Disabled state
* [TextArea] fixed issue with border on hover in Readonly state for inline mode
* [MainMenu] added possibilitu for localization 'More' button

# 3.32.2

* MakeMeItem - set MakeMe cookie on path='/'
* ArrayDataSource - fixed DataTableRow.shouldComponentUpdate to work if filters are used
* [Pickers]: Added check that selectedId is not null or undefined for valueType=entity

# 3.32.1

* [MainMenu]: Added re-export MainMenuLogo from loveship
* [Slate]: fixed problem with deleting columns; added horizontal scroll to table; disable uploadFile button when fileUploadPlugin is not connected; added global css class to Slate image block
* [Notifications]: added top-center and bottom-center positions
* [PickerInput]: fixed bug when page scroll triggers by focus on serach in picker body

# 3.32.0

* [PROMO]: Released first part of components: MainMenu, Buttons, form components, tooltip, layout components
* [Slate]: Tables refactor and bug fixes

# 3.31.8

* [Dropdown]: Removed adding handleMouseMove events from render
* [Loveship]: Added Avatar and MainMenuCustomElement exports

# 3.31.7

* [DatePickers]: Now getting the day of the week from moment.js, not from array constant
* [DatePicker]: Fixed typings
* [Dropdown]: Moved mouseMove handlers from render to openChange handler
* [Dropdown]: Added portalTarget and boundaryElement props
* [Inputs]: Fixed focus losing by clicking on clear/up/down icons
* [Slate]: fix problem with tables; add extention field in fileUpload plugin
* [Avatar]: Added more sizes
* [Modals]: Add disallowClickOutside to IModal interface
* [TextArea]: Fixed bug, when ref is null
* [LayoutContext]: Increase initial z-index value from 1000 to 2000


# 3.31.6

* [ErrorPage]: changed types for errorPage info, to get possibility to pass react elements;
* [Slate]: Fixed image inserting by url, added PDF global className to the Iframes with PDF documents;
* [UUIRouter]: add search props for Link interface.

# 3.31.2

* [DraftRichTextEditor] bug with focusing fixed
* [Slate]: add ability to delete table
* [Tooltip]: add portalTarget props to specify container for render
* [PickerModal]: Set rowPadding to 24
* [Notifications]: redesign and rework

# 3.31.3

* [MakeMeItem]: Change cookie name for make me functionality from "uui-make-me-id" to "MakeMe"
* Rework demo notification page to new notification design

# 3.31.2

* [DraftRichTextEditor] bug with focusing fixed
* [Slate]: add ability to delete table
* [Tooltip]: add portalTarget props to specify container for render
* [PickerModal]: Set rowPadding to 24
* [Notifications]: redesign and rework


# 3.31.0

* [PickerInput]: new design, fix scroll problem, added row disabled style
* [Slate]: added delete key handlers form image/iframe/video blocks
* [Tables]: add always visible prop for columns, add select all checkbox in header
* [Textarea and TextInput]: add maxLength
* [Slate]: fix problem with adding tables and duplicating table bars in case when 2+ tables added in editor
* [Slate]: fix color removing
* [Slate]: fix serializing
* [Modals]: removed scale animation
* [Slate]: add blockquote serializer; fix table font size; fix image max size
* [UploadFileToggler]: Fixed bug with uploading files with the same name

# 3.30.0

* [Breaking Change]: update icons, rework button's and input's layouts
  * The first, delete size from IconButton, component size = icon size
  * The second, check all icons from @epam/assets/icons/ they were moved to @epam/assets/icons/legacy.
  * For correct work icons they should had width and height (in body or style)
  * New icons have less empty space around, recommend to look all places where its used to check the view
  * If you use custom icons in uui-components you should review them (space between icon and text was changed)
  * Use the recommended icon sizes:
        18, 24, 30 - 12px
        36, 42 - 18px
        48 - 24px

# 3.29.0

* [Slate]: bug fixes and new features
* [FireFox]: fix red border in invalid NumericInput, fix inputs text and opacity colors
* [Table]: fix configuration modal DnD
* Fixed testSearch helper in case when passed string which contain only space characters(" ")

# 3.28.3

* Added localization object to loveship. Move draft localization to draft-rte module.
* Change history replace method to push method in router will leave with lock context

# 3.28.2

* Fix bug with null dsRef in AsyncDataSource
* Fix bug with custom getId in DataSources with Picker

# 3.28.0

* Pickers: Fixed bug with dsRef is null in PickerBase
* Modals: add missed style for height 300 prop, change border-top for footer from gray8 to night200 and improve codestyle
* Tooltip: fixed tooltip to work with all types of react components

# 3.27.2
* [Fonts]: Improve visibility of font faces for SCSS

# 3.27.1
* [Slate]: Fixed image upload
* [DraftRTE]: Fixed bug with placeholder visibility
* [TextInput]: Fixed error with onClick handler
* [Modal footer]: Increased spacing between buttons to 12px
* [Tables]: Fixed FF bug with stretching row container when cells take up more space than row container, fixed columns configuration modal D'n'D

# 3.27.0
* [RangeDatePicker]: fix problem with inline and cell mode, fix styles, fix problem with filter, fix problem with focus;
* [DatePicker]: fix changing value when filter used;
* [DataTable]: add headerTextCase prop; minor style fixes;
* [Tables]: Set default value as 'normal' for textCase prop in DateTableHeaderRow;
* [PickerToggler]: Fixed input blur for search position body/none;
* [DraftJS]: Fixed placeholder position;
* [Tooltip]: Removed div wrapper for tooltip target;
* [Breaking change][Buttons]: Removed activeLink prop, replaced with isLinkActive: boolean. Now you can calculate isLinkActive value by yourself and pass to the Button to apply active styles.

# 3.26.5
* [Slate]: now image proportionally fit in editor size on mobile screens;
* [RichTextEditor]: fix issue placeholder doesn't disappear when user click to unordered-list or ordered-list;

# 3.26.4
* [Slate]: fix separator inserting;
* [Pickers]: Implemented renderNotFound prop for PickerModal; Added dataSource props in parameters in renderFooter prop from PickerModal;
* RangeDatePicker minor fixes;

# 3.26.3
* [Table]: Add possibility to import column config modal.

# 3.26.1
* [Table]: Fixed active filter icon in table header cell.

# 3.26.0
* [Slate]: fixed video insert, created utilsPlugin, imageBlock fix behavior in readonly mod;
* [Table]: DataTableHeader redesign
* [Table]: Added ColumnsConfigurationModal to handle columns visibility and order


# 3.25.5
* [VirtualList]: fix rowsOffsets calculation

# 3.25.4
* [Slate]: fixed image upload;
* [MainMenuAvatar]: add placeholder image;

# 3.25.3
* [PickerModal]: change rowPadding;
* [Modal]: change animation;

# 3.25.2
* [SlateEditor]: add ability to resize table columns, add possibility to disable toolbar buttons, fix image resize, fix problem with image, iframe, file deleting, fix problem with image loading, remove image border;
* [RangeDatePicker]: fix problem when second value was bigger than first
* [Modals]: add animation, change blocker color

# 3.25.1
* Breaking change: replace oswald package to legacy;
* [SlateEditor]: added resizing dots on image border, fix text align, added export of TextAlignPlugin;
* [PickerInput]: fixed crashes in PickerInput with undefined value in entity mode;
* Fix upload file error handling;

# 3.25.0
* [PickerInput]: fixed setting item in cache in entity mode;
* [DatePicker, RangeDatePicker]: remove onCancel and add disableClear in props, fix changing input value;
* [Dnd]: Fixed wrong DndGhost positioning with scrolling window;
* [SlateEditor]: Add oprional image description, fix problem with delete note block, update style, fix border for inline-readpnly mode;
* [Typography] delete padding for list;
* [DataSources]: added exact and known rows count properties to IDataSource. Existing rowsCount prop is inaccurate in case of lazy loaded lists, and will be depricated;

# 3.24.4
* Fixed PickerInput crashing when your have default value
* [PickerInput]: Return empty string if we can't get a name
* [DataTableRow]: Fixed columns overflowing


# 3.24.3
* Added emptyValue prop interface in PickerBase
* [Slate]: Fix video upload
* [PickerInput]:
*   Update popper picker body position on value change
*   Add props pickerHeight to change default placeholder height
* [Docs]: Added blocker demo
* [Breaking change]: Draft RTE moved from @epam/loveship into the separate package - @epam/draft-rte.
* [Breaking change]: Change valueType prop in PickerInput, now this prop responsible for what you want to receive prom picker - id or entity;
To configure your picker in single(scalar) or multi(array) mode you need to set selectionMode prop, which accept 'single' or 'multi' values;

# 3.24.2
* [CheckBox]: fixed passing color prop
* [RangeDatePicker]: fix default presets
* [PickerInput]: Clear search when you select already selected item
* Fix TextArea, TextInput performance issues
* [DatePicker]: Fixed displayedDate change
* [Tables]: Added calculation of browser scrollBars width and use this value for hide scroll in rows

# 3.24.1
* [DatePicker]: fix problem where the value does not change when a new value arrives in props. Add test to DatePicker
* [PickerInput]: fix wrong behavior in multiple searches
* Changed dropdown boundariesElement to 'viewport'
* Added possibility to provide custom error message for api error notifications.

# 3.24.0
* modals demo rework
* [Form]: fix getMetada prop
* [NumericInput]: fix problem when value is not exist
* Columns filter feature
* [Breaking Change]: add emptyValue prop to array pickers, default: undefined

# 3.23.7
* [AvatarStack]: Add avatarsCount props
* [SlateJS]: Divide superscript into the separate plugin
* [TextPlaceholder]: Added animation and prop "isNotAnimated"
* Change form prop 'save' api - chage return value from Promise<any> to void

# 3.23.6
* added PickerToggler to @epam/loveship
* added CSRF token to http headers
* fix issue Table - Edge only. No sorting icons on header's titles
* [SlateEditor]
  * fix problem with delete text
  * rename attachment block
  * added blur preventing for sidebar
* [DatePickers]: fix not necessary calling of onValueChange handler when only displayDate changed

# 3.23.5
* uui-build - added hash to JS chunks file names
* [SlateEditor]
  * fix problem with delete noteBlock and separator
  * refactor focus/blur handling
  * update Slate packages to the latest versions

# 3.23.4
* [NumericInput]: fix bug with undeletable zero
* [SlateEditor]
  * fix sidebar offset; fix crashing problem
  * add note plugin
  * add separator plugin
  * fix sidebar position
  * add inline mode, focus state, placeholder
  * add spinner when file is loading; rework note block; fix bug with pickure adding
* Added modals docs

# 3.23.3
* [TextInput]: added "autocomplite" and "name" props
* [TextArea]: added onKeyDown
* [VirtualList]: added onScroll prop
* [DatePicker]: Fixed date which is displayed at first opening
* Added public VirtualList ref and support for onScroll prop in DataTable

# 3.23.2
* [DragGhost]: fixed z-index
* [ReadOnly]: set background in readOnly only for "form" and "cell" mode
* [SlateEditor]: add download ability to attachment plugin; add simple iframe plugin with demo
* fix date in rengeDatePicker presets

# 3.23.1

* [DragGhost]: add z-index
* [Dropdown]: add modifiers prop
* Pickers: add offset to picker popper

# 3.23.0

* isReadonly prop for most components. Read-only slightly differs from disabled, it has more readable text in particular. Use it for forms which should be readable, but not editable.
* uui.lab.epam.com fixes:
  * Fix layout on demo pages
  * Remove validationMessage prop from docs where it not used
* uui-editor:
  * autoFocus prop added
  * fix issue with lists in quoteBlock


# 3.22.6

* [TextArea]:
  * fix height textArea in FF
  * correct border-width for FF and Edge
* [PickerInput]: fix handling 'tab' key in Picker input toggler
* [SlateJS]: changed TableToolbar size
* [Dropdown]: added timeout for closing dropdown when cursor is outside (for prop closeOnMouseLeave = 'boundary')
* [Switch]: fix handling 'tab' key

# 3.22.5

* DatePicker
  * fix issue with typing invalid date in input
  * now calendar change current month to month which was typing in input by user
  * fix format for initial date
  * added onCancel prop
* DrafJS (RichTextEditor) - added readonly mode for Draft RTE
* uui-editor: Added possibility to specify toolbar and sidebar structure, by passing toolbarStructure or sidebarStructure props to the SlateEditor component.
* Docs. Added file upload demo
* PickerInput. Added minCharsToSearch prop, which specify how mach chars in search required to start load data
* uui-db
  * added foreign key mapping to tempIds
  * added prevTables to context for beforeUpdate trigger
* uui-build
  * add package name to dev-tools file names
  * CSS selectors hash depends on version
* epam-assets
  * add .color-vars for scss
* Rating - added 30 size

# 3.22.4

* [DraftJS] valueType prop now is required
* [SlateJS] Change icons in table toolbar
* Updated processIcons script according to new folders structure. Added new icons pack.
* Added include cookie into upload file request
* [Switch] Remove possibility of focusing on the disabled Switch
* Added cx prop for DataTableHeaderCell

* Replaced .for-each less plugin method with native less methods
* Fixed bug with onClear and custom format in datePickers
* PickerInput: Fixed picker body position after searching
* Added clearCache method for LazyDataSource

# 3.22.3

* Replaced .for-each less plugin method with native less methods
* Fixed bug with onClear and custom format in datePickers
* PickerInput: Fixed picker body position after searching
* Added clearCache method for LazyDataSource

# 3.22.2

* Fixed issues with displayedDate in date pickers
* Fixed date pickers styles
* Fixed onCancel props in TextInput

# 3.22.1

* Added markdown converter for DraftJs editor
* Added activeLink prop in MainMenuDropdown for parent link highlight

# 3.21.0

* Redesign and rework date and date range pickers
* [Breaking change] Change value type of date picker body

# 3.20.1

* SliderRating: fix tooltip
* PickerToggler
  * correct text clipping
  * fix invalid view

# 3.20.0

* 'mode' prop for most inputs. It has three values:
  * 'form' - the default one, controls appears as usual
  * 'inline' - control appears w/o borders, as plain text. Border appears on hover. Can be used for WYSIWIG-style editing.
  * 'cell' - controls appears w/o borders, hover/focus add squared border. This is intended to be used as in-cell editors in editable tables.
* Control sizes rework (backward-compatible):
  * Text and most input components, got optional lineHeight and fontSize props. Default values are chosen according to the size prop, and match prior settings. You can use these props to tweak font appearance.
    * Obviously useful for Text, but also for inline inputs; and editable cells (design guidelines put less line-height than default there)
    * The formula is: padding top/bottom = (size - line-height) / 2. This means that a control get height exactly equal to 'size' if you get one-line text, and it will be center-aligned properly.
    * Some font-sizes wouldn't fit some line-heights. Keep this in mind, and choose reasonable combinations of line-height and font-size. Design guidelines on possible combinations will be ready soon.
    * Extreme line-height and size combinations are not supported (like size=60, line-height=12). Let us know if you need that.
  * Added 42 size for most components.
  * 48 size will be deprecated, as it's not approved by design team. Let us know if you use it. The plan is to deprecate it.
* File upload facilities added:
  * A new DropSpot component, which can wrap areas where files can be dropped. It handles all machinery of file DnD events handing.
  * ApiContext.uploadFile() method added. It use XHRRequest instead of fetch, and allow tracking progress. No error handling for now, it will be added later.
  * We are still lacking docs and demos for file upload features, contact core team for help
* [Breaking changes] Removed vPadding prop from DataTable.
  * Added renderCell callback for table column props. Can be used to replace whole cell, including padding
  * Rework padding prop for DataTableCell component, now there are rowPadding(value for first and last column) and padding (value for all columns) props.
  * For 36-sized tables, switch to size=36, and use new line-height props for texts and inputs to fit cell properly.
* uui-build now supports SAAS/SCSS. We are going to gradually migrate whole library to scss
  * @epam/assets/scss - more mixins and variables migrated from less
* new uui-editor package: a Slate.js-based Rich Text Editor, with pre-configured plugins.
  * Still work in progress, we aim for production quality at the end of July
* Reworked page layout on UUI sandbox app. New page layout puts scrollbars on body, improving mobile experience. It also allows to disable menus on particular pages, and fall-back to the old layout style if necessary.
* Tooltip will be hidden if content and renderContent is falsy. Useful for conditionally hiding the tooltip
* Fixed Dropdown and Tooltip "jumping" glitch on opening
* ModalHeader - allow pass ReactNode to Title instead of just sting
* Avatar - added size=30
* Checkbox, RadioInput - fix styles according to design spec
* ScrollBars - added top/bottom shadows, for light and dark themes
* Fixed Drag-n-drop scrolling freezes
* DataTableRow: 'none' option for background works now (default is still white)
* UUI IRouterContext - added getCurrentLink method
* New 'db' package - an experimental relational state-management tool for CRUD UIs.
* PickerInput
  * disableClear props - to remove cross icon, and prevent empty selected values
  * searchPosition prop - to move search to dropdown (useful if you use Button as a Toggler), or remove it completely (if you have small lists, where search is useless)

# 3.19.4

* PickerInput improvements: close on clear, no items focus until down key pressed, minBodyWidth prop
* ArrayDataSource - added selection cascading. Use cascadeSelection prop to make parent selection to select all children, and vice versa

# 3.19.3 - not released

* TypeScript updated to 3.5.2 from 3.3.3333
  * Changelogs:
    * https://devblogs.microsoft.com/typescript/announcing-typescript-3-4/
    * https://devblogs.microsoft.com/typescript/announcing-typescript-3-5/
* uui-build
  * updated webpack and loader-related packages
  * removed excess TS compilation pass
  * build performance improved

# 3.19.2 - broken release

* uui-build: BUILD_DIR settings

# 3.19.1

* Introduced internationalization: ability to translate component's text. Currently hard-coded texts are moved to a i18n.ts file, and can be overrided if needed. For now, only RichTextEditor-related dialogs are reworked this way. We'll refine the approach, and will allow such customization for other components when needed.
* Form components: fixes in unsaved data-related logic

# 3.19.0

* @epam/uui/Stateful Component now supports storing state in query string
* urlParser.ts - arrays, boolean, and numbers are serialized now in query string
* UUI IRouterContext - added getCurrentLink method

# 3.18.1
* LazyApiCache - fixed empty API results handling
* RichTextEditor - allow to bind to raw editor state to avoid html<->state conversion. Can be used to significantly improve performance.
* ApiContext - Allow error handling customization. You can opt to show notification instead of error page, or disable built-in error handling.
* SliderRating - fixed ToolTip hover zone
* TextInput.focus() method added. Can be used via component ref.
* withMods helper now passes by wrapped component's ref with React.forwardRef
* Dropdown - fixed performance issue caused by broken events' un-subscription, and over-use of getBoundingClientRect.
* DataTableRow - enabled horizontal scrolling using middle mouse button and touchpad gestures
* Unsaved form state handling. Pass "settingsKey" prop to Form, to make form store edited values in the UserSettings context (local store by default). If Form component detect non-saved changes, it will ask user if it wants to restore these changes. Use that to provide additional barrier to not to lose user-entered data.
* The whole new icons set build by Design Platform team is pre-processed and published to @epam/assets/icons/common. Pre-processing includes file name normalization, fixing issues with symbol IDs, removing 'fill' style to be able to color icons, and other tweaks and optimizations.
  * Note: new icons are not yet compatible with UUI3 components. There are size mismatch, and we are in progress updating all buttons and input to the new size. However, we published icons early, as there can be other uses.
* Two new loaders icons in the set. Usable in any button or input.
* fixed layout problem RadioInput, Checkbox, and Dropdown menu in latest Chrome (broken SVG sizing)

# 3.18.0

* [Breaking change] DatePicker and RangeDatePicker date format handling changed:
  * value and onValueChange are now always use date in YYYY-MM-DD format, despite component's "format" prop value
  * the "format" prop now affects display format only, not internal 'value' format
  * this behaviour matches <input type='date' > behavior: it can change display format according to user's locale, but always use YYYY-MM-DD format in API. Your can swap <DatePicker> with <TextInput type='date'> on mobile devices to get better UX.
  * default value for the "format" prop is set to more readable "MMM D, YYYY", e.g. "20 May, 2019"
  * invalid dates are no longer passed to onValueChanged callback, i.e. while user types dates. onValueChange is only fired when complete and correct date is entered

# 3.17.1

* Fixed RangeDatePicker layout

# 3.17.0

* [Breaking change] @loveship/MainMenu and related components are re-styled to match the new guideline
  Please update your menu-related code:
  * Add collapseToMore prop to all items that can be collapsed to "More" dropdown if they doesn't fit screen. This was implicit behavior, now you have to specify this explicitly
  * All custom menu items should be wrapped with the new MainMenuCustomElement component, to support adoptability
* Fix labeled input info icon
* Dropdown now pass body size to render callbacks
  * PickerInput now adjust dropdown body width to match toggler width
* Fixed logo layout, in case when logo arrow is enabled (when customer logo is used)

# 3.16.0

* EmbeddedWidget component - a part of micro-frontends POC
* RangeDatePicker - better layout
* Form - allow to disable Save Changes confirmation

# 3.15.1

* Added link to UUI logo in demo app
* Added possibility to a pass href to main menu logo
* change vh/vw to % in mobile size

# 3.15.0

* React.ReactElement type is replaced to React.ReactNode in most props
  * it's the correct return type for render-props. See this page to understand the differences: https://react-cn.github.io/react/docs/glossary.html
  * this fix improves compatibility with different @types/react versions
  * please use React.ReactNode as render-props return type, if you allow anything to be rendered. There are still cases when you need particular ReactElements, like in menu, you can keep ReactElements in such cases.
* Fix border bottom prop in ModalHeader

# 3.14.1

* Added compatibility of Analytics Context with history v4

# 3.14.0

* Positional drag and drop support (beta)
* TextArea and TextInput sets -clickable if not disabled to prevent click bubbling
* TextArea - autoSize prop
* [Breaking Change] Context APIs - changes subscription reworked to allow multiple subscribers. Use subscribe and unsubscribe methods on all contexts.
* LockContext - added compatibility with history v4


# 3.13.1 - 14.03.2019

* Fixed ErrorPage styling

# 3.13.0

* LazyDataSource reworked:
  * No more stall isLoading rows
  * Internal logic decomposed into new ListApiCache, LazyLoadedMap, and batchOnNextTick helpers, which can be useful separately from LazyDataSource
* new @epam/uui/IEditableDebouncer component. It's a wrapper component that debounce onValueChange calls, while still reacting to external value changes immediately.
  * @epam/loveship/Search component is debounced
  * Use disableDebounce prop if debouncing is not needed
* ErrorPage component (extracted from ErrorHandler)
* Minor fixes
  * Enforced TSLint styles for JSDoc comments
  * DataPickerRow component exported
  * PickerModal - components alignment fixed


# 3.12.0

* Updated to latest React (16.8.3) and typescript (3.3.3333).

  Important: there are no breaking changes, all packages are still depend on React >16.0.0 and compatible with typescript 2.9. Upgrading your project is not necessary. However, we are planning to use new 'getDerivedState' API instead of componentWillReceiveProps in newer version, so it's recommended to update.

* New @epam/uui/Form component to handle forms state.

* Minor fixes:
  * add icon prop to MainMenuAvatar component
  * remove hover/focus/active style effects for dropdownMenuButton if it not clickable
  * Slider: z-index use avoided, "Handler" component renamed to "Handle"

# 3.11.4

* Fixed dropdown close when scroll event fired on mobile devices

# 3.11.2

* @epam/uui - replaced scrollbarWidth const with getScrollbarWidth function (memoized) to avoid build-time crashes on certain environments
* @epam/loveship - PickerList: show "No options available" message on empty list; customizable via "noOptionsMessage" prop

# 3.11.0

* TextArea - add onBlur props
* night600 added to colors
* added entity name to PickerInput and PickerList modals title

# 3.10.0

* Reworked all components to use CSS Variables for coloring to reduce CSS bundle size
* Correct -clickable marker class for Buttons with href prop

# 3.9.0

* @epam/loveship - Table components
  *  New components: DataTableRow, DataTableHeader, DataTableCell, DataTableHeaderCell, DataTable components added.
  *  Note: DataTable API is not final yet, and might change in future. Other components are stable.
* Moved infrastructure/sandbox to uui-site folder
* FlexCell - alignSelf prop
* Checkbox - 12 size added
* DataTreeCell renamed to DataTableCell

# 3.8.0

* New SliderRating component
* [Breaking Change] TextPlaceholder - default color changed to night50 (from night700) to match the default bright theme.
* Lenses - fixed issue when toProps passes all host's properties, instead on validation-related only
* Lenses - onChange helper fix: not validationState is passed down
* @epam/uui - added scrollBarWidth and getBrowser helpers
* @epam/uui-docs module introduced. Moved all docs-related helpers there, as well as demo data and APIs
* Tests infrastructure restored on top of Jest. All tests are migrated to Jest.

# 3.7.2 - 31 Jan 2019

* Validation - bug fix: isInvalid flag were not cascaded correctly

# 3.7.1

* PickerList - sortBy prop added
* add helper for detect browser, move 'scrollBarWidth' utils in uui/helpers
* Button - add style round for 48 size
* Text - fix 24 size to match 6px grid
* TextPlaceholder - colors added, fixes
* IE - add banner for IE (please add script to 'body' in index.html)
* uui-build - fixed source map folders in Chrome Dev Tools

# 3.7.0

* [Breaking Change] - CSS styles are extracted.
    Users need to import them explicitly.

    Before this change, we kept all CSS code inside JS, and they are injected into DOM on app start.
    However, it can hit performance, adds mess in HEAD, and it's was tricky to override UUI styles, as they get placed on top of app's styles.
    With new version, we extract all CSS into separate 'styles.css' files.
    To import styles, please add following to your index.tsx/jsx file:
    ```tsx
        import '@epam/uui-components/styles.css';
        import '@epam/loveship/styles.css';
    ```
    Consider placing these imports before any your App's import, as it would place UUI styles before yours, making it's easier to override if needed.
* Fixed TS error in ApiContext in newer/stricter TypeScript setup

# 3.6.0
* ApiContext and Error Handler rework
  * All requests are queued and retried after a error
  * Added connection lost and authentication errors recovery.
* Removed non-standard syntax from @epam/assets/less/index.less
* Fixed events bubbling issue in Anchor
* TextArea - add 'size' prop.
* FlexRow - change default background from "white" to "none"
* Tooltip - add border-radius

# 3.5.0

* Greatly reduced package sized by reworking controls coloring with CSS Variables.
* Removed most react warnings
* @epam/uui-build:
  * setupProxy.js now works (removed debug code)
  * Switched devTool to 'eval'
  * css modules selectors generation changed, to avoid loveship and oswald conflicts
* [Breaking Change] Modals rendering moved from ContextProvider to the separate @epam/uui-components/Modals component. This is done to make certain contexts (like Apollo) visible inside modal components.
To update, please add make this changes:
    ```tsx
        <>
            ...
            <ErrorHandler>
                {this.props.children}
            </ErrorHandler>
            <Snackbar/>
            <Modals /> /* add this line in your Application component */
        </>
    ```

# 3.4.3

* export object from urlParser. Fix dependencies.
* fix typings for notification context

# 3.4.2

* ILens interface meaning changed. Now it's LensBuilder public interface. We can use this to pass an lensBuilder around. Think of it like Lens class from edu-core.
* NotificationsContext.show() - 'params' argument is now optional
* urlParser helper is added to edu-core-routing

# 3.4.1

* Rating - add tooltip for emptyStars
* fixed paddings for demo confirmation modal
* OnClose callback for renderNotFound - used in Grow for tags picker to close dropdown after tag creation
* edu-utils - lambdaParser helper added

# 3.4.0

* [BreakingChange] edu-core, edu-ui-components, and edu-ui-base packages are deprecated and will be removed soon. Migration path:
  * Application base class and bootstrap() method should be replaced with the new ContextProvider-based initialization approach (see example in the uui-template repository)
  * edu-core Lenses can be replaced with the new uui.Lens helper
* Components focus effect are agreed with design team and implemented in all components
*Typography in agreed with design team (h1-h6, p, b, i, etc.). Implemented in RichTextView, RichTextEditor, and as LESS mixin.
  * Subset of typography are now supported in all labels (LabeledInput, Checkbox, RadioButton). You can now use `<a>`, `<b>`, `<i>`, and few other tags in component labels.
* [BreakingChange]. LabeledInput "renderLabel" prop is removed. We allow to pass ReactElements directly into "label" prop, so there's no need for a separate prop
* Picker component - various fixes
    [note] Pickers are still not stable. PickerProps.getDataSource API will be reworked soon
* Sandbox - introduced GraphQL demo APIs with Apollo library. We'll work further to integrate Apollo GQL with UUI components (e.g. Pickers will support Apollo GQL as data sources)
* PickerInput - renderToggler prop. Use to implement non-standard pickers, like buttons or autocomplete search fields
* uui-build package added
  * added auto-detect index.tsx location (./index.ts(x), ./src/index.ts(x))
* MainMenu: links on app logo, burger close callback
* Forms databinding rework:
  * ICanBeInvalid is extended to pass children validation props
  * IEditable now extends ICanBeInvalid
  * Lenses improvements and fixes (API is still WIP, might change in future)
* @epam/loveship - DataTableRow component added (final design is still WIP)
* SourceSans font updated (labels might appear too bold, the issue we'll be discussed with design team)
* ErrorHandler now handles React crashes
* Fixed tooltip z-index issues
* Button - 18px size added
* PickerToggler - fixed layout issue
* TextInput - onFocus event added

# 3.3.1 - 22.11.2018

* allow to pass any React Element in any component's icon props now. This allows using CRA-style SVG icons, as well as other use-cases.

  Use in CRA:
    ```tsx
        import { ReactComponent as myIcon } from './myIcon.svg';
        //...
        <Button icon={ myIcon } />
    ```
* numerous PickerInput and other Picker-components fixes and improvements.

  Important: PickerInput, PickerModal, and other IDataSource-based components are WIP. DataSource API will change in future versions.

* DataPickerRow component introduced. Use this component to customize rows in PickerInput and PickerModal. See example in epam-uui2\components\pickers\docs\common.tsx
  * [breaking change] UserPickerRow deprecated, use DataPickerRow instead
* dark theme for PickerList
* Fixes in Modals (placement, correct close icon)
  * [breaking change] height prop is required on Modal for max-sized windows
* Rating component fixed on iOS
* Tooltip - correct z-index calculation via LayoutContext
* Fixed dropdown crash and popper flickering
* [breaking change] withMods helper API changed. Now default props in a function accepting mods. This allow to change child components according to mods (e.g. PickerInput can change color of PickerInputToggler according to it's mods)
* [breaking change] VirtualList reworked, now it's delegates visible range state via IEditable<VirtualListStateProps>. This allows parent component to know up-front what rows are visible.

