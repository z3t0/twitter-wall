const {ipcRenderer} = require('electron')

var tweets = []

function processTweet(tweetData) {
    var data = tweetData

    // Parse Date time information
    var date = new Date(
    data.created_at.replace(/^\w+ (\w+) (\d+) ([\d:]+) \+0000 (\d+)$/,
        "$1 $2 $4 $3 UTC"));

    // Create the list item:
    var item = document.createElement('li');

    var tweet = {}

    // User
    var user_name = data.user.screen_name
    var user_fullname = data.user.name
    var user_image_src = data.user.profile_image_url.replace("normal", "400x400")

    // Tweet Text
    var tweet_text = data.text

    // Media
    var media = []
    var has_media = false
    if (data.entities.media) {
        for (var i = 0; i < data.entities.media.length; i++) {
            media.push(data.entities.media[0].media_url)
        }
        has_media = true
    }

    tweet.user_name = user_name
    tweet.user_fullname = user_fullname
    tweet.user_image_src = user_image_src
    tweet.tweet_text = tweet_text
    tweet.date = date
    tweet.has_media = has_media
    tweet.media = media

    return tweet
}

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

    node.appendChild(item)
}

ipcRenderer.on('updateStream', function(event, data) {
   
    // Got tweet, add it to the system
    var tweet = processTweet(data)
    tweets.push(tweet)
    updateStream(tweet)
})

function setCurrentTweet(tweetData) {
    var node = document.getElementById('current')

    // Remove children
    while (node.firstChild) {
        node.removeChild(node.firstChild)
    }

    var item = document.createElement('li')
    item.className = 'currentItem'

    var user = document.createElement('div')
    var user_fullname = document.createElement('div')
    var user_image = document.createElement("IMG")

    user.className = 'current_user'
    user_fullname.className = 'current_user_fullname'
    user_image.className = 'current_user_image'
    user.appendChild(user_image)
    user.appendChild(user_fullname)
    

    var tweet = document.createElement('div')
    var tweet_text = document.createElement('div')

    tweet.className = 'current_tweet'
    tweet_text.className = 'current_tweet_text'
    tweet.appendChild(tweet_text)

    user_fullname.appendChild(document.createTextNode(tweetData.user_fullname))
    user_image.src = tweetData.user_image_src

    tweet_text.appendChild(document.createTextNode(tweetData.tweet_text))

    item.appendChild(user)
    item.appendChild(tweet)

    node.appendChild(item)
}

var count = 0

window.setInterval(function(){
    setCurrentTweet(tweets[count])

    if (count >= (tweets.length - 1))
        count = 0
    else
        count++

}, 5000);