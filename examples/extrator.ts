/**
 * Example: institutional Extrator client (requires credentialed WSDL + optional soap package).
 *
 *   LATTES_WSDL_URL=https://... npx tsx examples/extrator.ts 8907059238612691
 */
import { ExtratorClient } from "../src/extrator/index.js";

const wsdlUrl = process.env.LATTES_WSDL_URL;
const id = process.argv[2];

if (!wsdlUrl || !id) {
  console.error("Set LATTES_WSDL_URL and pass a 16-digit Lattes ID.");
  process.exit(1);
}

const client = new ExtratorClient({
  wsdlUrl,
  endpointUrl: process.env.LATTES_SOAP_ENDPOINT,
});

const updatedAt = await client.getUpdatedAt(id);
console.log("Updated at:", updatedAt);

const curriculum = await client.getCurriculum(id);
console.log("Name:", curriculum.identification.fullName);
