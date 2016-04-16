describe('Fail in one browser only test suite', function () {
    function goodFunction() {
        return true;
    }

    function badFunction() {
        throw new Error('Oh no!');
    }

    function badFunctionFor(agent) {
        if (navigator.userAgent.indexOf(agent) !== -1) {
            throw new Error('Oh no! What\'s wrong with ' + agent);
        }
    }

    describe('Reproduce mocha-reporter output', function() {
        it('fails in all browsers', function() {
            badFunction();
        });

        it('works in all browsers', function() {
            goodFunction();
        });

        describe('Reproduce mocha-reporter output nested', function() {
            it('fails in all browsers', function() {
                badFunction();
            });

            it('works in all browsers', function() {
                goodFunction();
            });

            it('fails in Chrome', function() {
                badFunctionFor('Chrome');
            });

            it('fails in PhantomJS', function() {
                badFunctionFor('PhantomJS');
            });
        });

        it('fails in Chrome', function() {
            badFunctionFor('Chrome');
        });

        it('fails in PhantomJS', function() {
            badFunctionFor('PhantomJS');
        });
    });

    describe('Reproduce mocha-reporter output run 2', function() {
        it('fails in all browsers', function() {
            badFunction();
        });

        it('works in all browsers', function() {
            goodFunction();
        });

        it('fails in Chrome', function() {
            badFunctionFor('Chrome');
        });

        it('fails in PhantomJS', function() {
            badFunctionFor('PhantomJS');
        });
    });
});