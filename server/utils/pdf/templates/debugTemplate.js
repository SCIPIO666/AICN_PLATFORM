function debugTemplate() {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial;
            padding: 40px;
          }

          h1 {
            color: blue;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }

          th, td {
            border: 1px solid #ddd;
            padding: 10px;
          }
        </style>
      </head>

      <body>
        <h1>PDF Debug Test</h1>

        <p>
          Puppeteer PDF generation working.
        </p>

        <table>
          <tr>
            <th>Test</th>
            <th>Status</th>
          </tr>

          <tr>
            <td>PDF</td>
            <td>Success</td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

module.exports = debugTemplate;