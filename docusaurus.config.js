// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'AegisIAM Documentation',
  tagline: 'Enterprise Identity, Autonomous AI Agent RBAC & SCIM 2.0 Directory Plane',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://ghoshsrijani.github.io',
  baseUrl: '/',

  organizationName: 'ghoshsrijani',
  projectName: 'aegis-iam-docs',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/ghoshsrijani/aegis-iam-docs/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'AegisIAM Docs',
        logo: {
          alt: 'AegisIAM Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Documentation',
          },
          {
            to: '/docs/api/provision-agent-identity',
            label: 'API Reference',
            position: 'left',
          },
          {
            to: '/docs/admin/troubleshoot-scim-sync',
            label: 'Admin Guides',
            position: 'left',
          },
          {
            href: 'https://github.com/ghoshsrijani/aegis-iam-docs',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentation',
            items: [
              {
                label: 'Architecture Overview',
                to: '/docs/intro',
              },
              {
                label: 'API Reference: Provision Agent Identity',
                to: '/docs/api/provision-agent-identity',
              },
              {
                label: 'Admin Guide: Troubleshoot SCIM 2.0 Sync',
                to: '/docs/admin/troubleshoot-scim-sync',
              },
            ],
          },
          {
            title: 'Schemas & Governance',
            items: [
              {
                label: 'Agent Identity JSON Schema (2020-12)',
                href: 'https://github.com/ghoshsrijani/aegis-iam-docs/blob/main/static/schemas/agent-identity.schema.json',
              },
              {
                label: 'AI DocOps Prompt Library',
                href: 'https://github.com/ghoshsrijani/aegis-iam-docs/tree/main/prompts',
              },
            ],
          },
          {
            title: 'Author',
            items: [
              {
                label: 'Srijani Ghosh Portfolio',
                href: 'https://ghoshsrijani.github.io/portfolio/',
              },
              {
                label: 'GitHub Repository',
                href: 'https://github.com/ghoshsrijani/aegis-iam-docs',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Srijani Ghosh — Senior Technical Writer Showcase (AegisIAM Docs-as-Code).`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
