let words = { mastered: [], learning: [], 'to-learn': [] };

function showSection(section) {
    $("#sections .section").addClass("d-none");
    $("#" + section).removeClass("d-none");
}

function addWord(section) {
    let word = $("#" + section + "-word").val().trim();
    if (word) {
        words[section].push(word);
        updateUI();
        saveData();
        $("#" + section + "-word").val("");
    }
}

function bulkAddWords(section) {
    let bulkWords = prompt("Enter words, comma separated:");
    if (bulkWords) {
        words[section] = words[section].concat(bulkWords.split(",").map(w => w.trim()));
        updateUI();
        saveData();
    }
}

function updateUI() {
    Object.keys(words).forEach(section => {
        let list = $("#" + section + "-list");
        list.empty();
        words[section].forEach(word => {
            list.append(`<li class="list-group-item">${word}</li>`);
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