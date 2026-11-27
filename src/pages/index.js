import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Explore Architecture &amp; API Docs →
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Enterprise Docs-as-Code portal for AegisIAM: REST API specifications, autonomous AI agent RBAC provisioning, and SCIM 2.0 directory troubleshooting.">
      <HomepageHeader />
      <main className="container margin-vert--xl">
        <div className="row">
          <div className="col col--4">
            <h3>Docs-as-Code &amp; CI Gating</h3>
            <p>
              Declarative Markdown paired with Draft 2020-12 JSON Schemas, automated broken-link compilation (<code>onBrokenLinks: 'throw'</code>), and pull-request validation.
            </p>
            <Link to="/docs/intro">Read Architecture Overview →</Link>
          </div>
          <div className="col col--4">
            <h3>Autonomous Agent Identity API</h3>
            <p>
              Complete REST API reference for <code>POST /v1/agents/identities</code> with Least-Privilege RBAC bindings, human sponsor MFA attestation, and cURL/Python examples.
            </p>
            <Link to="/docs/api/provision-agent-identity">Explore API Reference →</Link>
          </div>
          <div className="col col--4">
            <h3>SCIM 2.0 Directory Runbook</h3>
            <p>
              Step-by-step IT administrator troubleshooting guide for resolving <code>401</code> bearer token rotation, <code>400</code> schema collisions, and <code>429</code> batch rate limits.
            </p>
            <Link to="/docs/admin/troubleshoot-scim-sync">Open Admin Runbook →</Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}
