$(document).ready(function () {
    onReadyState();
});

function onReadyState() {
    (function ($) {

        function initEventListeners() {
            $('input').on('keyup', function() {
                var start = new Date();
                var search = $(this).val().toLowerCase();
                if (!search) {
                    $('#master ul li').css('display', '');
                }
                else {
                    $('#master ul li[data-name]:not(#master ul li[data-name*="' + search + '"])').css('display', 'none');
                    $('#master ul li[data-name*="' + search + '"]').css('display', '');
                }
                var end = new Date();
                console.log("Bench: " + (end - start));
            });

            $('#master ul li').live('click', function() {
                $('#master ul li.selected').removeClass('selected');
                $(this).addClass('selected');
                location.hash = '#/tag/' + $(this).attr('data-slug');
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
        '/tag': function() {
            showMasterLoadIndicator('#master-content');

            $.ajax({
                url: 'http://blog.xebia.fr/wp-json-api/get_tag_index/?callback=?',
                dataType: 'JSONP',
                success: function(data) {
                    var source = $("#tag-item-template").html();
                    var template = Handlebars.compile(source);
                    var html = template({ tags: data.tags });

                    $('#master-content').html(html);
                },
                error: function() {
                    $('#master-content').html("");
                }
            });
        },
        '/tag/:slug?page=:page': function(tagSlug, page) {
            showMasterLoadIndicator('#detail');

            $.ajax({
                url: 'http://blog.xebia.fr/wp-json-api//get_tag_posts/?exclude=description,parent,content,comments,attachments&tag_slug=' + tagSlug + '&page=' + page + '&count=8&callback=?',
                dataType: 'JSONP',
                success: function(data) {
                    var source = $("#posts-tag-template").html();
                    var template = Handlebars.compile(source);

                    _(data.posts).each(function(post) {
                        var authorEmailMd5Hash = md5((post.author.nickname + '@xebia.fr').trim().toLowerCase());
                        post.author.imageUrl = "http://www.gravatar.com/avatar/" + authorEmailMd5Hash;
                        post.dateFormatted = Date.parseExact(post.date, 'yyyy-MM-dd HH:mm:ss').toString("HH:mm");
                    });

                    var html = template({ posts: data.posts });

                    $('#detail').html(html);
                },
                error: function() {
                    $('#detail').html("");
                }
            });
        }
    };

    // OK
    Router(routes).configure({
        on: function(){
            // amplify.store('hash', location.hash);
        },
        notfound: function(){
            location.hash = '/';
        }
    }).init('/'); // .init(amplify.store('hash') || '/')

}
