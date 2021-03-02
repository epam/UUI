# 3.xx.xx - 01.01.2021

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

* Forms validation - better cross-fields dependencies.
  'validate' function in Metadata now receives all parent objects in path as argument.
  Each validator receives N arguments - first is the value itself, then it's container, and down to the root object.
  You can use this to make validation dependencies between items. For example:
  ```
    const value = { array: [{ id: 100, name: 'abc' }, { id: 101, name: 'bcd' }] };
    const nameValidator = (name, item, array) => [item.id > 100 && name.length < 2 && "Items with ID > 100 should have names longer than 2"];
    const meta = { array: { all: { props: { name: { validators: [nameValidator] }}}}};
  ```


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