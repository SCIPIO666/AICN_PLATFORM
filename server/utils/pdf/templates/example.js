function reportTemplate(data) {
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
            color: #2563eb;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          td, th {
            border: 1px solid #ddd;
            padding: 8px;
          }
        </style>
      </head>

      <body>
        <h1>Patient Report</h1>

        <p>Name: ${data.name}</p>
        <p>Age: ${data.age}</p>

        <table>
          <tr>
            <th>Test</th>
            <th>Result</th>
          </tr>

          ${data.results.map(r => `
            <tr>
              <td>${r.test}</td>
              <td>${r.result}</td>
            </tr>
          `).join('')}
        </table>
      </body>
    </html>
  `;
}

module.exports = reportTemplate;