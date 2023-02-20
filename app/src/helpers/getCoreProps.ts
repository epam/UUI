export function getCoreProps(props: any) {
    return props['data-sourcepos'] ? { 'data-sourcepos': props['data-sourcepos'] } : {};
}
