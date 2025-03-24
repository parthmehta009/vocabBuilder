// testSpec.js - Unit tests for Vocab Tracker
describe("Vocabulary Tracker Tests", function() {
    beforeEach(function() {
        localStorage.clear();
        words = { mastered: [], learning: [], 'to-learn': [] };
    });

    it("should add a word to the To-Learn list", function() {
        addWord("to-learn", "example"); // Pass word directly
        expect(words["to-learn"].length).toBe(1);
    });


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

    it("should delete a word from To-Learn list", function() {
        words["to-learn"] = ["remove-me"]; // Ensure the section exists
        deleteWord("to-learn", "remove-me");
        expect(words["to-learn"].includes("remove-me")).toBe(false);
    });

    it("should delete a word from Learning list", function() {
        words["learning"] = ["remove-learning"]; // Ensure the section exists
        deleteWord("learning", "remove-learning");
        expect(words["learning"].includes("remove-learning")).toBe(false);
    });

    it("should delete a word from Mastered list", function() {
        words["mastered"] = ["remove-mastered"]; // Ensure the section exists
        deleteWord("mastered", "remove-mastered");
        expect(words["mastered"].includes("remove-mastered")).toBe(false);
    });

});