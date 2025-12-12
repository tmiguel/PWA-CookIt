export const unitsTemplate = `
<div class="page-content">
    <div class="form-header">
        <button id="btn-back-settings" class="btn-back">⬅</button>
        <h2 class="page-title">Unidades</h2>
    </div>

    <div class="card">
        <div class="input-row">
            <input type="text" id="input-code" class="input-field input-code" placeholder="KG" maxlength="5">
            <input type="text" id="input-name" class="input-field" placeholder="Nome (ex: Quilograma)">
        </div>
        <button id="btn-add" class="btn-primary">Adicionar Unidade</button>
        <p id="error-msg" style="color:var(--danger-color); text-align:center; margin-top:15px; font-size:0.9rem; display:none;"></p>
    </div>

    <h3 style="margin: 30px 0 15px 0; font-size: 1rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;">Existentes</h3>
    <ul id="list-container" class="manage-list"></ul>
</div>
`;
