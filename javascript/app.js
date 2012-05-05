$(document).ready(function () {
    onReadyState();
});

function onReadyState() {
    (function ($) {
      initRouter();
    })($);
}

function initRouter() {

    // OK
    var currentView = null;

    // OK
    var routes = {
        '/': function() {
            // Do Nothing
        },
        '/tags': function() {
            var page = 'tags';
            $.ajax({
                url: 'http://blog.xebia.fr/wp-json-api/get_tag_index/?callback=?',
                dataType: 'JSONP',
                success: function(data) {
                    var content = "";
                    _(data.tags).each(function(tag) {
                        content += '<li><div class="li-content">' +
                                '<span class="aside">' + tag.post_count + '</span>' +
                                '<h1>' + tag.title + '</h1>' +
                            '</div></li>';
                    });
                    $('#master ul#master-items').html(content);
                }
            });
        }
    };

    // OK
    Router(routes).configure({
        on: function(){
            amplify.store('hash', location.hash);
        },
        notfound: function(){
            location.hash = '/';
        }
    }).init(amplify.store('hash') || '/');

}
