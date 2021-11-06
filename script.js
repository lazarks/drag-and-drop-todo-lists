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
        // d&d
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

        // create new card
        list.addEventListener("click", (event) => {
            if (event.target.classList.contains("addTaskButton")) {
                let newTitle = prompt("title: ? ", "tiiiitle");
                if (newTitle) {
                    let newTask = document.createElement("div");
                    newTask.classList.add("card");
                    newTask.draggable = true;
                    newTask.innerHTML = `
                        <div class="title">${newTitle}</div>
                        <div class="description">
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                        </div>
                        <div class="card-buttons">
                            <button class="editButton" type="button">
                                <i class="material-icons">edit</i>
                            </button>
                            <button class="deleteButton" type="button">
                               <i class="material-icons">delete</i>
                            </button>
                        </div>`;
                    list.appendChild(newTask);
                    initCardEvents();
                    save();
                    console.log(`created task: ${newTitle}, in list: ${list.querySelector("h1").innerText}`);
                } else {
                    return false;
                }
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
                let titleElement = event.target.parentNode.parentNode.querySelector(".title");
                let title = titleElement.innerText;

                let newTitle = prompt("Edit title?", title);
                if (newTitle) {
                    titleElement.innerText = newTitle;
                    console.log(`edited card: ${title}, new title: ${newTitle}`);
                }
                save();
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
