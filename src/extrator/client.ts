import { readCurriculum } from "../io/read-curriculum.js";
import { ExtratorError } from "../errors.js";
import { LattesId } from "../lattes-id.js";
import type { Curriculum } from "../types.js";

export interface ExtratorClientOptions {
  /** WSDL URL provided by CNPq or your institution proxy (not hardcoded by this library). */
  wsdlUrl: string;
  /** Optional SOAP endpoint override when the generated client points to a stale host. */
  endpointUrl?: string;
}

type SoapModule = typeof import("soap");

async function loadSoap(): Promise<SoapModule> {
  try {
    return await import("soap");
  } catch {
    throw new ExtratorError(
      "SOAP_DEPENDENCY_MISSING",
      'Install optional peer dependency "soap" to use the Extrator client (npm install soap)',
    );
  }
}

function decodeCompactedPayload(payload: unknown): Uint8Array {
  if (payload instanceof Uint8Array) {
    return payload;
  }
  if (Buffer.isBuffer(payload)) {
    return new Uint8Array(payload);
  }
  if (typeof payload === "string") {
    return new Uint8Array(Buffer.from(payload, "base64"));
  }
  throw new ExtratorError(
    "INVALID_EXTRATOR_RESPONSE",
    "getCurriculoCompactado did not return base64 ZIP data",
  );
}

export class ExtratorClient {
  private readonly wsdlUrl: string;
  private readonly endpointUrl?: string;
  private clientPromise: ReturnType<SoapModule["createClientAsync"]> | undefined;

  constructor(options: ExtratorClientOptions) {
    this.wsdlUrl = options.wsdlUrl;
    this.endpointUrl = options.endpointUrl;
  }

  private async getClient() {
    if (!this.clientPromise) {
      const soap = await loadSoap();
      this.clientPromise = soap.createClientAsync(this.wsdlUrl).then((client) => {
        if (this.endpointUrl) {
          client.setEndpoint(this.endpointUrl);
        }
        return client;
      });
    }
    return this.clientPromise;
  }

  async getCurriculumCompacted(id: string): Promise<Uint8Array> {
    const lattesId = LattesId.parse(id).id;
    const client = await this.getClient();
    const [result] = await client.getCurriculoCompactadoAsync({ id: lattesId });
    const payload = result?.return ?? result;
    return decodeCompactedPayload(payload);
  }

  async getCurriculum(id: string): Promise<Curriculum> {
    const zip = await this.getCurriculumCompacted(id);
    return readCurriculum(zip);
  }

  async getUpdatedAt(id: string): Promise<string> {
    const lattesId = LattesId.parse(id).id;
    const client = await this.getClient();
    const [result] = await client.getDataAtualizacaoCVAsync({ id: lattesId });
    const value = result?.return ?? result;
    if (typeof value !== "string" || value.trim() === "") {
      throw new ExtratorError(
        "INVALID_EXTRATOR_RESPONSE",
        "getDataAtualizacaoCV returned an empty value",
      );
    }
    return value;
  }
}
