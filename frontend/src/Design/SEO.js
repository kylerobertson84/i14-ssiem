import React from 'react';
import { Helmet } from 'react-helmet';

const SEO = ({ title, description, lang = 'en' }) => {
  const defaultTitle = 'Simple SIEM';
  const defaultDescription = 'Advanced Security Information and Event Management Solution';

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title ? `${title} | ${defaultTitle}` : defaultTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title || defaultTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title || defaultTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
    </Helmet>
  );
};

export default SEO;