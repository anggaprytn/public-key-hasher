import express from "express";
import tls from "tls";
import { createHash } from "crypto";
import forge from "node-forge";

const app = express();
const PORT = 3012;

app.get("/publicKeyHash", (req, res) => {
  const domain = req.query.domain as string;

  if (!domain) {
    res.status(400).json({
      data: false,
      meta: { code: 400, message: "Missing domain query parameter" },
    });
    return;
  }

  const options = {
    host: domain,
    port: 443,
    servername: domain,
  };

  const socket = tls.connect(options, () => {
    if (!socket.authorized) {
      console.warn("Socket not authorized:", socket.authorizationError);
    }

    const peerCert = socket.getPeerCertificate();
    if (!peerCert) {
      res.status(500).json({
        data: false,
        meta: { code: 500, message: "Certificate not available" },
      });
      socket.end();
      return;
    }

    if (!peerCert.pubkey) {
      res.status(500).json({
        data: false,
        meta: { code: 500, message: "Public key not available in certificate" },
      });
      socket.end();
      return;
    }

    try {
      const asn1 = forge.asn1;
      const publicKeyBinary = peerCert.pubkey.toString("binary");
      const bitString = String.fromCharCode(0x00) + publicKeyBinary;

      const spkiAsn1 = asn1.create(
        asn1.Class.UNIVERSAL,
        asn1.Type.SEQUENCE,
        true,
        [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            asn1.create(
              asn1.Class.UNIVERSAL,
              asn1.Type.OID,
              false,
              asn1.oidToDer("1.2.840.10045.2.1").getBytes()
            ),
            asn1.create(
              asn1.Class.UNIVERSAL,
              asn1.Type.OID,
              false,
              asn1.oidToDer("1.2.840.10045.3.1.7").getBytes()
            ),
          ]),
          asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.BITSTRING,
            false,
            bitString
          ),
        ]
      );

      const derBytes = forge.asn1.toDer(spkiAsn1).getBytes();
      const derBuffer = Buffer.from(derBytes, "binary");

      const publicKeyHash = createHash("sha256")
        .update(new Uint8Array(derBuffer))
        .digest("base64");

      const validToFixed = peerCert.valid_to.replace(/\s+/g, " ");
      const validToReadable = new Date(validToFixed).toISOString();

      res.json({
        data: { publicKeyHash, validTo: validToReadable },
        meta: { code: 200, message: "success" },
      });
    } catch (err: any) {
      console.error("Error processing public key:", err);
      res.status(500).json({
        data: false,
        meta: { code: 500, message: "Failed to process public key" },
      });
    } finally {
      socket.end();
    }
  });

  socket.on("error", (err) => {
    res.status(500).json({
      data: false,
      meta: { code: 500, message: err.message },
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
