// reference: 
// https://www.youtube.com/watch?v=_SRS8b4LcZ8
// https://editor.p5js.org/slow_izzm/sketches/UgWRuFnIp
const web_app_URL = "https://script.google.com/macros/s/AKfycbzALtjH1-W6-FxL-0-H_pAuvtPDTKveoH4C7pC1ajsgVZ6lygwciVejv0ZKYOMdWT-xoQ/exec";
class SaveData {
    constructor() {
        this.data = [];
    }

    // Load all pins from Google Sheets (GET)
    async loadData() {
        try {
            const res = await fetch(web_app_URL);
            const json = await res.json();
            if (Array.isArray(json)) {
                this.data = json;
            } else {
                this.data = [];
            }
        } catch (e) {
            console.error('Error loading pins from server:', e);
            this.data = [];
        }
    }

    getData() {
        return this.data;
    }

    // Save ONE new pin to Google Sheets (POST)
    async saveOne(pin) {
        try {
            await fetch(web_app_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(pin),
            });
        } catch (e) {
            console.error('Error saving pin to server:', e);
        }
    }
}