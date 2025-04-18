// testSpec.js - Unit tests for Vocab Tracker
describe("Vocabulary Tracker Tests", function() {
    beforeEach(function() {
        localStorage.clear();
        words = { mastered: [], learning: [], 'to-learn': [] };
        $("body").append(`
            <div id="sections">
                <div id="to-learn" class="section"></div>
                <div id="learning" class="section"></div>
                <div id="mastered" class="section"></div>
                <div id="add-word-view" class="section d-none"></div>
                <div id="bulk-add-view" class="section d-none"></div>
            </div>
        `);
    });

    // ✅ Test for adding a single word
    it("should add a single word to the To-Learn list if it does not exist", function() {
        $("body").append('<input type="text" id="new-word">');
        $("body").append('<div id="to-learn" class="section d-none"></div>');

        $("#new-word").val("uniqueWord");
        addNewWord();

        expect(words["to-learn"].includes("uniqueWord")).toBe(true);
        expect($("#to-learn").hasClass("d-none")).toBe(false); // Should navigate to "To-Learn"

        $("#new-word").remove();
        $("#to-learn").remove();
    });

    it("should not add a duplicate word but navigate to To-Learn", function() {
        words["to-learn"].push("duplicateWord"); // Word already exists

        $("body").append('<input type="text" id="new-word">');
        $("body").append('<div id="to-learn" class="section d-none"></div>');

        $("#new-word").val("duplicateWord");
        addNewWord();

        // Word count should still be 1 (not added again)
        expect(words["to-learn"].filter(w => w === "duplicateWord").length).toBe(1);

        // Should navigate to "To-Learn"
        expect($("#to-learn").hasClass("d-none")).toBe(false);

        $("#new-word").remove();
        $("#to-learn").remove();
    });

    // ✅ Test for bulk word addition
    it("should add multiple words from bulk input", function() {
        $("body").append('<textarea id="bulk-words"></textarea>');
        $("#bulk-words").val("apple, banana, cherry ");
        addBulkWords();
        expect(words["to-learn"]).toEqual(["apple", "banana", "cherry"]);
        $("#bulk-words").remove();
    });

    it("should add only unique words from bulk input", function() {
        words["to-learn"].push("apple"); // Already exists

        $("body").append('<textarea id="bulk-words"></textarea>');
        $("body").append('<div id="to-learn" class="section d-none"></div>');

        $("#bulk-words").val("apple, banana, cherry, apple"); // "apple" is a duplicate
        addBulkWords();

        expect(words["to-learn"]).toEqual(["apple", "banana", "cherry"]);
        expect($("#to-learn").hasClass("d-none")).toBe(false); // Should navigate to "To-Learn"

        $("#bulk-words").remove();
        $("#to-learn").remove();
    });

    // ✅ Test for trimming spaces in bulk words
    it("should trim spaces from bulk words", function() {
        $("body").append('<textarea id="bulk-words"></textarea>');
        $("#bulk-words").val("  dog ,  cat, fish  ");
        addBulkWords();
        expect(words["to-learn"]).toEqual(["dog", "cat", "fish"]);
        $("#bulk-words").remove();
    });

    // ✅ Test for moving words between sections
    it("should move a word from To-Learn to Learning", function() {
        words["to-learn"].push("testword");
        moveWord("testword", "to-learn", "learning");
        expect(words["to-learn"].includes("testword")).toBe(false);
        expect(words["learning"].includes("testword")).toBe(true);
    });

    it("should move a word from Learning to Mastered", function() {
        words["learning"].push("progress");
        moveWord("progress", "learning", "mastered");
        expect(words["learning"].includes("progress")).toBe(false);
        expect(words["mastered"].includes("progress")).toBe(true);
    });

    // ✅ Test for deleting words
    it("should delete a word from To-Learn list", function() {
        words["to-learn"] = ["remove-me"];
        deleteWord("to-learn", "remove-me");
        expect(words["to-learn"].includes("remove-me")).toBe(false);
    });

    it("should delete a word from Learning list", function() {
        words["learning"] = ["remove-learning"];
        deleteWord("learning", "remove-learning");
        expect(words["learning"].includes("remove-learning")).toBe(false);
    });

    it("should delete a word from Mastered list", function() {
        words["mastered"] = ["remove-mastered"];
        deleteWord("mastered", "remove-mastered");
        expect(words["mastered"].includes("remove-mastered")).toBe(false);
    });

    // ✅ Test for localStorage save/load
    it("should save data to localStorage and retrieve it", function() {
        words["learning"].push("word1");
        saveData();
        let storedData = JSON.parse(localStorage.getItem("vocabData"));
        expect(storedData.learning.includes("word1")).toBe(true);
    });

    it("should load data correctly from localStorage", function() {
        localStorage.setItem("vocabData", JSON.stringify({ mastered: ["expert"], learning: [], 'to-learn': [] }));
        loadData();
        expect(words.mastered.includes("expert")).toBe(true);
    });

    // ✅ UI behavior tests for showing/hiding views
    it("should show Add Word view and hide other sections", function() {
        showAddWordView();
        expect($("#add-word-view").hasClass("d-none")).toBe(false);
        expect($("#to-learn").hasClass("d-none")).toBe(true);
        expect($("#bulk-add-view").hasClass("d-none")).toBe(true);
    });

    it("should show Bulk Add view and hide other sections", function() {
        showBulkAddView();
        expect($("#bulk-add-view").hasClass("d-none")).toBe(false);
        expect($("#add-word-view").hasClass("d-none")).toBe(true);
        expect($("#learning").hasClass("d-none")).toBe(true);
    });

    it("should hide Add Word and Bulk views when switching to a section", function() {
        showSection("to-learn");
        expect($("#add-word-view").hasClass("d-none")).toBe(true);
        expect($("#bulk-add-view").hasClass("d-none")).toBe(true);
    });

    afterEach(function() {
        $("#sections").remove();
    });

});

describe("Pagination Tests", function() {
    beforeEach(function() {
        localStorage.clear();
        words = { mastered: [], learning: [], "to-learn": [] };
        for (let i = 1; i <= 15; i++) {
            words["to-learn"].push("word" + i);
        }
        $("body").append('<div id="to-learn-list"></div>');
        $("body").append('<div id="to-learn-pagination"></div>');
        currentPage["to-learn"] = 1;
    });

    it("should display only 10 words per page", function() {
        updateUI();
        expect($("#to-learn-list .list-group-item").length).toBe(10);
    });

    it("should change page when Next button is clicked", function() {
        updateUI();
        changePage("to-learn", 1);
        expect(currentPage["to-learn"]).toBe(2);
    });

    it("should not go past the last page", function() {
        updateUI();
        changePage("to-learn", 1);
        changePage("to-learn", 1);
        changePage("to-learn", 1);
        expect(currentPage["to-learn"]).toBe(2); // Should not exceed total pages
    });

    afterEach(function() {
        $("#to-learn-list").remove();
        $("#to-learn-pagination").remove();
    });
});
