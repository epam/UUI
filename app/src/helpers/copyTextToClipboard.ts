export function copyTextToClipboard(text: string, cb: any) {
    navigator.clipboard.writeText(text).then(
        function () {
            cb();
        },
        function (err) {
            console.error('Async: Could not copy text: ', err);
        },
    );
}
