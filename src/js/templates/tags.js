export const tagsTemplate = `
<div class="page-content">
    <div class="form-header">
        <button id="btn-back-settings-tags" style="background:none; border:none; font-size:1.5rem; cursor:pointer;">⬅</button>
        <h2 style="margin:0; flex:1; text-align:center;">Gerir Tags</h2>
        <div style="width:24px;"></div>
    </div>

    <!-- Área de Adicionar -->
    <div style="display:flex; gap:10px; margin-top:20px;">
        <input type="text" id="input-new-tag" class="input-field" placeholder="Nova tag (ex: Almoço)">
        <button id="btn-add-tag" style="background:var(--primary-color); color:white; border:none; padding:0 15px; border-radius:8px; font-weight:bold;">OK</button>
    </div>

    <!-- Lista de Tags -->
    <ul id="tags-list" class="manage-list">
        <li style="text-align:center; padding:20px; color:#888;">A carregar...</li>
    </ul>
</div>
`;
