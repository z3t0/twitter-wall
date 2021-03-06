var tweets = [];
//as
var address = "localhost:3000"
var socket = require('socket.io-client')(address);
socket.on('connect', function(){});
socket.on('event', function(data){
});
socket.on('disconnect', function(){
});

var qrious = require('qrious')

// Received a new tweet
socket.on('tweet', function(data) {
  // Got a tweet from server
  // add to the list
  data.streamIndex = UpdateStream(data)
  tweets.push(data)
})

// Commands
socket.on('status', function(data) {
  $("#status")[0].innerHTML = "<p>" + data + "</p>"
})

var feature_schedule = ["Schedule", "Period 1 : 8:50 - 9:55", "Period 2 : 10:00 - 11:55", "Period 3 : 11:15 - 12:20", "NOON : 12:20 - 1:10", "Period 4 : 1:10 - 2:15", "Period 5 : 2:20 - 3: 25"]
var feature_values = ["Values", "Belong", "Respect", "Care", "Inspire"]

var feature = feature_schedule

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

    user_name.appendChild(time)

    localTime.appendChild(document.createTextNode(date.toLocaleTimeString()))
    dateTime.appendChild(document.createTextNode(date.toLocaleDateString()))

    var featureNode = document.createElement('div')
    var removeLinks = []

    // Media
    if (tweetData.has_media)
    {
      for (var i = 0; i < tweetData.media.length; i++) {
        // TODO: add videos
        // TODO: qr code generator from other links

        if(tweetData.media[i].type == "photo")
        {
          var media = document.createElement('IMG')
          media.className = 'current_media'
          media.src = tweetData.media[i].media_url
          item.appendChild(media)

					// Remove the media link from the twitter text
					removeLinks.push(media.src)
        }
      }
    }

    // Feature, only if there is no media
    else {
      featureNode.className = "current_feature"
      // FIXME: need other features? advertising maybe
      var currentFeature = feature

      for (var j = 0; j < currentFeature.length; j++) {
        var element = document.createElement('div')

        if(j === 0 && (currentFeature.length > 1)) {
          element.className = "current_feature_heading"
        }

        else {
          element.className = "current_feature_element"
        }

        element.appendChild(document.createTextNode(currentFeature[j]))

        featureNode.appendChild(element)
      }
    }

		// Get Text
  	tweet.appendChild(parseText(tweetData.tweet_text, removeLinks))

    // Help
    var helpNode = document.createElement('div')
    helpNode.className = "current_help"

    // Add logo
    var helpImage = document.createElement('IMG')
    helpImage.className = "current_help_image"
    helpImage.src = "https://g.twimg.com/ios_homescreen_icon.png"

    // Add text
    var helpText = document.createElement('div')

    var helpTextString = "To share something tweet with " + '<span style="color:lightblue">' + "#brcispark" + "</span>" + " and give it a while to pass through our filters. You can try sharing images, videos, and even links!"
    helpText.innerHTML = "<p>" + helpTextString + "<p>"
    helpText.className = "current_help_text"

    helpNode.appendChild(helpImage)
    helpNode.appendChild(helpText)


    item.appendChild(user_name)
    item.appendChild(user_image)
    item.appendChild(tweet)
    if(!tweetData.has_media)
      item.appendChild(featureNode)
    item.appendChild(helpNode)

    node.appendChild(item)
  }


  function parseText(text, removeLinks) {

		var ignoredLinks = []

		for (var i = 0; i < removeLinks.length; i++) {
			text.replace(removeLinks[i], "")
		}

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
        string = string + '<span style="color:lightblue">' + word +'</span>' + " "
      }

      // tag
      else if (word.includes("#")) {
        string = string + '<span style="color:lightblue">' + word +'</span>' + " "
      }

      else if (word.includes("http")) {
        // we dont want any links
				ignoredLinks.push(word)
      }

      else if (i == (data.length - 1)) {
        string = string + word
      }

      else {
        string = string + word + " "
      }

    }

    var e = document.createElement('div')
    e.innerHTML = string

    node.appendChild(e)

    return node
  }

  function UpdateStream(tweetData) {
    var node = document.getElementById("stream")

    var item = document.createElement("div")
    item.className = "stream_item"

    var name = document.createElement("div")
    name.className = "stream_user_screen_name"
    name.appendChild(document.createTextNode("@" + tweetData.user_name))

    var image = document.createElement("img")
    image.className = "stream_user_image"
    image.src = tweetData.user_image_src

    item.appendChild(image)
    item.appendChild(name)

    node.appendChild(item)
    return node.childNodes.length - 1
  }

  var count = 0
  var check = 1

  window.setInterval(function() {
    // Set next feature
    if(check == 1) {
      feature = feature_values
      check = 2
    }
    else if (check == 2) {
      feature = feature_schedule
      check = 1
    }


  }, 10000)

  window.setInterval(function(){
    // No tweets
    if (tweets.length === 0)
      return

    setCurrentTweet(tweets[count])

    // Reset color of the previous tweet
    $("#stream").children().eq(tweets[count].streamIndex - 1).css('background', '#0084B4')

    // Scroll
    var top = $("#stream").children().eq(tweets[count].streamIndex).position().top
    var node = $("#stream").animate({scrollTop: $("#stream").scrollTop() + top})

    // Set new color
    $("#stream").children().eq(tweets[count].streamIndex).css('background', '#FF0000')

    if (count >= (tweets.length - 1)) {
      count = 0
    }
    else {
      count++
    }

  }, 5000);
