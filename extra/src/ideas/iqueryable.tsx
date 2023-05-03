// type QueryResult<T> = T | 'lazy' | 'unknown' | 'loading';

// interface IQueryable<TFilter, TItem, TId> {
//     byId(id: TId): QueryResult<TItem>;
//     list(filter: TFilter, from: any): any;
//     versionHash?: string;
//     fetchMode?: 'all' | 'lazy';
// }

// interface ListProps<TItem, TId> {
//     query: IQueryable<TItem, TId>;
//     getChildren: (item: TItem) => IQueryable<TItem, TId>;
// }
//     [OK] picker
//         - getSelection: ids.map(id => q.byId(id))
//         - ignore parent/child, or pass this to render
//         - filter selectable only
//         - can order on client

//     [OK] Top picks
//         - ok, can get by ID

//     [NORM] highlight that some children are selected
//         - fetch whole selection by ids
//         - unroll parents

//     [BAD - FETCH ALL] selection cascading:
//         - are there selectable children?
//         - select all/none: get list of all selectable children
//         - q.query(parent => getChildren(of parent)) // need to fetch all children here
//             .map(node => isSelectable(node))

//     [NORM] folding
//         - children == null -> skip
//         - given a node, does it have any children?
//         - folded ? q.count() : q.list

//     [OK] lazyLoading
//         - can I fetch count?
//         - can I query for selection?
//         - are there too much nodes to fetch them all for select all?
//         - controlled by fetch
//         [S] lazy = true - no select all

//     [OK] sorting
//         - refetch all
//         - can be done externally
//         - should change versionHash
//         - children can be sorted differently if needed

//     [OK] should we indent the first level - does any node has any children?
//         - there is getChildren() defined

//     filter+folding
//         - given the node, does it has any children matching search/filter?
//         - what if children passed the filter, but parent - are not?
//         - lazy: up to IQuery impl
//         - greedy: ?????

//     [OK] custom hierarchy issues
//         - how to mix ids from different queries?
//             - byId, selection
//             - use [id, type]
//             - add uid to the DB Entities
//         -

//     selection option:
//         - fetch all selected by ID (need anyway)
//         - walk to root, ISSUE: how to navigate child=>parent?
//         - solves:
//             - has selected children (recusively)
//         - doesn't solve
//             - selection cascading
const dummyExport = {};
export default dummyExport;
