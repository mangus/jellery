
document.onkeydown = function(evt) {
  evt = evt || window.event;
  if (evt.keyCode == 37) {
    showPreviousSlide();
  } else if (evt.keyCode == 39 || evt.keyCode == 32) {
    showNextSlide();
  }
  if (evt.ctrlKey && evt.keyCode == 90) {
    alert("Ctrl-Z");
  }
};

function showImages(imageList) {
  clearSlides();
  generateImageElements(imageList);
  loadAndShowFirstImage();
}

function generateImageElements(imageList) {
  var container = document.createElement("span"); 
  container.setAttribute("id", "picture-slides");
  document.getElementById("slides").appendChild(container);
  
  imageList.forEach(function(element) {
    var slide = document.createElement("div");
    slide.classList.add('picture-container');
    slide.onclick = showOrHideControls;
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
  done = false;
  document.getElementById("picture-slides").childNodes
    .forEach(function (e, index) {
      if (!done) {
        e.classList.remove("slide-out-to-left");
        e.classList.remove("slide-out-to-right");
        if (e.classList.contains("current")) {
          e.classList.remove("slide-in-from-right");
          e.classList.remove("slide-in-from-left");
          e.classList.remove("current");
          e.classList.add("slide-out-to-left");
          
          next = document.getElementById("picture-slides").childNodes[index + 1];
          next.classList.remove("slide-out-to-right");
          next.classList.add("slide-in-from-right");
          next.classList.add("current");
          
          preloadImage(document.getElementById("picture-slides").childNodes[index + 2].firstChild.src);
          done = true;
          
          // TODO+TEST
          /*
          var swiper = new Swipe(e.firstChild);
          swiper.onLeft(function() { alert('swiped left.') });
          swiper.onRight(function() { alert('swiped right.') });
          swiper.onUp(function() { alert('swiped up.') });
          swiper.onDown(function() { alert('swiped down.') });
          swiper.run();
          */
        }
      }
    });
    
    if (!done) {
      takeFirst = document.getElementById("picture-slides").childNodes[0];
      takeFirst.classList.add("slide-in-from-right");
      takeFirst.classList.add("current");
    }
}

function showPreviousSlide() {
  document.getElementById("picture-slides").childNodes
    .forEach(function (e, index) {
      e.classList.remove("slide-out-to-left");
      e.classList.remove("slide-out-to-right");
      
      if (e.classList.contains("current")) {
        e.classList.remove("slide-in-from-right");
        e.classList.remove("slide-in-from-left");
        e.classList.remove("current");
        
        e.classList.add("slide-out-to-right");
        
        previous = document.getElementById("picture-slides").childNodes[index - 1];
        previous.classList.remove("slide-out-to-left");
        previous.classList.add("slide-in-from-left");
        previous.classList.add("current");
        
        next = document.getElementById("picture-slides").childNodes[index + 1];
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

function showOrHideControls() {
  alert("showOrHideControls()");
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
