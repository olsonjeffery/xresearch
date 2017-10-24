(() => {
    const e = React.createElement;

    // main entry point, called from web page on document ready
    window.initXResearch = (data) => {
        ReactDOM.render(e(xrComponents.AppComponent, {data: data}, null), document.getElementById('app-root'));
    };
    window.initCy = (containerElem, data, store) => {
    };
})();
