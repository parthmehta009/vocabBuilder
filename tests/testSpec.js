// testSpec.js - Unit tests for Vocab Tracker
describe("Vocabulary Tracker Tests", function() {
    beforeEach(function() {
        localStorage.clear();
        words = { mastered: [], learning: [], 'to-learn': [] };
    });

    // ✅ Test for adding a single word
    it("should add a word to the To-Learn list", function() {
        $("body").append('<input type="text" id="new-word">'); // Ensure input exists
        $("#new-word").val("example");
        addNewWord();
        expect(words["to-learn"].includes("example")).toBe(true);
        $("#new-word").remove(); // Cleanup
    });

    // ✅ Test for bulk word addition
    it("should add multiple words from bulk input", function() {
        $("body").append('<textarea id="bulk-words"></textarea>');
        $("#bulk-words").val("apple, banana, cherry ");
        addBulkWords();
        expect(words["to-learn"]).toEqual(["apple", "banana", "cherry"]);
        $("#bulk-words").remove();
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
    it("should hide Add Word and Bulk views when switching to a section", function() {
        // Ensure elements exist in test DOM
        $("body").append('<div id="add-word-view"></div>');
        $("body").append('<div id="bulk-add-view"></div>');
        $("body").append('<div id="sections"><div id="to-learn"></div></div>');

        showSection("to-learn");

        expect($("#add-word-view").hasClass("d-none")).toBe(true);
        expect($("#bulk-add-view").hasClass("d-none")).toBe(true);

        // Cleanup
        $("#add-word-view").remove();
        $("#bulk-add-view").remove();
        $("#sections").remove();
    });


    it("should show Add Word view and hide Bulk view when clicking Add Word", function() {
        // Ensure both views exist in the test environment
        $("body").append('<div id="add-word-view" class="d-none"></div>');
        $("body").append('<div id="bulk-add-view"></div>');

        showAddWordView();

        expect($("#add-word-view").hasClass("d-none")).toBe(false); // Should be visible
        expect($("#bulk-add-view").hasClass("d-none")).toBe(true);  // Should be hidden

        // Cleanup test DOM
        $("#add-word-view").remove();
        $("#bulk-add-view").remove();
    });


    it("should show Bulk Add view and hide Add Word view when clicking Add Bulk", function() {
        // Ensure both views exist in the test environment
        $("body").append('<div id="add-word-view" class="d-none"></div>');
        $("body").append('<div id="bulk-add-view" class="d-none"></div>');

        showBulkAddView();

        expect($("#bulk-add-view").hasClass("d-none")).toBe(false); // Should be visible
        expect($("#add-word-view").hasClass("d-none")).toBe(true);  // Should be hidden

        // Cleanup test DOM
        $("#add-word-view").remove();
        $("#bulk-add-view").remove();
    });

});