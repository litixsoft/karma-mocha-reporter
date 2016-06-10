var expect = chai.expect;

describe("test reproducer", function() {
    'use strict';

    describe("test level 2", function() {
        it("fail", function() {
	        expect(false).equal(true);
        });

        it("success", function() {
        	expect(true).equal(true);
        });
    });
});
