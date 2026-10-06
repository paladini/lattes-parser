import { defineConfig } from "vitepress";

const siteHost = "https://paladini.github.io";
const basePath = "/lattes-toolkit/";
const siteUrl = `${siteHost}${basePath.replace(/\/$/, "")}`;

export default defineConfig({
  lang: "pt-BR",
  title: "lattes-toolkit",
  titleTemplate: ":title | lattes-toolkit",
  description:
    "Toolkit para ler e gravar campos do Currículo Lattes no XML exportado, por código, CLI ou agente de IA.",
  base: basePath,
  mpa: true,
  cleanUrls: true,
  lastUpdated: true,
  sitemap: {
    hostname: siteUrl,
  },
  head: [
    ["link", { rel: "icon", href: `${basePath}favicon.svg`, type: "image/svg+xml" }],
    ["link", { rel: "canonical", href: siteUrl }],
    ["meta", { name: "theme-color", content: "#0f766e" }],
    ["meta", { name: "author", content: "Fernando Paladini" }],
    ["meta", { name: "robots", content: "index, follow, max-image-preview:large" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:site_name", content: "lattes-toolkit" }],
    ["meta", { property: "og:locale", content: "pt_BR" }],
    ["meta", { property: "og:url", content: siteUrl }],
    [
      "meta",
      {
        property: "og:title",
        content: "lattes-toolkit: leitura e gravação de campos do Currículo Lattes",
      },
    ],
    [
      "meta",
      {
        property: "og:description",
        content:
          "Toolkit para ler e gravar campos do Currículo Lattes no XML exportado, por código, CLI ou agente de IA.",
      },
    ],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:creator", content: "@paladini" }],
    [
      "meta",
      {
        name: "keywords",
        content:
          "lattes, curriculo lattes, xml lattes, cnpq, parser lattes, editar lattes, importar xml lattes, typescript, cli, pesquisa brasil",
      },
    ],
  ],
  themeConfig: {
    logo: "/favicon.svg",
    siteTitle: "lattes-toolkit",
    nav: [
      { text: "Guia", link: "/ciclo-de-trabalho" },
      { text: "CLI", link: "/cli" },
      { text: "FAQ", link: "/faq" },
      { text: "npm", link: "https://www.npmjs.com/package/@paladini/lattes-toolkit" },
      { text: "GitHub", link: "https://github.com/paladini/lattes-toolkit" },
    ],
    sidebar: [
      {
        text: "Começar",
        items: [
          { text: "Visão geral", link: "/" },
          { text: "Ciclo de trabalho", link: "/ciclo-de-trabalho" },
          { text: "Como obter o XML", link: "/como-obter-o-xml" },
          { text: "Importar no Lattes", link: "/importacao-lattes" },
          { text: "Perguntas frequentes", link: "/faq" },
        ],
      },
      {
        text: "Uso",
        items: [
          { text: "Referência CLI", link: "/cli" },
          { text: "API TypeScript", link: "/api-typescript" },
          { text: "Backups", link: "/backups" },
          { text: "Agentes de IA", link: "/integracao-ia" },
        ],
      },
      {
        text: "Referência",
        items: [
          { text: "Modelo de dados", link: "/modelo" },
          { text: "Schema XSD", link: "/schema-xsd" },
          { text: "Cobertura de campos", link: "/cobertura-campos" },
          { text: "Limitações", link: "/limitacoes" },
          { text: "Extrator institucional", link: "/extrator" },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/paladini/lattes-toolkit" },
    ],
    footer: {
      message: "Projeto independente. Não afiliado ao CNPq.",
      copyright: "MIT © Fernando Paladini",
    },
    search: {
      provider: "local",
    },
    outline: { level: [2, 3] },
  },
  transformHead({ pageData }) {
    const head: Array<[string, Record<string, string>]> = [];
    const pagePath = pageData.relativePath.replace(/\.md$/, "").replace(/\/index$/, "");
    const pageUrl =
      pagePath === "index" || pagePath === ""
        ? siteUrl
        : `${siteUrl}/${pagePath}`;
    head.push(["link", { rel: "canonical", href: pageUrl }]);
    if (pageData.description) {
      head.push(["meta", { property: "og:description", content: pageData.description }]);
      head.push(["meta", { name: "description", content: pageData.description }]);
    }
    if (pageData.title) {
      head.push([
        "meta",
        { property: "og:title", content: `${pageData.title} | lattes-toolkit` },
      ]);
    }
    return head;
  },
});
