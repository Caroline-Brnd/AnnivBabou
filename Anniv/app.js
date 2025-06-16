(() => {
  'use strict';

  const targetWord = 'MONTGOLFIÈRE';

  const semanticWords = {
    "MONTGOLFIÈRE": 100,
    "BALLON": 98,
    "VOLER": 96,
    "AIR": 94,
    "CIEL": 92,
    "ALTITUDE": 90,
    "NACELLE": 88,
    "PANIER": 86,
    "BRÛLEUR": 84,
    "GAZ": 82,
    "CHALEUR": 80,
    "FLAMME": 78,
    "ENVELOPPE": 76,
    "TISSU": 74,
    "COLORÉ": 72,
    "VOYAGE": 70,
    "AVENTURE": 68,
    "PAYSAGE": 66,
    "PANORAMA": 64,
    "HORIZON": 62,
    "LIBERTÉ": 60,
    "RÊVE": 58,
    "ROMANTIQUE": 56,
    "FESTIVAL": 54,
    "SPECTACLE": 52,
    "TRANSPORT": 50,
    "PILOTE": 48,
    "PASSAGER": 46,
    "SÉCURITÉ": 44,
    "VENT": 42,
    "MÉTÉO": 40,
    "NUAGE": 38,
    "SOLEIL": 36,
    "MATIN": 34,
    "LEVER": 32,
    "COUCHER": 30,
    "PHOTO": 28,
    "SOUVENIR": 26,
    "CADEAU": 24,
    "ANNIVERSAIRE": 22,
    "FÊTE": 20,
    "VOITURE": 18,
    "TRAIN": 16,
    "BATEAU": 14,
    "AVION": 31,
    "MAISON": 10,
    "TRAVAIL": 8,
    "ÉCOLE": 6,
    "ORDINATEUR": 4,
    "TÉLÉPHONE": 2,
    "PROBLÈME": 1,
    "DELTAPLANE": 35,
    "PARACHUTE": 33,
  };

  const hints = [
    "C’est une expérience qui te fera prendre de la hauteur…",
    "Aventure douce et silencieuse",
    "Tu pourra admirer des paysages à couper le souffle",
    "OHHH c'est bon tu as eu déjà beaucoup d'indices !"
  ];

  // Elements
  const wordInput = document.getElementById('wordInput');
  const submitBtn = document.getElementById('submitBtn');
  const hintBtn = document.getElementById('hintBtn');
  const resetBtn = document.getElementById('resetBtn');
  const hintBox = document.getElementById('hintBox');
  const attemptsList = document.getElementById('attemptsList');
  const attemptForm = document.getElementById('attemptForm');

  // State
  let attempts = [];
  let hintIndex = -1;

  // Utilities
  function colorByScore(score) {
    if (score >= 90) return 'score-green';
    if (score >= 70) return 'score-yellow';
    if (score >= 40) return 'score-orange';
    return 'score-red';
  }

  function renderAttempts() {
    if (attempts.length === 0) {
      attemptsList.innerHTML = '<p style="text-align:center; color:#94a3b8; font-weight:600;">Aucune tentative pour le moment. Commence à taper un mot !</p>';
      return;
    }
    // Sort descending by score
    attempts.sort((a, b) => b.score - a.score);
    // Add ranking badges for top 3
    const attemptItems = attempts.map((attempt, i) => {
      const rank = i + 1;
      const colorClass = colorByScore(attempt.score);
      let rankBadge = '';
      if (rank === 1) rankBadge = ' 🏆';
      else if (rank === 2) rankBadge = ' ⭐';
      else if (rank === 3) rankBadge = ' ✨';
      return `
        <div class="attempt-item ${colorClass}" tabindex="0" aria-label="Mot ${attempt.word} avec un score de ${attempt.score} et rang ${rank}">
          <span>${attempt.word.toUpperCase()}${rankBadge}</span>
          <span>${attempt.score} pts</span>
        </div>
      `;
    }).join('');
    attemptsList.innerHTML = attemptItems;
  }

  function enableButtons() {
    submitBtn.disabled = !wordInput.value.trim();
    hintBtn.disabled = (hintIndex >= hints.length - 1);
  }

  // Submit a word guess instantly showing score
  function submitWord(word) {
    const normalized = word.toUpperCase().trim();
    if (!normalized) return;
    if (attempts.some(a => a.word === normalized)) return;

    const score = semanticWords[normalized] !== undefined ? semanticWords[normalized] : (Math.floor(Math.random() * 20) + 1);
    attempts.push({ word: normalized, score });
    renderAttempts();

    wordInput.value = '';
    enableButtons();

    if (normalized === targetWord) {
      // Save attempts count in sessionStorage for victory page
      sessionStorage.setItem('cemantixAttemptsCount', attempts.length.toString());
      // Redirect to victory page
      window.location.href = 'victory.html';
    }
  }

  // Show next hint
  function showNextHint() {
    if (hintIndex < hints.length - 1) {
      hintIndex++;
      hintBox.textContent = 'Indice : ' + hints[hintIndex];
      hintBox.classList.remove('hidden');
      enableButtons();
    }
  }

  // Reset game state
  function resetGame() {
    attempts = [];
    hintIndex = -1;
    hintBox.classList.add('hidden');
    hintBox.textContent = '';
    wordInput.value = '';
    renderAttempts();
    enableButtons();
  }

  // Event listeners
  attemptForm.addEventListener('submit', e => {
    e.preventDefault();
    submitWord(wordInput.value);
  });

  wordInput.addEventListener('input', enableButtons);
  hintBtn.addEventListener('click', showNextHint);
  resetBtn.addEventListener('click', resetGame);

  // Initialization
  resetGame();

})();