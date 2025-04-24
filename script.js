document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".hero-slider");
  const slides = document.querySelectorAll(".slide");
  const prevButton = document.querySelector(".arrow.prev");
  const nextButton = document.querySelector(".arrow.next");

  let currentIndex = 0;
  const slideCount = slides.length;

  // Update the transform property to slide
  const updateSlider = () => {
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
  };

  // Go to the next slide
  const nextSlide = () => {
    currentIndex = (currentIndex + 1) % slideCount; // Loop back to first slide
    updateSlider();
  };

  // Go to the previous slide
  const prevSlide = () => {
    currentIndex = (currentIndex - 1 + slideCount) % slideCount; // Loop back to last slide
    updateSlider();
  };

  // Event listeners for navigation buttons
  nextButton.addEventListener("click", nextSlide);
  prevButton.addEventListener("click", prevSlide);

  // Auto slide every 5 seconds
  setInterval(nextSlide, 5000); // Adjust time as needed
});
