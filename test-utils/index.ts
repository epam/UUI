import * as setupJsDomAll from './src/jsdom/setupJsDom';

import renderer from 'react-test-renderer';

export { renderer };

export const setupJsDom = setupJsDomAll.setupJsDom as (global?: any, params?: { mockCommon3rdPartyDeps: boolean }) => void;
/*
 * Re-exports everything from @testing-library/react and extends it with:
 * 1) additional queries
 * 2) re-exports userEvent
 */
export * from './src/extensions/testingLibraryReactExt';
// Utility function to mock adaptive panel items width
export { mockAdaptivePanelLayout } from './src/mocks/adaptivePanelMockUtils';

// Utility function to create mocked dataSources
export * from './src/mocks/dataSources';

// mocks
export { mockReactPortalsForSnapshots } from './src/mocks/reactPortalsMockUtils';
export { SvgMock } from './src/mocks/svgrMock';
// renderers
export {
    renderSnapshotWithContextAsync,
    renderHookWithContextAsync,
    renderWithContextAsync,
    getDefaultUUiContextWrapper,
} from './src/rendering/renderingWithContextUtils';
export type { CustomWrapperType } from './src/rendering/renderingWithContextUtils';
// setup
export { setupComponentForTest } from './src/rendering/setupComponentUtils';
// delay
export { delayAct, delay } from './src/rendering/timerUtils';
// test objects
export { PickerInputTestObject, PickerModalTestObject, PickerListTestObject } from './src/testObjects';
