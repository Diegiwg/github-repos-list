import { loadLocalData } from "./data/data.js";
import { setupRepoLoadForm, renderRepoList } from "./client/client.js";

const data = loadLocalData();
setupRepoLoadForm(data);
renderRepoList();
