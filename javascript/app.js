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

    var viewModel;

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
                    var source   = $("#tag-item-template").html();
                    var template = Handlebars.compile(source);
                    var html = template({ tags: data.tags });

                    $('#master-content').html(html);
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
