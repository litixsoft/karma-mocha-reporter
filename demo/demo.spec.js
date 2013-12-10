/*global describe, it, expect, xdescribe */
describe('2 Demo test suite', function () {
    it('should assert true', function () {
        expect(true).toBeTruthy();
    });

    xdescribe('ignored', function () {
        it('should be skipped', function () {
            expect(true).toBeTruthy();
        });
    });

    it('should assert true 1', function () {
        expect(true).toBeTruthy();
    });
});