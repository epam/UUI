---
name: uui-services-context
description: Helps work with UUI services layer including ContextProvider, ApiContext, ModalContext, NotificationContext, and useUuiContext. Use when implementing features that need modals, notifications, API calls, error handling, or routing.
---

# UUI Services & Context

UUI provides a services layer that components consume via `useUuiContext()`. Services are initialized by `ContextProvider` and include API, modals, notifications, routing, analytics, and more.

## Location

- **Package:** `@epam/uui-core`
- **Path:** `uui-core/src/services/`
- **Types:** `uui-core/src/types/contexts.ts`

## ContextProvider

Wrap the app with `ContextProvider` to initialize UUI services:

```typescript
import { ContextProvider } from '@epam/uui-core';

<ContextProvider
    apiDefinition={ (processRequest) => ({
        myApi: (data) => processRequest('/api/endpoint', 'POST', data),
    })}
    loadAppContext={ async (api) => ({ user: await api.getUser() }) }
    onInitCompleted={ (svc) => { /* optional: store ref, etc. */ } }
    history={ history }  // optional: for SPA routing
>
    <App />
</ContextProvider>
```

- **apiDefinition** — Returns API object. Each method receives `(url, method, data, options)` via `processRequest`.
- **loadAppContext** — Loads global data before mount. Result stored in `uuiApp`.
- **onInitCompleted** — Called when contexts are ready.
- **history** — React Router history for `uuiRouter.redirect()`.

## useUuiContext

Access services inside any component under `ContextProvider`:

```typescript
import { useUuiContext } from '@epam/uui-core';

function MyComponent() {
    const svc = useUuiContext();
    const { api, uuiModals, uuiNotifications, uuiRouter } = svc;
    // ...
}
```

**Throws** if used outside `ContextProvider`.

## Key Services

| Service | Property | Purpose |
|---------|----------|---------|
| API | `api` | HTTP requests. Methods from `apiDefinition`. `api.withOptions({})` for call options. |
| Modals | `uuiModals` | Show modal dialogs. `uuiModals.show(render, params)` returns `Promise<TResult>`. |
| Notifications | `uuiNotifications` | Toast notifications. `uuiNotifications.show(render, params)`. |
| Router | `uuiRouter` | `redirect(link)`, `getCurrentLink()`, `transfer(link)`. |
| Layout | `uuiLayout` | Layers, portal root. `getLayer()`, `releaseLayer()`, `getPortalRoot()`. |
| Locks | `uuiLocks` | Concurrent action locking. `acquire()`, `release()`, `withLock()`. |
| Errors | `uuiErrors` | Error handling, recovery. |
| Analytics | `uuiAnalytics` | Analytics events. |
| User Settings | `uuiUserSettings` | Persistent user settings (e.g. form drafts). |
| App Context | `uuiApp` | Data from `loadAppContext`. |

## Modals

```typescript
const result = await uuiModals.show<ResultType>((props) => (
    <MyModal
        { ...props }
        onSave={ () => props.success(data) }
        onCancel={ () => props.abort() }
    />
), { initialValue });
```

- `props.success(data)` — Resolves the promise, closes modal.
- `props.abort()` — Rejects the promise, closes modal.
- `ModalOperationCancelled` — Thrown when user dismisses modal (e.g. backdrop click).

## Notifications

```typescript
await uuiNotifications.show((props) => (
    <SuccessNotification { ...props }>
        Saved successfully
    </SuccessNotification>
), { duration: 5, position: 'bot-right' });
```

- **duration** — Seconds or `'forever'` for persistent notification.
- **position** — `'bot-left'` | `'bot-right'` | `'top-left'` | `'top-right'` | `'top-center'` | `'bot-center'`.

## API (ApiContext)

- `processRequest(url, method, data, options)` — Low-level HTTP.
- API methods from `apiDefinition` use `processRequest` internally.
- AbortSignal passed via `FetchingOptions` for cancellation.
- Auth recovery, relogin path configured via `ApiContext` props.

## useUuiServices

Used by `ContextProvider` internally. For tests or custom setup:

```typescript
const { services } = useUuiServices({ apiDefinition, router });
// Provide via UuiContext.Provider value={services}
```

## Routing Adapters

- **HistoryAdaptedRouter** — Wraps react-router `history`.
- **StubAdaptedRouter** — No-op for apps without routing.
- **Next.js** — Use `useUuiServicesSsr` from `@epam/uui-core/ssr`.

## References

- ContextProvider: `uui-core/src/services/ContextProvider.tsx`
- useUuiServices: `uui-core/src/hooks/useUuiServices.ts`
- Types: `uui-core/src/types/contexts.ts`
- ApiContext: `uui-core/src/services/ApiContext.ts`
- ModalContext: `uui-core/src/services/ModalContext.ts`
- NotificationContext: `uui-core/src/services/NotificationContext.ts`
