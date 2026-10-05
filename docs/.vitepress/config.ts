import { defineConfig } from "vitepress";

const siteHost = "https://paladini.github.io";
const basePath = "/lattes-parser/";
const siteUrl = `${siteHost}${basePath.replace(/\/$/, "")}`;

export default defineConfig({
  lang: "pt-BR",
  title: "@paladini/lattes-parser",
  titleTemplate: ":title | Editar XML Lattes localmente",
  description:
    "Automatize o Currículo Lattes no XML exportado: CLI, TypeScript, patches para IA e backup. Feche com Importar XML na Plataforma.",
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
    ["meta", { property: "og:site_name", content: "@paladini/lattes-parser" }],
    ["meta", { property: "og:locale", content: "pt_BR" }],
    ["meta", { property: "og:url", content: siteUrl }],
    [
      "meta",
      {
        property: "og:title",
        content: "Editar XML do Currículo Lattes localmente (CLI e TypeScript)",
      },
    ],
    [
      "meta",
      {
        property: "og:description",
        content:
          "Automatize edições no XML exportado do Lattes: CLI, TypeScript, skill de IA, backup. Importar XML na Plataforma.",
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
    siteTitle: "Lattes XML Toolkit",
    nav: [
      { text: "Guia", link: "/ciclo-de-trabalho" },
      { text: "CLI", link: "/cli" },
      { text: "FAQ", link: "/faq" },
      { text: "npm", link: "https://www.npmjs.com/package/@paladini/lattes-parser" },
      { text: "GitHub", link: "https://github.com/paladini/lattes-parser" },
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
          { text: "Integração com IA", link: "/integracao-ia" },
        ],
      },
      {
        text: "Referência",
        items: [
          { text: "Modelo de dados", link: "/modelo" },
          { text: "Cobertura de campos", link: "/cobertura-campos" },
          { text: "Limitações", link: "/limitacoes" },
          { text: "Extrator institucional", link: "/extrator" },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/paladini/lattes-parser" },
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
        { property: "og:title", content: `${pageData.title} | Lattes XML Toolkit` },
      ]);
    }
    return head;
  },
});
