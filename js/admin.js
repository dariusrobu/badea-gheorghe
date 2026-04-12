/**
 * Admin Logic for Badea Gheorghe Local Dashboard
 */

document.addEventListener('DOMContentLoaded', function() {
    const subscribersBody = document.getElementById('subscribersBody');
    const loadingState = document.getElementById('loading');
    const noDataState = document.getElementById('noData');
    const totalSubscribersOutput = document.getElementById('totalSubscribers');
    const newTodayOutput = document.getElementById('newToday');
    const campaignsSentOutput = document.getElementById('campaignsSent');
    const exportCsvBtn = document.getElementById('exportCsv');

    const LOCAL_API = '/api/subscribers';

    // Initial fetch
    fetchSubscribers();

    /**
     * Fetch all subscribers from local backend
     */
    async function fetchSubscribers() {
        try {
            showLoading(true);
            const response = await fetch(LOCAL_API);
            
            if (!response.ok) {
                throw new Error('Could not connect to local backend. Make sure it is running.');
            }

            const data = await response.json();
            renderSubscribers(data);
            updateStats(data);
        } catch (error) {
            console.error('Fetch Error:', error);
            subscribersBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #d32f2f; padding: 2rem;">Error: ${error.message}</td></tr>`;
        } finally {
            showLoading(false);
        }
    }

    /**
     * Render the table rows
     */
    function renderSubscribers(subscribers) {
        if (!subscribers || subscribers.length === 0) {
            subscribersBody.innerHTML = '';
            noDataState.style.display = 'block';
            return;
        }

        noDataState.style.display = 'none';
        subscribersBody.innerHTML = subscribers.map(sub => `
            <tr data-id="${sub.id}">
                <td>#${sub.id}</td>
                <td style="font-weight: 600;">${sub.email}</td>
                <td style="color: #666; font-size: 0.9rem;">${formatDate(sub.subscribed_at)}</td>
                <td>
                    <button class="btn-delete" title="Șterge" onclick="deleteSubscriber(${sub.id})">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    /**
     * Update stats cards
     */
    function updateStats(subscribers) {
        totalSubscribersOutput.textContent = subscribers.length;
        
        // Count today's signups
        const today = new Date().toISOString().split('T')[0];
        const todayCount = subscribers.filter(sub => 
            sub.subscribed_at.startsWith(today)
        ).length;
        
        newTodayOutput.textContent = todayCount;
        
        // Campaigns sent (mock stat for now)
        campaignsSentOutput.textContent = '0';
    }

    /**
     * Delete a subscriber
     */
    window.deleteSubscriber = async function(id) {
        if (!confirm('Ești sigur că vrei să ștergi acest abonat?')) return;

        try {
            const response = await fetch(`${LOCAL_API}?id=${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Remove from UI
                const row = document.querySelector(`tr[data-id="${id}"]`);
                if (row) {
                    row.style.opacity = '0.3';
                    row.style.pointerEvents = 'none';
                    setTimeout(() => fetchSubscribers(), 500);
                }
            } else {
                throw new Error('Failed to delete');
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    /**
     * Export to CSV
     */
    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', async function() {
            try {
                const response = await fetch(LOCAL_API);
                const data = await response.json();
                
                if (data.length === 0) return alert('No data to export');

                const csvContent = "data:text/csv;charset=utf-8," 
                    + "ID,Email,Date\n"
                    + data.map(sub => `${sub.id},${sub.email},${sub.subscribed_at}`).join("\n");

                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", `subscribers_${new Date().toISOString().split('T')[0]}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                alert('Export failed: ' + error.message);
            }
        });
    }

    /**
     * Helpers
     */
    function showLoading(show) {
        loadingState.style.display = show ? 'block' : 'none';
    }

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ro-RO', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
});
