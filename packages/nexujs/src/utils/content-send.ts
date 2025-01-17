export const sendErrorLog = (content: string) => {
  function escape(str: string): string {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Error Log</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              color: #333;
              padding: 20px;
              line-height: 1.6;
            }
            pre {
              background-color: #282c34;
              color: #f8f8f2;
              padding: 15px;
              border-radius: 5px;
              overflow-x: auto;
              white-space: pre-wrap;
              word-wrap: break-word;
            }
            h1 {
              color: #ff6347;
            }
            .error-message {
              color: #d9534f;
            }
            .stack-trace {
              color: #5bc0de;
            }
          </style>
        </head>
        <body>
          <h1>Error Log</h1>
          <p class="error-message">There was an error processing your request.</p>
          <pre class="stack-trace">${escape(content)}</pre>
        </body>
      </html>
    `;
};
