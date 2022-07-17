import {tmpdir} from 'os';
import {existsSync, readFileSync, statSync, writeFileSync} from 'fs';
import * as https from 'https';

const SEARCH_DATA_FILENAME = "mdn_search_data.json";
const SEARCH_DATA_PATHNAME = `${tmpdir()}/${SEARCH_DATA_FILENAME}`;
const CACHE_PERIOD = 7 * 24 * 86400 * 1000;

export async function loadSearchData() {
    if (!await isSearchDataExists()) {
        await downloadSearchData();
    }
    return await parseSearchData();
}

async function isSearchDataExists() {
    if (existsSync(SEARCH_DATA_PATHNAME)) {
        const stat = statSync(SEARCH_DATA_PATHNAME);
        if (stat.mtime.getTime() > Date.now() - CACHE_PERIOD) {
            return true;
        }
    }
    return false;
}

async function downloadSearchData() {
    const body: string = await new Promise((rs, rj) => {
        https.get("https://developer.mozilla.org/en-US/search-index.json", (res) => {
            let body = '';
           res.setEncoding('utf8');
           res.on('data', data => {
               body += data;
           });
           res.on('end', () => {
               rs(body);
           });
           res.on('error', rj);
        });
    });

    writeFileSync(SEARCH_DATA_PATHNAME, body, {encoding: 'utf8'});
}

async function parseSearchData() {
    const json = readFileSync(SEARCH_DATA_PATHNAME, {encoding: 'utf8'});
    return JSON.parse(json);
}
