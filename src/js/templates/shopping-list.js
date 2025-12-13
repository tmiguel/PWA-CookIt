export const shoppingListTemplate = `
<div class="page-content">
    <div class="form-header">
        <h2 class="page-title">As Minhas Listas</h2>
    </div>

    <!-- SECÇÃO: LISTA ATIVA (DESTAQUE) -->
    <div id="active-list-section" style="margin-bottom: 30px;">
        <h3 class="list-subtitle">A decorrer</h3>
        <div id="active-list-container">
            <!-- O JS vai injetar aqui o tile de destaque ou msg vazia -->
            <p style="color:var(--text-muted); font-size:0.9rem;">Nenhuma lista ativa.</p>
        </div>
    </div>

    <!-- SECÇÃO: HISTÓRICO (TILES) -->
    <div>
        <h3 class="list-subtitle">Histórico</h3>
        <div id="history-list-container" class="lists-grid">
            <!-- Tiles das últimas 5 listas entram aqui -->
            <div style="grid-column: 1/-1; text-align:center; padding:20px; color:#666;">A carregar...</div>
        </div>
        
        <!-- Botão Ver Mais -->
        <button id="btn-load-more" class="btn-discrete" style="margin-top:20px; display:none;">Ver mais antigas</button>
    </div>

    <!-- FAB para criar nova lista -->
    <button id="btn-new-list" class="fab-btn">+</button>
</div>
`;
