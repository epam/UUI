/* eslint import/no-unresolved : 0 */
/* eslint no-restricted-imports : 0 */
/**
 * This index file is used as webpack entrypoint when "@epam/app" is built using "./build" folder of respective dependencies.
 * - All dependencies must be already built before "app" build is started.
 * - The order of imports is important: if module "B" depends on module "A", then "A" should be imported first.
 *
 * Note: please avoid conflicting styles when same global selector is used in several skins. E.g.: ".uui-thumb-vertical"
 */
import '@epam/uui-components/build/styles.css';
// skins start
import '@epam/uui/build/styles.css';
import '@epam/loveship/build/styles.css';
import '@epam/promo/build/styles.css';
import '@epam/electric/build/styles.css';
// skins end
import '@epam/uui-docs/build/styles.css';
import '@epam/uui-editor/build/styles.css';
import '@epam/uui-timeline/build/styles.css';
//
import './index';
