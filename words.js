// MODAL BOX GENERAL





/* BUTTONS */






// Prevents focus on buttons inside modal box
$(document).on('mousedown', '.modal-box .modal-box-button', function(e) {
    e.preventDefault();
});

// Add-button: add input field when clicked on plus-sign
$(document).on('click', '.modal-box span.add-button', function(e) {
    $(this).parents().eq(1).append($(
        `<div class="form-element">
            <label class="form-label"></label>
            <div class="input-field-wrapper">
                <input type="text" class="text-field text-field-small" maxlength="256">
                <span class ="undo-button modal-box-button"><i class="fas fa-undo-alt"></i></span>
            </div>
            <span class="delete-button modal-box-button"><i class="fas fa-minus"></i></span>
        </div>`)
    .hide()
    .fadeIn(500));
    e.stopPropagation();
});

// Close-button: if pressed on close button, the modal box disappears and all values are reset
$(document).on('click', '.modal-box span.close-button', function(e) {
    const modalBox = $(this).parents().eq(2);
    modalBox.css(
        {'display': 'none'}
    );
    resetForm();
    e.stopPropagation();
});

// Delete-button: remove input field when clicked on minus-sign
$(document).on('click', '.modal-box span.delete-button', function(e) {
    $(this).parent().fadeOut(500, function(){
        $(this).remove();
    });
    e.stopPropagation();
});

// Undo-button: when clicked, the corresponding input field will be cleared
$(document).on('click', '.modal-box span.undo-button', function(e) {
    $(this).parent().find('input[type=text]').val('');
    e.stopPropagation();
});

// Make undo-button appear/disappear when hovering over a form element of a modal box.
$(document).on({
    mouseenter: function() {
        if (!$(this).find('input.text-field').prop('disabled')) {
            $(this).find('span.undo-button').show(250);
        }
    },
    mouseleave: function() {
        if (!$(this).find('input.text-field').is($(document.activeElement))) {
            $(this).find('span.undo-button').hide(250);
        }
    },
    focus: function() {
        $(this).find('span.undo-button').show(250);
    },
    blur: function() { 
        $(this).find('span.undo-button').hide(250); 
    }
}, '.modal-box .input-field-wrapper');




// MODAL BOX ADD WORD

// TODO 
// Part of Speech moet list worden


// Input fields
const kanjiInput = $('#add-word-kanji-reading');
const hiraganaInput = $('#add-word-hiragana-reading');
const katakanaInput = $('#add-word-katakana-reading');
const romajiInput = $('#add-word-romaji-reading');
const translationInput = $('#add-word-translation');
const otherFormsInput = $('#add-word-other-forms');

// Display Settings
$('#add-word-modal-box-button').click(() => {
    $('#add-word-modal-box').css(
        {'display': 'block'}
    );
});

// If clicked outside the modal box, the modal box disappears and all values are reset
$(window).click(e => {
    if (e.target.id == $('#add-word-modal-box').attr('id')) {
        $('#add-word-modal-box').css(
            {'display': 'none'}
        );
        resetForm();
    }
});

// ROMAJI INPUT
// Add a letter as input value
$('#romaji-button-container input.button-small').click(function() {
    const startPosition = romajiInput[0].selectionStart;
    const endPosition = romajiInput[0].selectionEnd;

    if (!romajiInput.prop('disabled') && romajiInput.is($(document.activeElement))) {
        romajiInput.val(romajiInput.val().substring(0, startPosition) + $(this).val() + romajiInput.val().substring(endPosition));
    }
    else if (!romajiInput.is($(document.activeElement))) {
        romajiInput.focus();
        romajiInput.val(romajiInput.val() + $(this).val());
    }
});


/* BUTTONS */
// SWITCH BUTTON
// Switch between lowercase and uppercase letters when clicked on switch-sign
$('.switch-button').click(function() {
    $('#romaji-button-container').find('input.button-small').each(function() {
        if ($(this).val() === $(this).val().toUpperCase())
            $(this).val($(this).val().toLowerCase())
        else
            $(this).val($(this).val().toUpperCase());
    });
});

// CHANGE BUTTON
// Turns double vowels into long vowel characters
$('.modal-box').on('click', '.change-button', function() {
    romajiInput.val(generateLongVowels(romajiInput.val()));
});

// UNDO BUTTON (EXTRA)
// If there is a check-icon, it will be hidden
// Input fields will be enabled/disabled
$(document).on({
    click: function() {
        const input = $(this).parent().find('input[type=text]');
        if (!input.prop('disabled')) {
            input.val('');
            $(this).parents().eq(1).find('.check-icon').animate({'opacity':0}, 150);
        }
        if ( (input.is(kanjiInput) && hiraganaInput.val() === '') || 
             (input.is(hiraganaInput) && kanjiInput.val() === '') ) {
            katakanaInput.prop('disabled', false);
        }
        if (input.is(katakanaInput)) {
            kanjiInput.add(hiraganaInput).prop('disabled', false);
        }
        if (hiraganaInput.val() === '' && katakanaInput.val() === '') {
            romajiInput.prop('disabled', true).val('');
        }
    }
}, '.modal-box span.undo-button');

// SUBMIT FORM
// Add a new word to the database
$('#add-word-submit-button').on('click', function() {
    addWordToDatabase();
    resetForm();
});

// Reset form after submitting
function resetForm() {
    $("#form-add-word")[0].reset();
    kanjiInput.prop('disabled', false);
    hiraganaInput.prop('disabled', false);
    katakanaInput.prop('disabled', false);
    romajiInput.prop('disabled', true);
    translationInput.children(".form-element").not(":first").remove();
    otherFormsInput.children(".form-element").not(":first").remove();
    $("#romaji-button-container").find('input.button-small').each(function() {
        $(this).val($(this).val().toLowerCase())
    });
    $(".modal-box-body").find('span.check-icon').each(function() {
        $(this).css({'opacity':0});
    });
}

// ENABLE/DISABLE INPUT FIELDS (KANJI, HIRAGANA, KATAKANA)
// Disable katakana-input when entering either kanji or hiragana
kanjiInput.add(hiraganaInput).on('keyup', function(){
    if ($(this).val() !== '') {
        katakanaInput.prop('disabled', true);
    } else { 
        katakanaInput.prop('disabled', false);
    }
});
// Enable romaji-input when entering either hiragana or katakana
hiraganaInput.add(katakanaInput).on('keyup', function() {
    if ($(this).val() !== '') {
        romajiInput.prop('disabled', false);
    } else { 
        romajiInput.prop('disabled', true);
    }
});
// Disable kanji-input and hiragana-input when entering katakana
katakanaInput.on('keyup', function() {
    if ($(this).val() !== '') {
        kanjiInput.add(hiraganaInput).prop('disabled', true); 
    } else { 
        kanjiInput.add(hiraganaInput).prop('disabled', false);
    }
});

// Automatically convert Hiragana characters to Romaji characters
// 1. Verify which input field is being used and if the characters match the Unicode values.
// 2. Check whether the subsequent character forms a compound with the first character.
// 3. Check whether the input contains a 'っ' or 'ッ', so the output can be adjusted accordingly.
hiraganaInput.add(katakanaInput).on('input', function(e) {
    let input = $(this).val();
    let output = '';
    if (($(e.target).is(hiraganaInput) && isHiragana(input)) ||
        ($(e.target).is(katakanaInput) && isKatakana(input))) {
        for (let i = 0; i < input.length; i++) {
            let syllable = input.charAt(i);
            let addition = input.charAt(i+1);
            if (addition.match(/^(ゃ|ゅ|ょ|ャ|ュ|ョ)$/) || 
                addition.match(/^(ぁ|ぃ|ぅ|ぇ|ぉ|ァ|ィ|ゥ|ェ|ォ)$/)) {
                syllable += addition;
            }
            output += convertKanaToRomaji(syllable);
            if (addition === 'ー') {
                output += output.charAt(output.length-1);
            }
            if (addition.match(/^(っ|ッ)$/)) {
                let thirdChar = input.charAt(i+2);
                if (thirdChar.match(/^(ち|ちゃ|ちゅ|ちょ|チ|チャ|チュ|チョ)$/)) {
                    output += 't';
                } else {
                    output += convertKanaToRomaji(thirdChar).charAt(0);
                }
            }
        }
    }
    romajiInput.val(output);
});

// Change the input of romajiInput to long vowels

function generateLongVowels(string) {
    string = string.split('aa').join('ā');
    string = string.split('uu').join('ū');
    string = string.split('ee').join('ē');
    string = string.split('oo').join('ō');
    string = string.split('ou').join('ō');
    return string;
}


// $('.modal-box').on('input', function() {
//     let value = romajiInput.val();
//     value = value.split('aa').join('ā');
//     value = value.split('uu').join('ū');
//     value = value.split('ee').join('ē');
//     value = value.split('oo').join('ō');
//     value = value.split('ou').join('ō');
//     romajiInput.val(value);
// });




// INPUT VALIDATOR
// Show/hide check icon if input is validated
hiraganaInput.add(katakanaInput).on('input', function(e) {
    const checkIcon = $(this).parents().eq(1).find('span.check-icon');
    if ($(e.target).is(hiraganaInput)) {
        if ($(this).val() === '' || !isHiragana($(this).val())) {
            checkIcon.animate({'opacity':0}, 150);
        }
        else {
            checkIcon.animate({'opacity':1}, 150);
        }
    }
    else if ($(e.target).is(katakanaInput)) {
        if ($(this).val() === '' || !isKatakana($(this).val()))
            checkIcon.animate({'opacity':0}, 150);
        else
            checkIcon.animate({'opacity':1}, 150);
    }
});


// Check whether a string only contains kanji characters.
function isKanji(str) {
    // return (ch >= "\u4e00" && ch <= "\u9faf") || (ch >= "\u3400" && ch <= "\u4dbf");
    for (let i = 0; i < str.length; i++) {
        if (!str.charAt(i).match(/[\u4e00-\u9faf]|[\u3400-\u4dbf]/))
            return false;
    }
    return true;
}
// Check whether a string only contains hiragana characters.
function isHiragana(str) {
    for (let i = 0; i < str.length; i++) {
        if (!str.charAt(i).match(/[\u3040-\u309f]/))
            return false;
    }
    return true;
}
// Check whether a string only contains katakana characters.
function isKatakana(str) {
    for (let i = 0; i < str.length; i++) {
        if (!str.charAt(i).match(/[\u30a0-\u30ff]/))
            return false;
    }
    return true;
}

function isKana(str) {
    return isHiragana(str) || isKatakana(str);
}


const kanaChart = [
    // Gojūon 【五十音】- Pure sounds
    ['あ', 'ア', 'a'], ['い', 'イ', 'i'], ['う', 'ウ', 'u'], ['え', 'エ', 'e'], ['お', 'オ', 'o'],
    ['か', 'カ', 'ka'], ['き', 'キ', 'ki'], ['く', 'ク', 'ku'], ['け', 'ケ', 'ke'], ['こ', 'コ', 'ko'],
    ['さ', 'サ', 'sa'], ['し', 'シ', 'shi'], ['す', 'ス', 'su'], ['せ', 'セ', 'se'], ['そ', 'ソ', 'so'],
    ['た', 'タ', 'ta'], ['ち', 'チ', 'chi'], ['つ', 'ツ', 'tsu'], ['て', 'テ', 'te'], ['と', 'ト', 'to'],
    ['な', 'ナ', 'na'], ['に', 'ニ', 'ni'], ['ぬ', 'ヌ', 'nu'], ['ね', 'ネ', 'ne'], ['の', 'ノ', 'no'],
    ['は', 'ハ', 'ha'], ['ひ', 'ヒ', 'hi'], ['ふ', 'フ', 'fu'], ['へ', 'ヘ', 'he'], ['ほ', 'ホ', 'ho'],
    ['ま', 'マ', 'ma'], ['み', 'ミ', 'mi'], ['む', 'ム', 'mu'], ['め', 'メ', 'me'], ['も', 'モ', 'mo'],
    ['や', 'ヤ', 'ya'], ['ゆ', 'ユ', 'yu'], ['よ', 'ヨ', 'yo'],
    ['ら', 'ラ', 'ra'], ['り', 'リ', 'ri'], ['る', 'ル', 'ru'], ['れ', 'レ', 're'], ['ろ', 'ロ', 'ro'],
    ['わ', 'ワ', 'wa'], ['を', 'ヲ', 'o'], ['ん', 'ン', 'n'],
    // Dakuon 【濁音】- Impure sounds
    ['が', 'ガ', 'ga'], ['ぎ', 'ギ', 'gi'], ['ぐ', 'グ', 'gu'], ['げ', 'ゲ', 'ge'], ['ご', 'ゴ', 'go'],
    ['ざ', 'ザ', 'za'], ['じ', 'ジ', 'ji'], ['ず', 'ズ', 'zu'], ['ぜ', 'ゼ', 'ze'], ['ぞ', 'ゾ', 'zo'],
    ['だ', 'ダ', 'da'], ['ぢ', 'ヂ', 'ji'], ['づ', 'ヅ', 'zu'], ['で', 'デ', 'de'], ['ど', 'ド', 'do'],
    ['ば', 'バ', 'ba'], ['び', 'ビ', 'bi'], ['ぶ', 'ブ', 'bu'], ['べ', 'ベ', 'be'], ['ぼ', 'ボ', 'bo'],
    // Handakuon 【半濁音】- Impure sounds
    ['ぱ', 'パ', 'pa'], ['ぴ', 'ピ', 'pi'], ['ぷ', 'プ', 'pu'], ['ぺ', 'ペ', 'pe'], ['ぽ', 'ポ', 'po'],
    // Yōon 【拗音】 - I-column syllables combined with ya, yu or yo
    ['きゃ', 'キャ', 'kya'], ['きゅ', 'キュ', 'kyu'], ['きょ', 'キョ', 'kyo'],
    ['しゃ', 'シャ', 'sha'], ['しゅ', 'シュ', 'shu'], ['しょ', 'ショ', 'sho'],
    ['ちゃ', 'チャ', 'cha'], ['ちゅ', 'チュ', 'chu'], ['ちょ', 'チョ', 'cho'],
    ['にゃ', 'ニャ', 'nya'], ['にゅ', 'ニュ', 'nyu'], ['にょ', 'ニョ', 'nyo'],
    ['ひゃ', 'ヒャ', 'hya'], ['ひゅ', 'ヒュ', 'hyu'], ['ひょ', 'ヒョ', 'hyo'],
    ['みゃ', 'ミャ', 'mya'], ['みゅ', 'ミュ', 'myu'], ['みょ', 'ミョ', 'myo'],
    ['りゃ', 'リャ', 'rya'], ['りゅ', 'リュ', 'ryu'], ['りょ', 'リョ', 'ryo'],
    ['ぎゃ', 'ギャ', 'gya'], ['ぎゅ', 'ギュ', 'gyu'], ['ぎょ', 'ギョ', 'gyo'],
    ['じゃ', 'ジャ', 'ja'], ['じゅ', 'ジュ', 'ju'], ['じょ', 'ジョ', 'jo'],
    ['ぢゃ', 'ヂャ', 'ja'], ['ぢゅ', 'ヂュ', 'ju'], ['ぢょ', 'ヂョ', 'jo'],
    ['びゃ', 'ビャ', 'bya'], ['びゅ', 'ビュ', 'byu'], ['びょ', 'ビョ', 'byo'],
    ['ぴゃ', 'ピャ', 'pya'], ['ぴゅ', 'ピュ', 'pyu'], ['ぴょ', 'ピョ', 'pyo'],
    // Less common vowels
    ['いぇ', 'イェ', 'ye'],
    ['うぃ', 'ウィ', 'wi'], ['うぇ', 'ウェ', 'we'], ['うぉ', 'ウォ', 'wo'],
    ['くぁ', 'クァ', 'kwa'], ['くぃ', 'クィ', 'kwi'], ['くぇ', 'クェ', 'kwe'], ['くぉ', 'クォ', 'kwo'],
    ['しぇ', 'シェ', 'she'],
    ['ちぇ', 'チェ', 'che'], 
    ['つぁ', 'ツァ', 'tsa'], ['つぃ',　'ツィ',　'tsi'], ['つぇ', 'ツェ', 'tse'], ['つぉ', 'ツォ', 'tso'],
    ['てぃ', 'ティ', 'ti'], ['てゅ', 'テュ', 'tyu'],
    ['とぅ', 'トゥ', 'tu'],
    ['ふぁ', 'ファ', 'fa'], ['ふぃ', 'フィ', 'fi'], ['ふぇ', 'フェ', 'fe'], ['ふぉ', 'フォ', 'fo'], ['ふゅ', 'フュ', 'fyu'],
    ['ぐぁ', 'グァ', 'gwa'],
    ['じぇ', 'ジェ', 'je'],
    ['でぃ', 'ディ', 'di'], ['でゅ', 'デュ', 'dyu'],
    ['どぅ', 'ドゥ', 'du'], 
    ['ゔぁ', 'ヴァ', 'va'], ['ゔぃ', 'ヴィ', 'vi'], ['ゔ', 'ヴ', 'vu'], ['ゔぇ', 'ヴぇ', 've'], ['ゔぉ', 'ヴォ', 'vo'], ['ゔゅ', 'ヴュ', 'vyu']
];

const convertKanaToRomaji = function(singleChar) {
    let outputCharacter = '';
    for (let i = 0; i < kanaChart.length; i++) {
        let hiragana = kanaChart[i][0];
        let katakana = kanaChart[i][1];
        let romaji = kanaChart[i][2];
        if (singleChar === hiragana || singleChar === katakana) {
            outputCharacter = romaji;
        }
    }
    return outputCharacter;
}

function convertKana(char) {
    if (isHiragana(char)) {
        for (let i = 0; i < kanaChart.length; i++) {
            if (char === kanaChart[i][0])
                return kanaChart[i][1];
        }
    }
    if (isKatakana(char)) {
        for (let i = 0; i < kanaChart.length; i++) {
            if (char === kanaChart[i][1])
                return kanaChart[i][0];
        }
    }
}

// Load enums
loadEnumsPartOfSpeech("#add-word-part-of-speech");
loadEnumsJlptLevel("#add-word-jlpt-level");









const adjustColumnWidth = function() {
    // Find each column.
    const col1 = $('.word-column-1 .word-element');
    const col2 = $('.word-column-2 .word-element');
    const col3 = $('.word-column-3 .word-element');
    const col4 = $('.word-column-4 .word-element');
    const col5 = $('.word-column-5 .word-element');
    // Find the maximum column-width of each column.
    const col1Width = Math.max.apply(Math, col1.map((index, el) => $(el).width()).get());
    const col2Width = Math.max.apply(Math, col2.map((index, el) => $(el).width()).get());
    const col3Width = Math.max.apply(Math, col3.map((index, el) => $(el).width()).get());
    const col4Width = Math.max.apply(Math, col4.map((index, el) => $(el).width()).get());
    const col5Width = Math.max.apply(Math, col5.map((index, el) => $(el).width()).get());
    // Apply maximum column width to all columns.
    $('.view-word-body').find('.word-row').each(() => {
        col1.width(col1Width);
        col2.width(col2Width);
        col3.width(col3Width);
        col4.width(col4Width);
        col5.width(col5Width);
    });
    // const colWidthArray = [col1Width, col2Width, col3Width, col4Width, col5Width];
    // // Apply the maximum column-width to every column inside a row.
    // $('.view-word-body').find('.word-row').each((index, wordRow) => {
    //     $(wordRow).children().find('.word-element').each((index, wordElement) => {
    //         $(wordElement).width(colWidthArray[index]);
    //     });
    // });
}

// GET REQUESTS
const loadAllWords = async () => {
    const url = 'http://localhost:9000/api/words/';
    await fetch(url, {method: 'GET'})
        .then(response => response.json())
        .then(words => {
            $('.word-rows-wrapper').children('.word-row').not(':first').remove();
            words.forEach(word => {
                const kanaReading = (word.hiraganaReading !== '') ? word.hiraganaReading : (word.katakanaReading !== '') ? word.katakanaReading : '';
                let wordTranslation = '';
                word.translation.forEach(translation => { 
                    wordTranslation += `<li><span>${translation}</span></li>`; 
                });
                $('.word-rows-wrapper').append($(`
                <div class="word-row">
                    <div class="word-column word-column-1"><div class="word-element"><span>${word.id}</span></div></div>
                    <div class="word-column word-column-2"><div class="word-element"><span>${word.kanjiReading}</span></div></div>
                    <div class="word-column word-column-3"><div class="word-element"><span>${kanaReading}</span></div></div>
                    <div class="word-column word-column-4"><div class="word-element"><span>${word.romajiReading}</span></div></div>
                    <div class="word-column word-column-5"><div class="word-element"><ul>${wordTranslation}</ul></div></div>
                </div>`));
            });
        });
        adjustColumnWidth();
}

const loadSingleWord = async () => {
    const url = 'http://localhost:9000/api/words/';
    const input = $('#loadSingleWord').val();
    await fetch(url + input, {method: 'GET'})
        .then(response => response.json())
        .then(word => {
            // if (word.status === 404) {
            //     console.log(word.message);
            // }
            const wordItem = `<ul><li>${word.id} ${word.kanjiReading} ${word.hiraganaReading} ${word.katakanaReading} ${word.romajiReading} ${word.translation} ${word.partOfSpeech} ${word.jlptLevel} ${word.dateCreated} ${word.dateLastModified}</li></ul>`;
            $('#printSingleWord').html(wordItem);
        });
}


const getWordsFromString = async (sentence) => {
    const url = 'http://localhost:9000/api/words/sentence/';
    await fetch(url + sentence, {method: 'GET'})
    .then(response => response.json())
    .then(words => {
        if (words.status !== 404) {
            let output = '';
            words.forEach(word => {
                if (word.kanjiReading !== '') {
                    output += word.kanjiReading;
                } else if (word.hiraganaReading !== '') {
                    output += word.hiraganaReading;
                } else if (word.katakanaReading !== '') {
                    output += word.katakanaReading;
                }
            });
            $("#element-selection").html(output);
        }
    });
}

const loadSingleWordWithId = async (id) => {
    const url = "http://localhost:9000/api/words/";
    await fetch(url + id, {method: "GET"})
        .then(response => response.json())
        .then(word => {
            const wordItem =`
            <div class="form-element">
                <label for="edit-word-kanji-reading">Kanji:</label>
                <input type="text" id="edit-word-kanji-reading" value="${word.kanjiReading}">
            </div>
            <div class="form-element">
                <label for="edit-word-hiragana-reading">Hiragana:</label>
                <input type="text" id="edit-word-hiragana-reading" value="${word.hiraganaReading}">
            </div>
            <div class="form-element">
                <label for="edit-word-katakana-reading">Katakana:</label>
                <input type="text" id="edit-word-katakana-reading" value="${word.katakanaReading}">
            </div>
            <div class="form-element">
                <label for="edit-word-romaji-reading">Romaji:</label>
                <input type="text" id="edit-word-romaji-reading" value="${word.romajiReading}">
            </div>
            <div class="form-element">
                <label for="edit-word-translation">Translation:</label>
                <input type="text" id="edit-word-translation" value='${word.translation}'>
            </div>
            <div class="form-element">
                <label for="edit-word-other-forms">Other forms:</label>
                <input type="text" id="edit-word-other-forms" value='${word.otherForms}'>
            </div>
            <div class="form-element">
                <label for="edit-word-part-of-speech">Part of speech:</label>
                <select id="edit-word-part-of-speech">
                    <option value="${word.partOfSpeech}" selected disabled hidden>${word.partOfSpeech}</option>
                </select>
            </div>
            <div class="form-element">
            <label for="edit-word-jlpt-level">JLPT Level:</label>
                <select id="edit-word-jlpt-level">
                    <option value="${word.jlptLevel}" selected disabled hidden>${word.jlptLevel}</option> 
                </select>
            </div>
            <br>
            <button onclick="editSingleWord(${word.id})">Edit Word with this ID</button>`
            document.querySelector("#edit-word-form").innerHTML = wordItem;
        });
        loadEnumsPartOfSpeech("#edit-word-part-of-speech");
        loadEnumsJlptLevel("#edit-word-jlpt-level");
}

// POST Requests
const addWordToDatabase = async () => {
    const url = 'http://localhost:9000/api/words/';
    const word = {
        kanjiReading : $('#add-word-kanji-reading').val(),
        hiraganaReading : $('#add-word-hiragana-reading').val(),
        katakanaReading : $('#add-word-katakana-reading').val(),
        romajiReading : $('#add-word-romaji-reading').val(),
        translation : [],
        otherForms : [],
        partOfSpeech : $('#add-word-part-of-speech').val(),
        jlptLevel : $('#add-word-jlpt-level').val()
    };
    $('#add-word-translation').find('input').each(function() {
        if (this.value !== '') {
            word.translation.push(this.value);
        }
    });
    $('#add-word-other-forms').find('input').each(function() {
        if (this.value !== '') {
            word.otherForms.push(this.value);
        }
    });

    await fetch(url, {
        method: 'POST',
        body: JSON.stringify(word),
        headers: {'Content-Type': 'application/json'}
    })
    .then(response => response.json())
    .then(responseBody => {
        const consoleOutput = $('#add-word-console-output');
        if (responseBody.status === 409)
            consoleOutput.html(`<span class="red">${responseBody.message}</span>`);
        else
            consoleOutput.html(`<span class="green">Word succesfully added to database</span>`);
    })
    loadAllWords();
}

// DELETE Requests
const deleteSingleWord = async () => {
    const url = 'http://localhost:9000/api/words/';
    const input = $('#userInputDeleteSingleWord').val();
    await fetch(url + input, {method: 'DELETE'})
        .then(response => response.text());
    loadAllWords();
}

// PUT Requests
const editSingleWord = async (id) => {
    const url = 'http://localhost:9000/api/words/';
    // const input = document.querySelector('#userInputEditSingleWord').value;
    const word = {
        kanjiReading : document.querySelector("#edit-word-kanji-reading").value,
        hiraganaReading : document.querySelector("#edit-word-hiragana-reading").value,
        katakanaReading : document.querySelector("#edit-word-katakana-reading").value,
        romajiReading : document.querySelector("#edit-word-romaji-reading").value,
        translation : [ document.querySelector("#edit-word-translation").value ],
        otherForms : [ document.querySelector("#edit-word-other-forms").value ],
        partOfSpeech : document.querySelector("#edit-word-part-of-speech").value,
        jlptLevel : document.querySelector("#edit-word-jlpt-level").value
    };
    await fetch(url + id, {
        method: "PUT",
        body: JSON.stringify(word),
        headers: {"Content-Type": "application/json"}
    })
    .then(response => response.text());
    loadAllWords();
}

function loadEnumsPartOfSpeech(selectElement) {
    const partsOfSpeech = {
        ADVERB : 'Adverb', 
        CONJUNCTION : 'Conjunction', 
        COUNTER : 'Counter',
        I_ADJECTIVE : 'I-Adjective',
        INTERJECTION : 'Interjection',
        NA_ADJECTIVE : 'Na-Adjective',
        NOUN : 'Noun', 
        PARTICLE : 'Particle',
        PRONOUN : 'Pronoun',
        TEMPORAL_NOUN : 'Temporal Noun',
        VERB : 'Verb'
    };
    const select = document.querySelector(selectElement);
    for(index in partsOfSpeech) {
        select.options[select.options.length] = new Option(partsOfSpeech[index], index);
    }
}

function loadEnumsJlptLevel(selectElement) {
    const jlptLevel = {
        N1 : 'JLPT N1',
        N2 : 'JLPT N2',
        N3 : 'JLPT N3',
        N4 : 'JLPT N4',
        N5 : 'JLPT N5'
    };
    const select = document.querySelector(selectElement);
    for(index in jlptLevel) {
        select.options[select.options.length] = new Option(jlptLevel[index], index);
    }
}