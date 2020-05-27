/*Code for the slideshow in "reviews" in index.html*/
var reviewNumber = 1;
showReviews(1);

//Shows the next review
function changeSlide(n) {
  showReviews(reviewNumber += n);
}

//shows the previous review
function currentSlide(n) {
  showReviews(reviewNumber = n);
}

//displays slide
function showReviews(n) {
  var reviews = document.getElementsByClassName("reviews");
  if (n > reviews.length) {
    reviewNumber = 1;
  } else if (n < 1) {
    reviewNumber = reviews.length;
  }
  var i;
  for (i = 0; i < reviews.length; i++) {
    reviews[i].style.display = "none";
  }
  reviews[reviewNumber - 1].style.display = "block";
}
