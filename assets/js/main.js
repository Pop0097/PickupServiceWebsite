/*Code for the slideshow in "reviews" in index.html*/
var reviewNumber = 1;
showReviews(1);

//Shows the next review
function changeSlide(n){
  showReviews(reviewNumber += n);
}

//shows the previous review
function currentSlide(n){
  showReviews(reviewNumber = n);
}

//displays slide
function showReviews(n){
  var reviews = document.getElementsByClassName("reviews");
  if(n > reviews.length){
    reviewNumber = 1;
  }
  else if(n < 1){
    reviewNumber = reviews.length;
  }
  var i;
  for(i = 0; i < reviews.length; i++){
    reviews[i].style.display = "none";
  }
  reviews[reviewNumber-1].style.display = "block";
}

/*Send question form email:*/
var myform = $("form#myform");
myform.submit(function(event){
	event.preventDefault();

  // Change to your service ID, or keep using the default service
  var service_id = "Dhruv_R";
  var template_id = "template_2VPl8QHL";

  myform.find("button").text("Sending...");
  emailjs.sendForm(service_id,template_id,myform[0])
  	.then(function(){
    	alert("Sent!");
       myform.find("button").text("Send");
    }, function(err) {
       alert("Send email failed!\r\n Response:\n " + JSON.stringify(err));
       myform.find("button").text("Send");
    });
  return false;
});
