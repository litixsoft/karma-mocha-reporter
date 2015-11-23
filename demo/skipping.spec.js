describe('Some suite', function () {
    fit('Enabled test', function () {
        expect(true).toBeTruthy();
    });

    fdescribe('Enabled suite', function () {
        it('should be skipped', function () {
            expect(true).toBeTruthy();
        });
    });

    it('Skipped test', function () {
        expect(true).toBeTruthy();
    });

    describe('Skipped suite', function () {
        it('something', function () {
        });

        describe('somethingElse', function () {
        });
    });
});