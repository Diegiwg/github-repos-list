import { loadRepoInfo } from "../api/api.js";
import { syncLocalData } from "../data/data.js";

const load_repo = document.getElementById("load-repo");
const list_repo = document.getElementById("list-repo");

let local_data_ref = null;

function helperCreateRepoInfoSection(full_name, description) {
    const node = document.createElement("section");
    node.id = "info-repo-item";

    const title_node = document.createElement("h3");
    title_node.id = "title-repo-item";
    title_node.textContent = full_name.split("/")[1].replaceAll("-", " ");

    const desc_node = document.createElement("span");
    desc_node.id = "desc-repo-item";
    desc_node.textContent = !description ? "Não tem descrição" : description;

    node.appendChild(title_node);
    node.appendChild(desc_node);
    return node;
}

function helperCreateRepoControlsSection(repo_id) {
    const node = document.createElement("section");
    node.id = "controls-repo-item";

    const visit_btn = document.createElement("button");
    visit_btn.textContent = "Visitar";
    visit_btn.onclick = () => actionVisitRepoRequest(repo_id);

    const remove_btn = document.createElement("button");
    remove_btn.textContent = "Remover";
    remove_btn.onclick = () => actionRemoveRequest(repo_id);

    node.appendChild(visit_btn);
    node.appendChild(remove_btn);
    return node;
}

function createRepoItem(repo_data) {
    const node = document.createElement("div");
    node.className = "list-repo-item";
    node.setAttribute("repo-id", repo_data.id);

    const repo_info_node = helperCreateRepoInfoSection(
        repo_data.full_name,
        repo_data.description
    );

    const repo_controls_node = helperCreateRepoControlsSection(repo_data.id);

    node.appendChild(repo_info_node);
    node.appendChild(repo_controls_node);
    return node;
}

function renderRepoList() {
    const repos = [];
    Object.values(local_data_ref).forEach((repo) => {
        const node = createRepoItem(repo);
        repos.push(node);
    });

    list_repo.replaceChildren(...repos);
}

function helperVerifySubmitRequest(submit_data) {
    const repo_path = submit_data.split("/");
    if (!repo_path || repo_path.length !== 2) return null;

    return `${repo_path[0].trim()}/${repo_path[1].trim()}`;
}

async function actionSubmitRequest(submit_data) {
    const repo_data = await loadRepoInfo(submit_data);
    if (!repo_data) return;

    local_data_ref[repo_data.id] = repo_data;
    syncLocalData(local_data_ref);
    renderRepoList();
}

function actionRemoveRequest(repo_id) {
    delete local_data_ref[repo_id];
    syncLocalData(local_data_ref);
    renderRepoList();
}

function actionVisitRepoRequest(repo_id) {
    const href = local_data_ref[repo_id].html_url;
    window.open(href, "_blank");
}

function setupRepoLoadForm(local_data) {
    local_data_ref = local_data;

    const repo_path_node = load_repo.querySelector("input");
    repo_path_node.onkeydown = (event) => {
        if (event.key !== "Enter") return;

        const repo_path = helperVerifySubmitRequest(repo_path_node.value);
        if (!repo_path) return;

        actionSubmitRequest(repo_path);
        repo_path_node.value = "";
    };

    const submit_node = load_repo.querySelector("button");
    submit_node.onclick = () => {
        const repo_path = helperVerifySubmitRequest(repo_path_node.value);
        if (!repo_path) return;

        actionSubmitRequest(repo_path);
        repo_path_node.value = "";
    };
}

export { setupRepoLoadForm, renderRepoList };
