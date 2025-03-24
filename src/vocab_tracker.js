let words = { mastered: [], learning: [], 'to-learn': [] };

function showSection(section) {
    $("#sections .section").addClass("d-none"); // Hide all sections
    $("#" + section).removeClass("d-none"); // Show selected section
}

function showAddWordView() {
    $("#sections .section").addClass("d-none"); // Hide all sections
    $("#add-word-view").removeClass("d-none");  // Show Add Word view
}

function showBulkAddView() {
    $("#sections .section").addClass("d-none"); // Hide all sections
    $("#bulk-add-view").removeClass("d-none");  // Show Bulk Add view
}

function addNewWord() {
    let word = $("#new-word").val().trim();

    if (!word) return; // Ignore empty input

    // Check if the word exists in any list
    let exists = Object.values(words).some(list => list.includes(word));
    if (exists) {
        showSection("to-learn");
        return; // Do not add if already exists
    }

    words["to-learn"].push(word);
    updateUI();
    saveData();
    $("#new-word").val("");

    // Navigate to To-Learn view after adding
    showSection("to-learn");
}

function addBulkWords() {
    let inputText = $("#bulk-words").val().trim();
    if (!inputText) return; // Ignore empty input

    let wordList = inputText.split(",").map(word => word.trim()).filter(word => word !== "");

    // Remove words that already exist in any list
    let newWords = wordList.filter(word =>
        !Object.values(words).some(list => list.includes(word))
    );

    if (newWords.length > 0) {
        words["to-learn"].push(...newWords);
        updateUI();
        saveData();
    }

    $("#bulk-words").val("");

    // Navigate to To-Learn view after adding
    showSection("to-learn");
}

function deleteWord(section, word) {
    if (!words[section]) return; // Ensure the section exists before filtering
    words[section] = words[section].filter(w => w !== word);
    updateUI();
    saveData();
}

function bulkAddWords(section) {
    let bulkWords = prompt("Enter words, comma separated:");
    if (bulkWords) {
        words[section] = words[section].concat(bulkWords.split(",").map(w => w.trim()));
        updateUI();
        saveData();
    }
}

function moveWord(word, fromSection, toSection) {
    words[fromSection] = words[fromSection].filter(w => w !== word);
    words[toSection].push(word);
    updateUI();
    saveData();
}

function updateUI() {
    Object.keys(words).forEach(section => {
        let list = $("#" + section + "-list");
        list.empty();
        words[section].forEach(word => {
            let moveButton = "";
            if (section === "to-learn") {
                moveButton = `<button class='btn btn-sm btn-warning float-end' onclick='moveWord("${word}", "to-learn", "learning")'>Move to Learning</button>`;
            } else if (section === "learning") {
                moveButton = `<button class='btn btn-sm btn-success float-end' onclick='moveWord("${word}", "learning", "mastered")'>Move to Mastered</button>`;
            }
            let deleteButton = `<button class='btn btn-sm btn-danger float-end me-2' onclick='deleteWord("${section}", "${word}")'>🗑️</button>`;
            list.append(`<li class="list-group-item d-flex justify-content-between">${word} <span>${deleteButton} ${moveButton}</span></li>`);
        });
        $("#" + section + "-count").text(words[section].length);
    });
}

function saveData() {
    localStorage.setItem("vocabData", JSON.stringify(words));
}

function loadData() {
    let data = localStorage.getItem("vocabData");
    if (data) {
        words = JSON.parse(data);
        updateUI();
    }
}

function exportData() {
    const blob = new Blob([JSON.stringify(words, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "vocab_data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function importData() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = event => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            words = JSON.parse(e.target.result);
            updateUI();
            saveData();
        };
        reader.readAsText(file);
    };
    input.click();
}

$(document).ready(() => {
    loadData();
});