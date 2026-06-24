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

//#region 
const noticias = [
  {
    titulo: "Refinaria Abreu e Lima bate recorde na produção de diesel e fortalece papel de Pernambuco no setor energético nacional",
    p1: "A Refinaria Abreu e Lima (RNEST), localizada no Complexo Industrial de Suape, em Ipojuca, Pernambuco, alcançou em abril de 2026 o maior volume de produção de diesel S-10 de sua história. Foram produzidos 385 milhões de litros do combustível no mês, superando o recorde anterior, registrado em julho de 2016. O resultado reforça a importância da refinaria para o abastecimento do país e coloca Pernambuco em posição de destaque na estratégia energética da Petrobras.",
    p2: "O crescimento da produção foi impulsionado pela conclusão, em 2025, do projeto de Revisão e Ampliação (Revamp), que elevou a capacidade de processamento da refinaria para 130 mil barris de petróleo por dia. Com a modernização, a unidade passou a operar em um nível inédito de eficiência, aumentando em aproximadamente 60% a produção de diesel S-10 em relação ao mesmo período do ano anterior.",
    p3: "Segundo a Petrobras, o aumento da produção ocorre em um momento de instabilidade no mercado internacional de petróleo. O objetivo da estatal é fortalecer a capacidade de abastecimento interno e reduzir a dependência de importações de combustíveis. O diesel S-10 é o principal combustível utilizado no transporte rodoviário de cargas e também possui grande importância para o agronegócio e para diversos setores da economia brasileira.",
    p4: "Além do recorde de produção, a empresa mantém um plano de expansão para a refinaria. Estão previstos investimentos de cerca de R$ 12 bilhões destinados à conclusão do Trem 2 e à realização de melhorias no Trem 1 da unidade. Quando as obras forem concluídas, a capacidade de processamento deverá dobrar, chegando a aproximadamente 260 mil barris por dia até 2029.",
    p5: "Com essa ampliação, a Refinaria Abreu e Lima aumentará significativamente a produção de derivados como diesel S-10, gasolina, gás liquefeito de petróleo (GLP) e nafta. A expectativa é que o crescimento da produção contribua para reduzir a necessidade de importação desses combustíveis, fortalecendo a segurança energética nacional e diminuindo custos logísticos.",
    p6: "Com essa ampliação, a Refinaria Abreu e Lima aumentará significativamente a produção de derivados como diesel S-10, gasolina, gás liquefeito de petróleo (GLP) e nafta. A expectativa é que o crescimento da produção contribua para reduzir a necessidade de importação desses combustíveis, fortalecendo a segurança energética nacional e diminuindo custos logísticos.",
    p7: "Além dos impactos no abastecimento, a expansão da refinaria deve gerar empregos diretos e indiretos durante as obras e ampliar a demanda por empresas fornecedoras de equipamentos, engenharia, transporte e manutenção. O fortalecimento da atividade industrial em Suape também beneficia o comércio e diversos serviços da região, consolidando o complexo como um dos principais polos industriais do Nordeste.",
    p8: "Para a Petrobras, o desempenho da Refinaria Abreu e Lima demonstra os resultados dos investimentos realizados no parque de refino brasileiro. Com os projetos previstos para os próximos anos, a estatal espera ampliar a produção nacional de combustíveis, reduzir a dependência do mercado externo e consolidar Pernambuco como um dos principais centros de produção de derivados de petróleo do país.",
    imagem: "../assets/n1.jpg",
    tema: "politica"
  },
  {
    titulo: "Vitória conquista o pentacampeonato da Copa do Nordeste e iguala Bahia como maior campeão da competição",
    p1: "O Esporte Clube Vitória conquistou, no dia 6 de junho de 2026, o título da Copa do Nordeste ao vencer o Fortaleza por 2 a 1, no Estádio Barradão, em Salvador. Com o resultado, o clube baiano levantou a taça pela quinta vez em sua história e igualou o rival Bahia como o maior campeão da competição regional. A conquista encerrou um jejum de 16 anos sem títulos do torneio e foi celebrada por mais de 30 mil torcedores presentes no estádio.",
    p2: "A decisão foi disputada em dois jogos. Na partida de ida, realizada na Arena Castelão, em Fortaleza, o Vitória já havia conquistado uma importante vantagem ao vencer também por 2 a 1. Jogando diante de sua torcida no confronto de volta, a equipe administrou o resultado e voltou a superar o adversário, confirmando o título com autoridade e encerrando uma campanha marcada pela regularidade.",
    p3: "Durante toda a competição, o clube baiano apresentou um desempenho consistente. Depois de liderar seu grupo na primeira fase, eliminou o Ceará nas quartas de final e o ABC nas semifinais, chegando à decisão como uma das equipes mais eficientes do campeonato. A campanha consolidou o bom momento vivido pelo Vitória na temporada e reforçou o crescimento do futebol nordestino no cenário nacional.",
    p4: "A conquista também teve grande importância histórica. Com o pentacampeonato, o Vitória voltou ao topo da lista de maiores vencedores da Copa do Nordeste, agora ao lado do Bahia, ambos com cinco títulos. Logo atrás aparecem Fortaleza, Ceará e Sport, cada um com três conquistas. O equilíbrio entre os clubes demonstra a força da competição, considerada uma das mais tradicionais do futebol brasileiro.",
    p5: "Além do prestígio esportivo, o título garantiu ao Vitória uma premiação total de aproximadamente R$ 4,6 milhões ao longo da competição. Os recursos obtidos com participação, classificação para as fases eliminatórias e conquista da final representam um importante reforço financeiro para o clube, permitindo novos investimentos no elenco, na estrutura e nas categorias de base.",
    p6: "A festa tomou conta das ruas de Salvador logo após o apito final. Milhares de torcedores comemoraram o título em diversos bairros da capital baiana, com carreatas, bandeiras e fogos de artifício. Nas redes sociais, a conquista esteve entre os assuntos mais comentados do país, demonstrando a enorme mobilização causada pela competição entre os estados nordestinos.",
    p7: "O sucesso da Copa do Nordeste também reforça a importância econômica e cultural do torneio. Além de movimentar milhões de reais em direitos de transmissão, patrocínios e turismo esportivo, a competição fortalece a rivalidade regional e oferece grande visibilidade aos clubes do Nordeste. A cada edição, o campeonato atrai mais público e amplia sua relevância no calendário nacional.",
    p8: "Para o Vitória, o pentacampeonato representa mais do que uma conquista esportiva. O título simboliza o retorno do clube ao protagonismo regional após anos de reconstrução e aumenta a confiança da equipe para a sequência da temporada. Já para o futebol nordestino, a decisão entre Vitória e Fortaleza mostrou, mais uma vez, a competitividade e a força dos clubes da região, que seguem conquistando espaço entre os principais times do país.",
    imagem: "../assets/n4.jpg",
    tema: "esporte"
  },
  {
    titulo: "São João de Campina Grande deve receber mais de 3,5 milhões de visitantes e movimentar mais de R$ 800 milhões na economia",
    p1: "Campina Grande, na Paraíba, deu início à 43ª edição d'O Maior São João do Mundo, um dos eventos culturais mais tradicionais do Brasil. Realizada entre os dias 3 de junho e 5 de julho de 2026, a festa reúne milhares de artistas, comerciantes e turistas durante 33 dias consecutivos de programação. Reconhecido como um dos principais símbolos da cultura nordestina, o evento transforma a cidade em um dos maiores polos turísticos do país durante o período junino.",
    p2: "A expectativa da Prefeitura de Campina Grande é que mais de 3,5 milhões de pessoas passem pelo Parque do Povo ao longo da festa, um crescimento em relação ao ano anterior. Segundo estimativas da Secretaria de Desenvolvimento Econômico do município, o evento deverá movimentar mais de R$ 800 milhões na economia local, beneficiando hotéis, restaurantes, comerciantes, ambulantes, motoristas de aplicativo e diversos prestadores de serviços.",
    p3: "A programação deste ano conta com cerca de 120 apresentações musicais distribuídas entre o palco principal e polos culturais espalhados pela cidade. Entre os artistas confirmados estão João Gomes, Solange Almeida, Limão com Mel, Wesley Safadão, Elba Ramalho, Flávio José, Xand Avião, Nattan, Roberto Carlos, Marisa Monte e Henrique & Juliano, além de dezenas de trios de forró e grupos tradicionais que mantêm viva a identidade cultural nordestina.",
    p4: "Além dos grandes shows, o evento preserva manifestações culturais que fazem parte da história do Nordeste. Quadrilhas juninas, apresentações de repentistas, grupos de xaxado, trios de sanfona, zabumba e triângulo, além de concursos culturais, ocupam diversos espaços da cidade. A valorização dessas tradições faz do São João de Campina Grande muito mais do que um festival musical, consolidando-o como uma importante celebração do patrimônio cultural brasileiro.",
    p5: "Outro destaque é a estrutura montada no Parque do Povo, que passou por ampliações nos últimos anos e hoje está integrado ao Parque Evaldo Cruz. O espaço possui mais de 70 mil metros quadrados e capacidade para receber aproximadamente 79 mil pessoas por noite, oferecendo áreas para shows, alimentação, artesanato e atrações culturais. A organização também reforçou os esquemas de segurança, mobilidade urbana e atendimento médico para garantir maior conforto aos visitantes.",
    p6: "O impacto econômico da festa vai além de Campina Grande. Municípios vizinhos também registram aumento na ocupação hoteleira, na procura por transporte e na comercialização de produtos típicos. Artesãos, agricultores familiares e pequenos empreendedores aproveitam o período para ampliar suas vendas, fortalecendo a economia regional e gerando milhares de empregos temporários durante as festividades juninas.",
    p7: "A gastronomia nordestina também ocupa papel de destaque na programação. Barracas espalhadas pelo Parque do Povo oferecem pratos tradicionais como canjica, pamonha, milho-verde, bolo de milho, pé de moleque, carne de sol, tapioca e diversas receitas típicas da culinária regional. O artesanato local também recebe grande visibilidade, permitindo que visitantes conheçam produtos produzidos por artistas da Paraíba e de outros estados nordestinos.",
    p8: "Considerado um dos maiores eventos populares da América Latina, o São João de Campina Grande reforça, a cada edição, a importância da cultura nordestina para a identidade brasileira. Ao unir tradição, música, gastronomia, turismo e desenvolvimento econômico, a festa consolida a cidade paraibana como uma das principais referências culturais do país e demonstra a força das manifestações populares do Nordeste.",
    imagem: "../assets/n6.jpg",
    tema: "cultura"
  },
  {
    titulo: "Novo Desenrola deve beneficiar milhões de brasileiros e ampliar acesso ao crédito no Nordeste",
    p1: "O governo federal lançou, no dia 4 de maio, o Novo Desenrola Brasil, conhecido como Desenrola 2.0, segunda edição do programa de renegociação de dívidas criado para ajudar brasileiros em situação de inadimplência. A iniciativa foi anunciada pelo presidente Luiz Inácio Lula da Silva e formalizada por Medida Provisória, reunindo representantes dos ministérios da Fazenda, do Trabalho e do Planejamento durante a cerimônia de lançamento no Palácio do Planalto.",
    p2: "A principal novidade desta edição é a possibilidade de utilizar até 20% do saldo do FGTS, ou R$ 1.000 — o que for maior — para quitar dívidas bancárias em atraso. Após a autorização do trabalhador pelo aplicativo do FGTS, a Caixa Econômica Federal realiza diretamente o pagamento à instituição financeira credora, sem necessidade de saque do valor. O programa conta com um limite de R$ 8,2 bilhões em recursos do fundo para essa finalidade.",
    p3: "Podem participar trabalhadores com renda mensal de até cinco salários mínimos e dívidas contratadas até 31 de janeiro de 2026, em atraso entre 90 dias e dois anos. O programa contempla modalidades como cartão de crédito, cheque especial e empréstimos pessoais, oferecendo descontos que podem chegar a 90%, juros reduzidos e prazo de pagamento de até 48 meses.",
    p4: "Outra medida que chamou atenção foi a restrição ao acesso às plataformas de apostas esportivas. Os participantes que aderirem ao programa terão o CPF bloqueado nesses serviços durante um período de 12 meses. Segundo o governo, a medida busca evitar que pessoas beneficiadas pelo programa voltem a comprometer sua renda com apostas enquanto renegociam suas dívidas.",
    p5: "Além das famílias, o Novo Desenrola também contempla micro e pequenas empresas por meio da ampliação das condições de pagamento de linhas de crédito como Pronampe e Procred. Agricultores familiares e estudantes com contratos do Fies também poderão renegociar seus débitos, ampliando o alcance social da iniciativa em diferentes setores da economia.",
    p6: "Segundo dados do Banco Central, o comprometimento da renda das famílias brasileiras com o pagamento de dívidas atingiu um dos maiores níveis da série histórica, tornando a renegociação uma prioridade para milhões de pessoas. A expectativa do governo é reduzir a inadimplência, estimular o consumo e fortalecer a recuperação econômica do país.",
    p7: "O programa também deverá ter impacto significativo na Região Nordeste, que concentra milhões de trabalhadores aptos a participar da iniciativa. Estados como Bahia, Pernambuco, Ceará e Maranhão possuem elevado número de famílias com renda dentro dos critérios do programa e podem ser amplamente beneficiados pela possibilidade de renegociação das dívidas utilizando recursos do FGTS. A expectativa é que a medida contribua para fortalecer o comércio, ampliar o acesso ao crédito e melhorar a situação financeira de milhares de famílias nordestinas.",
    p8: "O governo afirma que o Novo Desenrola faz parte de um conjunto de políticas voltadas à recuperação da economia e à redução do endividamento da população. No Nordeste, onde grande parte da atividade econômica depende do consumo das famílias e dos pequenos negócios, a expectativa é que o programa impulsione a circulação de recursos, facilite a retomada do crédito e contribua para o desenvolvimento econômico da região.",
    imagem: "../assets/n2.jpg",
    tema: "politica"
  },
  {
    titulo: "Brasil goleia Haiti por 3 a 0, Matheus Cunha brilha na Filadélfia e seleção dorme líder do Grupo C",
    p1: "A seleção brasileira conquistou sua primeira vitória na Copa do Mundo de 2026 nesta sexta-feira, 19 de junho, ao vencer o Haiti por 3 a 0 no Lincoln Financial Field, na Filadélfia, pela segunda rodada do Grupo C. Com o resultado, o Brasil chegou a quatro pontos e assumiu a liderança da chave, superando o Marrocos no saldo de gols após os africanos também vencerem a Escócia por 1 a 0 na mesma rodada.",
    p2: "Os três gols foram marcados ainda no primeiro tempo, em uma atuação dominante que afastou as dúvidas surgidas após o empate de 1 a 1 com o Marrocos na estreia. O artilheiro da noite foi Matheus Cunha, que abriu o placar aos 23 minutos aproveitando rebote do goleiro haitiano Placide após chute de Vinícius Júnior, e ampliou aos 36, desta vez concluindo assistência do próprio Vini Jr com chute de esquerda no canto.",
    p3: "O terceiro gol saiu nos acréscimos do primeiro tempo, aos 45+3, em jogada individual de Vinícius Júnior. Após lançamento de Lucas Paquetá, o camisa 7 ganhou na corrida do zagueiro e tocou na saída do goleiro, com categoria. Foi o segundo gol de Vini Jr na Copa do Mundo, igualando o número de participações diretas que Ronaldinho Gaúcho havia tido em torneios mundiais.",
    p4: "O Haiti, que retornava a uma Copa do Mundo pela primeira vez desde 1974 — um jejum de 52 anos — mostrou organização e coragem nos primeiros minutos, chegando a causar algum desconforto na saída de bola brasileira. O técnico adversário, Sébastien Migné, tentou surpreender com pressão alta, mas a qualidade técnica da seleção rapidamente se impôs assim que os jogadores ajustaram o ritmo das trocas de passes.",
    p5: "No segundo tempo, Carlo Ancelotti optou por poupar os titulares e dar minutos a jogadores que ainda não haviam atuado no torneio. Entraram Gabriel Martinelli, Endrick, Rayan e Danilo Santos, todos estreando na Copa. O Haiti melhorou com a mudança de esquema do intervalo e forçou Alisson a realizar três boas defesas, mas sem ameaçar de fato a vitória já consolidada. Endrick chegou a fazer o quarto gol, mas a jogada foi anulada por impedimento.",
    p6: "A escalação brasileira no jogo trouxe duas novidades em relação à estreia: Matheus Cunha no lugar de Igor Thiago e Danilo na lateral direita substituindo Éder Militão, que se lesionou antes do torneio. O Brasil alinhou com Alisson; Danilo, Gabriel Magalhães, Marquinhos e Douglas Santos; Casemiro, Bruno Guimarães e Lucas Paquetá; Raphinha, Vinícius Júnior e Matheus Cunha. Raphinha saiu ainda no primeiro tempo com dores e foi substituído pelo jovem Rayan.",
    p7: "Com 68.324 torcedores presentes, grande parte vestida de verde e amarelo — reflexo da enorme comunidade brasileira na região da Filadélfia —, o clima nas arquibancadas foi de festa. O árbitro espanhol Alejandro Hernandez comandou a partida sem grandes polêmicas. Os cartões amarelos da partida foram para Arcus, Pierrot e Jean Jacques, pelo Haiti, e Douglas Santos, pelo Brasil.",
    p8: "Na próxima quarta-feira, 24 de junho, o Brasil enfrenta a Escócia no estádio de Miami, às 19h no horário de Brasília, com transmissão pela Globo, Sportv e CazéTV. Uma vitória ou empate garante a classificação antecipada às oitavas de final. O adversário nas oitavas, caso o Brasil avance como líder, seria o segundo colocado do Grupo D, ainda indefinido.",
    imagem: "../assets/n3.jpg",
    tema: "esporte"
  },
  {
    titulo: "Chico Buarque foi a Cuba pela primeira vez em 34 anos — e voltou com um documentário que pode ser histórico",
    p1: "No dia 19 de junho de 2026, data que marca simultaneamente o Dia do Cinema Brasileiro e o aniversário de 82 anos de Chico Buarque, a produtora Cinema Inflamável, do cineasta cearense Karim Aïnouz, anunciou a produção de um longa-metragem documental sobre a viagem do cantor e compositor a Cuba, ocorrida em abril do mesmo ano. Foi o primeiro retorno de Chico à ilha após 34 anos de ausência, tornando o projeto um registro histórico por razões que vão muito além da música.",
    p2: "A direção do documentário ficou a cargo de Francisco Proner, fotógrafo de 25 anos que já havia acompanhado o artista durante toda a semana em Havana, registrando cenas do cotidiano, dos ensaios e dos encontros com músicos locais. O trabalho marcará a estreia de Proner na direção de longas-metragens, e a produção executiva da Cinema Inflamável — conhecida por títulos como A Vida Invisível (2019) e Motel Destino (2024) — garante ao projeto um selo de qualidade reconhecido internacionalmente.",
    p3: "O coração do documentário é o reencontro de Chico com o cantor cubano Silvio Rodríguez, figura central da Nueva Trova e amigo do compositor brasileiro há mais de cinco décadas. A viagem aconteceu a convite do próprio Rodríguez, e os dois artistas entraram juntos em estúdio para gravar uma nova versão de um clássico do repertório cubano.",
    p4: "Além do encontro musical, a viagem registrou uma cena espontânea que viralizou nas redes sociais: enquanto passeava com a esposa pelo Malecón de Havana, Chico foi abordado por músicos de rua cubanos que o reconheceram e cantaram juntos em uma cena filmada pelo enteado Francisco.",
    p5: "A visita também teve dimensão humanitária. Acompanhado da esposa, Chico doou medicamentos ao Ministério da Saúde de Cuba, em meio a uma crise de desabastecimento que afeta a ilha, impactando aproximadamente cinco milhões de pacientes com doenças crônicas.",
    p6: "O contexto político da visita também chamou atenção. A presença de Chico em Havana foi interpretada por analistas como uma declaração política implícita, reforçando os laços de solidariedade entre artistas engajados dos dois países.",
    p7: "A produção do documentário assume, segundo a Cinema Inflamável, um caráter que vai além do biográfico. O objetivo é capturar a dimensão política e humana do encontro entre dois ícones da canção popular latino-americana que nunca abandonaram seus compromissos com a liberdade artística e a resistência cultural.",
    p8: "O documentário ainda não tem data de estreia confirmada, mas já atrai atenção de festivais nacionais e internacionais. Para o público brasileiro, o anúncio chegou num momento especial: o aniversário do artista, celebrado com a confirmação de que Chico, aos 82 anos, segue criando, viajando e se posicionando — como sempre fez.",
    imagem: "../assets/n5.jpg",
    tema: "cultura"
  },
  {
    titulo: "A revista mais lida sobre viagens no mundo escolheu o Brasil como destino do ano — e os motivos vão além do Carnaval",
    p1: "O Brasil foi eleito Destino do Ano de 2026 pela revista americana Travel + Leisure, uma das publicações de viagem mais influentes do planeta, com presença em mais de 90 países. A escolha foi publicada na edição de dezembro de 2025 e gerou grande repercussão no setor de turismo nacional e internacional.",
    p2: "A premiação marca o 11º ano em que a Travel + Leisure seleciona um Destino do Ano, lista que já incluiu nomes como Tailândia, Costa Rica e Itália. A escolha do Brasil ocorre num momento de retomada do turismo internacional após a pandemia, com crescimento expressivo da conectividade aérea entre o país e a Europa, América do Norte e Ásia.",
    p3: "A publicação destaca destinos como Itacaré, na Bahia, pelas praias preservadas; a Amazônia, por seu caráter único e preservado; e Belém do Pará, reconhecida pela cena gastronômica que ganhou projeção mundial nos últimos anos. São Paulo aparece como metrópole que rivaliza com as grandes capitais mundiais em arte, design e gastronomia.",
    p4: "O reconhecimento internacional não foi isolado. A britânica Wanderlust, em sua premiação anual, colocou o Brasil em segundo lugar na categoria Natureza e Vida Selvagem, destacando os biomas brasileiros — Amazônia, Pantanal, Cerrado e Mata Atlântica — como atrativos únicos no mundo.",
    p5: "A National Geographic também incluiu o Rio de Janeiro entre os destinos imperdíveis de 2026, mencionando a efervescência cultural da cidade para além do Carnaval. A visibilidade acumulada dessas premiações coloca o Brasil em posição rara no noticiário internacional de turismo.",
    p6: "O avanço do turismo de base comunitária é apontado pelas publicações estrangeiras como um dos diferenciais da nova imagem do Brasil. Projetos em territórios indígenas e quilombolas aproximam viajantes exigentes de uma vivência que vai além das atrações convencionais.",
    p7: "O Ministério do Turismo informou que o reconhecimento será utilizado como âncora de uma campanha de divulgação internacional prevista para o segundo semestre de 2026, com foco em mercados como Estados Unidos, Alemanha e Japão. A meta é receber 9,5 milhões de turistas estrangeiros ao longo do ano.",
    p8: "O setor privado também se movimenta, com redes hoteleiras anunciando novos empreendimentos em destinos como Trancoso, Caraíva, Serra Gaúcha e Chapada Diamantina, com foco em hospedagens integradas à natureza. O aquecimento do setor é resultado direto do aumento da visibilidade internacional.",
    imagem: "../assets/n7.jpg",
    tema: "turismo"
  },
  {
    titulo: "Julho começa e os Lençóis Maranhenses entram na melhor fase do ano — mas as vagas de hospedagem já estão desaparecendo",
    p1: "O Parque Nacional dos Lençóis Maranhenses, no Maranhão, entra agora em seu período mais esperado: julho é considerado por especialistas e guias locais o mês de equilíbrio perfeito entre lagoas cheias, sol garantido e temperatura amena. Com o fim das chuvas em junho, julho ainda encontra as lagoas em seu volume máximo, com água cristalina azul e verde entre as dunas brancas por mais de 155 mil hectares.",
    p2: "O acesso ao parque é feito a partir de três cidades-base: Barreirinhas, a mais estruturada; Santo Amaro, indicada como melhor base para quem prioriza as lagoas; e Atins, um vilarejo de pescadores com acesso de lancha pelo Rio Preguiças, com apelo especial para quem busca tranquilidade.",
    p3: "Em julho de 2024, os Lençóis Maranhenses receberam o título de Patrimônio Natural da Humanidade pela Unesco, reconhecimento que acelerou o interesse internacional pelo destino. A expectativa para 2026 é de lotação ainda mais expressiva, alimentada pela eleição do Brasil como Destino do Ano pela Travel + Leisure.",
    p4: "Toda a visitação interna ao parque é feita em veículos 4x4 com motoristas locais credenciados e guias obrigatórios. Os passeios mais tradicionais incluem o Circuito Lagoa Azul e o Circuito Lagoa Bonita, que exige a subida em uma duna íngreme, mas recompensa com uma vista panorâmica de tirar o fôlego.",
    p5: "O tempo de permanência ideal é de pelo menos uma semana, especialmente para quem quiser dividir a base entre as três cidades. O traslado de Barreirinhas a Atins é feito de voadora pelo Rio Preguiças em aproximadamente uma hora, com horários que normalmente se encerram ao meio-dia.",
    p6: "Além das lagoas, a região oferece passeios de lancha pelo Rio Preguiças com paradas em bancos de areia e no Farol Mandacaru. A gastronomia local valoriza o peixe fresco, o caranguejo e as preparações com cuxá, molho típico maranhense feito com vinagreira, camarão seco e farinha.",
    p7: "Quem planeja a viagem para agosto encontra condições igualmente favoráveis: as lagoas ainda estão cheias e o vento forte marca o início da temporada de kitesurf em Atins e Caburé, atraindo esportistas de todo o Brasil e do exterior.",
    p8: "A recomendação unânime dos especialistas é reservar a hospedagem com pelo menos 30 a 45 dias de antecedência para viagens em julho e agosto. As pousadas de Atins são as que esgotam mais rapidamente, pela oferta limitada e pela demanda crescente de turistas que buscam uma experiência mais rústica.",
    imagem: "../assets/n8.jpg",
    tema: "turismo"
  }
];
//#endregion

/* Home */
(function initHome() {
  const lista = document.getElementById('lista-noticias');
  if (!lista) return; // só roda na home

  let categoriaAtiva = 'todas';

  // Cria o HTML de um card e já salva o índice no localStorage ao clicar
  function criarCard(noticia, indice) {
    const card = document.createElement('div');
    card.className = 'home-card';
    card.innerHTML = `
      <img class="home-card__img" src="${noticia.imagem}" alt="${noticia.titulo}">
      <div class="home-card__conteudo">
        <span class="home-card__tag">${noticia.tema}</span>
        <h3 class="home-card__titulo">${noticia.titulo}</h3>
        <p class="home-card__resumo">${noticia.p1}</p>
        <a class="home-card__link" href="noticias.html">Ler mais →</a>
      </div>
    `;

    // Ao clicar em "Ler mais", salva o índice antes de trocar de página
    card.querySelector('.home-card__link').addEventListener('click', () => {
      localStorage.setItem('noticiaAtual', indice);
    });

    return card;
  }

  // Desenha os cards na tela conforme a categoria selecionada
  function renderizarCards() {
    lista.innerHTML = '';

    const filtradas = categoriaAtiva === 'todas'
      ? noticias
      : noticias.filter(n => n.tema === categoriaAtiva);

    if (filtradas.length === 0) {
      lista.innerHTML = '<p style="color:#888;margin:20px 0">Nenhuma notícia encontrada.</p>';
      return;
    }

    filtradas.forEach(noticia => {
      const indiceOriginal = noticias.indexOf(noticia);
      lista.appendChild(criarCard(noticia, indiceOriginal));
    });
  }

  // Filtro pelos botões de categoria
  document.querySelectorAll('.home-cats__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.home-cats__btn').forEach(b => b.classList.remove('ativo'));
      btn.classList.add('ativo');
      categoriaAtiva = btn.dataset.categoria;
      renderizarCards();
    });
  });

  // Botão "Ver mais" (pode expandir depois)
  const btnVerMais = document.getElementById('home-vermais');
  if (btnVerMais) {
    btnVerMais.addEventListener('click', () => {
      alert('Carregar mais notícias...');
    });
  }

  renderizarCards();
})();

/* Noticias */
(function initDetalhe() {
  const titulo = document.querySelector('.Ntitulo');
  if (!titulo) return; // só roda na página de detalhe

  // Lê o índice que foi salvo ao clicar em "Ler mais" na home
  const indice = parseInt(localStorage.getItem('noticiaAtual')) || 0;
  const noticia = noticias[indice];

  document.querySelector('.Ntitulo').textContent  = noticia.titulo;
  document.querySelector('.paragrafo1').textContent = noticia.p1;
  document.querySelector('.paragrafo2').textContent = noticia.p2;
  document.querySelector('.paragrafo3').textContent = noticia.p3;
  document.querySelector('.paragrafo4').textContent = noticia.p4;
  document.querySelector('.paragrafo5').textContent = noticia.p5;
  document.querySelector('.paragrafo6').textContent = noticia.p6;
  document.querySelector('.paragrafo7').textContent = noticia.p7;
  document.querySelector('.paragrafo8').textContent = noticia.p8;
  document.querySelector('.Nfoto').src              = noticia.imagem;
})();