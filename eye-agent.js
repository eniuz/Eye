var Eye = (function(root) {

    var fb, trackedEvents, resultsToSend, ls,
        index = 1000;

    var init = function(options) {
        root = window;
        
        // remember to restrict access in Firebase manager
        if (!options.url || !options) {
            root.error('No firebase specified.');
            return false;
        }

        fb = new Firebase(options.url);

        // by default Eye looks for JS exceptions and console.error.
        // However you can extend this list below to specify items to send.
        // you can add log, warn, info or remove existing items
        trackedEvents = options.trackedEvents || ['exception', 'error'];
        resultsToSend = options.resultsToSend+2 || 12;
        ls = root.localStorage;

        ls.clear();
    }

    var getUserData = function() {
        save('UserData',navigator.userAgent);
    }

    // console events. Log, warn, info, error
    // thx StackOverflow 

    root.console.error = (function() {
        var name = 'error';
        var error = root.console.error;

        return function(content) {
            if (content !== '') {
                error.call(console, content);
                
                save('error',content);

                if (trackedEvents.indexOf(name) !== -1) 
                    send();
            } else {
                error.apply(console, arguments);
            }
        }
    })();

    root.console.log = (function() {
        var name = 'log';
        var log = root.console.log;

        return function(content) {
            if (content !== '') {
                log.call(console, content);
                
                save('log',content);

                if (trackedEvents.indexOf(name) !== -1) 
                    send();
            } else {
                log.apply(console, arguments);
            }
        }
    })();

    root.console.warn = (function() {
        var name = 'warn';
        var warn = root.console.warn;

        return function(content) {
            if (content !== '') {
                warn.call(console, content);
                
                save('warn',content);

                if (trackedEvents.indexOf(name) !== -1) 
                    send();
            } else {
                warn.apply(console, arguments);
            }
        }
    })();

    root.console.info = (function() {
        var name = 'info';
        var info = root.console.info;

        return function(content) {
            if (content !== '') {
                info.call(console, content);
                
                save('info',content);

                if (trackedEvents.indexOf(name) !== -1) 
                    send();
            } else {
                info.apply(console, arguments);
            }
        }
    })();

    // JS exceptions
    // Override previous handler. Thx MDN!
    root.onerror = function eyeHandler(msg, url, line) {
        var name = 'exception'
        if (onerror)
            return onerror(msg, url, line);

        var content = msg + url + line;
        save('exception',content);

        if (trackedEvents.indexOf(name) !== -1) 
            send();
    }


    // save to localStorage
    var save = function(type, content) {
        index++;
        ls.setItem(index + 'Eye' + capitalize(type), content);
        //QUOTA_EXCEEDED_ERR - remove some data!
    }

    // save to Firebase
    var send = function() {
        getUserData();
        var item, startingPoint, y,
            data = {};

        y = -1;

        var length = Object.keys(ls).length;

        startingPoint = length - resultsToSend;

        if (length <= resultsToSend)
            startingPoint = 0;
        

        for (var x = startingPoint; x <= length; x++) {
            y++;
            item = Object.keys(ls)[y];
            
            if (typeof item !== 'undefined')
                data[y] = {
                    item: item,
                    content: ls.getItem(item)
                }
        }

        data = formattedData(data);

        // send to firebase
        fb.push(data);

        // clear localStorage
        // not so wise man
        ls.clear();

        // tests required
        // index = 1000;
    }

    var formattedData = function(data) {
        // remove non-eye entries
        for (var i in data) {
            if(data[i].item.indexOf('Eye') == -1) {
                data[i].remove();
            }
        }
        return data;
    }

    // helpers
    var capitalize = function(str) {
        return str[0].toUpperCase() + str.slice(1,str.length);
    }

    // allow non-standard send
    return {
        init: init,
        send: send 
    }

}(window));


if(typeof(Storage)!=="undefined") 
    Eye.init({
        url: 'http://your-firebase.firebaseio.com/'
    });
