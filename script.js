// ======================
// ELEMENTOS DA TELA
// ======================

const telaInicial = document.getElementById("telaInicial");
const nomeJogador = document.getElementById("nomeJogador");
const btnEntrar = document.getElementById("btnEntrar");
const btnNovoJogo = document.getElementById("novoJogo");

const somAgua = new Audio("sounds/agua.mp3");
const somBarco = new Audio("sounds/barco.mp3");
const somBomba = new Audio("sounds/bomba.mp3");
somAgua.volume = 0.3;
somBarco.volume = 0.3;
somBomba.volume = 0.3;

const nomeExibido = document.getElementById("jogador");

const tabuleiro = document.getElementById("tabuleiro");

const mensagem = document.getElementById("mensagem");
const campoPontos = document.getElementById("pontos");
const campoVidas = document.getElementById("vidas");

const campoAcertos = document.getElementById("acertos");
const campoErros = document.getElementById("erros");

const campoBombas = document.getElementById("bombas");
const campoJogadas = document.getElementById("jogadas");

const campoPrecisao = document.getElementById("precisao");
const campoBarcos = document.getElementById("barcos");

const campoTempo = document.getElementById("tempo");
const nivelAtual = document.getElementById("nivelAtual");

const listaRanking = document.getElementById("listaRanking");
const areaRanking = document.querySelector(".ranking");
const btnRanking = document.getElementById("verRanking");

btnEntrar.addEventListener("click", iniciarJogo);
btnNovoJogo.addEventListener("click", novoJogo);
btnRanking.addEventListener("click", () => {

    areaRanking.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

});



// ======================
// DADOS DO JOGO
// ======================
let dificuldadeAtual = "medio";

let jogadorAtual = "";

let matriz = [];
let pontos = 0;
let vidas = 5;

let acertos = 0;
let erros = 0;

let bombasEncontradas = 0;
let jogadas = 0;
let jogoFinalizado = false;

let segundos = 0;
let intervaloTempo = null;

const tamanho = 10;
const AGUA = "agua";
const BARCO = "barco";
const BOMBA = "bomba";


// ======================
// INICIAR JOGO
// ======================




function iniciarJogo() {


    const nome = nomeJogador.value.trim();

    if (nome === "") {

        alert("Digite seu nome.");

        return;
    }

    jogadorAtual = nome;

   dificuldadeAtual =  document.getElementById("dificuldadeInicial").value;

   if (dificuldadeAtual === "facil") {

    vidas = 5;

}
else if (dificuldadeAtual === "medio") {

    vidas = 4;

}
else {

    vidas = 3;

}


   if (dificuldadeAtual === "facil") {

    nivelAtual.textContent = "Fácil";

}
else if (dificuldadeAtual === "medio") {

    nivelAtual.textContent = "Médio";

}
else {

    nivelAtual.textContent = "Difícil";

}


    

    localStorage.setItem("nomeJogador", nome);

    nomeExibido.textContent = `Jogador: ${nome}`;

    telaInicial.style.display = "none";
    

    pontos = 0;

    acertos = 0;

    erros = 0;

    bombasEncontradas = 0;

    jogadas = 0;

    jogoFinalizado = false;

    criarMatriz();

    colocarElementos();

    desenharTabuleiro();

    atualizarPainel();

    iniciarCronometro();

    mensagem.textContent = "Jogo iniciado!";
}


// ======================
// CARREGAR NOME SALVO
// ======================

window.addEventListener("load", () => {

    
    const nomeSalvo = localStorage.getItem("nomeJogador");

    if (nomeSalvo) {

        nomeJogador.value = nomeSalvo;

    }
    mostrarRanking();

});


// ======================
// MATRIZ 10x10
// ======================

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

    let quantidadeBombas;

    const nivel = dificuldadeAtual;

    if (nivel === "facil") {

        quantidadeBombas = 8;

    } else if (nivel === "medio") {

        quantidadeBombas = 15;

    } else {

        quantidadeBombas = 25;

    }


    colocarAleatorio(BARCO, 12);

    colocarAleatorio(BOMBA, quantidadeBombas);

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


// ======================
// DESENHAR TABULEIRO
// ======================

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

function atualizarPainel() {

    campoPontos.textContent = pontos;

    campoVidas.textContent = vidas;

    campoAcertos.textContent = acertos;

    campoErros.textContent = erros;

    campoBombas.textContent = bombasEncontradas;

    campoJogadas.textContent = jogadas;

    campoBarcos.textContent = 12 - acertos;

    let precisao = 0;

    if (jogadas > 0) {

        precisao = Math.round((acertos / jogadas) * 100);

    }

    campoPrecisao.textContent = precisao + "%";

}

function clicarCelula(event) {

      const celula = event.currentTarget;

    if (celula.classList.contains("aberta")) {
        return;
    }

    if (jogoFinalizado) {
        return;
    }

    celula.classList.add("aberta");

    const linha = Number(celula.dataset.linha);

    const coluna = Number(celula.dataset.coluna);

    const valor = matriz[linha][coluna];

    jogadas++;

    if (valor === AGUA) {


        mostrarImagem(celula, "agua.png", "Água");

        tocarSom(somAgua);

        erros++;

        mensagem.textContent = "Você encontrou água.";

    }

    else if (valor === BARCO) {

        mostrarImagem(celula, "barco.png", "Barco");

        tocarSom(somBarco);

        pontos += 10;

        acertos++;

        mensagem.textContent = "Barco encontrado!";

    }

    else if (valor === BOMBA) {

        mostrarImagem(celula, "bomba.png", "Bomba");

        tocarSom(somBomba);

        vidas--;

        bombasEncontradas++;

        mensagem.textContent = "Você encontrou uma bomba!";

    }

    atualizarPainel();

    verificarFimDeJogo();

}


function verificarFimDeJogo() {

    if (vidas <= 0) {

        jogoFinalizado = true;

        pararCronometro();

        mensagem.textContent =
            "💀 GAME OVER! Você perdeu.";

        salvarRanking();

        return;
    }

    if (acertos === 12) {

        jogoFinalizado = true;

        pararCronometro();

        mensagem.textContent =
            "🏆 PARABÉNS! Você encontrou todos os barcos.";

        salvarRanking();

    }



}

function novoJogo() {

    if (jogadorAtual === "") {

        return;

    }

    if (dificuldadeAtual === "facil") {

        vidas = 5;

    }
    else if (dificuldadeAtual === "medio") {

        vidas = 4;

    }
    else {

        vidas = 3;

    }

    pontos = 0;

    acertos = 0;

    erros = 0;

    bombasEncontradas = 0;

    jogadas = 0;

    jogoFinalizado = false;

    criarMatriz();

    colocarElementos();

    desenharTabuleiro();

    atualizarPainel();

    iniciarCronometro();

    mensagem.textContent = "Novo jogo iniciado!";

}

function iniciarCronometro() {

    clearInterval(intervaloTempo);

    segundos = 0;

    campoTempo.textContent = "00:00";

    intervaloTempo = setInterval(() => {

        segundos++;

        const minutos = Math.floor(segundos / 60);

        const seg = segundos % 60;

        const minutosFormatado =
            String(minutos).padStart(2, "0");

        const segundosFormatado =
            String(seg).padStart(2, "0");

        campoTempo.textContent =
            `${minutosFormatado}:${segundosFormatado}`;

    }, 1000);

}

function pararCronometro() {

    clearInterval(intervaloTempo);

}

function salvarRanking() {

    let ranking = JSON.parse(localStorage.getItem("rankingBatalha")) || [];

    const novoResultado = {
        nome: jogadorAtual,
        pontos: pontos,
        tempo: campoTempo.textContent,
        dificuldade: dificuldadeAtual
    };

    ranking.push(novoResultado);

    ranking.sort((a, b) => {

    if (b.pontos !== a.pontos) {
        return b.pontos - a.pontos;
    }

    return converterTempo(a.tempo) - converterTempo(b.tempo);

});

    ranking = ranking.slice(0, 5);

    localStorage.setItem("rankingBatalha", JSON.stringify(ranking));

    mostrarRanking();

}

function mostrarRanking() {

    const ranking =
        JSON.parse(localStorage.getItem("rankingBatalha")) || [];

    listaRanking.innerHTML = "";

    if (ranking.length === 0) {

        const item = document.createElement("li");

        item.textContent = "Nenhuma partida registrada ainda.";

        listaRanking.appendChild(item);

        return;
    }

    for (let i = 0; i < ranking.length; i++) {

        const item = document.createElement("li");

        const resultado = ranking[i];

        const dificuldadeTexto =
            formatarDificuldade(resultado.dificuldade);

        item.textContent =
            `${i + 1}º - ${resultado.nome}  ${resultado.pontos} pontos  ${resultado.tempo}  ${dificuldadeTexto}`;

        listaRanking.appendChild(item);

    }

}

function formatarDificuldade(nivel) {

    if (nivel === "facil") {
        return "Fácil";
    }

    if (nivel === "medio") {
        return "Médio";
    }

    if (nivel === "dificil") {
        return "Difícil";
    }

    return "Não informada";

}

function mostrarImagem(celula, nomeImagem, textoAlternativo) {

    const imagem = document.createElement("img");

    imagem.src = `img/${nomeImagem}`;

    imagem.alt = textoAlternativo;

    imagem.classList.add("imagemCelula");

    celula.innerHTML = "";

    celula.appendChild(imagem);

}

function tocarSom(som) {

    som.currentTime = 0;

    som.play().catch(() => {
        console.log("O navegador bloqueou o som.");
    });

}

function converterTempo(tempo) {

    const partes = tempo.split(":");

    const minutos = Number(partes[0]);

    const segundos = Number(partes[1]);

    return (minutos * 60) + segundos;

}