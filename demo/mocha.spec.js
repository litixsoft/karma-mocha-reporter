'use strict';

describe('A mocha test suite', function () {

    it('should work', function () {
        var expected = 'foo';
        var actual = 'foo';
        expect(actual).to.equal(expected);
    });

    it('should show a multiline string diff', function () {
        var expected = 'b\na';
        var actual = 'a\nb';
        expect(actual).to.equal(expected);
    });

    it('should show a string diff', function () {
        var expected = 'foo';
        var actual = 'foo bar';
        expect(actual).to.equal(expected);
    });

    it('should show an array diff', function () {
        var expected = [
            'foo',
            'bar'
        ];
        var actual = [
            'bar',
            'baz'
        ];
        expect(actual).to.deep.equal(expected);
    });

    it('should show an object diff', function () {
        var expected = {
            foo: 42,
            bar: 1764,
            baz: {
                qux: 'bleep',
                norf: 'bloop'
            }
        };
        var actual = {
            bar: 1764,
            baz: {
                norf: 'bloop'
            },
            random: true
        };
        expect(actual).to.deep.equal(expected);
    });

    describe('Test Suite 1 (with a skipped test)', function () {
        // case 1
        xit('should fail', function () {
            assert.isTrue(false);
        });

        // case 2
        it('should pass', function () {
            assert.isTrue(true);
        });
    });

    describe('Test Suite 2', function () {
        it('should fail', function () {
            assert.isTrue(false);
        });
    });
});