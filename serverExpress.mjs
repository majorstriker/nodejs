import express from "express";

export default class ServerExpress {#
    metrics;#
    port;#
    server;

    constructor(metrics, port = 3000) {
        this.#metrics = metrics;
        this.#port = port;
    }

    start() {
        this.#server = express();
        this.#server.listen(this.#port, () => {
            console.log(`Server stated on http://localhost:${this.#port}`);
        });

        this.#server.use((req, res, next) => {
            console.log("Request method", req.method, "URL", req.url);
            this.#metrics.add(req.url);
            next();
        });

        this.#server.get("/", this.#renderHomePage.bind(this));
        this.#server.get("/about", this.#renderAboutPage.bind(this));
        this.#server.use(this.#render404Page.bind(this));
    }

    #
    renderHomePage(req, res) {
        const visitCounter = this.#metrics.get(req.url);
        const html = `
      <a href="/">Home</a> <a href="/about">About</a>
      <h1>Welcome to Home page</h1>
      <p>Count: ${visitCounter}</p>
    `;
        this.#renderHTML(res, 200, html);
    }

    #
    renderAboutPage(req, res) {
        const visitCounter = this.#metrics.get(req.url);
        const html = `
      <a href="/">Home</a> <a href="/about">About</a>
      <h1>Welcome to About page</h1>
      <p>Count: ${visitCounter}</p>
    `;
        this.#renderHTML(res, 200, html);
    }

    #
    render404Page(req, res) {
        const visitCounter = this.#metrics.get(req.url);
        const html = `
      <a href="/">Home</a> <a href="/about">About</a>
      <h1>404. Page with url: "${req.url}" not found</h1>
      <p>Count: ${visitCounter}</p>
    `;
        this.#renderHTML(res, 404, html);
    }

    #
    renderHTML(res, statusCode, content) {
        res.status(statusCode).send(content);
    }
}