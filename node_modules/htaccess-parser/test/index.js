var htaccessParser = require('../lib/parser');
var path = require('path');

var expect = require('chai').expect;
var htaccess = null;

describe('htaccess parser', function() {
  before(function (done) {
    htaccessParser({
      file: path.resolve(__dirname, 'htaccess_files', '01-simple.htaccess')
    }, 
    function(err, parsedFile) {
      htaccess = parsedFile;
      done();
    });
  });


  it('RewriteBase', function (done) {
    expect(htaccess.RewriteBase).to.equal('/dir');
    expect(htaccess.RewriteRules).to.have.lengthOf(4);

    done();
  });


  it('RewriteRule #1', function (done) {
    expect(htaccess.RewriteRules[0].pattern).to.equal('^source1.html$');
    expect(htaccess.RewriteRules[0].substitution).to.equal('/dest1.html');
    expect(htaccess.RewriteRules[0].flags).to.have.lengthOf(2);
    expect(htaccess.RewriteRules[0].flags).to.have.members(['L', 'R=301']);
    expect(htaccess.RewriteRules[0].conditions).to.have.lengthOf(0);

    done();
  });


  it('RewriteRule #2', function (done) {
    expect(htaccess.RewriteRules[1].conditions).to.have.lengthOf(2);
    expect(htaccess.RewriteRules[1].conditions[0].variable).to.equal('%{HTTP_USER_AGENT}');
    expect(htaccess.RewriteRules[1].conditions[0].pattern).to.equal('^Blacklisted-agent1$');
    expect(htaccess.RewriteRules[1].conditions[0].flags).to.have.lengthOf(2);
    expect(htaccess.RewriteRules[1].conditions[0].flags).to.have.members(['OR', 'NC']);

    expect(htaccess.RewriteRules[1].conditions[1].variable).to.equal('%{HTTP_USER_AGENT}');
    expect(htaccess.RewriteRules[1].conditions[1].pattern).to.equal('^Blacklisted-agent2$');
    expect(htaccess.RewriteRules[1].conditions[1].flags).to.have.lengthOf(1);
    expect(htaccess.RewriteRules[1].conditions[1].flags).to.have.members(['NC']);

    expect(htaccess.RewriteRules[1].pattern).to.equal('.*');
    expect(htaccess.RewriteRules[1].substitution).to.equal('-');
    expect(htaccess.RewriteRules[1].flags).to.have.lengthOf(1);
    expect(htaccess.RewriteRules[1].flags).to.have.members(['F']);

    done();
  });


  it('RewriteRule #3', function (done) {
    expect(htaccess.RewriteRules[2].conditions).to.have.lengthOf(2);
    expect(htaccess.RewriteRules[2].conditions[0].variable).to.equal('%{REQUEST_METHOD}');
    expect(htaccess.RewriteRules[2].conditions[0].pattern).to.equal('POST');
    expect(htaccess.RewriteRules[2].conditions[0].flags).to.have.lengthOf(0);

    expect(htaccess.RewriteRules[2].conditions[1].variable).to.equal('%{HTTP_REFERER}');
    expect(htaccess.RewriteRules[2].conditions[1].pattern).to.equal('!^http://www.olddomain.com');
    expect(htaccess.RewriteRules[2].conditions[1].flags).to.have.lengthOf(1);
    expect(htaccess.RewriteRules[2].conditions[1].flags).to.have.members(['NC']);

    expect(htaccess.RewriteRules[2].pattern).to.equal('.*');
    expect(htaccess.RewriteRules[2].substitution).to.equal('-');
    expect(htaccess.RewriteRules[2].flags).to.have.lengthOf(1);
    expect(htaccess.RewriteRules[2].flags).to.have.members(['G']);

    done();
  });


  it('RewriteRule #4', function (done) {
    expect(htaccess.RewriteRules[3].conditions).to.have.lengthOf(1);
    expect(htaccess.RewriteRules[3].conditions[0].variable).to.equal('%{REQUEST_METHOD}');
    expect(htaccess.RewriteRules[3].conditions[0].pattern).to.equal('POST');
    expect(htaccess.RewriteRules[3].conditions[0].flags).to.have.lengthOf(0);

    expect(htaccess.RewriteRules[3].pattern).to.equal('^(.*)');
    expect(htaccess.RewriteRules[3].substitution).to.equal('/dest7.html');
    expect(htaccess.RewriteRules[3].flags).to.have.lengthOf(1);
    expect(htaccess.RewriteRules[3].flags).to.have.members(['L']);

    done();
  });
});