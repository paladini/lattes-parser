import http from "node:http";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { ExtratorClient } from "../src/extrator/index.js";
import { zipSampleCurriculum } from "./helpers/zip.js";

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), "fixtures");
let baseUrl = "";
let server: http.Server;

function buildSoapResponse(tag: string, value: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <ns1:${tag} xmlns:ns1="http://servico.curriculo.ws.cnpq.br/">
      <return>${value}</return>
    </ns1:${tag}>
  </soap:Body>
</soap:Envelope>`;
}

beforeAll(async () => {
  const wsdlTemplate = readFileSync(join(fixturesDir, "extrator.wsdl"), "utf8");
  const zipBase64 = Buffer.from(zipSampleCurriculum()).toString("base64");

  server = http.createServer((req, res) => {
    if (req.method === "GET" && req.url?.includes("WSCurriculo")) {
      const wsdl = wsdlTemplate.replace(
        "http://127.0.0.1:0/srvcurriculo/WSCurriculo",
        `${baseUrl}/srvcurriculo/WSCurriculo`,
      );
      res.writeHead(200, { "Content-Type": "text/xml" });
      res.end(wsdl);
      return;
    }

    if (req.method === "POST" && req.url?.includes("WSCurriculo")) {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        if (body.includes("getCurriculoCompactado")) {
          res.writeHead(200, { "Content-Type": "text/xml" });
          res.end(
            buildSoapResponse("getCurriculoCompactadoResponse", zipBase64),
          );
          return;
        }
        if (body.includes("getDataAtualizacaoCV")) {
          res.writeHead(200, { "Content-Type": "text/xml" });
          res.end(
            buildSoapResponse(
              "getDataAtualizacaoCVResponse",
              "15/03/2024 14:30:22",
            ),
          );
          return;
        }
        res.writeHead(500);
        res.end("unknown operation");
      });
      return;
    }

    res.writeHead(404);
    res.end("not found");
  });

  await new Promise<void>((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (address && typeof address === "object") {
        baseUrl = `http://127.0.0.1:${address.port}`;
      }
      resolve();
    });
  });
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

describe("ExtratorClient", () => {
  it("downloads and parses compacted curricula via SOAP", async () => {
    const client = new ExtratorClient({
      wsdlUrl: `${baseUrl}/srvcurriculo/WSCurriculo?wsdl`,
      endpointUrl: `${baseUrl}/srvcurriculo/WSCurriculo`,
    });

    const zip = await client.getCurriculumCompacted("8907059238612691");
    expect(zip.byteLength).toBeGreaterThan(0);

    const curriculum = await client.getCurriculum("8907059238612691");
    expect(curriculum.id).toBe("8907059238612691");
    expect(curriculum.identification.fullName).toBe("Pesquisador Síntese");
  });

  it("reads curriculum update timestamps", async () => {
    const client = new ExtratorClient({
      wsdlUrl: `${baseUrl}/srvcurriculo/WSCurriculo?wsdl`,
      endpointUrl: `${baseUrl}/srvcurriculo/WSCurriculo`,
    });

    await expect(client.getUpdatedAt("8907059238612691")).resolves.toBe(
      "15/03/2024 14:30:22",
    );
  });
});
