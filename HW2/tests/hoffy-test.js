const chai = require('chai');
const expect = chai.expect; 
require('mocha-sinon');
Object.assign(global, require('../src/hoffy.js'));

// use to test console output while still allowing console.log
// to _actually_ output to screen
// source: http://stackoverflow.com/a/30626035
function mockConsoleOutput() {
    const log = console.log;
    this.sinon.stub(console, 'log').callsFake(function() {
        return log.apply(log, arguments);
    });
}
describe('hoffy', function() {
    describe('sum', function() {

        it('returns the sum of all arguments passed in', function() {
            expect(sum(1, 2, 3)).to.equal(6);
            expect(sum(1, 1, 1, 1, 1, 1, 1, 1, 1, 1)).to.equal(10);
            expect(sum(1)).to.equal(1);
        });
        it('returns 0 if there are no arguments passed in', function() {
            expect(sum()).to.equal(0);
        });
    });

    describe('repeatCall', function() {

        beforeEach(mockConsoleOutput);

        it('calls function n times', function() {
            var n = 2;
            repeatCall(console.log, n, "Hello!");
            expect(console.log.callCount).to.equal(n);
            expect(console.log.alwaysCalledWithExactly('Hello!')).to.be.true;
        });
    });

    describe('repeatCallAllArgs', function() {

        beforeEach(mockConsoleOutput);

        it('calls function n times, allows arbitrary number of arguments', function() {
            var n = 2;
            repeatCallAllArgs(console.log, n, "foo", "bar", "baz", "qux", "quxx", "corge");
            expect(console.log.callCount).to.equal(n);
            expect(console.log.alwaysCalledWithExactly('foo','bar', 'baz', 'qux', 'quxx', 'corge')).to.be.true;
        });
    });

    describe('maybe', function() {
        function createFullName(firstName, lastName) {
            return `${firstName} ${lastName}`; 
        }
        it('creates a new function that calls the old function and returns the old functions value', function() {
            expect(maybe(createFullName)('Frederick', 'Functionstein')).to.be.equal('Frederick Functionstein');
        });
        it('creates a new function that returns undefined if any of the arguments passed to it are null or undefined', function() {
            expect(maybe(createFullName)(null, 'Functionstein')).to.be.undefined;
            expect(maybe(createFullName)('Freddy', undefined)).to.be.undefined;
        });
    });
    describe('filterWith', function() {
        function even(x) { 
            return x % 2 === 0;
        }
        it('turns a function that returns a boolean into a function that filters an Array', function() {
            const filterWithEven = filterWith(even);
            expect(filterWithEven([1, 2, 3, 4])).to.eql([2, 4]);
        });
    });
    describe('simpleINIParse', function() {
        const obj = {foo: 'bar', baz: 'qux', quxx: 'corge'};
        it('it parses an INI formatted string into an object', function() {
            expect(simpleINIParse("foo=bar\nbaz=qux\nquxx=corge")).to.eql(obj);
        });
        it('it will overwrite keys if a later string has a duplicate key', function() {
            const expected = {foo: 'WAT', baz: 'qux', quxx: 'corge'};
            expect(simpleINIParse("foo=bar\nbaz=qux\nquxx=corge\nfoo=WAT")).to.eql(expected);
        });
        it('if format of line is invalid, line will be skipped', function() {
            const expected = {foo: 'bar', quxx: 'corge'};
            expect(simpleINIParse("foo=bar\nbaz\nquxx=corge")).to.eql(expected);
        });
        it('if value to left or right of equal sign is missing, then key or value is empty string', function() {
            const expected = {foo: 'bar', baz: '', '': 'qux'};
            expect(simpleINIParse("foo=bar\nbaz=\n=qux")).to.eql(expected);
        });

    });
    describe('readFileWith', function() {
        it('creates a function that reads a file and automatically parses it as an INI file', function(done) {
            const readFileWithSimpleINIParse = readFileWith(simpleINIParse);
            const obj = {foo: 'bar', baz: 'qux', quxx: 'corge'};
            readFileWithSimpleINIParse('tests/config.ini', (err, data) => {
                expect(data).to.eql(obj);
                expect(err).to.be.null;
                done();
            });
            
        });
        it('creates a function that reads a file and automatically parses it as an JSON file', function(done) {
            const readFileWithJSONParse = readFileWith(JSON.parse);
            const obj = {foo: 'bar', baz: [1, 2, 3]};
            readFileWithJSONParse('tests/config.json', (err, data) => {
                expect(data).to.eql(obj);
                expect(err).to.be.null;
                done();
            });
            
        });
        it('creates a function that propagates err object if error occurs (for example, file does not exist)', function(done) {
            const readFileWithJSONParse = readFileWith(JSON.parse);
            readFileWithJSONParse('tests/doesNotExist.dne', (err, data) => {
                expect(err).to.not.be.null;
                expect(data).to.be.undefined;
                done();
            });
            
        });
    });
 

    describe('constrainDecorator', function() {

        it('returns a function that calls the original function ... and allows the return value of the original function to be returned without modification if it is between (inclusive) min and max', function() {
            const constrainedParseInt = constrainDecorator(parseInt, -10, 10);
            expect(constrainedParseInt("7")).to.equal(7);
            expect(constrainedParseInt("-10")).to.equal(-10);
            expect(constrainedParseInt("10")).to.equal(10);
            expect(constrainedParseInt("0")).to.equal(0);
        });

        it('returns a function that calls the original function ... and when either max or min are not present or undefined, the new function will just give back the return value of the old function, without any constraints', function() {
            const constrainedParseInt = constrainDecorator(parseInt);
            expect(constrainedParseInt("-12")).to.equal(-12);
            expect(constrainedParseInt("12")).to.equal(12);
        });

        it('returns a function that sets the return value of the original function to min if return value of original is less than min', function() {
            const constrainedParseInt = constrainDecorator(parseInt, -10, 10);
            expect(constrainedParseInt("-12")).to.equal(-10);
        });

        it('returns a function that sets the return value of the original function to max if return value of original is less than max', function() {
            const constrainedParseInt = constrainDecorator(parseInt, -10, 10);
            expect(constrainedParseInt("12")).to.equal(10);
        });
    });

    describe('limitCallsDecorator', function() {

        beforeEach(mockConsoleOutput);

        it('decorates a function so that it can only be called a specified number of times', function() {
            const n = 3;
            const limitedParseInt = limitCallsDecorator(parseInt, 3);
            expect(limitedParseInt("423")).to.equal(423);
            expect(limitedParseInt("423")).to.equal(423);
            expect(limitedParseInt("423")).to.equal(423);
            expect(limitedParseInt("423")).to.be.undefined;
            console.log(limitedParseInt("423"));
        });
    });
});


