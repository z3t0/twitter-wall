var tweets = [];
//as
var address = "localhost:3000"
var socket = require('socket.io-client')(address);
socket.on('connect', function(){});
socket.on('event', function(data){
});
socket.on('disconnect', function(){
});
socket.on('tweet', function(data) {
    // Got a tweet from server
    // add to the list
    tweets.push(data)
})

function setCurrentTweet(tweetData) {
    var node = document.getElementById('current')

    // Remove children
    while (node.firstChild) {
        node.removeChild(node.firstChild)
    }

    // Name
    //      Full name
    //      Screen name
    // Profile Image
    // Time

    // Tweet Text
    // Media

    var item = document.createElement('div')
    item.className = 'currentItem'

    // User
    var user_name = document.createElement('div')
    var user_name_full = document.createElement('div')
    var user_name_screen = document.createElement('div')
    var user_image = document.createElement("IMG")

    user_name.className = 'current_user_name'
    user_name_full.className = 'current_user_name_full'
    user_name_screen.className = 'current_user_name_screen'

    user_image.className = 'current_user_image'

    user_name.appendChild(user_name_full)
    user_name.appendChild(user_name_screen)

    user_name_full.appendChild(document.createTextNode(tweetData.user_fullname))
    user_name_screen.appendChild(document.createTextNode(tweetData.user_name))
    user_image.src = tweetData.user_image_src

    // Tweet
    var tweet = document.createElement('div')

    tweet.className = 'current_tweet'
    tweet.appendChild(document.createTextNode(tweetData.tweet_text))

    // Time
    var time = document.createElement('div')
    time.className = "current_time"

    // Date Object needs to be created locally
    var date = new Date(
        tweetData.date.replace(/^\w+ (\w+) (\d+) ([\d:]+) \+0000 (\d+)$/,
            "$1 $2 $4 $3 UTC"));

    var dateTime = document.createElement('div')
    var localTime= document.createElement('div')

    time.appendChild(dateTime)
    time.appendChild(localTime)

    dateTime.className = "current_date_time"
    localTime.className = "current_local_time"

    localTime.appendChild(document.createTextNode(date.toLocaleTimeString()))
    dateTime.appendChild(document.createTextNode(date.toLocaleDateString()))

    // Media
    if (tweetData.has_media)
    {
        for (var i = 0; i < tweetData.media.length; i++) {
            var media = document.createElement('IMG')
            media.className = 'current_media'
            media.src = tweetData.media[i]

            item.appendChild(media)
        }
    }


    item.appendChild(user_name)
    item.appendChild(user_image)
    item.appendChild(time)
    item.appendChild(tweet)

    node.appendChild(item)
}

function parseText(text) {
    var node = document.createElement('div')

    var data = text.split(' ')
    var string = ""

    for (var i = 0; i < data.length; i++) {
        var word = data[i]


        if (i < (data.length - 1)) {
        }

        var element = document.createElement('div')
        element.appendChild(document.createTextNode(word))

        // Mention
        if (word.includes("@")) {
            string = string + '<span style="color:yellow">' + word +'</span>' + " "
        }

        // tag
        else if (word.includes("#")) {
            string = string + '<span style="color:blue">' + word +'</span>' + " "
        }

        else if (i == (data.length - 1)) {
            string = string + word
        }

        else if (word.includes("http")) {
            // we dont want any links
            return
        }

        else {
            string = string + word + " "
        }

    }

    var e = document.createElement('div')
    e.innerHTML = string
    console.log(string)

    node.appendChild(e)

    console.log(node)
    return node
}

var count = 0

window.setInterval(function(){
    if (tweets.length == 0)
        return
    setCurrentTweet(tweets[count])

    if (count >= (tweets.length - 1))
        count = 0
    else
        count++

}, 5000);