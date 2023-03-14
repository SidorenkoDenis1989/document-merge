export enum EnvironmentMode {
    Char = 'char',
    Tag = 'tag',
    Whitespace = 'whitespace',
    SpecChars = 'special characters'
}

export class Tokenizer {
    protected readonly html: string;
    protected mode: EnvironmentMode = EnvironmentMode.Char;
    protected readonly tokens: string[] = [];
    protected currentWord: string = '';

    constructor(html: string) {
        this.html = html;
    }

    public static isEndOfTag(char: string): boolean {
        return char === '>';
    }

    public static isStartOfTag(char: string): boolean {
        return char === '<';
    }

    public static isWhitespace(char: string): boolean {
        return /^\s+$/.test(char);
    }

    public static isTag(token: string): boolean {
        return /^\s*<[^>]+>\s*$/.test(token);
    }

    public static isntTag(token: string): boolean {
        return !Tokenizer.isTag(token);
    }

    public static isClosedTag(tag: string) {
        return /^<\/\w+>/.test(tag);
    }

    public static isNotPunctuationCharacter(char: string) {
        return /[\w@]+/i.test(char)
    }

    public static isStartSpecCharacters(char: string) {
        return  char === '&';
    }

    public static isEndSpecCharacters(char: string) {
        return  char === ';';
    }


    public getTokens(): string[] {
        this.tokenize();
        return this.tokens;
    }

    protected handleTag(char: string): void {
        if (Tokenizer.isEndOfTag(char)) {
            this.currentWord += '>';
            this.pushCurrentWord();
            this.currentWord = '';
            this.mode = EnvironmentMode.Char;
        } else {
            this.currentWord += char;
        }
    }

    protected handleChar(char: string): void {
        if (Tokenizer.isStartOfTag(char)) {
            this.pushCurrentWord();
            this.currentWord = '<';
            this.mode = EnvironmentMode.Tag;
        } else if (/\s/.test(char)) {
            this.pushCurrentWord();
            this.currentWord = char;
            this.mode = EnvironmentMode.Whitespace;
        } else if (Tokenizer.isStartSpecCharacters(char)) {
            this.pushCurrentWord();
            this.currentWord = char;
            this.mode = EnvironmentMode.SpecChars;
        } else if (Tokenizer.isNotPunctuationCharacter(char)) {
            this.currentWord += char;
        } else {
            this.pushCurrentWord();
            this.currentWord = char;
        }
    }

    protected handleSpecialCharacters(char: string): void {
        if (Tokenizer.isStartOfTag(char)) {
            this.pushCurrentWord();
            this.currentWord = '<';
            this.mode = EnvironmentMode.Tag;
        } else if (/\s/.test(char)) {
            this.pushCurrentWord();
            this.currentWord = char;
            this.mode = EnvironmentMode.Whitespace;
        }
        else if (Tokenizer.isEndSpecCharacters(char)) {
            this.currentWord += char;
            this.pushCurrentWord();
            this.currentWord = '';
            this.mode = EnvironmentMode.Char;
        }
        else if (Tokenizer.isNotPunctuationCharacter(char)) {
            this.currentWord += char;
        } else {
            this.pushCurrentWord();
            this.currentWord = char;
        }
    }

    protected handleWhitespace(char: string): void {
        if (Tokenizer.isStartOfTag(char)) {
            this.pushCurrentWord();
            this.currentWord = '<';
            this.mode = EnvironmentMode.Tag;
        } else if (Tokenizer.isWhitespace(char)) {
            this.currentWord += char;
        } else {
            this.pushCurrentWord();
            this.currentWord = char;
            this.mode = EnvironmentMode.Char;
        }
    }

    protected pushCurrentWord(): void {
        if (this.currentWord) {
            this.tokens.push(this.currentWord);
        }
    }

    protected tokenize(): void {
        for (const char of this.html) {
            switch (this.mode) {
                case EnvironmentMode.Tag:
                    this.handleTag(char);
                    break;
                case EnvironmentMode.SpecChars:
                    this.handleSpecialCharacters(char);
                    break;
                case EnvironmentMode.Char:
                    this.handleChar(char);
                    break;
                case EnvironmentMode.Whitespace:
                    this.handleWhitespace(char);
                    break;
                default:
                    throw new Error(`Unknown mode ${this.mode}`);
            }
        }
        this.pushCurrentWord();
    }
}
