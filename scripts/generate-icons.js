/**
 * Gera os assets de marca a partir do original exportado do Canva.
 *
 *   node scripts/generate-icons.js
 *
 * A fonte da verdade é `assets/iconeprincipal.png`, que traz o disco dentro de
 * uma tela maior com margem transparente. Aqui ele é recortado no limite exato
 * do conteúdo e reemitido em cada tamanho e proporção que a plataforma pede.
 *
 * Todas as saídas usam paleta indexada. O logo tem três cores de verdade —
 * navy, dourado e branco — e o resto é antialiasing, então uma paleta de 64
 * cores é indistinguível do RGBA e ocupa uma fração do espaço.
 */
const sharp = require('sharp');
const path = require('path');

const ORIGEM = path.join(__dirname, '..', 'assets', 'iconeprincipal.png');
const SAIDA = path.join(__dirname, '..', 'assets');

/** Navy da marca. Precisa bater com `palette.ink[800]` em app/theme. */
const NAVY = '#0A1628';

const PNG = { palette: true, colours: 64, compressionLevel: 9, effort: 10 };

/** Acha o retângulo do conteúdo, ignorando a margem transparente. */
async function recorteDoConteudo(arquivo) {
  const { data, info } = await sharp(arquivo).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = channels === 4 ? data[(y * width + x) * channels + 3] : 255;
      if (alpha > 12) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

/** O disco isolado, no tamanho pedido, com fundo transparente. */
function disco(caixa, lado) {
  return sharp(ORIGEM).extract(caixa).resize(lado, lado, { fit: 'cover' });
}

/** Centraliza o disco numa tela quadrada maior. */
async function emTela({ caixa, tela, tamanhoDisco, fundo }) {
  const margem = Math.round((tela - tamanhoDisco) / 2);
  const camada = await disco(caixa, tamanhoDisco).png().toBuffer();
  return sharp({
    create: {
      width: tela,
      height: tela,
      channels: 4,
      background: fundo ?? { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: camada, top: margem, left: margem }])
    .png(PNG)
    .toBuffer();
}

async function main() {
  const caixa = await recorteDoConteudo(ORIGEM);
  console.log(`disco encontrado em ${caixa.width}x${caixa.height} (${caixa.left},${caixa.top})`);

  const saidas = [
    // Usado dentro do app, na tela inicial. 512 cobre 148pt em telas 3x.
    { nome: 'brand-pi.png', buffer: () => disco(caixa, 512).png(PNG).toBuffer() },

    // Ícone do app. Precisa ser quadrado e sem transparência: o iOS não aceita
    // alpha e pinta de preto o que estiver vazio.
    {
      nome: 'icon.png',
      buffer: () => emTela({ caixa, tela: 1024, tamanhoDisco: 860, fundo: NAVY }),
    },

    // Ícone adaptativo do Android. O sistema recorta a arte numa máscara — só
    // os 66% centrais são garantidos — então o disco fica bem dentro disso.
    {
      nome: 'adaptive-icon.png',
      buffer: () => emTela({ caixa, tela: 1024, tamanhoDisco: 620 }),
    },

    // Splash. O plugin desenha em `imageWidth` (180pt), então 640 já cobre
    // telas 3x com folga — 1024 seria peso sem ganho.
    { nome: 'splash-icon.png', buffer: () => disco(caixa, 640).png(PNG).toBuffer() },

    { nome: 'favicon.png', buffer: () => disco(caixa, 64).png(PNG).toBuffer() },
  ];

  for (const { nome, buffer } of saidas) {
    const dados = await buffer();
    const destino = path.join(SAIDA, nome);
    let antes = 0;
    try {
      antes = require('fs').statSync(destino).size;
    } catch {
      // asset novo
    }
    await require('fs').promises.writeFile(destino, dados);
    const kb = (n) => (n / 1024).toFixed(1) + ' KB';
    console.log(
      `  ${nome.padEnd(20)} ${antes ? kb(antes) + ' -> ' : ''}${kb(dados.length)}`
    );
  }
}

main().catch((erro) => {
  console.error(erro);
  process.exit(1);
});
