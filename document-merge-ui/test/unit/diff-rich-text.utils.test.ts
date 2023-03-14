import { Tokenizer } from '../../src/utils/diff-rich-text/tokenizer';
import { DiffRichText } from '../../src/utils/diff-rich-text/diff-rich-text.utils';
import { CharTokenizer } from '../../src/utils/diff-rich-text/char-tokenizer';

describe('Tokenizer', () => {
    it('should tokenize a string into individual words and tags', () => {
        const html = '<html><head><title>Test Page</title></head><body><p>Hello world!</p></body></html>';
        const tokenizer = new Tokenizer(html);
        expect(tokenizer.getTokens()).toStrictEqual([
            '<html>',
            '<head>',
            '<title>', 'Test', ' ', 'Page', '</title>',
            '</head>',
            '<body>',
            '<p>', 'Hello', ' ', 'world', '!', '</p>',
            '</body>',
            '</html>',
        ]);
    });

    it('should tokenize a string into individual chars and tags', () => {
        const result = new CharTokenizer('<b>test test</b>').getTokens();
        expect(result).toEqual(['<b>', 't', 'e', 's', 't', ' ', 't', 'e', 's', 't', '</b>']);
    });

    it('checking Tokenizer with special characters', () => {
        const html = '<p>RV&amp;S</p>';
        const result = new Tokenizer(html).getTokens();
        expect(result).toEqual(['<p>', 'RV', '&amp;', 'S', '</p>']);
    });

    it('checking CharTokenizer with special characters', () => {
        const html = '<p>RV&amp;S</p>';
        const result = new CharTokenizer(html).getTokens();
        expect(result).toEqual(['<p>', 'R', 'V', '&amp;', 'S', '</p>']);
    });
});


describe('DiffRichText', () => {

    it('checking string with new line', () => {
        const oldValue = '<p>Hello, <strong>world else</strong>!</p>';
        const newValue = '<p>New hello</p><p>Hello, <strong>worlsd assd Else</strong>!</p>';
        const result = DiffRichText.getDiff(oldValue, newValue);
        expect(result).toEqual('<p><ins>New hello</ins></p><p>Hello, <strong>worl<ins>s</ins>d <ins>assd E</ins>lse</strong>!</p>');
    });

    it('checking the replacing of tags', () => {
        const oldValue = '<p>Hello, <strong>world else</strong>!</p>';
        const newValue = '<p>Hello, <b>world else</b>!</p>';
        const result = DiffRichText.getDiff(oldValue, newValue);
        expect(result).toEqual('<p>Hello, <ins><b>world else</b></ins>!</p>');
    });

    it('checking removing', () => {
        const oldValue = '<p>Introduction</p>';
        const newValue = '<p>Introduct</p>';
        const result = DiffRichText.getDiff(oldValue, newValue);
        expect(result).toEqual('<p>Introduct<del>ion</del></p>');
    });

    it('checking data with special characters', () => {
        const oldValue = '<p>Windchill RV&amp;S Server</p>';
        const newValue = '<p>&#160;</p>';
        const result = DiffRichText.getDiff(oldValue, newValue);
        expect(result).toEqual('<p><ins>&#160;</ins></p>');
    });

});

