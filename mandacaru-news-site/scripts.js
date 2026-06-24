/* ============================================================
   scripts.js — Mandacarú News · JS unificado
   ============================================================ */

/* ============================================================
   HOME
   ============================================================ */
(function initHome() {
  const btnVerMais = document.getElementById('home-vermais');
  if (!btnVerMais) return;

  btnVerMais.addEventListener('click', () => {
    alert('Carregar mais notícias...');
  });
})();

/* ============================================================
   CLIMA
   ============================================================ */
(function initClima() {
  const tabsContainer = document.getElementById('clima-tabs');
  if (!tabsContainer) return;

  const capitais = [
    { nome: 'São Luís',    estado: 'MA', lat: -2.53,  lon: -44.30 },
    { nome: 'Teresina',    estado: 'PI', lat: -5.09,  lon: -42.80 },
    { nome: 'Fortaleza',   estado: 'CE', lat: -3.73,  lon: -38.52 },
    { nome: 'Natal',       estado: 'RN', lat: -5.79,  lon: -35.21 },
    { nome: 'João Pessoa', estado: 'PB', lat: -7.11,  lon: -34.86 },
    { nome: 'Recife',      estado: 'PE', lat: -8.05,  lon: -34.88 },
    { nome: 'Maceió',      estado: 'AL', lat: -9.66,  lon: -35.73 },
    { nome: 'Aracaju',     estado: 'SE', lat: -10.91, lon: -37.07 },
    { nome: 'Salvador',    estado: 'BA', lat: -12.97, lon: -38.50 },
  ];

  capitais.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'clima-tab';
    btn.textContent = `${c.nome} (${c.estado})`;
    btn.addEventListener('click', () => carregarClima(c));
    tabsContainer.appendChild(btn);
  });

  async function carregarClima(cidade) {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${cidade.lat}&longitude=${cidade.lon}` +
      `&current=temperature_2m,relative_humidity_2m,wind_speed_10m` +
      `&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

    const res   = await fetch(url);
    const dados = await res.json();

    document.getElementById('clima-cidade').textContent =
      `${cidade.nome} - ${cidade.estado}`;
    document.getElementById('clima-temp').textContent =
      Math.round(dados.current.temperature_2m) + '°C';
    document.getElementById('clima-umidade').textContent =
      dados.current.relative_humidity_2m;
    document.getElementById('clima-vento').textContent =
      dados.current.wind_speed_10m;

    const forecast = document.getElementById('clima-forecast');
    forecast.innerHTML = '';

    dados.daily.time.forEach((dia, i) => {
      const card = document.createElement('div');
      card.className = 'clima-forecast__dia';
      card.innerHTML = `
        <strong>${dia}</strong><br>
        Máx: ${Math.round(dados.daily.temperature_2m_max[i])}°<br>
        Mín: ${Math.round(dados.daily.temperature_2m_min[i])}°
      `;
      forecast.appendChild(card);
    });
  }

  carregarClima(capitais[0]);
})();

/* ============================================================
   CULTURA
   ============================================================ */
(function initCultura() {
  if (!document.querySelector('.pg-cultura')) return;
  console.log('Página de cultura carregada com sucesso!');
})();

/* ============================================================
   PERFIL
   ============================================================ */
(function initPerfil() {
  const saveBtn = document.getElementById('perfil-saveBtn');
  if (!saveBtn) return;

  saveBtn.addEventListener('click', () => {
    alert('Alterações salvas!');
  });
})();

/* ============================================================
   TIRINHAS
   ============================================================ */
(function initTirinhas() {
  const btns = document.querySelectorAll('.tirinhas-sidebar__btn');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      alert(btn.textContent);
    });
  });
})();
