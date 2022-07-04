// GET Requests
const loadAllKanji = async () => {
    const url = 'http://localhost:9000/api/kanji/';
    await fetch(url, {method: 'GET'})
        .then(response => response.json())
        .then(kanji => {
            let kanjiList = '<ul>';
            kanji.forEach(kanji => {
                kanjiList += `<li>${kanji.id} ${kanji.kanjiReading} ${kanji.kunyomi} ${kanji.onyomi} ${kanji.translation} ${kanji.jlptLevel} ${kanji.dateCreated} ${kanji.dateLastModified}</li>`;
            });
            kanjiList += '</ul>';
            document.querySelector('#printKanji').innerHTML = kanjiList;
        });
}

const loadSingleKanji = async () => {
    const url = 'http://localhost:9000/api/kanji/';
    const input = document.querySelector('#loadSingleKanji').value;
    await fetch(url + input, {method: 'GET'})
        .then(response => response.json())
        .then(kanji => {
            const kanjiItem = `<ul><li>${kanji.id} ${kanji.kanjiReading} ${kanji.kunyomi} ${kanji.onyomi} ${kanji.translation} ${kanji.jlptLevel} ${kanji.dateCreated} ${kanji.dateLastModified}</li></ul>`;
            document.querySelector('#printSingleKanji').innerHTML = kanjiItem;
        });
}

// POST Requests
const addKanjiToDatabase = async () => {
    const url = 'http://localhost:9000/api/kanji/';
    const kanji = {
        kanjiReading : document.querySelector('#kanjiReading2').value,
        kunyomi : [ document.querySelector('#kunyomi').value ],
        onyomi : [ document.querySelector('#onyomi').value ],
        translation : [ document.querySelector('#kanjiTranslation').value ],
        otherForms : [ document.querySelector('#kanjiOtherForms').value ],
        joyoKanji : document.querySelector('#isJoyoKanji').value,
        jlptLevel : document.querySelector('#kanjiJlptLevel').value
    };
    await fetch(url, {
        method: 'POST',
        body: JSON.stringify(kanji),
        headers: {'Content-Type': 'application/json'}
    })
    .then(response => response.json())
    .then(responseBody => {
        if (responseBody.status === 409) {
            const testDivKanji = document.querySelector('#testDivKanji');
            testDivKanji.innerHTML = responseBody.message;
            console.log(responseBody.message);
        }
    });
    loadAllKanji();
}

// DELETE Requests
const deleteSingleKanji = async () => {
    const url = "http://localhost:9000/api/kanji/";
    const input = document.querySelector('#userInputDeleteSingleKanji').value;
    await fetch(url + input, {method: 'DELETE'})
        .then(response => response.text());
    loadAllKanji();
}

// PUT Requests
const editSingleKanji = async () => {
    var url = "http://localhost:9000/api/kanji/";
    var input = document.querySelector('#userInputEditSingleKanji').value;
    const kanji = {
        kanjiReading : document.querySelector('#kanjiReading2').value,
        kunyomi : [ document.querySelector('#kunyomi').value ],
        onyomi : [ document.querySelector('#onyomi').value ],
        translation : [ document.querySelector('#kanjiTranslation').value ],
        otherForms : [ document.querySelector('#kanjiOtherForms').value ],
        joyoKanji : document.querySelector('#isJoyoKanji').value,
        jlptLevel : document.querySelector('#kanjiJlptLevel').value
    };
    await fetch(url + input, {
        method: 'PUT',
        body: JSON.stringify(kanji),
        headers: {'Content-Type': 'application/json'}
    })
    .then(response => response.json());
    loadAllKanji();
}