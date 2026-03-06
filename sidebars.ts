import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  gettingStartedSidebar: [
    'intro',
    'what-is-cachebash',
    'core-concepts',
    'quick-start',
  ],
  guidesSidebar: [
    {
      type: 'category',
      label: 'Integration Guides',
      items: ['connect-claude-code', 'connect-cursor', 'connect-vscode'],
    },
    {
      type: 'category',
      label: 'System Guides',
      items: ['guides/multi-agent'],
    },
  ],
  conceptsSidebar: [
    {
      type: 'category',
      label: 'Core Concepts',
      items: ['concepts/governance'],
    },
  ],
  apiSidebar: [
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api/index',
        'api/dispatch',
        'api/relay',
        'api/pulse',
        'api/signal',
        'api/dream',
        'api/sprint',
        'api/keys',
        'api/programs',
        'api/program-state',
        'api/gsp',
        'api/metrics',
        'api/audit',
        'api/trace',
        'api/clu',
        'api/feedback',
        'api/admin',
      ],
    },
  ],
};

export default sidebars;
