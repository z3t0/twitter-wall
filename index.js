

var tweets = [];
var socket = require('socket.io-client')('http://localhost:3000');
socket.on('connect', function(){});
socket.on('event', function(data){
});
socket.on('disconnect', function(){
});
socket.on('tweet', function(data) {
    // Got a tweet from server
    // add to the list
    updateStream(data)
})
function updateStream(tweetData) {
    var node = document.getElementById('stream')

    // Create Stream Object

    var item = document.createElement('li')
    item.className = 'streamItem'

    var user = document.createElement('div')
    var user_fullname = document.createElement('div')
    var user_image = document.createElement("IMG")

    user.className = 'user'
    user_fullname.className = 'user_fullname'
    user_image.className = 'user_image'
    user.appendChild(user_image)
    user.appendChild(user_fullname)
    

    var tweet = document.createElement('div')
    var tweet_text = document.createElement('div')

    tweet.className = 'tweet'
    tweet_text.className = 'tweet_text'
    tweet.appendChild(tweet_text)

    user_fullname.appendChild(document.createTextNode(tweetData.user_fullname))
    user_image.src = tweetData.user_image_src

    tweet_text.appendChild(document.createTextNode(tweetData.tweet_text))

    item.appendChild(user)
    item.appendChild(tweet)

    tweets.push(tweetData)

    node.appendChild(item)
}

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
    item.appendChild(tweet)

    node.appendChild(item)
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

