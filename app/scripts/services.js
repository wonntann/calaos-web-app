'use strict';

angular.module('calaosApp').factory('CalaosApp', ['$rootScope', function($rootScope) {

    var connected = false;
    var loading = false;
    var auth = false;
    var auth_failed = false;
    var homeData = {};

    var service = {
        isConnected: function() { return connected; },
        isAuth: function() { return auth; },
        hasAuthFailed: function() { return auth_failed; },
        isLoading: function() { return loading; },
        getHomeData: function() { return homeData; },

        send: function(data) {
            if (angular.isString(data)) {
                ws.send(data);
            }
            else if (angular.isObject(data)) {
                ws.send(JSON.stringify(data));
            }
        },

        signIn: function (cuser, cpass) {
            console.log('Trying to sign in with ' + cuser);
        },
    };

    var parseMessage = function(obj) {

    };

    var getHost = function() {

        if (calaosDevConfig.calaosServerHost !== '')
            return calaosDevConfig.calaosServerHost;

        var h = window.location.protocol === 'http:'?'ws://':'wss://';
        h += window.location.hostname + ':' +
             window.location.port + '/api/v3';

        console.log('Connecting to ' + h);
        return h;
    }

    var ws = new ReconnectingWebSocket(getHost());
    ws.onopen = function() {
        console.log('websocket open');
        $rootScope.$apply(function() {
            connected = true;
        });

        //service.send({ msg: 'login' });
    };

    ws.onclose = function() {
        console.log('websocket closed');
        $rootScope.$apply(function() {
            connected = false;
        });
    };
    ws.onerror = function() {
        console.log('websocket error');
        $rootScope.$apply(function() {
            connected = false;
        });
    };
    ws.onmessage = function(evt) {
        var received_msg = evt.data;
        parseMessage(JSON.parse(received_msg));
    };

    return service;

}]);
