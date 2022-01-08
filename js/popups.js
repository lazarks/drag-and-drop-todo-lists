// POPUP
let popup = document.querySelector(".popup");
let titleInput = popup.querySelector("#titleInput");
let descriptionInput = popup.querySelector("#descriptionInput");
let titleErrors = popup.querySelector(".titleErrors");

// save on `enter`, close on `escape` or x-button on top right
popup.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        popup.querySelector("#save").click();
    }
    if (e.key == "Escape") {
        popup.querySelector("#cancel").click();
    }
});
popup.addEventListener("mousedown", (e) => {
    console.log(e);
    if (e.target.getAttribute("id") == "close" || e.target.innerText == "close") {
        popup.querySelector("#cancel").click();
    }
    if (!popup.querySelector(".popup-form").contains(e.target)) {
        popup.querySelector("#cancel").click();
    }
});

// show
function togglePopup() {
    popup.classList.toggle("active");
    if (popup.classList.contains("active")) {
        // focus on first input field
        titleInput.focus();
    }
    console.log("popup toggle");
}

function addCard(list) {
    // clear input fields
    titleInput.value = "";
    descriptionInput.value = "";
    togglePopup();

    popup.addEventListener("click", function createCardHandler(event) {
        if (event.target.getAttribute("id") == "save" || event.target.innerText == "save") {
            let error = checkTitle(titleInput.value);
            if (error.length > 0) {
                titleErrors.innerText = error;
                titleInput.focus();

                console.log("Title not valid: " + error);
            } else {
                // create card element
                let card = document.createElement("div");
                card.classList.add("card");
                card.draggable = true;
                card.innerHTML = `
                <div class="title">${titleInput.value}</div>
                <div class="description">${descriptionInput.value}</div>
                <div class="card-buttons">
                    <button class="editButton" type="button">
                        <i class="material-icons">edit</i>
                    </button>
                    <button class="deleteButton" type="button">
                        <i class="material-icons">delete</i>
                    </button>
                </div>`;
                // add card to it's list
                list.appendChild(card);
                initCardEvents();
                togglePopup();

                console.log(`created card: ${titleInput.value}, in list: ${list.querySelector("h1").innerText}`);
                popup.removeEventListener("click", createCardHandler);

                save();
            }
        } else if (event.target.getAttribute("id") == "cancel" || event.target.innerText == "cancel") {
            togglePopup();
            popup.querySelector(".titleErrors").innerText = "";
            popup.removeEventListener("click", createCardHandler); // prevent step skipping
        }
    });
}

function editCard(card) {
    titleInput.value = card.querySelector(".title").innerText;
    descriptionInput.value = card.querySelector(".description").innerText;
    togglePopup();

    popup.addEventListener("click", function editCardHandler(event) {
        if (event.target.getAttribute("id") == "save" || event.target.innerText == "save") {
            let error = checkTitle(titleInput.value);
            if (error.length > 0) {
                titleErrors.innerText = error;
                titleErrors.focus();

                console.log("Title not valid: " + error);
            } else {
                // input fields
                let newTitle = popup.querySelector("#titleInput").value;
                let newDescription = popup.querySelector("#descriptionInput").value;
                // change card data
                card.querySelector(".title").innerText = newTitle;
                card.querySelector(".description").innerText = newDescription;

                initCardEvents(); // test if needed
                togglePopup();

                console.log(`edited card: ${newTitle}`);
                popup.removeEventListener("click", editCardHandler);

                save();
            }
        } else if (event.target.getAttribute("id") == "cancel" || event.target.innerText == "cancel") {
            togglePopup();
            titleErrors.innerText = "";
            popup.removeEventListener("click", editCardHandler); // prevent step skipping
        }
    });
}

function checkTitle(title) {
    let errorMessage = "";
    if (title == null || title === "") {
        errorMessage = "Title is required!";
    } else if (title.length < 3) {
        errorMessage = "Title must have at least 3 characters!";
    }
    return errorMessage;
}
