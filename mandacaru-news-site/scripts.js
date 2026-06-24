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
   CLIMA NORDESTE — Integração Dinâmica Real com API Open-Meteo
   ============================================================ */
(function initClima() {
  const tabsContainer = document.getElementById('clima-tabs');
  if (!tabsContainer) return; // Garante que só roda na página de clima

  // Coordenadas geográficas reais das 9 capitais do Nordeste
  const capitais = [
    { nome: 'Aracaju', estado: 'SE', lat: -10.95, lon: -37.07 },
    { nome: 'Salvador', estado: 'BA', lat: -12.97, lon: -38.50 },
    { nome: 'Maceió', estado: 'AL', lat: -9.67, lon: -35.74 },
    { nome: 'Recife', estado: 'PE', lat: -8.05, lon: -34.90 },
    { nome: 'João Pessoa', estado: 'PB', lat: -7.12, lon: -34.86 },
    { nome: 'Natal', estado: 'RN', lat: -5.79, lon: -35.21 },
    { nome: 'Fortaleza', estado: 'CE', lat: -3.73, lon: -38.54 },
    { nome: 'Teresina', estado: 'PI', lat: -5.09, lon: -42.80 },
    { nome: 'São Luís', estado: 'MA', lat: -2.53, lon: -44.30 }
  ];

  // Dicionário para interpretar os Weather Codes (WMO) da API
  const interpretarCodigoClima = (code) => {
    if (code === 0) return { texto: 'Céu Limpo', icon: '☀️' };
    if ([1, 2, 3].includes(code)) return { texto: 'Parcialmente Nublado', icon: '⛅' };
    if ([45, 48].includes(code)) return { texto: 'Névoa / Nevoeiro', icon: '🌫️' };
    if ([51, 53, 55, 61, 63, 65].includes(code)) return { texto: 'Chuva Contínua', icon: '🌧️' };
    if ([80, 81, 82].includes(code)) return { texto: 'Pancadas de Chuva', icon: '🌦️' };
    if ([95, 96, 99].includes(code)) return { texto: 'Tempestades trovoadas', icon: '⛈️' };
    return { texto: 'Instável', icon: '☁️' };
  };

  // Converte a string de data (YYYY-MM-DD) para o nome do dia em português
  const formatarDiaSemana = (dateStr) => {
    const partes = dateStr.split('-');
    const data = new Date(partes[0], partes[1] - 1, partes[2]);
    return data.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
  };

  // Função principal que busca os dados da API
  async function carregarDadosClima(cidade) {
    // Seletores dos elementos do DOM
    const elCidade = document.getElementById('clima-cidade');
    const elCondicao = document.getElementById('clima-condicao');
    const elTemp = document.getElementById('clima-temp');
    const elUmidade = document.getElementById('clima-umidade');
    const elVento = document.getElementById('clima-vento');
    const forecastGrid = document.getElementById('clima-forecast');

    try {
      // Montagem da URL chamando dados atuais + previsão de 7 dias
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${cidade.lat}&longitude=${cidade.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=America%2FFortaleza`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Falha na resposta da API');
      const dados = await response.json();

      // 1. Renderiza os dados atuais no Card Principal
      const climaAtual = interpretarCodigoClima(dados.current.weather_code);
      elCidade.textContent = `${cidade.nome} — ${cidade.estado}`;
      elCondicao.textContent = `${climaAtual.icon} ${climaAtual.texto}`;
      elTemp.textContent = `${Math.round(dados.current.temperature_2m)}°C`;
      elUmidade.textContent = `${dados.current.relative_humidity_2m}%`;
      elVento.textContent = `${dados.current.wind_speed_10m} km/h`;

      // 2. Renderiza a Previsão dos Próximos 7 dias
      forecastGrid.innerHTML = ''; // Limpa os cards antigos
      dados.daily.time.forEach((dia, i) => {
        const infoDia = interpretarCodigoClima(dados.daily.weather_code[i]);
        const nomeDia = formatarDiaSemana(dia);
        const max = Math.round(dados.daily.temperature_2m_max[i]);
        const min = Math.round(dados.daily.temperature_2m_min[i]);

        const card = document.createElement('div');
        card.className = 'clima-forecast-card';
        card.innerHTML = `
          <span class="forecast-day">${nomeDia}</span>
          <span class="forecast-icon">${infoDia.icon}</span>
          <div class="forecast-temps">
            <span class="forecast-max">${max}°</span>
            <span class="forecast-min">${min}°</span>
          </div>
        `;
        forecastGrid.appendChild(card);
      });

    } catch (error) {
      console.error('Erro ao buscar clima:', error);
      elCidade.textContent = 'Erro ao carregar';
      elCondicao.textContent = 'Verifique sua conexão de rede.';
    }
  }

  // Cria dinamicamente os botões de abas no topo da tela
  capitais.forEach((cidade, index) => {
    const btn = document.createElement('button');
    btn.className = 'clima-tab-btn';
    btn.textContent = `${cidade.nome} (${cidade.estado})`;
    
    // Deixa a primeira capital (Aracaju) selecionada por padrão
    if (index === 0) btn.classList.add('active');

    btn.addEventListener('click', () => {
      // Remove o estilo ativo de todos os botões e adiciona no clicado
      document.querySelectorAll('.clima-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // Carrega os dados reais da cidade clicada
      carregarDadosClima(cidade);
    });

    tabsContainer.appendChild(btn);
  });

  // Inicializa a página buscando os dados da primeira capital da lista
  carregarDadosClima(capitais[0]);
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
   TIRINHAS — Sistema de Navegação de Histórias Gráficas
   ============================================================ */
(function initTirinhas() {
  const menuContainer = document.getElementById('tirinhas-menu-lista');
  const gridContainer = document.getElementById('tirinhas-grid');
  
  if (!menuContainer || !gridContainer) return; // Só executa se os elementos existirem na página

  // Banco de dados corrigido com os nomes e extensões exatas (.jpeg) dos seus arquivos!
  const bancoTirinhas = [
    {
      id: 'sabor',
      titulo: 'Sabor do Nordeste 🍳',
      descricao: 'As deliciosas confusões e paixões pela culinária sertaneja tradicional.',
      paineis: ['carnedesol.jpeg']
    },
    {
      id: 'dicionario',
      titulo: 'Dicionário do Zé 📖',
      descricao: 'Traduzindo as expressões mais arretadas do nosso vocabulário de forma cômica.',
      paineis: ['aregiao.jpeg', 'brilho.jpeg']
    },
    {
      id: 'peleja',
      titulo: 'Peleja de Alencar ⚔️',
      descricao: 'Os causos exagerados e assombrações que o povo conta no fim de tarde.',
      paineis: ['ritmodonordeste.jpeg', 'mitos.jpeg']
    }
  ];

  // Função para renderizar os quadrinhos na tela
  function exibirSerie(serie) {
    document.getElementById('tirinhas-titulo-atual').textContent = serie.titulo;
    document.getElementById('tirinhas-descricao-atual').textContent = serie.descricao;

    gridContainer.innerHTML = ''; // Limpa os painéis anteriores
    
    serie.paineis.forEach(nomeArquivo => {
      const painelBox = document.createElement('div');
      painelBox.className = 'tirinhas-panel';
      
      const img = document.createElement('img');
      img.src = nomeArquivo; // Caminho correto do arquivo na mesma pasta
      img.alt = `Painel da tirinha ${serie.titulo}`;
      
      // Mensagem de aviso elegante caso o arquivo não mude de pasta ou suma
      img.onerror = () => {
        painelBox.innerHTML = `<span style="color: #ff6b6b; font-size: 13px; padding: 30px 10px;">[Erro ao carregar: ${nomeArquivo}]</span>`;
      };

      painelBox.appendChild(img);
      gridContainer.appendChild(painelBox); // Corrigido! Antes estava como 'box' e quebrava
    });
  }

  // Limpa o menu lateral para não duplicar botões
  menuContainer.innerHTML = '';

  // Criação dinâmica dos botões da barra lateral
  bancoTirinhas.forEach((serie, index) => {
    const botao = document.createElement('button');
    botao.className = 'tirinhas-sidebar__btn';
    botao.textContent = serie.titulo;

    if (index === 0) botao.classList.add('selected');

    botao.addEventListener('click', () => {
      document.querySelectorAll('.tirinhas-sidebar__btn').forEach(b => b.classList.remove('selected'));
      botao.classList.add('selected');
      exibirSerie(serie);
    });

    menuContainer.appendChild(botao);
  });

  // Inicializa exibindo a primeira tirinha por padrão
  exibirSerie(bancoTirinhas[0]);
})();

/* ============================================================
   AUTH (Login / Cadastro)
   ============================================================ */
(function initAuth() {
  const formLogin = document.getElementById('form-login');
  const formCadastro = document.getElementById('form-cadastro');

  // Lógica de Login
  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = formLogin.querySelector('#submit-btn');
      btn.textContent = 'Entrando...';
      btn.disabled = true;

      // Simula uma espera de carregamento e redireciona para a Home
      setTimeout(() => {
        window.location.href = 'home.html';
      }, 800);
    });
  }

  // Lógica de Cadastro
  if (formCadastro) {
    formCadastro.addEventListener('submit', (e) => {
      e.preventDefault();
      const errorMsg = document.getElementById('error-msg');
      const senha = document.getElementById('senha-input').value;
      const btn = formCadastro.querySelector('#submit-btn');

      if (senha.length < 6) {
        errorMsg.textContent = 'A senha deve ter pelo menos 6 caracteres.';
        errorMsg.style.display = 'block';
        return;
      }

      errorMsg.style.display = 'none';
      btn.textContent = 'Criando conta...';
      btn.disabled = true;

      // Simula o cadastro e redireciona para a Home
      setTimeout(() => {
        window.location.href = 'home.html';
      }, 800);
    });
  }
})();

/*Notícias */