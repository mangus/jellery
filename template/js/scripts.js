

class PictureRoller {

  constructor (images) {
    this.imageList = images;
    this.currentIndex = 0;
    this.createContainer();
    this.createNeededImageElements();
    this.bindKeyboard();
    this.showFirst();
    this.homeScreen = true;
  }
  
  bindKeyboard() {
    let roller = this;
    document.onkeydown = function(evt) {
      evt = evt || window.event;
      if (evt.keyCode == 37) {
        roller.showPrevious();
      } else if (evt.keyCode == 39 || evt.keyCode == 32) {
        roller.showNext();
      }
      if (evt.ctrlKey && evt.keyCode == 90) {
        alert("Ctrl-Z");
      }
    };
  }
  
  createContainer() {
    let container = document.createElement("span"); 
    container.setAttribute("id", "picture-slides");
    document.getElementById("slides").appendChild(container);
  }
  
  whatToLoad() {
    let loadThese = [];
    if (this.currentIndex > 0)
      loadThese.push(this.currentIndex - 1);
    loadThese.push(this.currentIndex);
    if (this.currentIndex < (this.imageList.length - 1))
      loadThese.push(this.currentIndex + 1);
    return loadThese;
  }
  
  elementExists(index) {
    return (index in document.getElementById("picture-slides").childNodes);
  }

  createNeededImageElements() {
    let loadThese = this.whatToLoad();
    let roller = this;
    loadThese.forEach(imageIndex => {
      if (!roller.elementExists(imageIndex)) {
        var slide = document.createElement("div");
        slide.classList.add('picture-container');
        slide.onclick = roller.showOrHideControls;
        slide.innerHTML = "<img class='picture' src='images/" + roller.imageList[imageIndex] + ".jpg' />";
        document.getElementById("picture-slides").appendChild(slide);
        roller.preloadImage(document.getElementById("picture-slides").childNodes[imageIndex].firstChild.src);
      }
    });
  }
  
  preloadImage(url) {
    var img = new Image();
    img.src = url;
  }
  
  showFirst() {
    this.render("forward");
  }
  
  showNext() {
    if (this.currentIndex == this.imageList.length - 1) {
      this.render("home");
    } else {
      this.homeScreen = false;
      this.currentIndex++;
      this.createNeededImageElements();
      this.render("forward");
    }
  }
  showPrevious() {
    if (this.currentIndex == 0) {
      this.render("back-home");
    } else {
      this.homeScreen = false;
      this.currentIndex--;
      this.createNeededImageElements();
      this.render("back");
    }
  }
  
  render(direction) {
  
    this.createNeededImageElements();
    let pictureNodes = document.getElementById("picture-slides").childNodes;
    
    switch (direction) {
    
      case "home":
        homeScreen = true;
      case "forward":
        {    
          let done = false;
          pictureNodes
            .forEach(function (e, index) {
              if (!done) {
                e.classList.remove("slide-out-to-left");
                e.classList.remove("slide-out-to-right");
                if (e.classList.contains("current")) {
                  e.classList.remove("slide-in-from-right");
                  e.classList.remove("slide-in-from-left");
                  e.classList.remove("current");
                  e.classList.add("slide-out-to-left");
                  
                  if (!this.homeScreen) {
                    let next = pictureNodes[index + 1];
                    next.classList.remove("slide-out-to-right");
                    next.classList.add("slide-in-from-right");
                    next.classList.add("current");
                  }
                  done = true;
                }
              }
            });
          if (!done) {
            let takeFirst = pictureNodes[0];
            takeFirst.classList.add("slide-in-from-right");
            takeFirst.classList.add("current");
          }
        }
        break;
      
      case "back-home":
        homeScreen = true;
      case "back":
        {
          pictureNodes
            .forEach(function (e, index) {
              e.classList.remove("slide-out-to-left");
              e.classList.remove("slide-out-to-right");
              
              if (e.classList.contains("current")) {
                e.classList.remove("slide-in-from-right");
                e.classList.remove("slide-in-from-left");
                e.classList.remove("current");
                
                e.classList.add("slide-out-to-right");
                
                let previous = pictureNodes[index - 1];
                previous.classList.remove("slide-out-to-left");
                previous.classList.add("slide-in-from-left");
                previous.classList.add("current");
                
                let next = pictureNodes[index + 1];
              }
            });
        }
        break;
    }
  }
  cleanupSlidingClasses(element) {
    element.classList.remove("slide-in-from-right");
    element.classList.remove("slide-in-from-left");
    element.classList.remove("slide-out-to-right");
    element.classList.remove("slide-out-to-left");
    element.classList.remove("current");
  }
  
  showOrHideControls() {
    console.log("showOrHideControls()");
  }

}

function clearSlides() {
  var elem = document.getElementById('picture-slides');
  elem.parentNode.removeChild(elem);
}

          
// TODO+TEST
/*
var swiper = new Swipe(e.firstChild);
swiper.onLeft(function() { alert('swiped left.') });
swiper.onRight(function() { alert('swiped right.') });
swiper.onUp(function() { alert('swiped up.') });
swiper.onDown(function() { alert('swiped down.') });
swiper.run();
*/

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



