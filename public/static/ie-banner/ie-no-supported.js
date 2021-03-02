(function() {
    if (/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {

        document.body.innerHTML = "";

        let cssBanner = "margin: 0; background: #f2f3f7; height: 100%; text-align: center";
        let cssImg = "width: 50%";

        let banner = document.body;
        banner.style.cssText = cssBanner;

        let img = document.createElement("img");
        img.src = "../static/ie-banner/ie-no-supported.svg";
        img.style.cssText = cssImg;
        banner.appendChild(img);
    }
}());