# Vocabulary Tracker application created using chat gpt

Checkout live example : https://parthmehta009.github.io/vocabBuilder/src/

## Initial Prompt :

Consider yourself expert application builder who has extensive experience building front-end application using HTML and Javascript or Javascript framework.
Create front-end application for personal use to store list of words(i.e Vocabulary building activity) one has memorized. Please find below list of detailed functionlity list
- has 3 modules or 3 core section
    1. Mastered (i.e Word list that I have mastered)
    2. Learning (i.e Word list that I'm currently learning)
    3. To-Learn (i.e All the other word which not yet explored; basically word dump)
- Dashboard view, which shows above 3 list count and way to click on open specific view
- All 3 core section should have below basic functionality
    - Add new word
    - Add words comma separated in bulk
    - Remove word
- Interaction between core section
    - To-Learn section is the first touch point where user add new words in system
        - There should be button to move word from To-Learn to Learning
    - Once Learning completed, user should be able to move same word from Learning to Mastered list
    - In summary any word move in direction: To-Learn -> Learning -> Mastered
      
Application stack:
      
Use HTML, plain javascript or jquery and bootstrap for design. Do not use any other library framework.
      
As this is personal project, don't assume there is any backend database storage.
      
Use File System API directly via browser and for that purpose if required feel free to add any js library to ease the development.
      
Assume that I have intermediate level of experience building applicaiton with HTML, javascript and jquery, bootstrap.
      
Feel free to ask any clarifying question if required but don't stop for defacto or usual way things done and continue as I can understand usual way app development works