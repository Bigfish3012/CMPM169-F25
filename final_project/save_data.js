class SaveData {
    constructor() {
        this.data = [];
    }

    addData(data) {
        this.data.push(data);
    }

    saveData() {
        localStorage.setItem('pins', JSON.stringify(this.data));
    }

    loadData() {
        try {
        const raw = localStorage.getItem('pins');
        // Make parsing explicit for readability
        if (raw) {
            this.data = JSON.parse(raw);
        } else {
            this.data = [];
        }
        if (!Array.isArray(this.data)) {
            this.data = [];
        }
        } catch (e) {
        this.data = [];
        }
    }

    setData(data) {
        // Ensure data is always an array
        if (Array.isArray(data)) {
        this.data = data;
        } else {
        this.data = [];
        }
    }

    getData() {
        return this.data;
    }
}