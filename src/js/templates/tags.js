export const tagsTemplate = `
<div class="page-content">
    <div class="form-header">
        <button id="btn-back-settings" style="background:none; border:none; font-size:1.5rem; cursor:pointer;">⬅</button>
        <h2 style="margin:0; flex:1; text-align:center;">Gerir Tags</h2>
        <div style="width:24px;"></div>
    </div>

    <!-- Área de Adicionar -->
    <div style="background:var(--surface-color); padding:15px; border-radius:12px; margin-top:20px; border:1px solid var(--border-color);">
        <div style="display:flex; gap:10px; margin-bottom:10px;">
            <!-- Input Código -->
            <input type="text" id="input-code" class="input-field" placeholder="Cód (PEQ)" maxlength="5" style="width:100px; text-transform:uppercase;">
            
            <!-- Input Nome -->
            <input type="text" id="input-name" class="input-field" placeholder="Nome (Pequeno Almoço)" style="flex:1;">
        </div>
        <button id="btn-add" style="width:100%; background:var(--primary-color); color:white; border:none; padding:12px; border-radius:8px; font-weight:bold;">Adicionar</button>
    </div>

    <!-- Feedback de Erro -->
    <p id="error-msg" style="color:red; text-align:center; margin-top:10px; display:none;"></p>

    <!-- Lista -->
    <ul id="list-container" class="manage-list"></ul>
</div>
`;
