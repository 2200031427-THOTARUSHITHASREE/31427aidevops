document.addEventListener('DOMContentLoaded', () => {
    fetchIncidents();
  
    const form = document.getElementById('incidentForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const title = document.getElementById('title').value;
      const description = document.getElementById('description').value;
      const severity = document.getElementById('severity').value;
  
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, severity })
      });
  
      if (res.ok) {
        form.reset();
        fetchIncidents(); // Reload table
      }
    });
  });
  
  async function fetchIncidents() {
    const res = await fetch('/api/incidents');
    const incidents = await res.json();
    const table = document.getElementById('incidentTable');
    table.innerHTML = ''; // Clear
  
    incidents.forEach(incident => {
      const row = `
        <tr>
          <td>${incident.id}</td>
          <td>${incident.title}</td>
          <td>${incident.description}</td>
          <td>${incident.severity}</td>
          <td>${incident.status}</td>
          <td>${new Date(incident.reported_at).toLocaleString()}</td>
        </tr>
      `;
      table.innerHTML += row;
    });
  }
  