const requireContext = require.context('../../docs/_examples', true, /\.example.(ts|tsx)$/, 'lazy');

/**
 * Path must be relative to 'app/src/docs/_examples/' folder.
 *
 * @param params.path - Example './alert/Basic.example.tsx'
 * @param params.shortPath - Example 'alert/Basic'
 */
export async function docExampleLoader(params: { path: string } | { shortPath: string }) {
    const path = (params as { path: string }).path;
    const shortPath = (params as { shortPath: string }).shortPath;
    const pathEffective: string = path ? `./${path}` : `./${shortPath}.example.tsx`;

    const module: any = await requireContext(pathEffective);
    return module.default;
}
