$(document).ready(function(){

    $('#player').youTubeEmbed("https://www.youtube.com/watch?v=0NcJ_63z-mA")
    .youTubeEmbed('https://www.youtube.com/watch?v=quwebVjAEJA');
    /*
    http://www.youtube.com/watch?v=3gYCphTW3xA
    http://youtu.be/3Sk7cOqB9Dk - online shopping funny
    http://www.youtube.com/watch?v=yYq8VrsvMw8
    http://youtu.be/VC3FbBVlBZk Renegade X
    
    // unlisted video
    _aPEbpeMjA4
    */
    $('form').submit(function(){
        $('#player').youTubeEmbed($('#url').val());
        $('#url').val('');
        return false;
    });

});

var x = {
    "apiVersion":"2.1",
    "data":{
        "updated":"2011-12-12T08:58:20.381Z",
        "totalItems":1,
        "startIndex":1,
        "itemsPerPage":25,
        "items":[{
            "id":"quwebVjAEJA",
            "uploaded":"2009-03-11T14:51:24.000Z",
            "updated":"2011-12-12T03:42:20.000Z",
            "uploader":"BBC",
            "category":"Travel",
            "title":"HD: Bait Ball Feast - Nature's Great Events: The Great Feast - BBC One",
            "description":"Playlist: www.youtube.com Find out more: www.bbc.co.uk In late summer the plankton bloom is at its height. Vast shoals of herring gather to feed on it, diving birds round the fish up into a bait ball and then a humpback whale roars in to scoop up the entire ball of herring in one huge mouthful.",
            "tags":["humpback","whale","gulp","diving","birds","herring","wildlife","natural","history","bbc","one","bbcone","bbc1","natures","great","events","naturesgreatevents"],
            "thumbnail":{
                "sqDefault":"https://i.ytimg.com/vi/quwebVjAEJA/default.jpg",
                "hqDefault":"https://i.ytimg.com/vi/quwebVjAEJA/hqdefault.jpg"
            },
            "player":{
                "default":"https://www.youtube.com/watch?v=quwebVjAEJA&feature=youtube_gdata_player",
                "mobile":"https://m.youtube.com/details?v=quwebVjAEJA"
            },
            "content":{
                "5":"https://www.youtube.com/v/quwebVjAEJA?version=3&f=videos&app=youtube_gdata",
                "1":"rtsp://v1.cache3.c.youtube.com/CiILENy73wIaGQmQEMBYbR7sqhMYDSANFEgGUgZ2aWRlb3MM/0/0/0/video.3gp",
                "6":"rtsp://v7.cache1.c.youtube.com/CiILENy73wIaGQmQEMBYbR7sqhMYESARFEgGUgZ2aWRlb3MM/0/0/0/video.3gp"
            },
            "duration":75,
            "aspectRatio":"widescreen",
            "rating":4.9722548,
            "likeCount":"4224",
            "ratingCount":4253,
            "viewCount":980491,
            "favoriteCount":5918,
            "commentCount":895,
            "accessControl":{
                "comment":"allowed",
                "commentVote":"allowed",
                "videoRespond":"moderated",
                "rate":"allowed",
                "embed":"allowed",
                "list":"allowed",
                "autoPlay":"allowed",
                "syndicate":"allowed"
            }
        }]
    }
};