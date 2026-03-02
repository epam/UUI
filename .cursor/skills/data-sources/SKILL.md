---
name: uui-data-sources
description: Helps work with UUI DataSources (ArrayDataSource, LazyDataSource, AsyncDataSource) powering PickerInput, DataTable, FiltersPanel, and other data-driven components. Use when implementing or fixing features that load, filter, sort, or display lists of data.
---

# UUI Data Sources

UUI DataSources are the core infrastructure for data-driven components like PickerInput, DataTable, FiltersPanel, and PickerModal. They handle loading, filtering, sorting, selection, and tree hierarchies.

## Location

- **Package:** `@epam/uui-core`
- **Path:** `uui-core/src/data/processing/`
- **Types:** `uui-core/src/types/dataSources.ts`

## DataSource Types

| Type | Use Case | Data Flow |
|------|----------|-----------|
| **ArrayDataSource** | In-memory, synchronous list. Items already loaded. | Pass `items` array. Filtering/search/sorting done client-side. |
| **LazyDataSource** | Server-driven, lazy loading. Large or remote data. | `api(request, context)` fetches on demand. Supports pagination, search, tree. |
| **AsyncDataSource** | Fetches once via API, then caches. | `api(options)` called once; results cached and reused across views. |

## Hooks (Recommended Usage)

Use hooks instead of instantiating classes directly — they handle lifecycle and prop updates:

```typescript
import { useArrayDataSource, useLazyDataSource, useAsyncDataSource } from '@epam/uui-core';
```

### useArrayDataSource

For in-memory data:

```typescript
const dataSource = useArrayDataSource(
    {
        items: myItems,
        getId: (item) => item.id,
        getParentId: (item) => item.parentId, // optional, for tree
    },
    [myItems]
);
```

### useLazyDataSource

For server-driven lazy loading:

```typescript
const dataSource = useLazyDataSource<TItem, TId, TFilter>(
    {
        api: (request, context) => {
            // request: { filter, sorting, search, range, ids, cursor }
            // context: { parentId, parent } for tree children
            return myApi.fetchItems(request, context);
        },
        getId: (item) => item.id,
        getParentId: (item) => item.parentId,
    },
    []
);
```

API must return `{ items: TItem[], count?: number, from?: number, cursor?: any }`.

### useAsyncDataSource

Fetches once, then caches. Good for dropdowns with fixed options:

```typescript
const dataSource = useAsyncDataSource(
    {
        api: (options) => svc.api.demo.countries({}, options).then((r) => r.items),
        getId: (item) => item.id,
    },
    []
);
```

## useView and DataSourceState

Components consume DataSources via `useView`:

```typescript
const [dataSourceState, setDataSourceState] = useState<DataSourceState>({});
const view = dataSource.useView(dataSourceState, setDataSourceState);

const rows = view.getVisibleRows();
const listProps = view.getListProps();
view.reload();
```

**DataSourceState** (`uui-core/src/types/dataSources.ts`) includes:
- `search` — search string
- `filter` — filter object (passed to LazyDataSource API)
- `sorting` — sort options
- `checked` — checked item IDs (multi-select)
- `selectedId` — single selected item
- `folded` — tree node fold state
- `page`, `pageSize` — pagination
- `focusedIndex`, `scrollTo` — list position

**SetDataSourceState** is `(update: (prev) => DataSourceState) => void` — functional update pattern.

## Key Config Options

- **getId(item)** — Required. Returns unique ID.
- **getParentId(item)** — Optional. For tree hierarchy. LazyDataSource uses it to load parent chain.
- **complexIds** — Set `true` if IDs are objects/arrays (internally JSON.stringified).
- **rowOptions** / **getRowOptions(item)** — Row-level options (selectable, checkable, editable).
- **cascadeSelection** — `true` | `'explicit'` | `'implicit'` for parent-child selection behavior.
- **isFoldedByDefault(item, state)** — Default fold state for tree nodes.
- **selectAll** — Enable/disable select-all. Default `true`.

## LazyDataSource API Contract

```typescript
type LazyDataSourceApi<TItem, TId, TFilter> = (
    request: LazyDataSourceApiRequest<TItem, TId, TFilter>,
    context: LazyDataSourceApiRequestContext<TItem, TId>
) => Promise<LazyDataSourceApiResponse<TItem>>;
```

- **Request:** `filter`, `sorting`, `search`, `range: { from, count }`, `ids` (for specific IDs), `cursor` (pagination).
- **Context:** `parentId`, `parent` when loading tree children.
- **Response:** `{ items, count?, from?, cursor?, totalCount? }`.

## Common Patterns

### PickerInput with DataSource

```typescript
const dataSource = useArrayDataSource({ items, getId: (i) => i.id }, [items]);
<PickerInput
    dataSource={ dataSource }
    value={ value }
    onValueChange={ setValue }
    getName={ (item) => item.name }
    entityName="Item"
/>
```

### DataTable with DataSource

```typescript
const dataSource = useArrayDataSource({ items, getId: (i) => i.id }, [items]);
const [tableState, setTableState] = useState<DataTableState>({});
const view = dataSource.useView(tableState, setTableState);
<DataTable
    getRows={ () => view.getVisibleRows() }
    columns={ columns }
    value={ tableState }
    onValueChange={ setTableState }
/>
```

### Tree with getParentId

```typescript
const dataSource = useArrayDataSource({
    items,
    getId: (i) => i.id,
    getParentId: (i) => i.parentId,
}, [items]);
```

### LazyDataSource clearCache

When data changes on the server, call `dataSource.clearCache()` (LazyDataSource only) to force reload.

## References

- Data source types: `uui-core/src/types/dataSources.ts`
- ArrayDataSource: `uui-core/src/data/processing/ArrayDataSource.tsx`
- LazyDataSource: `uui-core/src/data/processing/LazyDataSource.tsx`
- AsyncDataSource: `uui-core/src/data/processing/AsyncDataSource.tsx`
- Hooks: `uui-core/src/data/processing/hooks/`
- Examples: `app/src/docs/_examples/dataSources/`, `app/src/docs/_examples/pickerInput/`, `app/src/docs/_examples/tables/`
