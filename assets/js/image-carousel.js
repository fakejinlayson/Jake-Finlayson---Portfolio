document.addEventListener('DOMContentLoaded', function() {
  const img = document.getElementById('saniti-carousel-img');
  const prevBtn = document.getElementById('saniti-prev');
  const nextBtn = document.getElementById('saniti-next');
  let images = [];
  let current = 0;

  if (img) {
    try {
      images = JSON.parse(img.getAttribute('data-images'));
    } catch (e) {
      images = [img.src];
    }
  }

  if (img && prevBtn && nextBtn && images.length > 0) {
    prevBtn.onclick = function() {
      current = (current - 1 + images.length) % images.length;
      img.src = images[current];
    };
    nextBtn.onclick = function() {
      current = (current + 1) % images.length;
      img.src = images[current];
    };
  }
});