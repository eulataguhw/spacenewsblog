import selfsigned from "selfsigned";
import fs from "node:fs";
import path from "node:path";

const attrs = [{ name: "commonName", value: "localhost" }];

(async () => {
  try {
    const pems = await selfsigned.generate(attrs, { keySize: 2048 });

    const certDir = path.join(__dirname, "../../../certs");

    if (!fs.existsSync(certDir)) {
      fs.mkdirSync(certDir, { recursive: true });
    }

    fs.writeFileSync(path.join(certDir, "localhost.crt"), pems.cert);
    fs.writeFileSync(path.join(certDir, "localhost.key"), pems.private);

    console.log("SSL certificates generated in " + certDir);
  } catch (error) {
    console.error("Error generating certificates:", error);
    process.exit(1);
  }
})();
