// var flickrAPI = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=4ed87948b21e64b1cd4e7df2c7913009&tags=kitten&media=photos&per_page=200&format=json&nojsoncallback=1&auth_token=72157674122099856-6b7e813e9a28781b&api_sig=12796211952e3fe95511d80ff4b80dfc";
$(document).ready(function(){
    var flickrURL = "https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&nojsoncallback=1&extras=url_o&per_page=200&text=";

    currentSearchWord = "kitten";

    var myFlickrKey = '&api_key=' + 'ee5fe46261aa2eaec8831fa3ed805bcd';

    var flickrReqURL = flickrURL + currentSearchWord + myFlickrKey;
    console.log(flickrReqURL);

    $("#showButton").click(function(){
        console.log("button clicked!");
        
            $.ajax({ 
        		url: flickrReqURL,
                type: "GET",
        		success: function(item){
        			var chosen = item.photos.photo[getRandomInt(0,199)];
        			console.log(chosen);

        			var imgInfo = [chosen.farm, chosen.server, chosen.id, chosen.secret];
        			// for (var i=0;i<imgInfo.length;i++){
        			// 	console.log(imgInfo[i]);
        			// }

                    // imgUrl Example: https://farm9.staticflickr.com/8305/29676526391_374717d9a8_z.jpg
        			var imgUrl = "https://farm"+imgInfo[0]+".staticflickr.com/"+
        			imgInfo[1]+"/"+imgInfo[2]+"_"+imgInfo[3]+"_b.jpg";
        			// console.log(imgUrl);

        			var img = $("<img />").attr('src', imgUrl)

    				.on('load', function() {
				        if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
				            alert('broken image!');
				        } else {
                            // $("body").css('background-image', 'url(' + imgUrl + ')');
				            $("#img").append(img);
        				}
    				});
        		}
        	});
    });
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Questions: How to load image when user scrolls down? 
//Combine with music api? 
//refresh button
