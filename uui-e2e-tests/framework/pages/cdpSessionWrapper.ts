import { CDPSession, Page } from '@playwright/test';
import { TEngine } from '../types';

/**
 * Wrapper around Chrome DevTools Protocol
 * See also: https://chromedevtools.github.io/devtools-protocol/
 */
export class CdpSessionWrapper {
    private cdpSession: CDPSession | undefined;

    constructor(private page: Page, private engine: TEngine) {}

    private getCdpSession = async () => {
        if (this.engine === TEngine.chromium) {
            if (!this.cdpSession) {
                const client = await this.page.context().newCDPSession(this.page);
                await client.send('DOM.enable');
                await client.send('CSS.enable');
                this.cdpSession = client;
            }
            return this.cdpSession;
        } else {
            throw new Error(`Unable to create CDPSession for "${this.engine}". CDPSession is only supported for ${TEngine.chromium}!`);
        }
    };

    cssForcePseudoState = async (params: { state: 'hover' | 'focus', selector: string }) => {
        const client = await this.getCdpSession();
        const { root } = await client.send('DOM.getDocument');
        const { nodeIds } = await client.send('DOM.querySelectorAll', { nodeId: root.nodeId, selector: params.selector });
        const apply = async (nodeId: number, forcedPseudoClasses: string[]) => {
            await client.send('CSS.forcePseudoState', {
                nodeId,
                forcedPseudoClasses,
            });
        };
        for (const n of nodeIds) {
            await apply(n, [params.state]);
        }
    };

    /**
     * Close the session. Any changes will be reset.
     */
    close = async () => {
        if (this.cdpSession) {
            await this.cdpSession.detach();
            this.cdpSession = undefined;
        }
    };
}
