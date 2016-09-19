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

    describe('test', function () {
        var foo, bar;

        beforeEach(function () {
            foo = {
                setBar: function (value) {
                    bar = value;
                }
            };

            spyOn(foo, 'setBar');

            foo.setBar(123);
            foo.setBar(456, 'another param');
        });

        it('tracks that the spy was called', function () {
            expect(foo.setBar).toHaveBeenCalled();
            expect(foo.setBar.calls.count()).toEqual(3);
        });

        it('tracks all the arguments of its calls', function () {
            expect(foo.setBar).toHaveBeenCalledWith(123);
            expect(foo.setBar).toHaveBeenCalledWith(456, 'another param');
        });
    });
});