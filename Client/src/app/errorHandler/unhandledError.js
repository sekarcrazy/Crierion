(function () {
    window.unhandledErrorFun = function (message) {
        //You can add a message into DOM by creating an element on the fly.
        alert(message);
        return;
    }
    window.onerror = unhandledErrorFun;

})();