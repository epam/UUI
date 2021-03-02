export const screenSize = {
    width: 0,
    height: 0,
};

if (typeof window !== 'undefined' && window.name !== 'nodejs') {
    screenSize.width = window.innerWidth;
    screenSize.height = window.innerHeight;

    window.addEventListener('resize', () => {
        screenSize.width = window.innerWidth;
        screenSize.height = window.innerHeight;
    });
}