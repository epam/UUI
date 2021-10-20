import { useLock } from '../useLock';
import { act, cleanup } from '@testing-library/react-hooks';
import { mountHookWithContext } from '@epam/test-utils';

describe('useLock', () => {
    beforeEach(jest.clearAllMocks);
    afterEach(cleanup);

    it('Creates lock correctly', async () => {
        const { result } = await mountHookWithContext(() => useLock({
            handleLeave: () => Promise.resolve(true),
            isEnabled: true,
        }));

        expect(result.current.lock.current).toBeDefined();
    });

    it('Releases lock correctly', async () => {
        const { result } = await mountHookWithContext(() => useLock({
            handleLeave: () => Promise.resolve(true),
            isEnabled: true,
        }));

        act(() => result.current.releaseLock());

        expect(result.current.lock.current).toBeNull();
    });

    it('Updates lock correctly', async () => {
        const { result } = await mountHookWithContext(() => useLock({
            handleLeave: () => Promise.resolve(true),
            isEnabled: true,
        }));

        const firstLock = result.current.lock.current;
        await act(() => result.current.updateLock());
        const secondLock = result.current.lock.current;

        expect(secondLock).toBeDefined();
        expect(firstLock).not.toEqual(secondLock);
    });

    it('Acquires lock correctly', async () => {
        const handleLeaveMock = jest.fn().mockResolvedValue(true);
        const { result } = await mountHookWithContext(() => useLock({
            handleLeave: handleLeaveMock,
            isEnabled: true,
        }));

        await act(() => result.current.acquireLock());

        expect(handleLeaveMock).toHaveBeenCalled();
    })
});