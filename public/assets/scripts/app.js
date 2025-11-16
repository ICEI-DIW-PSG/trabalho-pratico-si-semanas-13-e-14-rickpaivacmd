/* ============================================
    CONFIG
============================================ */
const API_CORRIDAS = "http://localhost:3000/corridas";

/* ============================================
    HELPERS
============================================ */
function byId(id) {
  return document.getElementById(id);
}

function getParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

/* ============================================
    DADOS FIXOS — NOTÍCIAS (ORIGINAIS DO SEU SITE)
============================================ */
const dados = {
  "noticias": [
    {
      "id": 1,
      "titulo": "Leclerc otimista em Cingapura",
      "descricao": "Mesmo com TL2 confuso, Ferrari projeta bom ritmo no fim de semana.",
      "conteudo": "Apesar de um TL2 difícil em Cingapura, Leclerc e a equipe demonstraram confiança...",
      "categoria": "Corridas",
      "autor": "Equipe F1 Insights",
      "data": "2025-03-30",
      "piloto": "Charles Leclerc",
      "equipe": "Ferrari",
      "local": "Circuito de Marina Bay, Singapura",
      "destaque": true,
      "imagem_principal": "images/Card1 Leclerc.avif",
      "fonte": "https://www.formula1.com/en/latest.html",
      "fotos_relacionadas": []
    },
    {
      "id": 2,
      "titulo": "Hamilton e o apoio pelo Roscoe",
      "descricao": "Piloto agradece mensagens após a perda do seu cachorro.",
      "conteudo": "Hamilton comentou o apoio ‘esmagador’ de fãs...",
      "categoria": "Paddock",
      "autor": "Equipe F1 Insights",
      "data": "2025-03-28",
      "piloto": "Lewis Hamilton",
      "equipe": "Mercedes-AMG F1",
      "local": "Redes Sociais",
      "destaque": true,
      "imagem_principal": "images/Roscoe.avif",
      "fonte": "https://www.formula1.com/en/latest.html",
      "fotos_relacionadas": []
    },
    {
      "id": 3,
      "titulo": "Wheatley elogia Bortoleto",
      "descricao": "Diretor define brasileiro como 'o verdadeiro negócio'.",
      "conteudo": "Bortoleto chama atenção pelo ritmo consistente...",
      "categoria": "Pilotos",
      "autor": "Equipe F1 Insights",
      "data": "2025-03-27",
      "piloto": "Gabriel Bortoleto",
      "equipe": "Kick Sauber",
      "local": "Base na Suíça",
      "destaque": true,
      "imagem_principal": "images/Bortoleto.avif",
      "fonte": "https://www.formula1.com/en/latest.html",
      "fotos_relacionadas": []
    }
  ]
};

/* ============================================
    CARROSSEL
============================================ */
function renderCarousel() {
  const wrap = byId("carousel-inner");
  if (!wrap) return;

  const destaques = dados.noticias.filter(n => n.destaque);

  wrap.innerHTML = destaques.map((item, index) => `
    <div class="carousel-item ${index === 0 ? "active" : ""}" data-id="${item.id}">
      <img src="${item.imagem_principal}" class="carousel-img">
      <div class="carousel-caption">
        <h4>${item.titulo}</h4>
        <p>${item.descricao}</p>
        <a href="./detalhes.html?id=${item.id}" class="btn ghost btn-small">Ver detalhes</a>
      </div>
    </div>
  `).join("");
}

function initCarousel() {
  const carousel = byId("carousel");
  if (!carousel) return;

  const inner = carousel.querySelector(".carousel-inner");
  const items = inner.querySelectorAll(".carousel-item");
  const prev = carousel.querySelector(".prev");
  const next = carousel.querySelector(".next");

  let index = 0;

  function update() {
    inner.style.transform = `translateX(-${index * 100}%)`;
  }

  prev.onclick = () => {
    index = index > 0 ? index - 1 : items.length - 1;
    update();
  };

  next.onclick = () => {
    index = index < items.length - 1 ? index + 1 : 0;
    update();
  };
}

/* ============================================
    LISTA DE NOTÍCIAS
============================================ */
function renderCategorias() {
  const wrap = byId("categorias");
  if (!wrap) return;

  const categorias = ["Todas", ...new Set(dados.noticias.map(n => n.categoria))];

  wrap.innerHTML = categorias.map(cat => `
    <li><button class="category-link" data-cat="${cat}">${cat}</button></li>
  `).join("");

  wrap.onclick = (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    renderHome(btn.dataset.cat);
  };
}

function renderHome(filtro = "Todas") {
  const wrap = byId("cards");
  if (!wrap) return;

  const lista = filtro === "Todas"
    ? dados.noticias
    : dados.noticias.filter(n => n.categoria === filtro);

  wrap.innerHTML = lista.map(n => `
    <article class="card item">
      <img class="thumb" src="${n.imagem_principal}">
      <div class="pad">
        <h4>${n.titulo}</h4>
        <p>${n.descricao}</p>
        <a class="link" href="./detalhes.html?id=${n.id}">Ver detalhes</a>
      </div>
    </article>
  `).join("");
}

/* ============================================
    DETALHES DE NOTÍCIA
============================================ */
function renderDetalhes() {
  const alvo = byId("detalhes-gerais");
  if (!alvo) return;

  const id = Number(getParam("id"));
  const item = dados.noticias.find(n => n.id === id);

  if (!item) {
    alvo.innerHTML = "<p>Notícia não encontrada.</p>";
    return;
  }

  alvo.innerHTML = `
    <div class="detalhe-item-wrap">
      <img class="thumb-detalhe" src="${item.imagem_principal}">
      <div class="detalhe-info">
        <h2>${item.titulo}</h2>
        <p>${item.descricao}</p>
        <p>${item.conteudo}</p>
      </div>
    </div>
  `;
}

/* ============================================
    CORRIDAS — LISTAR
============================================ */
async function carregarCorridas() {
  const wrap = byId("lista-corridas");
  if (!wrap) return;

  const res = await fetch(API_CORRIDAS);
  const corridas = await res.json();

  wrap.innerHTML = corridas.map(c => `
    <article class="card item">
      <img class="thumb" src="${c.imagem}">
      <div class="pad">
        <h4>${c.nome}</h4>
        <p><strong>${c.data}</strong></p>
        <p>${c.circuito} — ${c.pais}</p>

        <a class="link" href="./detalhes_corrida.html?id=${c.id}">Ver detalhes</a>

        <button onclick="excluirCorrida(${c.id})" class="btn ghost btn-small" style="margin-top:8px">
          Excluir
        </button>
      </div>
    </article>
  `).join("");
}

/* ============================================
    EXCLUIR CORRIDA
============================================ */
async function excluirCorrida(id) {
  await fetch(`${API_CORRIDAS}/${id}`, { method: "DELETE" });
  carregarCorridas();
}

/* ============================================
    DETALHES DE CORRIDA
============================================ */
async function renderDetalhesCorrida() {
  const alvo = byId("detalhes-corrida");
  if (!alvo) return;

  const id = getParam("id");

  const res = await fetch(`${API_CORRIDAS}/${id}`);
  const c = await res.json();

  alvo.innerHTML = `
    <div class="detalhe-item-wrap">
      <img class="thumb-detalhe" src="${c.imagem}">
      <div class="detalhe-info">
        <h2>${c.nome}</h2>
        <p><strong>Data:</strong> ${c.data}</p>
        <p><strong>Circuito:</strong> ${c.circuito}</p>
        <p><strong>País:</strong> ${c.pais}</p>
        <p>${c.descricao}</p>
      </div>
    </div>
  `;
}

/* ============================================
    FORM CADASTRO DE CORRIDA
============================================ */
function initFormularioCadastro() {
  const form = byId("form-corrida");
  if (!form) return;

  form.onsubmit = async (e) => {
    e.preventDefault();

    const dados = {
      nome: form.nome.value,
      data: form.data.value,
      circuito: form.circuito.value,
      pais: form.pais.value,
      descricao: form.descricao.value,
      imagem: form.imagem.value
    };

    await fetch(API_CORRIDAS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

    alert("Corrida cadastrada!");
    window.location.href = "./index.html";
  };
}

/* ============================================
    INIT GERAL
============================================ */
document.addEventListener("DOMContentLoaded", () => {
  renderCarousel();
  initCarousel();

  renderCategorias();
  renderHome("Todas");

  renderDetalhes();

  carregarCorridas();
  renderDetalhesCorrida();
  initFormularioCadastro();
});
