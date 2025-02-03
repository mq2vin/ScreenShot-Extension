const captureButton = document.getElementById('capture-button');

captureButton.addEventListener('click', () => {
    const filenameInput = document.getElementById('filename');
    let baseName = filenameInput.value.trim();

    // Nom par défaut si vide
    if (!baseName) {
        baseName = `screenshot_${Date.now()}`;
    }

    chrome.tabs.captureVisibleTab({ format: 'png' }, (dataUrl) => {
        chrome.downloads.download({
            url: dataUrl,
            filename: `${baseName}.png`
        });
    });
});
