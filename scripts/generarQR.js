import QRCode from "qrcode";
import path from "path";

const urlCatalogo= "https://nails-vibe.toledanadev.com";

const outputPath = path.join(process.cwd(), "public", "qr-catalogo.png");

QRCode.toFile(outputPath, urlCatalogo, {
  width: 1000,
  margin: 2,
  color: {
    dark: "#1F1F1F",
    light: "#FFFFFF",
  },
})
  .then(() => {
    console.log("✅ QR generado correctamente:");
    console.log(outputPath);
  })
  .catch((error) => {
    console.error("❌ Error generando QR:", error);
  });