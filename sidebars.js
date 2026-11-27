// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'API Reference',
      collapsed: false,
      items: ['api/provision-agent-identity'],
    },
    {
      type: 'category',
      label: 'Admin Guides',
      collapsed: false,
      items: ['admin/troubleshoot-scim-sync'],
    },
  ],
};

export default sidebars;
