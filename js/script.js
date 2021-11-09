function initCardEvents() {
    let lists = document.querySelectorAll(".list");
    lists.forEach((list) => {
        let card = list.querySelectorAll(".card");
        card.forEach((card) => addCardEvents(card));
    });
}

function addCardEvents(card) {
    card.addEventListener("dragstart", (e) => {
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
        // card manipulation
        list.addEventListener("click", (event) => {
            // create new card
            if (event.target.classList.contains("addTaskButton")) {
                addCard(list);
            }
            // delete card
            else if (event.target.classList.contains("deleteButton")) {
                let button = event.target;
                console.log("deleted card: " + button.parentNode.parentNode.querySelector(".title").innerText);
                let card = button.parentNode.parentNode;
                card.remove();
                save();
            }
            // edit card
            else if (event.target.classList.contains("editButton")) {
                let card = event.target.parentNode.parentNode;
                editCard(card);
            }
        });

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
// immediately invoked function expression
(function fillList() {
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
})();
