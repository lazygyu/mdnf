#!/usr/bin/env node


import {loadSearchData} from './modules/loadSearchData';
import {openBrowser, parseArguments, selectResult} from './modules/cli';
import {search} from './modules/search';

const URL_PREFIX = 'https://developer.mozilla.org';

async function main() {
    const data = await loadSearchData();
    const args = await parseArguments();
    const list = search(args.keyword, data);

    if (list.length === 0) {
        console.log('No result for ' + args.keyword);
    } else {
        const selectedResult = (args['--go'] && list[0]) ? list[0].url : await selectResult(list);
        if (selectedResult) {
            const url = `${URL_PREFIX}${selectedResult}`;
            openBrowser(url);
        }
    }
}

void main();
