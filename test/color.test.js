import { describe, it, expect } from 'vitest';
import chroma from 'chroma-js';

const Color = chroma.Color;

const hexColors = ['#ff9900', '#FF9900', '#F90', 'f90', 'FF9900', 'FF9900F0', 'F90F', '#F90F'];

describe('Testing Color', () => {
    it('re-use existing color instance', () => {
        const c0 = new Color('red');
        expect(c0).toBe(new Color(c0));
    });

    it('autodetect named colors', () => {
        const createColor = () => new Color('mediumslateblue');
        expect(createColor).not.toThrow();
        expect(createColor().hex()).toBe('#7b68ee');
    });

    it('throw err on wrong color name', () => {
        const createColor = () => new Color('fakecolor');
        expect(createColor).toThrow();
    });

    describe('autodetect correct hex colors', () => {
        hexColors.forEach((hex) => {
            it(`detect hex ${hex}`, () => {
                const createColor = () => new Color(hex);
                expect(createColor).not.toThrow();
                expect(createColor().hex('rgb')).toBe('#ff9900');
            });
        });
    });

    it('create lch color from object', () => {
        expect(new Color({ l: 80, c: 25, h: 200 }).hex()).toBe('#85d4d5');
        expect(chroma({ l: 80, c: 25, h: 200 }).hex()).toBe('#85d4d5');
        expect(chroma.lch(80, 25, 200).hex()).toBe('#85d4d5');
        expect(chroma(80, 25, 200, 'lch').hex()).toBe('#85d4d5');
    });

    it('create hcl color from object', () => {
        expect(new Color({ h: 200, c: 25, l: 80 }).hex()).toBe('#85d4d5');
        expect(chroma({ h: 200, c: 25, l: 80 }).hex()).toBe('#85d4d5');
        expect(chroma.hcl(200, 25, 80).hex()).toBe('#85d4d5');
        expect(chroma(200, 25, 80, 'hcl').hex()).toBe('#85d4d5');
    });
});
