function loadLocalData() {
    const raw_data = window.localStorage.getItem("repo-list");
    return !raw_data ? {} : JSON.parse(raw_data);
}

function syncLocalData(data) {
    if (!data) return;
    window.localStorage.setItem("repo-list", JSON.stringify(data));
}

export { loadLocalData, syncLocalData };
