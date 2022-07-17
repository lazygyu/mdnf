import type {MDNIndex} from '../types';
import {Fzf} from 'fzf';

export function search(keyword: string, data: MDNIndex) {
    const fzf = new Fzf(data, {
        selector: item => item.title,
    });
    const entries = fzf.find(keyword);
    return entries.map(entry => ({...entry.item}));
}
