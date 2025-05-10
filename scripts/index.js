//Profile elements
const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");

const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

//Form elements - edit area
const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

/// form elements - cardmodal
const cardModal = document.querySelector("#add-card-modal");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardFormElement = cardModal.querySelector(".modal__form");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

//preview modal
const previewModal = document.querySelector("#preview-modal");
const previewModalImageTitle = previewModal.querySelector(".modal__caption");
const previewModalCloseBtn = previewModal.querySelector(
  ".modal__close-btn_type_preview"
);
const previewImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");

previewModalCloseBtn.addEventListener("click", function () {
  closeModal(previewModal);
});
////

function openModal(modal) {
  modal.classList.add("modal_opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

//Card related elements
const cardsList = document.querySelector(".cards__list");
const cardTemplate = document.querySelector("#card-template");

function handleProfileSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;
  closeModal(editModal);
}

function handleAddCardSummit(evt) {
  evt.preventDefault();
  const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };
  const cardEl = getCardElement(inputValues);
  cardsList.prepend(cardEl);
  closeModal(cardModal);
  cardFormElement.reset();
}

///GET CARD ELEMENTS///

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikedBtn = cardElement.querySelector(".card__like-btn");

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  ///liked modal btn
  cardLikedBtn.addEventListener("click", () => {
    cardLikedBtn.classList.toggle("card__like-btn_liked");
  });

  //card delete modal
  const cardDeleteBtn = cardElement.querySelector(".card__delete-button");

  cardDeleteBtn.addEventListener("click", () => {
    cardElement.remove();
    //- because weve used it before.
    //other way its to use: cardElement.null(); - wich will let the engine know that that eleent has to be clean up
  });

  ///preview loading data
  cardImageEl.addEventListener("click", () => {
    previewModalImageTitle.textContent = data.name;
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    openModal(previewModal);
  });

  ///

  return cardElement;
}

//edit modal info
profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
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

////

editFormElement.addEventListener("submit", handleProfileSubmit);
cardFormElement.addEventListener("submit", handleAddCardSummit);

initialCards.forEach((item) => {
  const cardEl = getCardElement(item);
  cardsList.append(cardEl);
});
