(function () {
    if (/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
        document.body.innerHTML = '';

        const cssBanner = 'margin: 0; background: #f2f3f7; height: 100%; text-align: center';
        const cssImg = 'width: 50%';

        const banner = document.body;
        banner.style.cssText = cssBanner;

        const img = document.createElement('img');
        img.src = '../static/ie-banner/ie-no-supported.svg';
        img.style.cssText = cssImg;
        banner.appendChild(img);
    }
}());
