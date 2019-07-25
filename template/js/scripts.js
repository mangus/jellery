
function showImages(imageList) {
  clearSlides();
  generateImageElements(imageList);
  loadAndShowFirstImage();
}

function generateImageElements(imageList) {
  var container = document.createElement("span");
  container.setAttribute("id", "picture-slides");
  document.getElementById("slides").appendChild(container);
  
  var first = true;
  imageList.forEach(function(element) {
    var slide = document.createElement("div");
    slide.classList.add('picture-container');
    slide.onclick = showNextSlide;
    if (first) {
      slide.classList.add('next-slide');
      first = false;
    }
    slide.innerHTML = "<img class='picture' src='images/" + element + ".jpg' />";
    document.getElementById("picture-slides").appendChild(slide);
    console.log(element);
  });
}

function clearSlides() {
  var elem = document.getElementById('picture-slides');
  elem.parentNode.removeChild(elem);
}

function showNextSlide() {
  var changeNext = false;
  var exitLoop = false;
  document.getElementById("picture-slides").childNodes
    .forEach(function (e) {
      if (!exitLoop) {
        if (changeNext) {
          e.classList.add("next-slide");
          preloadImage(e.firstChild.src);
          exitLoop = true;
        } else if (e.classList.contains("next-slide")) {
        
          // TODO+TEST
          var swiper = new Swipe(e.firstChild);
          swiper.onLeft(function() { alert('swiped left.') });
          swiper.onRight(function() { alert('swiped right.') });
          swiper.onUp(function() { alert('swiped up.') });
          swiper.onDown(function() { alert('swiped down.') });
          swiper.run();
          
          e.classList.add("slide-in");
          e.classList.remove("next-slide");
          changeNext = true;
        } else if (e.classList.contains("slide-in")) { // Current slide
          e.classList.remove("slide-in");
          e.classList.add("slide-out");
        }
      }
    });
}

function loadAndShowFirstImage() {
  preloadImage(document.getElementById("picture-slides").childNodes[0].firstChild.src, showNextSlide());
}

function preloadImage(url, callback) {
  var img = new Image();
  img.src = url;
  img.onload = callback;
}

function showPreviousSlide() {
}

class Swipe {
  constructor(element) {
    this.xDown = null; this.yDown = null;
    this.element = typeof(element) === 'string' ? document.querySelector(element) : element;
      this.element.addEventListener('touchstart', function(evt) {
          this.xDown = evt.touches[0].clientX;
          this.yDown = evt.touches[0].clientY;
      }.bind(this), false);
  }
  
  onLeft(callback) { this.onLeft = callback; return this; }
  onRight(callback) { this.onRight = callback; return this; }
  onUp(callback) { this.onUp = callback; return this; }
  onDown(callback) { this.onDown = callback; return this; }

  handleTouchMove(evt) {
      if ( ! this.xDown || ! this.yDown ) { return; }
      var xUp = evt.touches[0].clientX; var yUp = evt.touches[0].clientY;
      this.xDiff = this.xDown - xUp; this.yDiff = this.yDown - yUp;
      if ( Math.abs( this.xDiff ) > Math.abs( this.yDiff ) ) {
          if ( this.xDiff > 0 ) {
              this.onLeft();
          } else {
              this.onRight();
          }
      } else {
          if ( this.yDiff > 0 ) {
              this.onUp();
          } else {
              this.onDown();
          }
      }
      this.xDown = null; this.yDown = null;
  }

  run() {
      this.element.addEventListener('touchmove', function(evt) {
          this.handleTouchMove(evt).bind(this);
      }.bind(this), false);
  }
}
