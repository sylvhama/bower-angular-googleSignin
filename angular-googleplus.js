(function() {
  'use strict';

  var app;

  app = angular.module("GoogleplusProvider", []);

  app.provider('GoogleplusConfig', function() {
    this.clientId = '';

    this.$get = function() {
      var clientId = this.clientId;
      return {
        getParams: function() {
          return {
            clientId: clientId
          }
        }
      };
    };

    this.setClientId = function(clientId) {
      this.clientId = clientId;
    };
  });

  app.factory("Googleplus", function($rootScope) {
    return {
      login: function() {
        gapi.auth.signIn({'callback':
          function (authResult) {
            if (authResult['status']['signed_in']) {
              return $rootScope.$broadcast("google_signin_success",{
                response: authResult['status']['signed_in']
              });
            }else {
              return $rootScope.$broadcast("google_signin_error",{
                response: authResult['error']
              });
            }
          }
        });
      },
      logout: function() {
        gapi.auth.signOut();
      },
      getInfo: function() {
        gapi.client.load('oauth2','v2',function() {
          gapi.client.oauth2.userinfo.get().execute(function(response){
            return $rootScope.$broadcast("google_getInfo_success",response);
          });
        });
      }
    }
  });
  app.run(function($rootScope, GoogleplusConfig) {
    (function() {
      var po = document.createElement('script');
      po.type = 'text/javascript';
      po.async = true;
      po.src = 'https://apis.google.com/js/client.js?onload=gapiCallback';
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(po, s);
    })();
    window.gapiCallback = function () {
      return $rootScope.$broadcast("google_gapiLoaded_success");
    }
  });
}).call(this);

