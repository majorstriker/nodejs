import http from "http";

export default class Server {#
    metrics;#
    port;

    constructor(metrics, port = 3000) {
        this.#metrics = metrics;
        this.#port = port;
    }

    start() {
        this.server = http.createServer(this.#requestHandler.bind(this));
        this.server.listen(this.#port, () => {
            console.log(`Server stated on http://localhost:${this.#port}`);
        });
    }

    #
    requestHandler(req, res) {
        console.log(`Request send: ${req.url}`);
        this.#metrics.add(req.url);

        if (req.url === "/" || req.url === "/home") {
            this.#renderHomePage(res);
        } else if (req.url === "/about") {
            this.#renderAboutPage(res);
        } else {
            this.#render404Page(res);
        }
    }

    #
    renderHomePage(res) {
        const visitCounter = this.#metrics.get(res.req.url);
        const html = `
      <a href="/">Home</a> <a href="/about">About</a>
      <h1>Welcome to Home page</h1>
      <p>Count: ${visitCounter}</p>
    `;
        this.#renderHTML(res, 200, html);
    }

    #
    renderAboutPage(res) {
        const visitCounter = this.#metrics.get(res.req.url);
        const html = `
      <a href="/">Home</a> <a href="/about">About</a>
      <h1>Welcome to About page</h1>
      <p>Count: ${visitCounter}</p>
    `;
        this.#renderHTML(res, 200, html);
    }

    #
    render404Page(res) {
        const visitCounter = this.#metrics.get(res.req.url);
        const html = `
      <a href="/">Home</a> <a href="/about">About</a>
      <h1>404. Page not found</h1>
      <p>Count: ${visitCounter}</p>
    `;
        this.#renderHTML(res, 404, html);
    }

    #
    renderHTML(res, statusCode, content) {
        res.writeHead(statusCode, {
            "Content-Type": "text/html; charset=UTF-8"
        });
        res.end(content);
    }
}