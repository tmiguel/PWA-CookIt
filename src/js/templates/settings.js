export const settingsTemplate = `
<div class="page-content">
    <div class="form-header">
        <!-- Título Simples -->
        <h2 class="page-title">Configuração</h2>
    </div>

    <p style="color:var(--text-muted); margin-bottom: 20px; font-size: 0.9rem;">
        Personaliza a tua cozinha.
    </p>

    <!-- MENU LISTA -->
    <div class="settings-menu">
        
        <button id="btn-manage-tags" class="settings-item">
            <div class="settings-info">
                <span class="settings-icon">🏷️</span>
                <span>Gerir Tags</span>
            </div>
            <div class="settings-arrow">❯</div>
        </button>

        <button id="btn-manage-units" class="settings-item">
            <div class="settings-info">
                <span class="settings-icon">⚖️</span>
                <span>Gerir Unidades</span>
            </div>
            <div class="settings-arrow">❯</div>
        </button>

        <button id="btn-manage-areas" class="settings-item">
            <div class="settings-info">
                <span class="settings-icon">🏪</span>
                <span>Gerir Áreas</span>
            </div>
            <div class="settings-arrow">❯</div>
        </button>

    </div>

    <!-- BOTÃO LOGOUT -->
    <div style="margin-top: 40px;">
        <button id="btn-logout" class="btn-discrete" style="border-color: var(--danger-color); color: var(--danger-color);">
            Terminar Sessão
        </button>
    </div>
</div>
`;
