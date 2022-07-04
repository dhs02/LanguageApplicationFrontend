
$('#add-sentence-modal-box-button').click(() => {
    $('#add-sentence-modal-box').css( {'display': 'block'} );
});


$('#add-character-string').on('keyup', function() {
    if ($('#add-character-string').val() !== '') {
        let input = $('#add-character-string').val();
        getWordsFromString(input);
    }
});


const testSingleWord = async () => {
    const url = 'http://localhost:9000/api/words/86';
    await fetch(url, {method: 'GET'})
        .then(response => response.json())
        .then(word => {
            const kanjiReading = word.kanjiReading;
            const hiraganaReading = word.hiraganaReading;
            const elementList = generateElementList(kanjiReading);
            // const furiganaList = generateSyllableList(elementList, hiraganaReading);

            console.log(elementList);
            // console.log(furiganaList);
            console.log(hiraganaReading);

            let output = '<div class="single-word">';
            for (let i = 0; i < elementList.length; i++) {
                if (isKanji(elementList[i])) {
                    output += `
                    <div class="single-word-kana">
                        <div class="furigana"><span>temp</span></div>
                        <div class="word-extraction"><span>${elementList[i]}</span></div>
                    </div>`;
                } else {
                    output += `
                    <div class="single-word-kanji">
                        <div class="furigana"><span></span></div>
                        <div class="word-extraction"><span>${elementList[i]}</span></div>
                    </div>`;
                }
            }
            output += '</div>';

            $('#testDiv').html(output);
            generateWidth($('#testDiv'));
        });
}

// Convert string into list of smaller elements, by separating kanji and kana
function generateElementList(str) {
    let list = [];
    let el = ''
    for (let i = 0; i < str.length; i++) {
        let thisChar = str[i];
        let nextChar = str[i+1];

        if (isKanji(thisChar)) {
            el += thisChar;
            if (nextChar && (!isKanji(nextChar))) {
                list.push(el);
                el = '';
            }
        }
        else if (isKana(thisChar)) {
            el += thisChar;
            if (nextChar) {
                if ( (isHiragana(thisChar) && !isHiragana(nextChar)) ||
                     (isKatakana(thisChar) && !isKatakana(nextChar)) ) {
                    list.push(el);
                    el = '';
                }
            }
        }
        else if (!isKanji(thisChar) && !isKana(thisChar)) {
            el += thisChar;
            if (nextChar && ((isKana(nextChar)) || (isKanji(nextChar)))) {
                list.push(el);
                el = '';
            }
        }
        if (i === str.length - 1 && el !== '') {
            list.push(el);
        }
    }
    return list;
}


function displayElements(arr) {
    let output = '<div class="single-word">';
    for (let i = 0; i < arr.length; i++) {
        if (isKanji(arr[i])) {
            output += `
            <div class="single-word-kana">
                <div class="furigana"><span>temp</span></div>
                <div class="word-extraction"><span>${arr[i]}</span></div>
            </div>`;
        } else {
            output += `
            <div class="single-word-kanji">
                <div class="furigana"><span></span></div>
                <div class="word-extraction"><span>${arr[i]}</span></div>
            </div>`;
        }
    }
    output += '</div>';
    return output;
}










// Convert list and a hiragana-string into a list of phonetic syllables

// TODO Kana generator maken.


// function generateSyllableList(arr, str) {
//     let list = [];
//     let start = '';
//     let end = '';
//     let charCount = 0;

//     for (let i = 0; i < arr.length; i++) {
//         let thisEl = arr[i];
//         let prevEl = arr[i-1];
//         let nextEl = arr[i+1];

//         console.log(thisEl);

//         if (prevEl) {
//             let lChar = '';
//             if (isHiragana(prevEl)) {
//                 lChar = prevEl.charAt(prevEl.length - 1);
//             }
//             if (isKatakana(prevEl)) {
//                 lChar = convertKana(prevEl.charAt(prevEl.length - 1));
//             }
//             start = str.indexOf(lChar, charCount - 1) + 1;
//             console.log('start: ' + start);
//         }
//         if (nextEl) {
//             let fChar = '';
//             if (isHiragana(nextEl)) {
//                 fChar = nextEl.charAt(0);
//             }
//             if (isKatakana(nextEl)) {
//                 fChar = convertKana(nextEl.charAt(0));
//             }
//             end = str.indexOf(fChar, charCount) + 1;
//             console.log('end: ' + end);
//         }

//         if (isHiragana(thisEl)) {
//             list.push(thisEl);
//             charCount += thisEl.length;
//         }
//         else if (isKatakana(thisEl)) {
//             let fChar = convertKana(thisEl.charAt(0));
//             let lChar = convertKana(thisEl.charAt(thisEl.length - 1));
//             let startPos = str.indexOf(fChar, charCount);
//             let endPos = str.indexOf(lChar, startPos + thisEl.length);
//             list.push(str.substring(startPos, endPos));
//             charCount += str.substring(startPos, endPos).length;
//         }
//         else {


//             if ( (prevEl && nextEl) && (isKana(prevEl) && isKana(nextEl)) ) {
//                 list.push(str.substring(start, end));
//                 charCount += str.substring(start, end).length;
//                 console.log(str.substring(start, end));
//             }
//             else if ( (!prevEl && nextEl) && (isKana(nextEl)) ) {
//                 list.push(str.substring(0, end));
//                 charCount += str.substring(0, end).length;
//             }
//             else if ( (prevEl && !nextEl) && (isKana(prevEl)) ) {
//                 list.push(str.substring(start));
//                 charCount += str.substring(start).length;
//             }
//             else {
//                 list.push(str);
//             }
//         }
//     }
//     // console.log(charCount);
//     return list;
// }

// Prevents div from getting as wide as furigana span
function generateWidth(el) {
    el.find('.single-word-kanji').each(function() {
        // const fSpan = $(this).find('.furigana span');
        const wSpan = $(this).find('.word-extraction span');
        $(this).width(wSpan.width());
        // if (fSpan.width() < wSpan.width()) {
        //     fSpan.width(wSpan.width());
        //     let str = fSpan.html();
        //     const spacing = (wSpan.width() - fSpan.width()) / (str.length - 1);
        //     fSpan.css( {'letter-spacing': spacing} );
        // } else if (fSpan.width() > wSpan.width()) {
        //     wSpan.width(fSpan.width());
        //     let str = wSpan.html();
        //     const spacing = (fSpan.width() - wSpan.width()) / (str.length - 1);
        //     wSpan.css( {'letter-spacing': spacing} );
        // }
    });
}