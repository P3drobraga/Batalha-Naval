const telaInicial = document.getElementById("telaInicial");
const nomeJogador = document.getElementById("nomeJogador");
const dificuldadeInicial = document.getElementById("dificuldadeInicial");
const btnEntrar = document.getElementById("btnEntrar");
const btnNovoJogo = document.getElementById("novoJogo");
const btnJogarNovamente = document.getElementById("btnJogarNovamente");

const nomeExibido = document.getElementById("jogador");
const nivelAtual = document.getElementById("nivelAtual");
const tabuleiro = document.getElementById("tabuleiro");
const mensagem = document.getElementById("mensagem");
const listaRanking = document.getElementById("listaRanking");

const campoPontos = document.getElementById("pontos");
const campoVidas = document.getElementById("vidas");
const campoTempo = document.getElementById("tempo");
const campoJogadas = document.getElementById("jogadas");

const telaResultado = document.getElementById("telaResultado");
const tituloResultado = document.getElementById("tituloResultado");
const textoResultado = document.getElementById("textoResultado");
const detalhesResultado = document.getElementById("detalhesResultado");

const somAgua = new Audio("sounds/agua.mp3");
const somBarco = new Audio("sounds/barco.mp3");
const somBomba = new Audio("sounds/bomba.mp3");

somAgua.volume = 0.3;
somBarco.volume = 0.3;
somBomba.volume = 0.3;

const tamanho = 10;
const quantidadeBarcos = 12;

const AGUA = "agua";
const BARCO = "barco";
const BOMBA = "bomba";

const niveis = {
facil: {
nome: "Fácil",
vidas: 5,
bombas: 8
},
medio: {
nome: "Médio",
vidas: 4,
bombas: 15
},
dificil: {
nome: "Difícil",
vidas: 3,
bombas: 25
}
};

let jogadorAtual = "";
let dificuldadeAtual = "medio";
let matriz = [];

let pontos = 0;
let vidas = 5;
let acertos = 0;
let jogadas = 0;
let jogoFinalizado = false;

let segundos = 0;
let intervaloTempo = null;

btnEntrar.addEventListener("click", iniciarJogo);
btnNovoJogo.addEventListener("click", novoJogo);
btnJogarNovamente.addEventListener("click", novoJogo);

window.addEventListener("load", mostrarRanking);

function iniciarJogo() {
const nome = nomeJogador.value.trim();

if (nome === "") {
    alert("Digite seu nome.");
    return;
}

jogadorAtual = nome;
dificuldadeAtual = dificuldadeInicial.value;

nomeExibido.textContent = "Jogador: " + nome;
nivelAtual.textContent = niveis[dificuldadeAtual].nome;

telaInicial.style.display = "none";

prepararPartida("Jogo iniciado.");

}

function novoJogo() {
if (jogadorAtual === "") {
return;
}

prepararPartida("Novo jogo iniciado.");

}

function prepararPartida(texto) {
vidas = niveis[dificuldadeAtual].vidas;
pontos = 0;
acertos = 0;
jogadas = 0;
jogoFinalizado = false;

criarMatriz();
colocarElementos();
desenharTabuleiro();
atualizarPainel();
esconderResultado();
mensagem.classList.remove("mensagem-vitoria", "mensagem-derrota");
mensagem.textContent = texto;
iniciarCronometro();

}

function criarMatriz() {
matriz = [];

for (let linha = 0; linha < tamanho; linha++) {
    const novaLinha = [];

    for (let coluna = 0; coluna < tamanho; coluna++) {
        novaLinha.push(AGUA);
    }

    matriz.push(novaLinha);
}

}

function colocarElementos() {
colocarAleatorio(BARCO, quantidadeBarcos);
colocarAleatorio(BOMBA, niveis[dificuldadeAtual].bombas);
}

function colocarAleatorio(tipo, quantidade) {
let colocados = 0;

while (colocados < quantidade) {
    const linha = Math.floor(Math.random() * tamanho);
    const coluna = Math.floor(Math.random() * tamanho);

    if (matriz[linha][coluna] === AGUA) {
        matriz[linha][coluna] = tipo;
        colocados++;
    }
}

}

function desenharTabuleiro() {
tabuleiro.innerHTML = "";


for (let linha = 0; linha < tamanho; linha++) {
    for (let coluna = 0; coluna < tamanho; coluna++) {
        const celula = document.createElement("div");

        celula.classList.add("celula");
        celula.dataset.linha = linha;
        celula.dataset.coluna = coluna;

        celula.addEventListener("click", clicarCelula);

        tabuleiro.appendChild(celula);
    }
}

}

function clicarCelula(event) {
const celula = event.currentTarget;


if (celula.classList.contains("aberta") || jogoFinalizado) {
    return;
}

const linha = Number(celula.dataset.linha);
const coluna = Number(celula.dataset.coluna);
const valor = matriz[linha][coluna];

celula.classList.add("aberta");

jogadas++;

if (valor === AGUA) {
    abrirAgua(celula);
} else if (valor === BARCO) {
    abrirBarco(celula);
} else {
    abrirBomba(celula);
}

atualizarPainel();
verificarFimDeJogo();

}

function abrirAgua(celula) {
mostrarImagem(celula, "agua.png", "Água");
celula.classList.add("animacao-agua");

tocarSom(somAgua);

mensagem.textContent = "Você encontrou água.";

}

function abrirBarco(celula) {
mostrarImagem(celula, "barco.png", "Barco");
celula.classList.add("animacao-barco");

tocarSom(somBarco);

pontos += 10;
acertos++;

mensagem.textContent = "Você acertou um barco.";

}

function abrirBomba(celula) {
mostrarImagem(celula, "bomba.png", "Bomba");
celula.classList.add("animacao-bomba");

tocarSom(somBomba);

vidas--;

mensagem.textContent = "Você encontrou uma bomba.";

}

function atualizarPainel() {
campoPontos.textContent = pontos;
campoVidas.textContent = vidas;
campoJogadas.textContent = jogadas;
}

function verificarFimDeJogo() {
if (vidas <= 0) {
finalizarJogo("derrota");
return;
}

if (acertos === quantidadeBarcos) {
    finalizarJogo("vitoria");
}

}

function finalizarJogo(tipo) {
jogoFinalizado = true;

pararCronometro();

mensagem.classList.remove("mensagem-vitoria", "mensagem-derrota");

if (tipo === "vitoria") {
    mensagem.textContent = "Parabéns, você venceu.";
    mensagem.classList.add("mensagem-vitoria");
} else {
    mensagem.textContent = "Fim de jogo. Você perdeu.";
    mensagem.classList.add("mensagem-derrota");
}

salvarRanking();
mostrarResultado(tipo);

}

function iniciarCronometro() {
clearInterval(intervaloTempo);

segundos = 0;
campoTempo.textContent = "00:00";

intervaloTempo = setInterval(() => {
    segundos++;

    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;

    campoTempo.textContent =
        formatarNumero(minutos) + ":" +
        formatarNumero(segundosRestantes);
}, 1000);


}

function pararCronometro() {
clearInterval(intervaloTempo);
}

function formatarNumero(numero) {
return String(numero).padStart(2, "0");
}

function obterRanking() {
try {
const ranking = JSON.parse(localStorage.getItem("rankingBatalha"));

    if (Array.isArray(ranking)) {
        return ranking;
    }

    return [];
} catch {
    return [];
}

}

function salvarRanking() {
const ranking = obterRanking();

ranking.push({
    nome: jogadorAtual,
    pontos: pontos,
    tempo: campoTempo.textContent,
    dificuldade: dificuldadeAtual
});

ranking.sort((a, b) => {
    if (b.pontos !== a.pontos) {
        return b.pontos - a.pontos;
    }

    return converterTempo(a.tempo) - converterTempo(b.tempo);
});

localStorage.setItem(
    "rankingBatalha",
    JSON.stringify(ranking.slice(0, 5))
);

mostrarRanking();

}

function mostrarRanking() {
const ranking = obterRanking();

listaRanking.innerHTML = "";

if (ranking.length === 0) {
    const item = document.createElement("li");

    item.textContent = "Nenhuma partida registrada ainda.";

    listaRanking.appendChild(item);

    return;
}

for (let i = 0; i < ranking.length; i++) {
    const resultado = ranking[i];
    const item = document.createElement("li");

    const nivel = niveis[resultado.dificuldade]
        ? niveis[resultado.dificuldade].nome
        : "Não informada";

    item.textContent =
        (i + 1) + "º - " +
        resultado.nome + " " +
        resultado.pontos + " pontos " +
        resultado.tempo + " " +
        nivel;

    listaRanking.appendChild(item);
}

}

function converterTempo(tempo) {
const partes = tempo.split(":");


const minutos = Number(partes[0]);
const segundosTempo = Number(partes[1]);

return (minutos * 60) + segundosTempo;

}

function mostrarImagem(celula, nomeImagem, textoAlternativo) {
const imagem = document.createElement("img");

imagem.src = "img/" + nomeImagem;
imagem.alt = textoAlternativo;
imagem.classList.add("imagemCelula");

celula.innerHTML = "";
celula.appendChild(imagem);

}

function tocarSom(som) {
som.currentTime = 0;

som.play().catch(() => {});

}

function mostrarResultado(tipo) {
telaResultado.classList.remove("escondida", "vitoria", "derrota");
telaResultado.classList.add(tipo);

detalhesResultado.textContent =
    "Pontuação: " + pontos +
    " pontos | Tempo: " + campoTempo.textContent;

if (tipo === "vitoria") {
    tituloResultado.textContent = "Vitória";
    textoResultado.textContent = "Você encontrou todos os barcos.";
} else {
    tituloResultado.textContent = "Fim de jogo";
    textoResultado.textContent = "Suas vidas acabaram. Tente novamente.";
}

}
function esconderResultado() {
telaResultado.classList.add("escondida");
telaResultado.classList.remove("vitoria", "derrota");
}
