module.exports = (app, router) => {
    const { view: ViewController } = app.controller
    router.get('/view/:page',ViewController.renderPage.bind(ViewController))
}