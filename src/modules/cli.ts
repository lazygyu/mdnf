import parseArgvs from 'arg';
import type {Arguments, MDNIndex} from '../types';
import inquirer from 'inquirer';
import {exec} from 'child_process';

const options = {
    '--go': Boolean,
    '-g': '--go',
};

export async function parseArguments(): Promise<Arguments> {
    const args = parseArgvs(options);
    let keyword = args._.join(' ').trim();

    if (!keyword) {
        const answers = await inquirer.prompt([{
            type: 'input',
            name: 'keyword',
            message: 'Enter a keyword to search',
            validate(v: string) {
                if (!!v.trim()) {
                    return true;
                }
                return 'Please enter a keyword';
            }
        }]);
        keyword = answers.keyword;
    }

    return {
        '--go': !!args['--go'],
        keyword,
    };
}

export async function selectResult(list: MDNIndex) {
    if (list.length === 1 && list[0]) {
        return list[0].url;
    }
    const result = await inquirer.prompt([
        {
            type: 'list',
            name: 'url',
            message: 'Choose an item',
            choices: list.map(item => ({name: item.title, value: item.url}))
        }
    ]);
    return result.url;
}

export function openBrowser(url: string) {
    exec(`${getCommand()} ${url}`);
}

function getCommand() {
    switch (process.platform) {
        case 'darwin': return 'open';
        case 'win32': return 'start';
        default:
            return 'xdg-open';
    }
}
