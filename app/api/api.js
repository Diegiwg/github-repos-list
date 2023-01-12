async function loadRepoInfo(repo_path) {
    const raw_data = await fetch(`https://api.github.com/repos/${repo_path}`);
    const data = await raw_data.json();

    return data.message ? null : data;
}

export { loadRepoInfo };
