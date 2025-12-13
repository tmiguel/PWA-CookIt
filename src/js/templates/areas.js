export const areasTemplate = `
<div class="page-content">
    <div class="form-header">
        <button id="btn-back-settings" class="btn-back">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
        </button>
        <h2 class="page-title">Gerir Áreas</h2>
    </div>

    <div class="card">
        <div class="input-row">
            <input type="text" id="input-code" class="input-field input-code" placeholder="TALHO" maxlength="5">
            <input type="text" id="input-name" class="input-field" placeholder="Nome (ex: Talho e Peixaria)">
        </div>
        <button id="btn-add" class="btn-discrete">Adicionar</button>
        <p id="error-msg" style="color:var(--danger-color); text-align:center; margin-top:15px; font-size:0.9rem; display:none;"></p>
    </div>

    <h3 class="list-subtitle">Áreas</h3>
    <ul id="list-container" class="manage-list"></ul>
</div>
`;
