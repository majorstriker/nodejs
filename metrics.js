import fs from "fs";
import * as path from "path";

export default class Metrics {#
    metrics;#
    jsonFileName = path.join(process.cwd(), "metrics.json");

    constructor() {
        if (fs.existsSync(this.#jsonFileName)) {
            this.#readJson();
        } else {
            this.#metrics = new Map();
            console.log(`Create ${this.#jsonFileName}.`);
        }
    }

    #
    readJson() {
        const fileData = fs.readFileSync(this.#jsonFileName).toString();
        this.#metrics = new Map(Object.entries(JSON.parse(fileData)));
    }

    async# writeJson() {
        const jsonMetrics = JSON.stringify(Object.fromEntries(this.#metrics.entries()), null, 2);
        try {
            await fs.promises.writeFile(this.#jsonFileName, jsonMetrics);
        } catch (err) {
            throw new Error(err.message);
        }
    }

    add(url) {
        if (!this.#metrics.has(url)) {
            this.#metrics.set(url, 1);
        } else {
            const urlVisits = this.#metrics.get(url);
            this.#metrics.set(url, urlVisits + 1);
        }
        this.#writeJson().then(() => console.log("Metrics were recorded to json"));
    }

    get(url) {
        return this.#metrics.get(url);
    }
}