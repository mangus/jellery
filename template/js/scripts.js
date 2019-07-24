
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


