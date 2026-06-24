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
   CULTURA — Sistema Unificado e Dinâmico
   ============================================================ */
(function initCultura() {
  const tabsContainer = document.getElementById('cultura-tabs');
  const gridContainer = document.getElementById('cultura-grid');
  const secaoTitulo = document.getElementById('cultura-secao-titulo');

  if (!tabsContainer || !gridContainer) return;

  // Todo o conteúdo dos 4 arquivos antigos centralizado aqui:
  const baseCultura = [
  {
    id: 'culinaria',
    label: 'Culinária 🥘',
    tituloSecao: 'Pratos Tradicionais',
    itens: [
      {
        titulo: 'Baixão de Dois',
        img: 'https://acdn-us.mitiendanube.com/stores/007/330/170/products/baiao_03-32b480966524036baa17756352777376-480-0.webp',
        desc: 'Mistura tradicional de arroz e feijão-de-corda cozidos juntos, enriquecida com queijo coalho, pedaços de carne de sol, coentro fresco e um fio generoso de manteiga de garrafa.'
      },
      {
        titulo: 'Acarajé',
        img: 'https://www.shutterstock.com/shutterstock/videos/1025245001/thumb/1.jpg?ip=x480',
        desc: 'Bolinho artesanal de feijão-fradinho e cebola, frito no azeite de dendê fervente. Servido tradicionalmente com vatapá, caruru, camarão seco e aquela pimenta marcante da região.'
      },
      {
        titulo: 'Carne de Sol',
        img: 'https://charcutaria.org/wp-content/uploads/2022/03/carne-de-sol.jpg',
        desc: 'Carne bovina levemente salgada e curada ao vento, servida dourada na chapa com manteiga de garrafa e acompanhada de macaxeira cozida macia ou frita bem crocante.'
      },
      {
        titulo: 'Cartola',
        img: 'https://s2-g1.glbimg.com/NJXQDuEsEa65Frc6BebCGwmXbXY=/0x0:4896x3264/1008x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2019/e/g/NEchEHRvmIGvUeqmEfow/cartola-alex-10-.jpg',
        desc: 'Sobremesa clássica de banana-da-terra frita na manteiga, coberta com uma camada generosa de queijo coalho derretido e finalizada com uma mistura polvilhada de açúcar e canela.'
      },
      {
        titulo: 'Azeite de Dendê',
        img: 'https://storage.googleapis.com/imagens_videos_gou_cooking_prod/production/mesas/2020/02/2c3c93ab-3a-feira-farofa-de-dende%CC%82-tm-tabuleiro-da-baiana-carlos-ribeiro-6620-alta-1-scaled.jpg',
        desc: 'Óleo vibrante extraído da palmeira dendezeiro. Com sua cor vermelho-alaranjada e sabor intenso, é a alma indispensável de moquecas, vatapás e do tradicional acarajé baiano.'
      },
      {
        titulo: 'Feijão-de-Corda',
        img: 'https://tudodelicious.com/wp-content/uploads/2026/03/Feijao-de-corda-500x500.png',
        desc: 'Grão de subsistência super resistente ao clima semiárido. Com cozimento rápido e caldo leve, é a base perfeita para o baião de dois, arrumadinho e saladas regionais.'
      },
      {
        titulo: 'Manteiga de Garrafa',
        img: 'https://cdn0.umcomo.com.br/pt/posts/6/1/8/como_fazer_manteiga_de_garrafa_26816_600.jpg',
        desc: 'Gordura pura obtida do cozimento do creme de leite bovino. Com aroma amendoado inconfundível, é usada para finalizar carnes, fritar macaxeira e regar o cuscuz quentinho.'
      },
      {
        titulo: 'Mandioca',
        img: 'https://www.guiacampos.com/wp-content/uploads/2023/04/ambientes-cozinha-como-cozinhar-mandioca-na-panela-eletrica-1.jpg',
        desc: 'Raiz nativa essencial da culinária local. Sua farinha artesanal acompanha todas as refeições e sua goma pura é o ingrediente único usado para preparar a tradicional tapioca.'
      },
      {
        titulo: 'Queijo Coalho',
        img: 'https://files.agro20.com.br/uploads/2020/06/Queijo-coalho-2-1.jpg',
        desc: 'Queijo típico do Nordeste, famoso por ser assado na brasa ou na chapa. Possui textura firme e sabor suave, sendo presença garantida em praias, feiras e festas juninas.'
      }
    ]
  },
  {
    id: 'danca',
    label: 'Dança 💃',
    tituloSecao: 'Grandes Festividades e Ritmos',
    itens: [
      {
        titulo: 'São João (Festejos Juninos)',
        img: 'https://www.assai.com.br/sites/default/files/blog/shutterstock_1954331056.jpg',
        desc: 'A maior celebração da cultura nordestina. Cidades como Caruaru e Campina Grande transformam-se em palcos gigantescos com muita fogueira, quadrilhas e comida típica.'
      },
      {
        titulo: 'Carnaval de Olinda e Recife',
        img: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Pal%C3%A1cio_dos_Governadores_-_Olinda.jpg',
        desc: 'O carnaval de rua mais democrático do país, arrastando multidões pelas ladeiras históricas ao som do frevo e sob o comando dos icônicos Bonecos Gigantes.'
      },
      {
        titulo: 'Bumba Meu Boi',
        img: 'https://t3.ftcdn.net/jpg/05/17/24/58/360_F_517245844_620dAWJHhhGg7S945d1bfAdFDHvxgspX.jpg',
        desc: 'Patrimônio cultural que brilha forte no Maranhão, misturando teatro, fé, música e dança para contar a clássica lenda da ressurreição do boi.'
      },
      {
        titulo: 'Festa de Iemanjá',
        img: 'https://www.bahia.ws/wp-content/uploads/2013/01/Festa-de-Iemanja-no-Rio-Vermelho-1.jpg',
        desc: 'Uma das maiores manifestações religiosas públicas da Bahia, onde o mar do Rio Vermelho se enche de barcos, flores e oferendas à Rainha do Mar no dia 2 de fevereiro.'
      },
      {
        titulo: 'Frevo',
        img: 'https://cdn.assets-casacor.tec.br/file/casacor-images-news/2026/02/frevo-dancers-olinda-pernambuco-brazil-gn8y8359.webp',
        desc: 'Ritmo frenético e dança acrobática patrimônio da humanidade. Mistura passos de capoeira com a famosa sombrinha colorida que guia os foliões.'
      },
      {
        titulo: 'Forró (Xote e Baião)',
        img: 'https://jcce.com.br/wp-content/uploads/2021/12/unnamed-25.jpg',
        desc: 'A batida oficial do arrasta-pé. Embalado pelo trio clássico de sanfona, zabumba e triângulo, é o ritmo que dita o compasso do Nordeste o ano inteiro.'
      },
      {
        titulo: 'Maracatu',
        img: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Maracatu_Rural_-_Recife%2C_Pernambuco%2C_Brazil.jpg',
        desc: 'Cortejo de forte herança africana que impressiona pela beleza e peso dos tambores. Destaca-se o Maracatu Nação e o Maracatu Rural com seus Caboclos de Lança.'
      },
      {
        titulo: 'Quadrilha Junina',
        img: 'https://radiosampaio.com.br/wp-content/uploads/2024/06/Quadrilha-junina.jpg',
        desc: 'A evolução coreografada das antigas danças de salão francesas, hoje transformada em espetáculos gigantescos cheios de cores, teatro e sincronia perfeita.'
      },
      {
        titulo: 'Coco de Roda',
        img: 'https://ne9.com.br/wp-content/uploads/2025/07/Coco-de-Roda-em-Maceio.-Foto_-Micael-Oliveira_Ascom-Fmac.webp',
        desc: 'Manifestação cultural que une música, dança e poesia popular. Os participantes formam uma roda e acompanham o ritmo marcado por tambores, palmas e sapateados.'
      }
    ]
  },
  {
    id: 'costumes',
    label: 'Costumes 🪗',
    tituloSecao: 'Tradições do Povo',
    itens: [
      {
        titulo: 'Literatura de Cordel',
        img: 'https://t3.ftcdn.net/jpg/04/86/09/36/360_F_486093678_V6kzfvcABnAtmBRYrQyo8p0MBHkMwcqw.jpg',
        desc: 'Histórias contadas em versos rimados, impressas e penduradas em cordas (cordéis). É uma das maiores expressões da poesia e do humor popular nordestino.'
      },
      {
        titulo: 'Artesanato em Barro',
        img: 'https://thumbs.dreamstime.com/b/artesanato-tradicional-do-nordeste-brasileiro-s%C3%A3o-paulo-brasil-nov-bonecas-de-barro-personagens-folcl%C3%B3ricas-feitas-por-artes%C3%A3os-162880888.jpg',
        desc: 'A arte que ganha vida pelas mãos de artesãos que moldam o cotidiano, figuras típicas e retirantes. Uma tradição imortalizada pelo legado do mestre Vitalino em Caruaru.'
      },
      {
        titulo: 'Rendas de Bilro',
        img: 'https://3ad77b72.delivery.rocketcdn.me/wp-content/uploads/2015/09/renda-de-bilro.jpg',
        desc: 'Um trabalho paciente e minucioso feito por rendeiras que, cruzando bilros de madeira sobre uma almofada, criam tecidos e rendas que são verdadeiras obras de arte.'
      },
      {
        titulo: 'Romarias e Fé',
        img: 'https://rsborgbr.s3.amazonaws.com/rede/81-romaria-da-familia-salesiana-rede-salesiana-brasil-rsb-capa.webp',
        desc: 'A forte religiosidade popular que move multidões em caminhadas de fé e devoção para centros de peregrinação, como Juazeiro do Norte (CE) e Canindé (CE).'
      },
      {
        titulo: 'Chapéu de Couro',
        img: 'https://tokdehistoria.com.br/wp-content/uploads/2016/06/dsc_4533.jpg',
        desc: 'Mais do que uma proteção contra o sol forte do sertão, o chapéu de couro é o maior símbolo de resistência, orgulho e identidade do povo nordestino.'
      },
      {
        titulo: 'O Hábito da Rede',
        img: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhWqUg3gB1ZpRnntiOKGT021YXuj_-RD1b8RqLiRkMpBGhf0WrkUfgSWgv4Hw2TNyCu8PpxRPTC0JAdPyH4jeyCu3EIcBOc_Zk1chG9uAW5whrGHzOIscbyrnjgJj01SYI2XLNcBSZCt0g/s1600/Rede-cores.jpg',
        desc: 'Herdado dos povos indígenas, o costume de armar a rede na varanda ou na sala é sinônimo de descanso, hospitalidade e o refúgio perfeito para o calor.'
      },
      {
        titulo: 'Carracas do São Francisco',
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSqi2kurdZWbznaI8aPYjQrHHDwv4i2n5V3A&s',
        desc: 'Esculturas de madeira com feições místicas colocadas na proa dos barcos para espantar os maus espíritos e proteger os navegantes do Velho Chico.'
      },
      {
        titulo: 'Traje do Vaqueiro',
        img: 'https://i.pinimg.com/736x/2c/8a/97/2c8a97003f59f5ef5e16f0e885c96ebe.jpg',
        desc: 'A armadura de couro legítimo (gibão, perneira e peitoral) usada para proteger o corpo do vaqueiro na lida com o gado em meio aos espinhos da caatinga.'
      },
      {
        titulo: 'Xilogravura',
        img: 'https://midias.correiobraziliense.com.br/_midias/jpg/2021/09/25/cd_2609_2213_l_23_cor_g-6882427.jpg',
        desc: 'Arte de gravar imagens em madeira para impressão. Tornou-se símbolo da cultura nordestina por ilustrar folhetos de cordel com cenas do sertão, personagens populares e lendas regionais.'
      }
    ]
  },
  {
    id: 'girias',
    label: 'Gírias 🗣️',
    tituloSecao: 'Expressões Populares',
    itens: [
      {
        titulo: 'Arretado',
        img: null,
        desc: 'Uma das palavras mais versáteis e icônicas do Nordeste. Pode significar algo que é muito bom, excelente, fantástico, ou também descrever alguém que está com muita raiva, invocado ou valente.'
      },
      {
        titulo: 'Oxente / Oxe',
        img: null,
        desc: 'A maior e mais famosa interjeição nordestina. Usada de forma natural para expressar praticamente qualquer reação instantânea: surpresa, espanto, dúvida, admiração, estranheza ou até indignação no início ou fim de uma frase.'
      },
      {
        titulo: 'Vixe',
        img: null,
        desc: 'Uma carinhosa e histórica abreviação de "Vigem Maria". É a gíria oficial e universal para demonstrar espanto imediato, grande preocupação, choque ou quando acontece algo totalmente inesperado e impactante no cotidiano.'
      },
      {
        titulo: 'Canhenga / Mofino',
        img: null,
        desc: 'Termos antigos e muito expressivos usados para descrever o estado de espírito de alguém que está meio jururu, triste, cabisbaixo, sem energia ou amuado pelos cantos, geralmente por desânimo ou uma leve indisposição.'
      },
      {
        titulo: 'Amarrado',
        img: null,
        desc: 'Um termo curioso com duplo sentido regional. Serve tanto para indicar que alguém está extremamente focado e com muita pressa para resolver um negócio, quanto para descrever uma pessoa que é muito ciumenta ou apegada.'
      },
      {
        titulo: 'Pirangueiro',
        img: null,
        desc: 'O termo perfeito e bem-humorado para se referir àquela pessoa que é "mão de vaca", pão-dura, que economiza até o último centavo possível e odeia gastar dinheiro com qualquer coisa, mesmo quando necessário.'
      },
      {
        titulo: 'Mermão',
        img: null,
        desc: 'Uma fusão clássica da expressão "meu irmão". Usada no cotidiano urbano de várias capitais nordestinas para chamar a atenção de um amigo, iniciar uma conversa informal de forma calorosa ou dar ênfase a uma explicação.'
      },
      {
        titulo: 'Besta Fera',
        img: null,
        desc: 'Expressão folclórica e enérgica usada para falar de alguém que está completamente furioso, descontrolado ou agindo de forma muito brava. Também tem uma forte raiz em lendas e histórias populares contadas pelo sertão.'
      },
      {
        titulo: 'Cabra da Peste',
        img: null,
        desc: 'Expressão usada para definir uma pessoa valente, resistente e determinada. É um dos maiores elogios do vocabulário nordestino, representando coragem diante das dificuldades.'
      }
    ]
  }
];

  function renderCategory(categoriaId) {
    const categoria = baseCultura.find(c => c.id === categoriaId);
    if (!categoria) return;

    secaoTitulo.textContent = categoria.tituloSecao;
    gridContainer.innerHTML = ''; // Limpa os cards anteriores

    categoria.itens.forEach(item => {
      const card = document.createElement('div');
      // Adiciona a classe 'no-img' se o item não possuir imagem (como no caso das gírias)
      card.className = `cultura-card ${!item.img ? 'no-img' : ''}`;
      
      let imgHTML = '';
      if (item.img) {
        imgHTML = `<img src="${item.img}" alt="${item.titulo}" class="cultura-card__img" onerror="this.style.display='none'">`;
      }

      card.innerHTML = `
        ${imgHTML}
        <div class="cultura-card__body">
          <h3>${item.titulo}</h3>
          <p>${item.desc}</p>
        </div>
      `;
      gridContainer.appendChild(card);
    });
  }

  // Gera os botões de navegação
  baseCultura.forEach((cat, index) => {
    const btn = document.createElement('button');
    btn.className = 'cultura-tab-btn';
    btn.textContent = cat.label;
    
    if (index === 0) btn.classList.add('active');

    btn.addEventListener('click', () => {
      document.querySelectorAll('.cultura-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCategory(cat.id);
    });

    tabsContainer.appendChild(btn);
  });

  // Carrega a aba "Culinária" por padrão assim que a página abre
  renderCategory(baseCultura[0].id);
})();

/* ============================================================
   PERFIL
   ============================================================ */
  const saveBtn = document.getElementById("perfil-saveBtn");

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {

      const dados = {
        nome: document.querySelector('input[value="Daniele Silva"]')?.value,
        usuario: document.querySelector('input[value="DaniSilva"]')?.value,
        email: document.querySelector('input[value="daniele@gmail.com"]')?.value
      };

      localStorage.setItem("perfilMandacaru", JSON.stringify(dados));

      alert("Alterações salvas com sucesso!");
    });
  }

  /* ==========================
     HOME - VER MAIS
     ========================== */

  const btnVerMais = document.getElementById("home-vermais");

  if (btnVerMais) {
    btnVerMais.addEventListener("click", () => {
      alert("Carregando mais notícias...");
    });
  }

  /* ==========================
     MENU ATIVO AUTOMÁTICO
     ========================== */

  const paginaAtual = window.location.pathname
    .split("/")
    .pop()
    .toLowerCase();

  const links = document.querySelectorAll(".header__nav a");

  links.forEach(link => {
    const href = link.getAttribute("href");

    if (href === paginaAtual) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

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
      paineis: ['aregiao.jpeg', 'ritmodonordeste.jpeg']
    },
    {
      id: 'peleja',
      titulo: 'Peleja de Alencar ⚔️',
      descricao: 'Os causos exagerados e assombrações que o povo conta no fim de tarde.',
      paineis: ['brilho.jpeg', 'mitos.jpeg']
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