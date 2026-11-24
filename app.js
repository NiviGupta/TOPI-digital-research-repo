// ============================================================================
// 1. INITIAL DATASET (Seed Data for TOPI Repository)
// ============================================================================
const initialRepositoryData = [
    {
        id: "topi-2026-084",
        title: "Neural Symbolic Reasoning in Low-Resource Linguistic Corpora",
        authors: ["Dr. Aarav Kulkarni", "Prof. Elena Rostova", "S. Chidambaram"],
        year: 2026,
        discipline: "Computer Science",
        type: "Journal Article",
        doi: "10.5281/topi.2026.084",
        downloads: 412,
        fileSize: "3.1 MB",
        keywords: ["NLP", "Neural-Symbolic AI", "Low-Resource Languages", "Transformers"],
        abstract: "This paper presents a hybrid neural-symbolic framework designed to improve syntactic parsing and semantic extraction in underrepresented regional languages. By integrating formal grammatical constraints directly into the attention mechanism, our architecture reduces training data requirements by 64% while outperforming baseline transformer models across four benchmark evaluation suites."
    },
    {
        id: "topi-2026-041",
        title: "High-Resolution Hydrological & Soil Moisture Dataset for Central India (2015–2025)",
        authors: ["Meera Deshmukh", "R. K. Tiwari", "Ananya Singh"],
        year: 2026,
        discipline: "Environmental Science",
        type: "Dataset",
        doi: "10.5281/topi.2026.041",
        downloads: 895,
        fileSize: "148.5 MB",
        keywords: ["Hydrology", "Remote Sensing", "Climate Resilience", "Open Data"],
        abstract: "A curated, decade-long spatio-temporal dataset combining satellite microwave radiometry with 120 ground-calibrated sensor stations across the Malwa and Chambal basins. Includes quality-controlled daily soil moisture indices, evapotranspiration estimates, and monsoon anomaly metrics formatted in NetCDF and GeoTIFF."
    },
    {
        id: "topi-2025-192",
        title: "Biodegradable Chitosan-Cellulose Scaffolds for Accelerated Dermal Regeneration",
        authors: ["Dr. Kabir Malhotra", "N. Subramanian"],
        year: 2025,
        discipline: "Biomedical Engineering",
        type: "Journal Article",
        doi: "10.5281/topi.2025.192",
        downloads: 630,
        fileSize: "5.4 MB",
        keywords: ["Tissue Engineering", "Biomaterials", "Wound Healing", "Nanofibers"],
        abstract: "We investigate the synthesis and in-vitro biocompatibility of electrospun chitosan-nanocellulose composite scaffolds infused with antimicrobial plant alkaloids. Mechanical tensile testing and fibroblast proliferation assays demonstrate superior porosity and a 2.3x acceleration in cellular migration compared to standard collagen dressings."
    },
    {
        id: "topi-2025-118",
        title: "Digital Public Infrastructure and Rural Micro-Enterprise Formalization",
        authors: ["Vikramaditya Rao", "Dr. Sunita Menon"],
        year: 2025,
        discipline: "Social Sciences",
        type: "Technical Report",
        doi: "10.5281/topi.2025.118",
        downloads: 518,
        fileSize: "1.9 MB",
        keywords: ["Digital Economy", "Financial Inclusion", "Public Policy", "Micro-enterprises"],
        abstract: "Based on longitudinal panel surveys of 2,400 rural merchants, this report evaluates the impact of instant digital payment rails and verifiable digital credentials on credit access and supply chain resilience. Policy recommendations are outlined for lowering compliance friction for women-led micro-enterprises."
    },
    {
        id: "topi-2024-309",
        title: "Quantum Dot Sensitized Perovskite Photovoltaics: Stability Under Thermal Cycling",
        authors: ["Dr. Siddharth Verma", "H. Takahashi", "P. Chatterjee"],
        year: 2024,
        discipline: "Physics & Materials",
        type: "Thesis / Dissertation",
        doi: "10.5281/topi.2024.309",
        downloads: 742,
        fileSize: "12.8 MB",
        keywords: ["Photovoltaics", "Perovskite", "Quantum Dots", "Renewable Energy"],
        abstract: "This doctoral dissertation explores interface passivation strategies using colloidal lead-free quantum dots to mitigate halide segregation in mixed-cation perovskite solar cells. Encapsulated devices retained 94% of their initial 22.8% power conversion efficiency after 1,000 hours of continuous damp-heat and thermal cycling."
    },
    {
        id: "topi-2023-077",
        title: "Zero-Knowledge Proofs for Privacy-Preserving Academic Credential Verification",
        authors: ["Rohan Kulkarni", "Devika Nair"],
        year: 2023,
        discipline: "Computer Science",
        type: "Journal Article",
        doi: "10.5281/topi.2023.077",
        downloads: 1120,
        fileSize: "2.2 MB",
        keywords: ["Cryptography", "Zero-Knowledge Proofs", "EdTech", "Decentralized Identity"],
        abstract: "We propose a lightweight zk-SNARK protocol enabling graduates to prove degree authenticity, GPA thresholds, and institutional accreditation to third-party verifiers without exposing underlying transcript metadata or requiring real-time queries to the issuing university registrar."
    }
];

// ============================================================================
// 2. STATE MANAGEMENT & CONSTANTS
// ============================================================================
let repositoryItems = [];
let selectedDisciplines = new Set();
let selectedTypes = new Set();
let currentActiveItem = null;
let selectedDepositFile = null;
const uploadedFilesStore = {};

const DISCIPLINES = [
    "Computer Science",
    "Environmental Science",
    "Biomedical Engineering",
    "Social Sciences",
    "Physics & Materials"
];

const RESOURCE_TYPES = [
    "Journal Article",
    "Dataset",
    "Thesis / Dissertation",
    "Technical Report"
];

// ============================================================================
// 3. INITIALIZATION & STORAGE
// ============================================================================
function initRepository() {
    try {
        const saved = localStorage.getItem('topi_repository_data');
        if (saved) {
            repositoryItems = JSON.parse(saved);
        } else {
            repositoryItems = [...initialRepositoryData];
            saveData();
        }
    } catch (e) {
        repositoryItems = [...initialRepositoryData];
    }

    renderFilterCheckboxes();
    updateMetrics();
    handleSearchAndFilter();
}

function saveData() {
    try {
        localStorage.setItem('topi_repository_data', JSON.stringify(repositoryItems));
    } catch (e) {
        console.warn("Local storage unavailable");
    }
}

function formatFileSize(bytes) {
    if (!bytes || bytes <= 0) return "1.0 MB";
    if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(1) + " KB";
    }
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function storeUploadedFile(itemId, file, dataUrl) {
    uploadedFilesStore[itemId] = {
        name: file.name,
        type: file.type || 'application/octet-stream',
        dataUrl: dataUrl
    };
    try {
        if (dataUrl && dataUrl.length < 3000000) {
            localStorage.setItem(`topi_file_${itemId}`, JSON.stringify(uploadedFilesStore[itemId]));
        }
    } catch (e) {
        console.warn("File too large for localStorage; kept in session memory.");
    }
}

function getStoredFileForItem(itemId) {
    if (uploadedFilesStore[itemId]) {
        return uploadedFilesStore[itemId];
    }
    try {
        const savedFile = localStorage.getItem(`topi_file_${itemId}`);
        if (savedFile) {
            const parsed = JSON.parse(savedFile);
            uploadedFilesStore[itemId] = parsed;
            return parsed;
        }
    } catch (e) {
        console.warn("Unable to read stored file");
    }
    return null;
}

// ============================================================================
// 4. RENDER FILTERS & METRICS
// ============================================================================
function renderFilterCheckboxes() {
    const discContainer = document.getElementById('discipline-filters');
    discContainer.innerHTML = DISCIPLINES.map(disc => `
        <label class="flex items-center gap-2.5 text-sm text-slate-600 hover:text-slate-900 cursor-pointer select-none">
            <input type="checkbox" value="${disc}" onchange="toggleDiscipline('${disc}')" class="rounded border-slate-300 text-topi-700 focus:ring-topi-500 w-4 h-4">
            <span class="truncate">${disc}</span>
        </label>
    `).join('');

    const typeContainer = document.getElementById('type-filters');
    typeContainer.innerHTML = RESOURCE_TYPES.map(type => `
        <label class="flex items-center gap-2.5 text-sm text-slate-600 hover:text-slate-900 cursor-pointer select-none">
            <input type="checkbox" value="${type}" onchange="toggleType('${type}')" class="rounded border-slate-300 text-topi-700 focus:ring-topi-500 w-4 h-4">
            <span class="truncate">${type}</span>
        </label>
    `).join('');
}

function updateMetrics() {
    const totalWorks = repositoryItems.length;
    const totalDownloads = repositoryItems.reduce((sum, item) => sum + item.downloads, 0);
    
    document.getElementById('metric-total').textContent = totalWorks.toLocaleString();
    document.getElementById('metric-downloads').textContent = totalDownloads.toLocaleString();
}

// ============================================================================
// 5. SEARCH, FILTER & SORT LOGIC
// ============================================================================
function toggleDiscipline(disc) {
    if (selectedDisciplines.has(disc)) {
        selectedDisciplines.delete(disc);
    } else {
        selectedDisciplines.add(disc);
    }
    handleSearchAndFilter();
}

function toggleType(type) {
    if (selectedTypes.has(type)) {
        selectedTypes.delete(type);
    } else {
        selectedTypes.add(type);
    }
    handleSearchAndFilter();
}

function clearSearch() {
    document.getElementById('search-input').value = '';
    handleSearchAndFilter();
}

function resetFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('year-filter').value = 'all';
    document.getElementById('sort-select').value = 'newest';
    selectedDisciplines.clear();
    selectedTypes.clear();

    document.querySelectorAll('#discipline-filters input, #type-filters input').forEach(cb => cb.checked = false);
    handleSearchAndFilter();
}

function handleSearchAndFilter() {
    const query = document.getElementById('search-input').value.trim().toLowerCase();
    const yearFilter = document.getElementById('year-filter').value;
    const sortBy = document.getElementById('sort-select').value;

    const clearBtn = document.getElementById('clear-search-btn');
    if (query.length > 0) {
        clearBtn.classList.remove('hidden');
    } else {
        clearBtn.classList.add('hidden');
    }

    let filtered = repositoryItems.filter(item => {
        const matchesQuery = !query || 
            item.title.toLowerCase().includes(query) ||
            item.abstract.toLowerCase().includes(query) ||
            item.doi.toLowerCase().includes(query) ||
            item.authors.some(a => a.toLowerCase().includes(query)) ||
            item.keywords.some(k => k.toLowerCase().includes(query));

        const matchesDisc = selectedDisciplines.size === 0 || selectedDisciplines.has(item.discipline);
        const matchesType = selectedTypes.size === 0 || selectedTypes.has(item.type);

        let matchesYear = true;
        if (yearFilter === '2023') {
            matchesYear = item.year <= 2023;
        } else if (yearFilter !== 'all') {
            matchesYear = item.year === parseInt(yearFilter);
        }

        return matchesQuery && matchesDisc && matchesType && matchesYear;
    });

    filtered.sort((a, b) => {
        if (sortBy === 'newest') return b.year - a.year;
        if (sortBy === 'oldest') return a.year - b.year;
        if (sortBy === 'downloads') return b.downloads - a.downloads;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
    });

    const isFiltered = query || selectedDisciplines.size > 0 || selectedTypes.size > 0 || yearFilter !== 'all';
    const badge = document.getElementById('active-filter-badge');
    if (isFiltered) {
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }

    renderRepositoryList(filtered);
}

// ============================================================================
// 6. RENDER REPOSITORY CARDS
// ============================================================================
function getTypeBadgeStyle(type) {
    switch(type) {
        case 'Dataset': return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'Thesis / Dissertation': return 'bg-amber-100 text-amber-800 border-amber-200';
        case 'Technical Report': return 'bg-teal-100 text-teal-800 border-teal-200';
        default: return 'bg-sky-100 text-sky-800 border-sky-200';
    }
}

function getTypeIcon(type) {
    switch(type) {
        case 'Dataset': return 'fa-database';
        case 'Thesis / Dissertation': return 'fa-graduation-cap';
        case 'Technical Report': return 'fa-file-lines';
        default: return 'fa-file-contract';
    }
}

function renderRepositoryList(items) {
    const listContainer = document.getElementById('repository-list');
    const emptyState = document.getElementById('empty-state');
    document.getElementById('results-count').textContent = items.length;

    if (items.length === 0) {
        listContainer.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    listContainer.innerHTML = items.map(item => `
        <article class="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-slate-200 hover:border-topi-500/50 hover:shadow-md transition group">
            <div class="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                <div class="flex items-center gap-2 flex-wrap">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${getTypeBadgeStyle(item.type)}">
                        <i class="fa-solid ${getTypeIcon(item.type)}"></i> ${item.type}
                    </span>
                    <span class="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                        ${item.discipline}
                    </span>
                    <span class="text-xs font-semibold text-slate-600">
                        • ${item.year}
                    </span>
                </div>
                <span class="text-xs font-mono text-slate-400">DOI: ${item.doi}</span>
            </div>

            <h3 onclick="openDetailModal('${item.id}')" class="text-lg sm:text-xl font-serif font-bold text-slate-900 group-hover:text-topi-700 cursor-pointer transition mb-2 leading-snug">
                ${item.title}
            </h3>

            <div class="text-sm text-slate-600 font-medium mb-3">
                <i class="fa-solid fa-user-pen text-slate-400 mr-1.5 text-xs"></i>
                ${item.authors.join(', ')}
            </div>

            <p class="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                ${item.abstract}
            </p>

            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <div class="flex flex-wrap gap-1.5">
                    ${item.keywords.slice(0, 3).map(kw => `
                        <span class="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            #${kw}
                        </span>
                    `).join('')}
                </div>

                <div class="flex items-center gap-4 self-end sm:self-auto">
                    <span class="text-xs text-slate-500 flex items-center gap-1" title="Total Downloads">
                        <i class="fa-solid fa-download text-slate-400"></i> ${item.downloads}
                    </span>
                    <button onclick="openDetailModal('${item.id}')" class="text-sm font-semibold text-topi-700 hover:text-topi-900 flex items-center gap-1 transition">
                        View Record <i class="fa-solid fa-arrow-right text-xs"></i>
                    </button>
                </div>
            </div>
        </article>
    `).join('');
}

// ============================================================================
// 7. DETAIL MODAL & ACTIONS
// ============================================================================
function openDetailModal(id) {
    const item = repositoryItems.find(i => i.id === id);
    if (!item) return;
    currentActiveItem = item;

    document.getElementById('modal-type-badge').textContent = item.type;
    document.getElementById('modal-year-badge').textContent = `Published ${item.year}`;
    document.getElementById('modal-title').textContent = item.title;
    document.getElementById('modal-doi').textContent = item.doi;
    document.getElementById('modal-discipline').textContent = item.discipline;
    document.getElementById('modal-abstract').textContent = item.abstract;
    document.getElementById('modal-filesize').textContent = item.fileSize;

    document.getElementById('modal-authors').innerHTML = item.authors.map(author => `
        <span class="bg-topi-50 text-topi-800 border border-topi-100 px-2.5 py-1 rounded-md text-xs">
            <i class="fa-solid fa-user-graduate mr-1 opacity-70"></i>${author}
        </span>
    `).join('');

    document.getElementById('modal-keywords').innerHTML = item.keywords.map(kw => `
        <span class="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-medium">
            ${kw}
        </span>
    `).join('');

    const authorList = item.authors.join(', ');
    const citation = `${authorList} (${item.year}). ${item.title}. TOPI Digital Research Repository. https://doi.org/${item.doi}`;
    document.getElementById('modal-citation').textContent = citation;

    const downloadBtn = document.getElementById('modal-download-btn');
    downloadBtn.onclick = () => triggerDocumentDownload(item);

    document.getElementById('detail-modal').classList.remove('hidden');
}

function closeDetailModal() {
    document.getElementById('detail-modal').classList.add('hidden');
    currentActiveItem = null;
}

function copyCitation() {
    const citationText = document.getElementById('modal-citation').textContent;
    const tempInput = document.createElement('textarea');
    tempInput.value = citationText;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    
    showToast('Citation copied to clipboard!', 'success');
}

function triggerDocumentDownload(item) {
    item.downloads += 1;
    saveData();
    updateMetrics();
    handleSearchAndFilter();

    const storedFile = getStoredFileForItem(item.id);
    if (storedFile && storedFile.dataUrl) {
        const a = document.createElement('a');
        a.href = storedFile.dataUrl;
        a.download = storedFile.name || `${item.id}-TOPI-Document.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast(`Downloading "${storedFile.name}"...`, 'info');
        return;
    }

    const fileContent = `TOPI DIGITAL RESEARCH REPOSITORY - ARCHIVAL RECORD\n` +
        `==================================================\n` +
        `Title: ${item.title}\n` +
        `Authors: ${item.authors.join(', ')}\n` +
        `Year: ${item.year}\n` +
        `Discipline: ${item.discipline}\n` +
        `Resource Type: ${item.type}\n` +
        `Persistent DOI: https://doi.org/${item.doi}\n` +
        `License: Creative Commons Attribution 4.0 International (CC BY 4.0)\n\n` +
        `ABSTRACT\n--------\n${item.abstract}\n\n` +
        `KEYWORDS\n--------\n${item.keywords.join(', ')}\n`;

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.id}-TOPI-Archive.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`Downloading "${item.id}" archival package...`, 'info');
}

// ============================================================================
// 8. DEPOSIT / SUBMIT MODAL LOGIC
// ============================================================================
function resetFileDropzoneUI() {
    selectedDepositFile = null;
    const fileInput = document.getElementById('input-file');
    if (fileInput) fileInput.value = '';

    const icon = document.getElementById('file-upload-icon');
    const label = document.getElementById('file-upload-label');
    const sublabel = document.getElementById('file-upload-sublabel');
    const dropzone = document.getElementById('file-dropzone');

    if (icon) icon.className = 'fa-solid fa-file-arrow-up text-slate-400 text-2xl mb-1.5';
    if (label) label.textContent = 'Click here to choose a PDF or dataset from your device';
    if (sublabel) sublabel.textContent = 'Supports PDF, CSV, TXT, ZIP • Persistent DOI minted automatically';
    if (dropzone) {
        dropzone.classList.remove('border-emerald-500', 'bg-emerald-50/40');
        dropzone.classList.add('border-slate-300', 'bg-slate-50');
    }
}

function handleFileSelection(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) {
        resetFileDropzoneUI();
        return;
    }

    selectedDepositFile = file;
    const icon = document.getElementById('file-upload-icon');
    const label = document.getElementById('file-upload-label');
    const sublabel = document.getElementById('file-upload-sublabel');
    const dropzone = document.getElementById('file-dropzone');

    if (icon) icon.className = 'fa-solid fa-file-circle-check text-emerald-600 text-2xl mb-1.5';
    if (label) label.textContent = `Selected: ${file.name}`;
    if (sublabel) sublabel.textContent = `Size: ${formatFileSize(file.size)} • Ready to upload & mint DOI`;
    if (dropzone) {
        dropzone.classList.remove('border-slate-300', 'bg-slate-50');
        dropzone.classList.add('border-emerald-500', 'bg-emerald-50/40');
    }
}

function openSubmitModal() {
    resetFileDropzoneUI();
    document.getElementById('submit-modal').classList.remove('hidden');
}

function closeSubmitModal() {
    document.getElementById('submit-modal').classList.add('hidden');
    document.getElementById('deposit-form').reset();
    resetFileDropzoneUI();
}

function finalizeDepositRecord(newRecord, file, dataUrl) {
    if (file && dataUrl) {
        storeUploadedFile(newRecord.id, file, dataUrl);
    }
    repositoryItems.unshift(newRecord);
    saveData();
    updateMetrics();
    resetFilters();
    closeSubmitModal();
    showToast(`Research published! Minted DOI: ${newRecord.doi}`, 'success');
}

function handleDepositSubmit(event) {
    event.preventDefault();

    const title = document.getElementById('input-title').value.trim();
    const authorsRaw = document.getElementById('input-authors').value;
    const year = parseInt(document.getElementById('input-year').value);
    const discipline = document.getElementById('input-discipline').value;
    const type = document.getElementById('input-type').value;
    const abstract = document.getElementById('input-abstract').value.trim();
    const keywordsRaw = document.getElementById('input-keywords').value;

    const randomNum = Math.floor(100 + Math.random() * 900);
    const newId = `topi-${year}-${randomNum}`;
    const newDoi = `10.5281/topi.${year}.${randomNum}`;

    const fileToUpload = selectedDepositFile || (document.getElementById('input-file').files && document.getElementById('input-file').files[0]) || null;

    const newRecord = {
        id: newId,
        title: title,
        authors: authorsRaw.split(',').map(a => a.trim()).filter(Boolean),
        year: year,
        discipline: discipline,
        type: type,
        doi: newDoi,
        downloads: 1,
        fileSize: fileToUpload ? formatFileSize(fileToUpload.size) : (Math.random() * 8 + 1.2).toFixed(1) + " MB",
        keywords: keywordsRaw.split(',').map(k => k.trim()).filter(Boolean),
        abstract: abstract
    };

    if (fileToUpload) {
        const reader = new FileReader();
        reader.onload = function(e) {
            finalizeDepositRecord(newRecord, fileToUpload, e.target.result);
        };
        reader.onerror = function() {
            finalizeDepositRecord(newRecord, null, null);
        };
        reader.readAsDataURL(fileToUpload);
    } else {
        finalizeDepositRecord(newRecord, null, null);
    }
}

// ============================================================================
// 9. ANALYTICS MODAL
// ============================================================================
function toggleStatsModal() {
    const modal = document.getElementById('stats-modal');
    if (modal.classList.contains('hidden')) {
        renderAnalytics();
        modal.classList.remove('hidden');
    } else {
        modal.classList.add('hidden');
    }
}

function renderAnalytics() {
    const container = document.getElementById('analytics-content');
    const total = repositoryItems.length;

    const discCounts = {};
    DISCIPLINES.forEach(d => discCounts[d] = 0);
    repositoryItems.forEach(item => {
        discCounts[item.discipline] = (discCounts[item.discipline] || 0) + 1;
    });

    container.innerHTML = `
        <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Holdings by Academic Discipline</h3>
            <div class="space-y-3">
                ${Object.entries(discCounts).map(([disc, count]) => {
                    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                    return `
                        <div>
                            <div class="flex justify-between text-xs font-medium text-slate-700 mb-1">
                                <span>${disc}</span>
                                <span>${count} works (${pct}%)</span>
                            </div>
                            <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                <div class="bg-topi-700 h-2.5 rounded-full transition-all duration-500" style="width: ${pct}%"></div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
        <div class="pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
            <span>Repository Status: <strong class="text-emerald-600">Operational</strong></span>
            <button onclick="resetDemoData()" class="text-rose-600 hover:underline font-medium">Reset Demo Data</button>
        </div>
    `;
}

function resetDemoData() {
    repositoryItems = [...initialRepositoryData];
    saveData();
    updateMetrics();
    resetFilters();
    renderAnalytics();
    showToast('Repository restored to default catalog.', 'info');
}

// ============================================================================
// 10. TOAST NOTIFICATION SYSTEM
// ============================================================================
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    const colors = type === 'success' 
        ? 'bg-emerald-800 text-white border-emerald-700' 
        : 'bg-slate-800 text-white border-slate-700';
    const icon = type === 'success' ? 'fa-circle-check text-emerald-400' : 'fa-circle-info text-sky-400';

    toast.className = `${colors} border px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2.5 pointer-events-auto transition-all duration-300 transform translate-y-2 opacity-0`;
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;

    container.appendChild(toast);
    
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-2', 'opacity-0');
    });

    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// Initialize immediately when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRepository);
} else {
    initRepository();
}