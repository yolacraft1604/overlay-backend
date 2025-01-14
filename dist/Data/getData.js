export async function getData() {
    try {
        const response = await fetch('https://mcsrranked.com/api/matches/');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        return (JSON.stringify(jsonData, null, 2));
    }
    catch (error) {
        console.error('ERROR:', error);
        return "ERROR";
    }
}
export async function getMatchData(id) {
    try {
        const response = await fetch('https://mcsrranked.com/api/matches/' + id);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        return (JSON.stringify(jsonData, null, 2));
    }
    catch (error) {
        console.error('ERROR:', error);
        return "ERROR";
    }
}
//# sourceMappingURL=getData.js.map