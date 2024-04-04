import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import { getImages } from "./js/pixabay-api";
import { imagesTemplate } from "./js/render-functions";

// ==============??????????????===============??????????????????????????===============
const lightbox = new SimpleLightbox(".gallery a", {
  captionsData: "alt",
  captionDelay: 250,
});
// =======================================================
const refs = {
  formEl: document.querySelector(".search-form"),
  imgListEl: document.querySelector(".gallery"),
  loaderEl: document.querySelector(".loader"),
};

//=================????????????????????????????????==========================================================================================

function showLoader() {
  refs.loaderEl.classList.remove("is-hidden");
}

function hideLoader() {
  refs.loaderEl.classList.add("is-hidden");
}
// =======================================================
refs.formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  refs.imgListEl.innerHTML = "";
  const search = event.target.elements.query.value.trim();
  showLoader();
  if (search === "") {
    getImages(search)
      .then((data) => {
        const markup = imagesTemplate(data.hits);
        refs.imgListEl.insertAdjacentHTML("beforeend", markup);
        // refs.loaderEl.classList.add('is-hidden');
        lightbox.refresh();
        if (data.hits.length === 0) {
          iziToast.error({
            position: "topRight",
            title: "Error",
            message: "The search field is empty. Please try again!",
          });
        }
      })
      .catch((error) => {
        iziToast.error({
          position: "topRight",
          message:
            "Sorry, there was an error processing your request. Please try again later!",
        });
      })
      .finally(() => {
        refs.formEl.reset();
        hideLoader();
      });
  }
});
