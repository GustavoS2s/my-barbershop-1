const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Tamanhos dos ícones PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Caminhos
const inputSvg = path.join(__dirname, '../apps/my-barbershop/public/barber-icon.svg');
const outputDir = path.join(__dirname, '../apps/my-barbershop/public/icons');

// Verifica se o SVG existe
if (!fs.existsSync(inputSvg)) {
  console.error('❌ Arquivo SVG não encontrado:', inputSvg);
  process.exit(1);
}

// Cria diretório de saída se não existir
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🎨 Gerando ícones PWA a partir do barber-icon.svg...\n');

// Função para gerar um ícone com padding/margem
async function generateIcon(size) {
  const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);

  try {
    // Adiciona padding de 10% para evitar que o ícone fique cortado
    const padding = Math.floor(size * 0.1);
    const iconSize = size - (padding * 2);

    await sharp(inputSvg)
      .resize(iconSize, iconSize, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(outputPath);

    console.log(`✅ Gerado: icon-${size}x${size}.png`);
  } catch (error) {
    console.error(`❌ Erro ao gerar icon-${size}x${size}.png:`, error.message);
  }
}

// Gera todos os ícones
async function generateAllIcons() {
  for (const size of sizes) {
    await generateIcon(size);
  }

  console.log('\n✨ Todos os ícones PWA foram gerados com sucesso!');
  console.log(`📁 Localização: ${outputDir}`);
}

generateAllIcons().catch(error => {
  console.error('❌ Erro ao gerar ícones:', error);
  process.exit(1);
});
