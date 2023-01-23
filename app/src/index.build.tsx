/**
 * This index file is used as webpack entrypoint when "@epam/app" is built using "./build" folder of respective dependencies.
 * - All dependencies must be already built before "app" build is started.
 * - The order of imports is important: if module "B" depends on module "A", then "A" should be imported first.
 *
 * Open questions:
 * 1) how to avoid conflicting styles when same global selector is used in several skins. E.g.: ".uui-thumb-vertical"
 */
// tslint:disable:no-import
import "@epam/uui-components/build/styles.css";
// skins start
import "@epam/uui/build/styles.css";
import "@epam/loveship/build/styles.css";
import "@epam/promo/build/styles.css";
// skins end
import "@epam/uui-docs/build/styles.css";
import "@epam/uui-editor/build/styles.css";
import "@epam/uui-timeline/build/styles.css";
//
export * from './index';
