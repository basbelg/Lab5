// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
var canvas = document.getElementById('user-image');
var ctx = canvas.getContext('2d');
var submit = document.querySelector('button[type=submit]');

// on load do the following:
// clear the canvas context
// toggle the relevant buttons (submit, clear, and read text buttons) by disabling or enabling them as needed
// fill the canvas context with black to add borders on non-square images
// draw the uploaded image onto the canvas with the correct width, height, leftmost coordinate (startX), and topmost coordinate (startY) using generated dimensions from the given function getDimensions
img.addEventListener('load', () => {
  // TODO
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  var dim = getDimensions(canvas.width, canvas.height, img.width, img.height);
  ctx.drawImage(img,dim['startX'],dim['startY'],dim.width,dim.height);
});

var inp = document.getElementById('image-input');
// on change
// load in the selected image into the Image object (img) src attribute
// set the image alt attribute by extracting the image file name from the file path
inp.addEventListener('input', function() {
  img.src = URL.createObjectURL(inp.files[0]);
  img.alt = inp.files[0].name
});

var clear = document.querySelector('button[type=reset]');
var readtext = document.querySelector('button[type=button]');
var syn = window.speechSynthesis;
var voice = document.getElementById('voice-selection');
var op = document.querySelector('select');
var voices = [];
var syn = window.speechSynthesis;
// on submit, generate your meme by grabbing the text in the two inputs with ids text-top and 
// text-bottom, and adding the relevant text to the canvas (note: you should still be able 
// to add text to the canvas without an image uploaded toggle relevant buttons
document.getElementById('generate-meme').addEventListener('submit', function(event) {
  var toptext = document.getElementById('text-top').value;
  var bottext = document.getElementById('text-bottom').value;

  ctx.textAlign = 'center';
  ctx.font = '40px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText(toptext, canvas.width/2, canvas.height/10);
  ctx.fillText(bottext, canvas.width/2, canvas.height-10);

  voices = syn.getVoices();
  op.textContent = '';
  
  for(let i = 0; i < voices.length; i++)
  {
    var o = document.createElement('option');
    o.textContent = voices[i].name + ' (' + voices[i].lang + ')';
    o.setAttribute('data-lang', voices[i].lang);
    o.setAttribute('data-name', voices[i].name);
    op.appendChild(o);
  }
  event.preventDefault();

  submit.toggleAttribute('disabled');
  clear.toggleAttribute('disabled');
  readtext.toggleAttribute('disabled');
  voice.toggleAttribute('disabled');
});

// on click, clear the image and/or text present
// toggle relevant buttons
clear.addEventListener('click', function() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  submit.toggleAttribute('disabled');
  clear.toggleAttribute('disabled');
  readtext.toggleAttribute('disabled');
  voice.toggleAttribute('disabled');
});

var talk = new SpeechSynthesisUtterance();
// on click, have the browser speak the text in the two 
// inputs with ids text-top and text-bottom out loud using the selected 
// voice type in the voice-selection dropdown
readtext.addEventListener('click', function() {
  var toptext = document.getElementById('text-top').value;
  var bottext = document.getElementById('text-bottom').value;

  talk.text = toptext+bottext;
  for(let i = 0; i < voices.length; i++)
  {
    if(op.selectedOptions[0].getAttribute('data-name') === voice[i].getAttribute('data-name'))
    {
      talk.voice = voices[i];
      break;
    }
  }
  syn.speak(talk);
});

// update the volume value to increase or decrease the volume at which the text is read if the read text button is clicked
// change the volume icons depending on the following volume ranges: (note: you can find these icons in the icons directory)
var volumee = document.querySelector('[type=range]');
var volumeimg = document.querySelector('div img');
volumee.addEventListener('change', function() {
  talk.volume = volumee.value/100;
  if(volumee.value >= 67)
  {
    volumeimg.setAttribute('src', 'icons/volume-level-3.svg');
  }
  else if(volumee.value >= 34 && volumee.value < 67)
  {
    volumeimg.setAttribute('src', 'icons/volume-level-2.svg');
  }
  else if(volumee.value > 0 && volumee.value < 34)
  {
    volumeimg.setAttribute('src', 'icons/volume-level-1.svg');
  }
  else
  {
    volumeimg.setAttribute('src', 'icons/volume-level-0.svg');
  }
});



/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
