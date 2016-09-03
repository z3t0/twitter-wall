const {ipcRenderer} = require('electron')

function getTweet(tweetData) {
    var data = tweetData

    // Create the list item:
    var item = document.createElement('li');

    var tweet = document.createElement("div")
    var text = document.createElement("div")
    var media = document.createElement("div")

    var user = document.createElement("div")
    var user_img = document.createElement("div")
    var name = document.createElement("div")

    // Set its contents:
    var str = data.text.split(" ")
    for(var j = 0; j < str.length; j++) {
        var element = document.createElement("div")
        if ((str.length - j) > 1) {
            if (str[j].charAt(0) == '#' || str[j].charAt(0) == '@') {
                var msg = document.createTextNode(str[j].concat(" "))
                element.appendChild(msg)
                element.className = "special element"
            }

            else if (str[j].includes("http")) {
                var msg = document.createTextNode(str[j].concat(" "))
                element.appendChild(msg)
                element.className = "link element"
            }

            else {
                element.appendChild(document.createTextNode(str[j].concat(" ")))
                element.className = "element"
            }
        }

        else {
            if (str[j].charAt(0) === '#' || str[j].charAt(0) === '@') {
                element.appendChild(document.createTextNode(str[j]))
                element.className = "special element"
            }

            else if (str[j].includes("http")) {
                var msg = document.createTextNode(str[j].concat(" "))
                element.appendChild(msg)
                element.className = "link element"
            }

            else {
                element.appendChild(document.createTextNode(str[j]))
                element.className = "element"
            }

        }
        text.appendChild(element)
    }

    text.className = "text"

    var img = document.createElement("IMG")
    img.className = "user_image"
    img.src = data.user.profile_image_url.replace("normal", "400x400")

    user_img.appendChild(img)

    name.appendChild(document.createTextNode(data.user.screen_name))
    name.className = "user_name"

    user.appendChild(user_img)
    user.appendChild(name)
    user.className = "user"

    // Media
    var mediaData = data.entities.media
    console.log(mediaData)

    if (mediaData) {

        for (var k = 0; k < mediaData.length; k++) {
            var mediaElement = document.createElement("IMG")
            mediaElement.className = "media-image"
            mediaElement.src = mediaData[k].media_url
            media.appendChild(mediaElement)
        }
    }


    tweet.appendChild(text)
    tweet.appendChild(media)
    tweet.className = "tweet"

    item.appendChild(user)
    item.appendChild(tweet)
    item.className = "item"

    return item

}

ipcRenderer.on('updateStream', function(event, data) {
    var node = document.getElementById('stream')
    node.appendChild(getTweet(data))
})

var counter = 0

window.setInterval(function(){


    // debugger;
    var node = document.getElementById('stream').childNodes;
    // Hide current tweet

    if(node.length == 0)
    {
    }

    else {

        if (counter == node.length)
            counter = 0;

        if (counter != 0)
            node[counter - 1].style.display = "none"

        // Show next tweet
        node[counter].style.display = "block"
        counter++;

        console.log("next")
    }
}, 5000);
