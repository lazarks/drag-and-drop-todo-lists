function initCardEvents() {
    let lists = document.querySelectorAll(".list");
    lists.forEach((list) => {
        let card = list.querySelectorAll(".card");
        card.forEach((card) => addCardEvents(card));
    });
}

function addCardEvents(card) {
    card.addEventListener("dragstart", () => {
        card.classList.add("dragging");
        if (card) {
            console.log(
                `dragstart: { card: ${card.querySelector(".title").innerText} from list: ${
                    card.parentNode.querySelector("h1").innerText
                } }`
            );
        }
    });
    card.addEventListener("dragend", (e) => {
        card.classList.remove("dragging");
        console.log(
            `dragend: { card: ${card.querySelector(".title").innerText} to list: ${
                card.parentNode.querySelector("h1").innerText
            } }`
        );
        save();
    });
}

function initListEvents() {
    let lists = document.querySelectorAll(".list");
    lists.forEach((list) => {
        // drag place
        list.addEventListener("dragover", (event) => {
            event.preventDefault();
            let draggingCard = document.querySelector(".dragging");
            let cardAafterDraggingCard = getCardAfterDraggingCard(list, event.clientY);
            if (cardAafterDraggingCard) {
                list.insertBefore(draggingCard, cardAafterDraggingCard);
            } else {
                list.appendChild(draggingCard);
            }
        });

        list.addEventListener("click", (event) => {
            // create new card
            if (event.target.classList.contains("addTaskButton")) {
                addCard(list);
            }

            // delete card
            if (event.target.classList.contains("deleteButton")) {
                let button = event.target;
                console.log("deleted card: " + button.parentNode.parentNode.querySelector(".title").innerText);
                let card = button.parentNode.parentNode;
                card.remove();
                save();
            }

            // edit card
            if (event.target.classList.contains("editButton")) {
                let card = event.target.parentNode.parentNode;
                editCard(card);
            }
        });
    });
}

function getCardAfterDraggingCard(list, yDraggingCard) {
    let listCards = [...list.querySelectorAll(".card:not(.dragging)")];
    return listCards.reduce(
        (closestCard, nextCard) => {
            let nextCardRect = nextCard.getBoundingClientRect();
            let offset = yDraggingCard - nextCardRect.top - nextCardRect.height / 2;

            if (offset < 0 && offset > closestCard.offset) {
                return { offset, element: nextCard };
            } else {
                return closestCard;
            }
        },
        { offset: Number.NEGATIVE_INFINITY }
    ).element;
}

// POPUP
let popup = document.querySelector(".popup");
function togglePopup() {
    popup.classList.toggle("active");
    if (popup.classList.contains("active")) {
        popup.focus();
    } // test
}

function addCard(list) {
    togglePopup();
    ["click", "keypress"].forEach((e) => {
        popup.addEventListener(e, function createCardHandler(event) {
            if (event.target.innerText === "save" || event.key === "Enter") {
                let newTitle = popup.querySelector("#titleInput").value;
                let newDescription = popup.querySelector("#descriptionInput").value;
                let card = document.createElement("div");
                card.classList.add("card");
                card.draggable = true;
                card.innerHTML = `
            <div class="title">${newTitle}</div>
            <div class="description">${newDescription}</div>
            <div class="card-buttons">
                <button class="editButton" type="button">
                    <i class="material-icons">edit</i>
                </button>
                <button class="deleteButton" type="button">
                    <i class="material-icons">delete</i>
                </button>
            </div>`;
                list.appendChild(card);
                initCardEvents();
                console.log(`created card: ${newTitle}, in list: ${list.querySelector("h1").innerText}`);
                togglePopup();
                save();
                popup.removeEventListener(e, createCardHandler);
            }
        });
    });
}

function editCard(card) {
    togglePopup();
    ["click", "keypress"].forEach((e) => {
        popup.addEventListener(e, function editCardHandler(event) {
            if (event.target.innerText === "save" || event.key === "Enter") {
                let newTitle = popup.querySelector("#titleInput").value;
                let newDescription = popup.querySelector("#descriptionInput").value;
                card.querySelector(".title").innerText = newTitle;
                card.querySelector(".description").innerText = newDescription;
                console.log(`edited card: ${newTitle}`);
                togglePopup();
                save();
                popup.removeEventListener(e, editCardHandler);
            }
        });
    });
}

// STORAGE
// saving lists to localstorage
function save() {
    let lists = document.querySelectorAll(".list");
    lists.forEach((list) => {
        let listName = list.classList[0];
        let listHTML = list.outerHTML;
        localStorage.setItem(listName, listHTML);
    });
}

// init lists
function fillList() {
    let lists = document.querySelectorAll(".list");
    lists.forEach((list) => {
        let listName = list.classList[0];
        let storage = localStorage.getItem(listName);
        if (storage) {
            list.outerHTML = localStorage.getItem(listName);
        }
    });
    initCardEvents();
    initListEvents();
}
fillList();
