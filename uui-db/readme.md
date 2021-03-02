# UUI DB package

This package is a part of [EPAM UUI](https://github.com/epam/UUI) library.

@epam/uui-db is an experimental state-management solution. It maintains immutable relational database on client, provides means to load data from server, update it both from client, and save it to server asynchronously with UI operations.

## Features

- relation data model for state, providing a normalized storage for UI state
- data loading from server, with automatic GraphQL response normalization into tables
- synchronous and transactional updates of state from UI
- asynchronous bi-directional state synchronization between UI and server. UI changes in terms of 'patches' are batched and sent to server. Server can also push updates to UI state
- GIT-like branch-rebase approach to handle state concurrency
- tables can be indexed to speed-up queries
- Views to build arbitrary state projections
- subscriptions to subscribe parts of UI to changes in Views

