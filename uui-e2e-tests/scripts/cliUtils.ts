// @ts-ignore
import spawn from 'cross-spawn';
import { Logger } from '../src/utils/logger';

export function isCmdSuccessful(params: { cmd: string, args: string[], cwd?: string }) {
    const { cwd = process.cwd(), cmd, args } = params;
    const result = spawn.sync(
        cmd,
        args,
        { stdio: undefined, cwd },
    );
    return result.status === 0;
}

export function spawnProcessSync(params: { cmd: string, args: string[], cwd?: string, exitOnErr: boolean }) {
    const { cwd = process.cwd(), args, cmd, exitOnErr } = params;
    const cmdInfoAsStr = `${cmd} ${args.join(' ')}`;

    Logger.infoHighlighted(cmdInfoAsStr);

    const result = spawn.sync(
        cmd,
        args,
        { stdio: 'inherit', cwd },
    );

    if (result.status !== 0) {
        const msgFromCmd = result.error?.message || '';
        const msg = `Error returned from "${cmdInfoAsStr}" ${msgFromCmd}`;
        if (exitOnErr) {
            Logger.error(msg);
            process.exit(1);
        }
    }
}
