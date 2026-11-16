const axios = require("axios");
const cheerio = require("cheerio");

async function printGrid(url) {
    try {
        const { data } = await axios.get(url);

        const $ = cheerio.load(data);

        const points = [];
        let maxX = 0;
        let maxY = 0;

        $("table tr").each((index, row) => {
            if (index === 0) return;

            const cells = $(row).find("td");

            if (cells.length < 3) return;

            const x = Number($(cells[0]).text().trim());
            const char = $(cells[1]).text().trim();
            const y = Number($(cells[2]).text().trim());

            if (Number.isNaN(x) || Number.isNaN(y)) return;

            points.push({ x, y, char });

            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
        });

        const grid = Array.from(
            { length: maxY + 1 },
            () => Array(maxX + 1).fill(" ")
        );

        for (const { x, y, char } of points) {
            grid[y][x] = char;
        }
        
        for (const row of grid) {
            console.log(row.join(""));
        }

    } catch (err) {
        console.error(err.message);
    }
}

printGrid("https://docs.google.com/document/d/e/2PACX-1vSvM5gDlNvt7npYHhp_XfsJvuntUhq184By5xO_pA4b_gCWeXb6dM6ZxwN8rE6S4ghUsCj2VKR21oEP/pub");