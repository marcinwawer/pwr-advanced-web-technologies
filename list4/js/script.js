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
    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity()) {
      alert("Formularz został wysłany!");
    }

    form.classList.add("was-validated");
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".needs-validation");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity()) {
      alert("Formularz został wysłany!");
    }

    form.classList.add("was-validated");
  });

  const modal = document.getElementById("exampleModal");
  const modalContent = modal.querySelector(".modal-content");

  modal.addEventListener("show.mdb.modal", function () {
    modalContent.style.transform = "scale(0.7)";
    modalContent.style.opacity = "0";
    setTimeout(() => {
      modalContent.style.transform = "scale(1)";
      modalContent.style.opacity = "1";
    }, 50);
  });

  modal.addEventListener("hide.mdb.modal", function () {
    modalContent.style.transform = "scale(0.7)";
    modalContent.style.opacity = "0";
  });

  const profileImage = modal.querySelector(".modal-body img");
  if (profileImage) {
    modal.addEventListener("shown.mdb.modal", function () {
      profileImage.style.animation = "pulse 1s";
    });
  }
});
