export interface Options {
    '--go': boolean;
}

export declare type Arguments = Partial<Options> & {
    keyword: string;
};

export declare type MDNIndexItem = {
    title: string,
    url: string,
}

export declare type MDNIndex = MDNIndexItem[];
