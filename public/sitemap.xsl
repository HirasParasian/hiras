<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
  xmlns:html="http://www.w3.org/TR/REC-html40"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="id">
      <head>
        <title>XML Sitemap — Hiras Parasian</title>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #0b0f19;
            color: #e2e8f0;
            padding: 30px 20px;
            margin: 0;
          }
          .container {
            max-width: 900px;
            margin: 0 auto;
            background: #111827;
            border: 1px solid #1f2937;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
          }
          h1 {
            font-size: 20px;
            margin: 0 0 8px 0;
            color: #f8fafc;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          p.desc {
            font-size: 13px;
            color: #94a3b8;
            margin: 0 0 20px 0;
            line-height: 1.5;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
          }
          th {
            text-align: left;
            padding: 12px 14px;
            background: #1e293b;
            color: #cbd5e1;
            font-weight: 600;
            border-bottom: 2px solid #334155;
          }
          td {
            padding: 12px 14px;
            border-bottom: 1px solid #1e293b;
          }
          tr:hover td {
            background-color: #1e293b80;
          }
          a {
            color: #38bdf8;
            text-decoration: none;
            word-break: break-all;
          }
          a:hover {
            text-decoration: underline;
          }
          .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
            background: #0284c720;
            color: #38bdf8;
          }
          .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #64748b;
            text-align: right;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Peta Situs XML (XML Sitemap)</h1>
          <p class="desc">
            File ini dibuat untuk mesin pencari seperti Google untuk mengindeks halaman di <strong>https://www.hiras.my.id</strong>.
          </p>
          <table>
            <thead>
              <tr>
                <th style="width: 55%;">URL Halaman</th>
                <th style="width: 15%;">Frekuensi</th>
                <th style="width: 15%;">Prioritas</th>
                <th style="width: 15%;">Terakhir Diubah</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td>
                    <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                  </td>
                  <td>
                    <span class="badge"><xsl:value-of select="sitemap:changefreq"/></span>
                  </td>
                  <td>
                    <xsl:value-of select="sitemap:priority"/>
                  </td>
                  <td style="color: #94a3b8;">
                    <xsl:value-of select="sitemap:lastmod"/>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
          <div class="footer">
            Total Halaman: <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
