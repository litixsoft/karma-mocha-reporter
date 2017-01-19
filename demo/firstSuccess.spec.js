if (navigator.userAgent.match(/firefox/i)) {
  describe('Firefox tests', function() {
    it('this would only be reported when printFirstSuccess is true', function() {
      console.log('firefox test');
    });
  });
}

describe('Other tests', function() {
  it('this should be always reported', function() {
    console.log('hello world');
  });
});