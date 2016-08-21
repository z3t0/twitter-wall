const {ipcRenderer} = require('electron')

function getTweet(tweetData) {
    var data = tweetData

    // Create the list item:
    var item = document.createElement('li');

    var tweet = document.createElement("div")
    var text = document.createElement("div")

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
    img.src = data.user.profile_image_url

    user_img.appendChild(img)

    name.appendChild(document.createTextNode(data.user.screen_name))
    name.className = "user_name"

    user.appendChild(user_img)
    user.appendChild(name)
    user.className = "user"

    tweet.appendChild(text)
    tweet.className = "tweet"

    item.appendChild(user)
    item.appendChild(tweet)
    item.className = "item"

    return item

}

ipcRenderer.on('updateStream', function(event, data) {
    var node = document.getElementById('stream')
    node.insertBefore(getTweet(data), node.firstChild)
})
