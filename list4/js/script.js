const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    console.log(entry);
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

const hiddenElements = document.querySelectorAll(".hidden");
hiddenElements.forEach((el) => observer.observe(el));

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".needs-validation");

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Zapobiega przeładowaniu strony
    event.stopPropagation();

    if (form.checkValidity()) {
      alert("Formularz został wysłany!");
    }

    form.classList.add("was-validated");
  });
});
