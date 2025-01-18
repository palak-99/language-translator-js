const selectTag = document.querySelectorAll("select");
const fromText = document.querySelector(".from-text");
const toText = document.querySelector(".to-text");
const translateBtn = document.querySelector("button");
const exchangeIcon = document.querySelector(".exchange");
const icons = document.querySelectorAll(".row i");

// Populate language dropdowns
selectTag.forEach((tag, id) => {
    for (const country_code in countries) {
        let selected = "";
        if (id === 0 && country_code === "en-GB") {
            selected = "selected";
        } else if (id === 1 && country_code === "hi-IN") {
            selected = "selected";
        }
        let option = `<option value="${country_code}" ${selected}>${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
    }
});

// Exchange languages and text
exchangeIcon.addEventListener("click", () => {
    let tempText = fromText.value;
    let tempLang = selectTag[0].value;
    fromText.value = toText.value;
    selectTag[0].value = selectTag[1].value;
    toText.value = tempText;
    selectTag[1].value = tempLang;
});

// Translate text
translateBtn.addEventListener("click", () => {
    let text = fromText.value.trim();
    let translateFrom = selectTag[0].value;
    let translateTo = selectTag[1].value;

    if (!text) {
        alert("Please enter text to translate.");
        return;
    }

    // Use encodeURIComponent for the text
    let apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${translateFrom}|${translateTo}`;

    // Fetching API response
    fetch(apiUrl)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            if (data.responseData && data.responseData.translatedText) {
                toText.value = data.responseData.translatedText;
            } else {
                console.error("Translation failed:", data);
                alert("Translation failed. Please try again.");
            }
        })
        .catch(err => {
            console.error("Error fetching translation:", err);
            alert("An error occurred while fetching the translation.");
        });
});

// Handle icon clicks
icons.forEach(icon => {
    icon.addEventListener("click", ({ target }) => {
        if (target.classList.contains("fa-copy")) {
            const textToCopy = target.id === "from" ? fromText.value : toText.value;
            navigator.clipboard.writeText(textToCopy)
                .then(() => alert("Copied to clipboard!"))
                .catch(err => console.error("Failed to copy text:", err));
        } else {
            let utterance;
            if (target.id === 'from') {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value;
            } else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;
            }
            speechSynthesis.speak(utterance);
        }
    });
});
