import "../pages/index.css";

import {
  enableValidation,
  validationConfig,
  resetValidation,
} from "../scripts/validation.js";
import { setBtnText } from "../utils/helpers.js";
import Api from "../utils/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "6459f961-b0e7-4b78-9b85-426b3060452c",
    "Content-Type": "application/json",
  },
});

// Fetch initial data from the API
api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    cards.forEach((item) => {
      const cardEl = getCardElement(item);
      cardsList.append(cardEl);
    });
    // Update profile if needed
    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
    profileAvatar.src = userInfo.avatar;
    // console.log("User Info:", userInfo);
  })
  .catch(console.error);

///DOM ELEMENTS
const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__avatar");
const cardsList = document.querySelector(".cards__list");
const cardTemplate = document.querySelector("#card-template");

///MODALS
const modals = document.querySelectorAll(".modal");
const editModal = document.querySelector("#edit-modal");
const cardModal = document.querySelector("#add-card-modal");
const avatarModal = document.querySelector("#avatar-modal");
const previewModal = document.querySelector("#preview-modal");
const deleteModal = document.querySelector("#delete-modal");

/// FORMS
const editFormElement = editModal.querySelector(".modal__form");
const cardFormElement = cardModal.querySelector(".modal__form");
const avatarFormElement = avatarModal.querySelector(".modal__form");
const deleteFormElement = deleteModal.querySelector(".modal__form-delete");

///INPUTS
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);
const editModalAvatarInput = avatarModal.querySelector("#profile-avatar-input");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

///PREVIEW MODAL ELEMENTS
const previewImageEl = previewModal.querySelector(".modal__image");
const previewModalImageTitle = previewModal.querySelector(".modal__caption");

///STATE
let currentUserId;
let selectedCard, selectedCardId;

/////
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");

//// Avatar form elements

const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");

//preview modals
const previewModalCloseBtn = previewModal.querySelector(
  ".modal__close-btn_type_preview"
);

///DELETE MODAL///

const deleteModalCloseBtn = deleteModal.querySelector(
  ".modal__close-btn_type_preview_delete"
);

//preview modal close button
previewModalCloseBtn.addEventListener("click", () => closeModal(previewModal));
deleteModalCloseBtn.addEventListener("click", () => closeModal(deleteModal));

modals.forEach((modal) => {
  modal.addEventListener("mousedown", (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });
});

/// ----- HANDLES - SUBMITS ------- ///

/// PROFILE ///
function handleProfileSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setBtnText(submitBtn, true);
  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      editFormElement.reset();

      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      setBtnText(submitBtn, false);
    });
}
/// AVATAR ////
function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setBtnText(submitBtn, true);
  api
    .getAvatarInfo({
      avatar: editModalAvatarInput.value,
    })
    .then((data) => {
      profileAvatar.src = data.avatar;
      closeModal(avatarModal);
      avatarFormElement.reset();
    })
    .catch(console.error)
    .finally(() => {
      setBtnText(submitBtn, false);
    });
}
/// CARD ///
function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setBtnText(submitBtn, true);
  api
    .addNewCard({
      name: cardNameInput.value,
      link: cardLinkInput.value,
    })
    .then((data) => {
      const cardEl = getCardElement(data);
      cardsList.prepend(cardEl);
      cardFormElement.reset();
      disableButton(cardSubmitBtn, validationConfig);
      closeModal(cardModal);
    })
    .catch(console.error)
    .finally(() => {
      setBtnText(submitBtn, false);
    });
}

/// DELETE - CARD ///
function handleDeleteCardSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setBtnText(submitBtn, true);
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setBtnText(submitBtn, false);
    });
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;

  openModal(deleteModal);
}

function handleLike(evt, cardId) {
  const isLiked = evt.target.classList.contains("card__like-btn_liked");
  evt.target.classList.toggle("card__like-btn_liked", !isLiked);
  api
    .likeStatus(cardId, !isLiked)
    .then(() => {
      evt.target.classList.toggle("card__like-btn_liked", !isLiked);
    })
    .catch(console.error);
}

/// MODAL FUNCTIONS ///

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscClose);
}
function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscClose);
}

function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

//// Preview modal ///
function handlePreviewImage(data) {
  previewModalImageTitle.textContent = data.name;
  previewImageEl.src = data.link;
  previewImageEl.alt = data.name;
  openModal(previewModal);
}

///GET CARD ELEMENTS///

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikedBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-button");

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardElement.id = data._id;

  cardLikedBtn.addEventListener("click", (evt) => {
    handleLike(evt, data._id);
  });
  cardDeleteBtn.addEventListener("click", () => {
    handleDeleteCard(cardElement, data._id);
  });
  cardImageEl.addEventListener("click", () => handlePreviewImage(data));

  return cardElement;
}

///
profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  editModalAvatarInput.value = profileAvatar.src;
  resetValidation(editFormElement, [
    editModalNameInput,
    editModalDescriptionInput,
  ]);
  openModal(editModal);
});

editModalCloseBtn.addEventListener("click", () => {
  closeModal(editModal);
});

////
cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarModalCloseBtn.addEventListener("click", () => {
  closeModal(avatarModal);
});

/// EVENT LISTENERS
avatarFormElement.addEventListener("submit", handleAvatarSubmit);
editFormElement.addEventListener("submit", handleProfileSubmit);
cardFormElement.addEventListener("submit", handleAddCardSubmit);
deleteFormElement.addEventListener("submit", handleDeleteCardSubmit);

enableValidation(validationConfig);
