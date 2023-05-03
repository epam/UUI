/*
 * Re-exports everything from @testing-library/react and extends it with:
 * 1) additional queries
 * 2) re-exports userEvent
 */
export * from './src/extensions/testingLibraryReactExt';
// Utility function to mock adaptive panel items width
export { mockAdaptivePanelLayout } from './src/mockUtils/adaptivePanelMockUtils';
// mocks
export { mockReactPortalsForSnapshots } from './src/mockUtils/reactPortalsMockUtils';
export { SvgMock } from './src/mockUtils/svgrMock';
// renderers
export {
    renderSnapshotWithContextAsync,
    renderHookToJsdomWithContextAsync,
    renderToJsdomWithContextAsync,
    getDefaultUUiContextWrapper,
} from './src/utils/renderingWithContextUtils';
export type { CustomWrapperType } from './src/utils/renderingWithContextUtils';
// setup
export { setupComponentForTest } from './src/utils/setupComponentUtils';
// delay
export { delayWrapInAct, delay } from './src/utils/timerUtils';
