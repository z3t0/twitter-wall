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
            // debugger;
            media.push(data.entities.media[i].media_url)
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
    setCurrentTweet(tweets[count])

    if (count >= (tweets.length - 1))
        count = 0
    else
        count++

}, 5000);