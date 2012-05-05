$(document).ready(function () {
    onReadyState();
});

function onReadyState() {
    (function ($) {

        function initEventListeners() {
            $("input").on('keyup', function() {
                var start = new Date();
                var search = $(this).val();
                if (!search) {
                    $('#master ul li').css('display', '');
                }
                else {
                    var hideSelector = '#master ul li[data-name]:not(#master ul li[data-name*="' + $(this).val() + '"])';
                    console.log('negativeSelector: ' + hideSelector);
                    $(hideSelector).css('display', 'none');
                    var showSelector = '#master ul li[data-name*="' + $(this).val() + '"]';
                    $(showSelector).css('display', '');
                }
                var end = new Date();
                console.log("Bench: " + (end - start));
            });

        }

        initHandlerbars();
        initRouter();
        initEventListeners();

    })($);
}

function initHandlerbars() {
    Handlebars.registerHelper('toLowerCase', function(value) {
        return (value && typeof value === 'string') ? value.toLowerCase() : '';
    });
}


function initRouter() {

    function showMasterLoadIndicator(parent) {
        $(parent).html('<div class="load-indicator-wrapper"><div class="load-indicator"></div></div>');
    }

    // OK
    var routes = {
        '/': function() {
            // Do Nothing
        },
        '/tags': function() {
            var page = 'tags';

            showMasterLoadIndicator('#master-content');

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
