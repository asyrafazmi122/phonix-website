document.addEventListener('DOMContentLoaded', function() {
  fetch('fetch_reports.php')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const tableBody = document.getElementById('reports-data');
      
      if (data.error) {
        tableBody.innerHTML = `<tr><td colspan="6">${data.error}</td></tr>`;
        return;
      }

      if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6">No reports found</td></tr>';
        return;
      }

      let html = '';
      data.forEach(report => {
        const reportDate = new Date(report.submission_date).toLocaleString();
        
        html += `
          <tr>
            <td>${report.id}</td>
            <td>${report.name}</td>
            <td>${report.email}</td>
            <td>${report.subject}</td>
            <td class="message-cell">${report.message}</td>
            <td>${reportDate}</td>
          </tr>
        `;
      });

      tableBody.innerHTML = html;
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('reports-data').innerHTML = 
        '<tr><td colspan="6">Error loading reports. Please try again.</td></tr>';
    });
});