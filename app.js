document.addEventListener('DOMContentLoaded', function () {

  var adFrame = document.querySelector('.adFrame1');
  const containers = document.querySelectorAll('.face');

  var width = 0;
  var rotation = 0;
  var touchstartX = 0;
  var rotationDeltaX = 0;
  var moved = false;
  var isRotating = false;

  /* ================= MOUSE DETECTION ================= */

  function mouseDetection() {

    var boxes = document.querySelectorAll('.box');
    let isDragging = false;

    adFrame.addEventListener('mousedown', handleMouseDown);

    function handleMouseMove(event) {

      if (!isDragging) return;

      isRotating = true;
      moved = true;

      var deltaX = event.clientX - touchstartX;
      var localX = deltaX / width;

      var dampingFactor = 1.3;
      rotationDeltaX = 90 * localX * dampingFactor;

      boxes.forEach((box, index) => {

        gsap.to(box, {
          duration: 1,
          rotateY: rotation + rotationDeltaX,
          delay: index * 0.02,
          ease: "power2.out"
        });

      });

    }

    function handleMouseDown(event) {

      event.preventDefault();
      killCubeTouchAnimation();

      width = boxes[0].offsetWidth;
      touchstartX = event.clientX;

      isDragging = true;
      moved = true;

      boxes.forEach(box => {
        gsap.to(box, {
          duration: 1,
          scale: .8,
          ease: "power2.out"
        });
      });

      adFrame.style.cursor = 'grabbing';

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      containers.forEach(container => {
        container.style.cursor = 'grabbing';
      });

    }

    function handleMouseUp() {

      if (isDragging) snapToNearestRotation();

      isDragging = false;
      moved = false;

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      containers.forEach(container => {
        container.style.cursor = 'grab';
      });

    }

    function snapToNearestRotation() {

      isRotating = false;

      rotation += rotationDeltaX;
      rotation = Math.round(rotation / 90) * 90;

      boxes.forEach((box, index) => {

        gsap.to(box, {
          duration: 3,
          rotateY: rotation,
          delay: index * 0.05,
          ease: "elastic.out(.2, 0.1)",
          scale: 1
        });

      });

    }

  }

  /* ================= TOUCH DETECTION ================= */

  function touchDetection() {

    var boxes = document.querySelectorAll('.box');

    let isDragging = false;
    let touchstartX = 0;
    let width = 0;
    let rotationDeltaX = 0;

    adFrame.addEventListener('touchstart', handleTouchStart);

    function handleTouchMove(event) {

      if (!isDragging) return;

      isRotating = true;
      moved = true;

      var touch = event.touches[0];
      var deltaX = touch.clientX - touchstartX;
      var localX = deltaX / width;

      var dampingFactor = 1.3;
      rotationDeltaX = 90 * localX * dampingFactor;

      boxes.forEach(box => {

        gsap.to(box, {
          duration: 1,
          rotateY: rotation + rotationDeltaX,
          ease: "power2.out"
        });

      });

    }

    function handleTouchStart(event) {

      killCubeTouchAnimation();

      event.preventDefault();

      width = boxes[0].offsetWidth;
      touchstartX = event.touches[0].clientX;

      isDragging = true;
      moved = true;

      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);

    }

    function handleTouchEnd() {

      if (isDragging) snapToNearestRotation();

      isDragging = false;

      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);

    }

    function snapToNearestRotation() {

      isRotating = false;

      rotation += rotationDeltaX;
      rotation = Math.round(rotation / 90) * 90;

      boxes.forEach(box => {

        gsap.to(box, {
          duration: 3,
          rotateY: rotation,
          ease: "elastic.out(.2, 0.1)"
        });

      });

    }

  }

  /* ================= IMAGE + CUBE BUILD ================= */

  let cubeWidth = 0;
  let totalcubes = 4;
  let imgWidth = 0;
  let imgHeight = 0;

  const img = new Image();
  img.src = 'images/Nivea1.jpg';

  img.onload = function () {

    const width = img.naturalWidth / 5.5;
    const height = img.naturalHeight / 5.5;

    let containers = document.querySelectorAll('.container');

    let newWidth = width / totalcubes;

    cubeWidth = newWidth;
    imgWidth = width;
    imgHeight = height;

    let k = 4.5;
    let mw = cubeWidth + k;

    containers.forEach((container, i) => {

      container.style.width = `${cubeWidth}px`;
      container.style.height = `${height}px`;
      container.style.position = 'absolute';
      container.style.left = `${i * mw}px`;
      container.style.top = `0`;

    });

    initCubes();

  };

  function initCubes() {

    const cubes = Array.from(document.querySelectorAll('.container'));
    let cubeHolder = document.querySelector('.cubeHolder');

    let k = 4.5;

    let finalLeft = ((320 - imgWidth) / 2) - k;

    cubeHolder.style.left = `${finalLeft}px`;
    cubeHolder.style.top = `${(480 - imgHeight) / 2}px`;

    cubes.forEach((container, index) => {

      const box = container.querySelector('.box');
      const faces = box.querySelectorAll('.face');

      faces.forEach(face => {

        if (face.classList.contains('left')) {
          face.style.backgroundPosition = `${-cubeWidth * index}px 0`;
          face.style.backgroundImage = "url('images/Nivea1.jpg')";
          face.style.backgroundSize = `${imgWidth}px ${imgHeight}px`;
          face.style.transform = `rotateY(-90deg) translateZ(${cubeWidth / 2}px)`;
        }

        if (face.classList.contains('right')) {
          face.style.backgroundPosition = `${-cubeWidth * index}px 0`;
          face.style.backgroundImage = "url('images/Nivea2.jpg')";
          face.style.backgroundSize = `${imgWidth}px ${imgHeight}px`;
          face.style.transform = `rotateY(90deg) translateZ(${cubeWidth / 2}px)`;
        }

        if (face.classList.contains('front')) {
          face.style.backgroundPosition = `${-cubeWidth * index}px 0`;
          face.style.backgroundImage = "url('images/Nivea3.jpg')";
          face.style.backgroundSize = `${imgWidth}px ${imgHeight}px`;
          face.style.transform = `translateZ(${cubeWidth / 2}px)`;
        }

        if (face.classList.contains('back')) {
          face.style.backgroundPosition = `${-cubeWidth * index}px 0`;
          face.style.backgroundImage = "url('images/Nivea4.jpg')";
          face.style.backgroundSize = `${imgWidth}px ${imgHeight}px`;
          face.style.transform = `rotateY(180deg) translateZ(${cubeWidth / 2}px)`;
        }

      });

    });

  }

  /* ================= IDLE CUBE + HAND ANIMATION ================= */

  let cubeAnim, touchAnim;

  const boxes = gsap.utils.toArray('.box');
  const touch = document.querySelector('.touchGesture') || document.querySelector('.touchGestureContainer');

  function startCubeTouchAnimation() {

    cubeAnim = gsap.timeline({ repeat: -1, defaults: { ease: "power2.inOut", duration: 1.2 } })
      .to(boxes, { rotationY: -15, scale: 0.8 })
      .to(boxes, { rotationY: 15 })
      .to(boxes, { rotationY: 0 })
      .to(boxes, { scale: 1 });

    touchAnim = gsap.timeline({ repeat: -1, defaults: { ease: "power2.inOut", duration: 1.2 } })
      .to(touch, { x: -30, scale: 0.5, rotation: -10 })
      .to(touch, { x: 30, rotation: 10 })
      .to(touch, { x: 0, rotation: 0 })
      .to(touch, { scale: 1 });

  }

  function killCubeTouchAnimation() {

    cubeAnim?.kill();
    touchAnim?.kill();

    gsap.to(touch, {
      opacity: 0,
      duration: 1
    });

    gsap.to(boxes, {
      scale: 1
    });

  }

  /* ================= INIT CALLS (VERY IMPORTANT) ================= */

  startCubeTouchAnimation();
  mouseDetection();
  touchDetection();

});

function scaleAdToFit() {
  const ad = document.querySelector('.adFrame1');
  const scaler = document.getElementById('adScaler');
  if (!ad || !scaler) return;

  const baseW = 320;
  const baseH = 480;

  const availW = scaler.clientWidth;
  const availH = scaler.clientHeight;

  const scale = Math.min(availW / baseW, availH / baseH);

  ad.style.transform = `scale(${scale})`;
}

scaleAdToFit();
window.addEventListener('resize', scaleAdToFit);
window.addEventListener('orientationchange', scaleAdToFit);
