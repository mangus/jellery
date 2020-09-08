

class PictureRoller {

  constructor (images) {
    this.imageList = images;
    this.currentIndex = 0;
    this.createContainer();
    this.createNeededImageElements();
    this.bindKeyboard();
    this.showFirst();
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
    console.log(loadThese);
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
        console.log("loading", imageIndex);
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
    this.render("first");
  }
  
  showNext() {
    if (this.currentIndex < document.getElementById("picture-slides").childNodes.length - 1) {
      this.currentIndex++;
      this.createNeededImageElements();
      this.render("forward");
    } else {
      this.render("forward-close");
    }
  }
  showPrevious() {
    if (this.currentIndex == 0) {
      this.render("back-close");
    } else if (this.currentIndex = document.getElementById("picture-slides").childNodes.length - 1) {
      this.render("back");      
    } else {
      this.currentIndex--;
      this.createNeededImageElements();
      this.render("back");
    }
  }
  
  render(direction) {
    this.createNeededImageElements();
    let pictureNodes = document.getElementById("picture-slides").childNodes;
    switch (direction) {
    
      case "first":
        pictureNodes[this.currentIndex].classList.add("slide-in-from-right");
        pictureNodes[this.currentIndex].classList.add("current");
        break;
        
      case "forward": {
          let elementOut = pictureNodes[this.currentIndex - 1];
          this.cleanupSlidingClasses(elementOut);
          elementOut.classList.add("slide-out-to-left");
          
          let elementIn = pictureNodes[this.currentIndex];
          this.cleanupSlidingClasses(elementIn);
          elementIn.classList.add("slide-in-from-right");
          elementIn.classList.add("current");
          
          if (this.currentIndex > 1) {
            let elementClean = pictureNodes[this.currentIndex - 2];
            this.cleanupSlidingClasses(elementClean);
          }
        }
        break;
      case "back": {
          let elementOut = pictureNodes[this.currentIndex + 1];
          this.cleanupSlidingClasses(elementOut);
          elementOut.classList.add("slide-out-to-right");
          
          let elementIn = pictureNodes[this.currentIndex];
          this.cleanupSlidingClasses(elementIn);
          elementIn.classList.add("slide-in-from-left");
          elementIn.classList.add("current");
          
          let count = pictureNodes.length;
          console.log("currentIndex", this.currentIndex);
          console.log("count", count);
          if ((this.currentIndex + 1) - count > 3) {
            let elementClean = pictureNodes[this.currentIndex + 2];
            this.cleanupSlidingClasses(elementClean);
          }
        }
        break;
        
      case "back-close": {
          let elementOut = pictureNodes[this.currentIndex];
          this.cleanupSlidingClasses(elementOut);
          elementOut.classList.add("slide-out-to-right");
        }
        break;
      case "forward-close": {
          let elementOut = pictureNodes[this.currentIndex];
          this.cleanupSlidingClasses(elementOut);
          elementOut.classList.add("slide-out-to-left");
          
          let elementClean = pictureNodes[this.currentIndex - 1];
          this.cleanupSlidingClasses(elementClean);
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

    /*
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
            
            let next = document.getElementById("picture-slides").childNodes[index + 1];
            next.classList.remove("slide-out-to-right");
            next.classList.add("slide-in-from-right");
            next.classList.add("current");
            
            done = true;
          }
        }
      });
    
    if (!done) {
      let takeFirst = document.getElementById("picture-slides").childNodes[0];
      takeFirst.classList.add("slide-in-from-right");
      takeFirst.classList.add("current");
    }  
    */
    
  
  showOrHideControls() {
    console.log("showOrHideControls()");
  }

}


/*
function showImages(images) {
  clearSlides();
  currentIndex = 0;
  imageList = images;
  showFirstImage();
}

function generateNeededImageElements() {
  var container = document.createElement("span"); 
  container.setAttribute("id", "picture-slides");
  document.getElementById("slides").appendChild(container);
  
  loadThese = [];
  if (currentIndex > 0) loadThese.push(currentIndex - 1);
  loadThese.push(currentIndex);
  if (currentIndex < (imageList.length - 1)) loadThese.push(currentIndex + 1);
  
  console.log("LoadThese",  loadThese);
  
  loadThese.forEach(function(imageIndex) {
    if (!elementExists(imageIndex)) {
      console.log("loading", imageIndex);
      var slide = document.createElement("div");
      slide.classList.add('picture-container');
      slide.onclick = showOrHideControls;
      slide.innerHTML = "<img class='picture' src='images/" + imageList[imageIndex] + ".jpg' />";
      document.getElementById("picture-slides").appendChild(slide);
      console.log(imageList[imageIndex]);
    }
  });
}

function elementExists(index) {
  return (index in document.getElementById("picture-slides").childNodes);
}

function clearSlides() {
  var elem = document.getElementById('picture-slides');
  elem.parentNode.removeChild(elem);
}

function showNextSlide() {

  generateNeededImageElements();

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
          
          //preloadImage(document.getElementById("picture-slides").childNodes[index + 2].firstChild.src);
          done = true;
          
          // TODO+TEST
          /*
          var swiper = new Swipe(e.firstChild);
          swiper.onLeft(function() { alert('swiped left.') });
          swiper.onRight(function() { alert('swiped right.') });
          swiper.onUp(function() { alert('swiped up.') });
          swiper.onDown(function() { alert('swiped down.') });
          swiper.run();
          * /
        }
      }
    });
  
  if (!done) {
    takeFirst = document.getElementById("picture-slides").childNodes[0];
    takeFirst.classList.add("slide-in-from-right");
    takeFirst.classList.add("current");
  }
  
  currentIndex++;
}

function showPreviousSlide() {

  generateNeededImageElements();

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
    
  currentIndex--;
}

function showFirstImage() {
  showNextSlide();
  //generateNeededImageElements();
  //preloadImage(document.getElementById("picture-slides").childNodes[0].firstChild.src, showNextSlide());
}

function preloadImage(url, callback) {
  var img = new Image();
  img.src = url;
  img.onload = callback;
}

function showOrHideControls() {
  console.log("showOrHideControls()");
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

*/


