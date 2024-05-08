
const elements = document.querySelectorAll(".ab3");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

elements.forEach((element) => {
  observer.observe(element);
});


