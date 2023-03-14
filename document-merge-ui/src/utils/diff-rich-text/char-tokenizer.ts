import { EnvironmentMode, Tokenizer } from './tokenizer';

export class CharTokenizer extends Tokenizer {

    constructor(html: string) {
        super(html);
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
        } else {
            this.pushCurrentWord();
            this.currentWord = char;
        }
    }
}
