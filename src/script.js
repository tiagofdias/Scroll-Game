// Cria um novo objeto Rainbow para manipulação de cores
var rainbow = new Rainbow();
var best = 0; // Variável para guardar a maior velocidade de scroll registada

// Define o espectro de cores para o objeto rainbow, de verde para laranja e para vermelho
rainbow.setSpectrum("#2ecc71", "#ff9a42", "#e74c3c");
// Define o intervalo de valores de cor baseado num intervalo de 0 a 25000 pixels
rainbow.setNumberRange(0, 25000);

// Adiciona um evento para detetar o movimento da roda do rato
window.addEventListener('wheel', mouseWheelEvent);
var lastSecond = []; // Array para armazenar dados de scroll do último segundo

// Função acionada sempre que há um evento de scroll da roda do rato
function mouseWheelEvent(e) {
  // Adiciona a distância de scroll e o carimbo de data/hora ao array lastSecond
  lastSecond.push({ delta: Math.floor(Math.abs(e.deltaY)), timestamp: new Date().getTime() });
}

// Define um intervalo para atualizar a velocidade de scroll e exibir cada 50ms
setInterval(function () {
  var pixelsPerSecond = displayLastSecond(); // Calcula a quantidade de pixels por segundo
  if (pixelsPerSecond > best) { // Se a velocidade atual for a melhor, atualiza o recorde
    best = pixelsPerSecond;
  }
  
  // Atualiza o texto com a quantidade de pixels por segundo e formata com vírgulas
  $(".pixels").text(numberWithCommas(pixelsPerSecond) + " pixels por segundo");
  
  // Exibe um gradiente de cor baseado na velocidade de scroll
  console.log(makeGradient(pixelsPerSecond));
  $("body").css("background", "#" + rainbow.colourAt(pixelsPerSecond));
  
  // Ajusta o tamanho da fonte de acordo com a velocidade de scroll
  $(".pixels").css("font-size", fontSize(pixelsPerSecond) + "px");

  // Mostra ou oculta a interface com base na velocidade de scroll
  if (pixelsPerSecond > 0) {
    $(".headline").css("display", "none");
    $(".container").css("display", "block");
  } else {
    var headline = "Faz scroll o mais rápido que conseguires!";
    if (best > 0) { // Exibe o recorde atual se existir
      headline += "<div class='best'>O teu melhor foi " + numberWithCommas(best) + " pixels por segundo</div>";
      $(".headline").css("height", "100px");
    }
    $(".headline").html(headline);
    $(".headline").css("display", "block");
    $(".container").css("display", "none");
  }
}, 50);

// Função para calcular a quantidade de pixels scrollados no último segundo
function displayLastSecond() {
  var now = new Date().getTime();
  var total = 0;
  var timestamps = 0;
  
  // Percorre o array lastSecond para somar apenas os eventos do último segundo
  for (var x = 0; x < lastSecond.length; x++) {
    if (now - lastSecond[x].timestamp <= 1000) {
      total += lastSecond[x].delta;
      timestamps++;
    } else {
      // Remove entradas mais antigas que 1 segundo
      lastSecond.splice(x, 1);
      x--;
    }
  }
  
  // Retorna 0 se não houver eventos de scroll, caso contrário retorna o total de pixels
  if (timestamps == 0) {
    return 0;
  }
  return Math.round(total);
}

// Função para calcular o tamanho da fonte com base na velocidade de scroll
function fontSize(pps) {
  return 32 + 20 * pps / 25000;
}

// Função para formatar números com vírgulas para facilitar a leitura
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Função para criar um gradiente de cor baseado na velocidade de scroll
function makeGradient(pps) {
  var color1 = rainbow.colourAt(pps);
  var color2 = rainbow.colourAt(pps + 5000);
  return "radial-gradient(40% 40% at center, #" + color2 + ", #" + color1 + ")";
}
