declare module "uttori-utilities";

declare module "classifier" {
    export = Classifier;
    class Classifier {
        static getFeatures(text: string): string[];
        constructor(model?: object);
        categories: any;
        frequency: any;
        minimums: any;
        thresholds: any;
        categoryCount(category: string): number;
        featureCount(feature: string, category: string): number;
        featureProbability(feature: string, category: string): number;
        getCategories(): string[];
        incrementCategory(category: string): void;
        incrementFeature(feature: string, category: string): void;
        totalCount(): number;
        train(item: string, category: string): void;
        weightedProbability(feature: string, _category: string, basicProbability: number, weight?: number, assumedProbability?: number): number;
        save(spaces?: number): string;
    }
}
declare module "classifier_fisher" {
    export = Fisher;
    class Fisher extends Classifier {
        static inverseChiSquared(probability: number, degreeOfFreedom: number): number;
        classify(item: string, fallback?: string): string;
        categoryProbability(feature: string, category: string): number;
        fisherProbability(item: string, category: string): number;
        getMinimum(category: string): number;
        setMinimum(category: string, minimum: number): number;
        setThreshold(): void;
    }
    import Classifier = require("classifier");
}
declare module "classifier_naive_bayes" {
    export = NaiveBayes;
    class NaiveBayes extends Classifier {
        classify(item: string, fallback?: string): string;
        documentProbability(item: string, category: string): number;
        probability(item: string, category: string): number;
        getThreshold(category: string): number;
        setThreshold(category: string, threshold: number): number;
        setMinimum(): void;
    }
    import Classifier = require("classifier");
}
declare module "tokenizer" {
    export = TokenizeThis;
    class TokenizeThis {
        constructor(config?: {});
        convertLiterals: any;
        escapeCharacter: any;
        tokenizeList: any[];
        tokenizeMap: {};
        matchList: any[];
        matchMap: {};
        delimiterList: any[];
        delimiterMap: {};
        config: {};
        tokenize(input: string, forEachToken: Function): any;
    }
}
declare module "diff-parser" {
    export = DiffParser;
    class DiffParser {
        static detectLineType(line?: string): string;
        static parseUnifiedContent(line?: string, header?: object): object;
        static parseCombinedContent(line?: string, header?: object): object;
        static praseChunkHeader(raw?: string): object;
        static praseFileLine(raw: string): object;
        constructor(config?: object);
        tokenizer: TokenizeThis;
        operators: {};
        config: any;
        parse(diff: string): object;
    }
    import TokenizeThis = require("tokenizer");
}
declare module "file-utility" {
    export function ensureDirectory(folder: string): Promise<void>;
    export function ensureDirectorySync(folder: string): void;
    export function deleteFile(folder: string, name: string, extension: string): Promise<void>;
    export function deleteFileSync(folder: string, name: string, extension: string): void;
    export function readFile(folder: string, name: string, extension: string, encoding?: string): Promise<any>;
    export function readFileSync(folder: string, name: string, extension: string, encoding?: string): object;
    export function readJSON(folder: string, name: string, extension: string, encoding?: string): Promise<any>;
    export function readJSONSync(folder: string, name: string, extension: string, encoding?: string): object;
    export function readFolder(folder: string): Promise<any>;
    export function readFolderSync(folder: string): string[];
    export function writeFile(folder: string, name: string, extension: string, content: string, encoding?: string): Promise<void>;
    export function writeFileSync(folder: string, name: string, extension: string, content: string, encoding?: string): void;
}
declare module "fisher\u2013yates-shuffle" {
    export = fyShuffle;
    function fyShuffle(array: any[]): any[];
}
declare module "function-queue" {
    export = FunctionQueue;
    class FunctionQueue {
        static throttle(max_requests_per_interval: number, interval: number, evenly_spaced?: boolean): Function;
    }
}
declare module "operator" {
    export = Operator;
    class Operator {
        static type(type: string): any;
        constructor(value: any, type: any, precedence: number);
        value: any;
        type: any;
        precedence: number;
        toJSON(): any;
        toString(): string;
    }
}
declare module "where-parser" {
    export = SqlWhereParser;
    class SqlWhereParser {
        static defaultEvaluator(operatorValue: string | symbol, operands: any[]): any[] | object;
        constructor(config: {
            operators?: object[];
            tokenizer?: {
                shouldTokenize?: string[];
                shouldMatch?: string[];
                shouldDelimitBy?: string[];
            };
            wrapQuery?: boolean;
        });
        tokenizer: TokenizeThis;
        operators: {};
        config: {
            operators?: object[];
            tokenizer?: {
                shouldTokenize?: string[];
                shouldMatch?: string[];
                shouldDelimitBy?: string[];
            };
            wrapQuery?: boolean;
        };
        parse(sql: string, evaluator?: Function): object;
        operatorPrecedenceFromValues(operatorValue1: string | symbol, operatorValue2: string | symbol): boolean;
        getOperator(operatorValue: string | symbol): any;
    }
    import TokenizeThis = require("tokenizer");
}
declare module "parse-query-to-array" {
    export = parseQueryToArray;
    function parseQueryToArray(query: string): any[];
}
declare module "parse-query-to-ramda" {
    export = parseQueryToRamda;
    function parseQueryToRamda(ast: object): any[];
}
declare module "validate-query" {
    export = validateQuery;
    function validateQuery(query: string): object;
}
declare module "network" {
    export function base(url: string | URL, options: {
        method: object;
    }, context: {
        responseEncoding: string;
        data: string | Buffer;
    }, callback: Function): Promise<any>;
    export function json(url: string | URL, options?: {
        method?: object;
    }, context?: {
        responseEncoding?: string;
        data?: string | Buffer;
        fallback?: any;
    }): Promise<any>;
    export function raw(url: string | URL, options?: {
        method?: object;
    }, context?: {
        responseEncoding?: string;
        data?: string | Buffer;
    }): Promise<any>;
    export function request(url: string | URL, options?: {
        method?: object;
    }, context?: {
        responseEncoding?: string;
        data?: string | Buffer;
        fallback?: any;
    }): Promise<any>;
}
declare module "index" {
    export const FileUtility: typeof import("file-utility");
    export const FunctionQueue: typeof import("function-queue");
    export const Operator: typeof import("operator");
    export const parseQueryToArray: (query: string) => any[];
    export const parseQueryToRamda: (ast: any) => any[];
    export const TokenizeThis: typeof import("tokenizer");
    export const validateQuery: (query: string) => any;
    export const SqlWhereParser: typeof import("where-parser");
    export const Classifier: typeof import("classifier");
    export const NaiveBayes: typeof import("classifier_naive_bayes");
    export const Fisher: typeof import("classifier_fisher");
    export const Network: typeof import("network");
    export const DiffParser: typeof import("diff-parser");
    export const fyShuffle: (array: any[]) => any[];
}
