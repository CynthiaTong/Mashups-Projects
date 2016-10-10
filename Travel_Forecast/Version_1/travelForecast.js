/* This js document needs to be used along with travelForecast.html and travelForecast.css
   It's designed for a webpage called "Travel Forecast", 
   which uses the Flickr and Expedia APIs to show what tours and activities are offered
   at a specific travel destination in the next 2 weeks, along with photos of that place.

   Created by Cynthia on 9/26/16.
   Copyright © 2016 Cynthia Xin Tong. All rights reserved.
*/

//Possible Improvements: pop image so it appears only once? 


//GetRandomInt function for accessing a random flickr photo (0-199) and Expedia data using the APIs
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Automatically capitalize user input
function toTitleCase(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

//For checking if user input consists of only alphabets and spaces
function isAlphabet(str) {
    return /^[A-Za-z\s]+$/.test(str);
}

//Search through the Expedia location-based "Things to do" API 
function expediaSearch(searchWord){
    var expediaUrl = "http://terminal2.expedia.com/x/activities/search?location="+searchWord+"&apikey=";
    var myExpediaKey = "RJyNjh06jyGl02HWdmKhAGtj8hghzxxf";
    var expediaReqUrl = expediaUrl + myExpediaKey;
    console.log(expediaReqUrl);

    $.ajax({
        url: expediaReqUrl,
        type:"GET",
        dataType:"json",
        error: function(err){
            console.log("Problems with Expedia!");
            console.log(err);
            var errorMessage = "Sorry, travel info for "+ searchWord + "cound not be found.";
            $("#expediaData").html(errorMessage);
        },
        success: function(data){
            console.log("Success with Expedia!");

            //add html code that shows the search line and search results 
            var dataStr = "Visit "+ "<span id =\"color\">"+searchWord +"</span> in the next two weeks for: <br> <ul>";
            //if the data returned total more than 10, put 5 random results on the screen
            if (data.activities.length >=10){ 
                var randomNum = getRandomInt(0,data.activities.length-10);
                for (var i=randomNum; i<randomNum+5; i++){
                    var activities = data.activities[i].title;
                    dataStr += "<li>"+activities+"</li>";
                }
                dataStr += "</ul>";
                $("#expediaData").html(dataStr);
            // else if the retured data is no more than 10, display all the data 
            }else if (data.activities.length > 0){
                for (var j=0; j<data.activities.length; j++){
                    var activity = data.activities[j].title;
                    dataStr += "<li>"+activity+"</li>";
                }
                dataStr += "</ul>";
                $("#expediaData").html(dataStr);
            //if no data returned, display error message 
            }else{
               var errorMessage = "Sorry, travel info for "+ searchWord + "cound not be found.";
                $("#expediaData").html(errorMessage);
            }
        },
    });
}

//Search through the Flickr "photo.search" API
function flickrSearch(searchWord){
    var flickrURL = "https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&nojsoncallback=1&extras=url_o&per_page=200&text=";

    var myFlickrKey = '&api_key=' + 'e904f6fd166f683b7e41a95949d9fc42';
    var flickrReqURL = flickrURL + searchWord + myFlickrKey;
    console.log(flickrReqURL);

    $.ajax({ 
        url: flickrReqURL,
        type: "GET",
        error: function(err){
            console.log("Problems with Flickr!");
            console.log(err);
        },
        success: function(item){
            console.log("Success with Flickr!");
            var chosen = item.photos.photo[getRandomInt(0,199)];
            // console.log(chosen);
            // var chosen = item.photos.photo.pop();

            var imgInfo = [chosen.farm, chosen.server, chosen.id, chosen.secret];

            //use the imgInfo provided through the API to construct the url for large images 
            var imgUrl = "https://farm"+imgInfo[0]+".staticflickr.com/"+
            imgInfo[1]+"/"+imgInfo[2]+"_"+imgInfo[3]+"_h.jpg";
            // console.log(imgUrl);

            var img = $("<img />").attr('src', imgUrl)

            .on('load', function() {
                if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth === 0) {
                    alert('broken image!');
                } else {
                    //load the image to the page as background 
                    $("body").css('background-image', 'url(' + imgUrl + ')');
                }
            });
        }
    });

}


function loopRequest(){

        var counter = 0;
        console.log("reqeust counter: "+counter); 

        id = setInterval(function(){
            counter ++;
            console.log("request counter: "+counter); 
            flickrSearch(input);

            //if reqeusted more than a certain times, stop flickr request. 
            if (counter>= 15){
                clearInterval(id);
                }
            }, 8000);

        id2 = setInterval(function(){expediaSearch(input);}, 16000);
        console.log(requestCount);
}

var requestCount = 0;
var id, id2;
var input;
//main function 
$(document).ready(function(){
    //hide the data area at first 
    $("#displayData").hide();

    //when user presses enter key, trigger search button click 
    $("#userInput").keydown(function(event){ 
        var keyCode = event.which;   
        if (keyCode == 13) {
            $("#showButton").trigger('click');
            console.log("Enter Key Pressed!");
            }
    });  

    //user clicks search button 
    $("#showButton").click(function(){
        console.log("Button Pressed!");

        //get user input and capitalize it 
        input = $("#userInput").val(); 
        input = toTitleCase(input);

        //if user input is alphabetical or space, execute the search functions 
        if (isAlphabet(input)){

            //hide unnecessary initial info 
            $("#shortIntro").hide();
            $("#photoCredit").hide();

            flickrSearch(input);            
            // wikiSearch(input);
            expediaSearch(input);
            $("#displayData").show();

            //call the loopRequest function to update the searches every 8/16seconds, 
            //note: setInterval will keep on executing until clearIntervals() function is called. 
            loopRequest();

            //clear text input to prevent multiple searches for the same city
            $("#userInput").val("");

        }else{
            alert("Please enter a valid input (English alphabet only, either upper or lower case).");
        }
    });    

   //prevent the display of data for multiple cities, by terminating the previous setInterval functions.
    $('#userInput').on('input',function(e){
        console.log("Input Changed!");
        clearInterval(id);
        clearInterval(id2); 
    });

}); 

//Unused: wikiSearch API 

// function wikiSearch(searchWord){
//     var wikiUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=";
//     var wikiSearch = wikiUrl + searchWord;
//     console.log(wikiSearch);

//     $.ajax({
//         url: wikiSearch,
//         type:"GET",
//         dataType:"jsonp",
//         error: function(err){
//             console.log("Problems with Wiki!");
//             console.log(err);
//         },
//         success: function(data){
//             console.log("Success!");
//             // console.log(data);

//             var result = data[2][0];
//             console.log(result);

//             if (result.length === 0){
//                 alert("No search result.");
//             } else {
//                 // $("#content").html(result);
//             }
//         },
//     });
// }

