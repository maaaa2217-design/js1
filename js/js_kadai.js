// ==========================================
// 1. かるたのデータ（博多弁と標準語のセット）
// ==========================================
const karutaData = [
  { hakata: "なんしょっと？", hyojun: "なにしてるの？" },
  { hakata: "ちかっぱ", hyojun: "とても・すごく" },
  { hakata: "とっとーと？", hyojun: "取っているの？" },
  { hakata: "よかよ", hyojun: "いいよ" },
  { hakata: "なおす", hyojun: "片付ける" },
  { hakata: "からう", hyojun: "背負う" },
  { hakata: "しゃーしい", hyojun: "うるさい" },
  { hakata: "いっちょん", hyojun: "全然、まったく" },
  { hakata: "あーね", hyojun: "なるほどね、だよね" },
  { hakata: "はらかく", hyojun: "腹が立つ、怒る" },
  { hakata: "ぱげる", hyojun: "壊れる" },
  { hakata: "くらす", hyojun: "なぐる" }
];

// ==========================================
// 2. 問題をランダムにするための「シャッフル関数」
// ==========================================
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// ゲームが始まる直前にデータをバラバラにします
shuffle(karutaData);


// ==========================================
// 3. ゲームの進行状態を管理する変数（カウンター）
// ==========================================
let questionIndex = 0;


// ==========================================
// 4. 画面のパーツ（DOM要素）をJavaScriptに連れてくる
// ==========================================
const gameStatus = document.getElementById('game-status');
const messageBar = document.getElementById('message-bar');
const retryBtn = document.getElementById('retry-btn');
const fudas = document.querySelectorAll('.fuda');


// ==========================================
// 5. ゲームを更新する（次の問題に進む）ための関数
// ==========================================
function nextQuestion() {
  if (questionIndex < karutaData.length) {
    // 【修正ポイント】毎回最新の「#current-yomifuda」を取得して文字を書き換えます
    const currentYomifuda = document.getElementById('current-yomifuda');
    if (currentYomifuda) {
      currentYomifuda.textContent = karutaData[questionIndex].hakata;
    }
  } else {
    // 12問すべて解き終わった（ゲームクリア）時のDOM操作
    gameStatus.textContent = "全問正解！ばりすご！";
    messageBar.textContent = "ゲームをクリアしました！";
    retryBtn.classList.remove('hidden'); // リトライボタンを表示
  }
}

// 最初の1問目を画面に表示する
nextQuestion();


// ==========================================
// 6. 絵札（カード）をクリックしたときの動き
// ==========================================
fudas.forEach(fuda => {
  fuda.addEventListener('click', () => {
    
    // 全問クリアしている状態なら、カードを押しても何もさせない
    if (questionIndex >= karutaData.length) return;

    // クリックされたカードの表面に書かれている文字（標準語）を取得
    const clickedMoji = fuda.textContent;
    
    // 現在の問題の正しい答え（標準語）をデータから取得
    const seikaiMoji = karutaData[questionIndex].hyojun;

    // クリックした文字と、正解の文字が一致しているか判定
    if (clickedMoji === seikaiMoji) {
      messageBar.textContent = "⭕ 正解！";
      messageBar.style.color = "green";
      
      // クリックした絵札の文字を、標準語から「正解の博多弁」に書き換える
      fuda.textContent = karutaData[questionIndex].hakata; 
      
      // CSSの .correct クラスを追加して、カードを「明太子色」に変身
      fuda.classList.add('correct');
      
      // 問題を1つ進める
      questionIndex++;
      
      // 次の問題を画面に表示
      nextQuestion();

    } else {
      messageBar.textContent = "❌ ちがうよー！";
      messageBar.style.color = "red";
      
      // CSSの .wrong クラスを追加して、カードを一瞬赤くする
      fuda.classList.add('wrong');
      
      // 0.5秒経ったら、赤いクラス（wrong）を自動で外して元に戻す
      setTimeout(() => {
        fuda.classList.remove('wrong');
      }, 500);
    }
  });
});


// ==========================================
// 7. 「もう一度あそぶ」ボタンを押したときの動き（リセット処理）
// ==========================================
retryBtn.addEventListener('click', () => {
  // ゲームの状態を最初（0問目）に戻す
  questionIndex = 0;
  
  // もう一度データをランダムに並び替える
  shuffle(karutaData);
  
  // 【修正ポイント】画面のメインタイトルを元の「これってどういう意味？：〜」の形にリセット
  gameStatus.innerHTML = 'これってどういう意味？：<span id="current-yomifuda"></span>';
  
  // メッセージバーを元の案内に戻す
  messageBar.textContent = "絵札をえらんでね！";
  messageBar.style.color = "#666";
  
  // リトライボタン自体を、再び非表示（hidden）にする
  retryBtn.classList.add('hidden');

  // HTMLに最初に書いてあった通りの標準語の並び順リスト
  const originalTexts = [
    "なにしてるの？", "とても・すごく", "取っているの？", "いいよ",
    "片付ける", "背負う", "うるさい", "全然、まったく",
    "なるほどね、だよね", "腹が立つ、怒る", "壊れる", "なぐる"
  ];

  // 12枚のカードすべてに対してリセットをかける
  fudas.forEach((fuda, index) => {
    // 正解（correct）や不正解（wrong）のCSSクラスをすべて剥ぎ取る（元の白いカードに戻す）
    fuda.classList.remove('correct', 'wrong');
    // 博多弁に変身してしまっていたカードの文字を、元の標準語に戻す
    fuda.textContent = originalTexts[index];
  });

  // リセットがすべて完了したので、新しくシャッフルされた1問目を表示する
  nextQuestion();
});
