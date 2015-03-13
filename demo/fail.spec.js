describe('Fail demo test suite', function () {
    it('should assert true', function () {
        expect(true).toBeFalsy();
    });

    it('should assert true 1', function () {
        expect(true).toBeFalsy();
    });

    it('should show all failures for this silly test', function () {
        expect(1).toBe(0);
        expect(2).toBe(0);
        expect(3).toBe(0);
        expect(4).toBe(0);
    });
});