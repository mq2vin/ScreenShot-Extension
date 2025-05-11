document.getElementById('capture-button').addEventListener('click', async () => {
    const filenameInput = document.getElementById('filename');
    let baseName = filenameInput.value.trim() || `screenshot_${Date.now()}`;

    try {
        const messageElement = document.createElement('div');
        messageElement.textContent = "Patientez, la capture d'écran est en cours de traitement...";
        messageElement.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #14C378; color: white; padding: 15px; border-radius: 6px; z-index: 9999;';
        document.body.appendChild(messageElement);
        setTimeout(() => document.body.removeChild(messageElement), 3000);

        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['lib/html2canvas.min.js']
        });

        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: async (fileName) => {
                try {
                    const canvas = await html2canvas(document.documentElement, {
                        allowTaint: false,
                        useCORS: true,
                        logging: false
                    });
                    
                    const link = document.createElement('a');
                    link.download = `${fileName}.png`;
                    link.href = canvas.toDataURL('image/png');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } catch (error) {
                    console.error('Erreur de capture:', error);
                }
            },
            args: [baseName]
        });
    } catch (error) {
        console.error('Erreur:', error);
    }
});