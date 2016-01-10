'use strict';

describe('myApp.fileman module', function() {

  beforeEach(module('myApp.fileman'));

  describe('fileman controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var view1Ctrl = $controller('FilemanCtrl');
      expect(view1Ctrl).toBeDefined();
    }));

  });
});