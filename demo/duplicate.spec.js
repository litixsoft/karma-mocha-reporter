describe('thing', function () {
    it('should do stuff', function () {
        expect(1 + 1).toEqual(2);
    });

    it('should do stuff', function () {
        expect(2 + 1).toEqual(3);
    });

    it('should do stuff', function () {
        expect(2 + 1).toEqual(3);
    });

    describe('thing', function () {
        it('should do stuff', function () {
            expect(1 + 1).toEqual(2);
        });

        it('should do stuff', function () {
            expect(2 + 1).toEqual(3);
        });
    });
});