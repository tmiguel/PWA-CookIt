export const tagsTemplate = `
<div class="page-content">
    <div class="form-header">
        <button id="btn-back-settings-tags" style="background:none; border:none; font-size:1.5rem; cursor:pointer;">⬅</button>
        <h2 style="margin:0; flex:1; text-align:center;">Gerir Tags</h2>
        <div style="width:24px;"></div>
    </div>

    <!-- Área de Adicionar (Agora com Code + Name) -->
    <div style="background:var(--surface-color); padding:15px; border-radius:12px; margin-top:20px; border:1px solid var(--border-color);">
        <h4 style="margin-bottom:10px; color:var(--text-light);">Nova Tag</h4>
        
        <div style="display:flex; gap:10px; margin-bottom:10px;">
            <!-- Input Código -->
            <input type="text" id="input-tag-code" class="input-field" placeholder="Cód (Max 5)" maxlength="5" style="width: 100px; text-transform:uppercase;">
            
            <!-- Input Nome -->
            <input type="text" id="input-tag-name" class="input-field" placeholder="Nome (ex: Almoço)" style="flex:1;">
        </div>

        <button id="btn-add-tag" style="width:100%; background:var(--primary-color); color:white; border:none; padding:12px; border-radius:8px; font-weight:bold;">Adicionar Tag</button>
    </div>

    <!-- Feedback de Erro -->
    <p id="tag-error-msg" style="color:red; text-align:center; margin-top:10px; display:none;"></p>

    <!-- Lista -->
    <h4 style="margin: 20px 0 10px 0; color:var(--text-light);">Existentes</h4>
    <ul id="tags-list" class="manage-list">
        <li style="text-align:center; padding:20px; color:#888;">A carregar...</li>
    </ul>
</div>
`;
