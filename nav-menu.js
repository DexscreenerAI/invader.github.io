// Nav Menu - Shared across all games
(function() {
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';

    var games = {
        auto: [
            { name: '👾 Space Invader', url: 'index.html' },
            { name: '🎈 Tire au Ballon', url: 'tireballon.html' },
            { name: '🎰 Spin', url: 'spin.html' },
            { name: '✈️ JetX', url: 'jetx.html' },
            { name: '💎 Diamant', url: 'diamant.html' },
            { name: '⚔️ BattleBox', url: 'battlebox.html' }
        ],
        manuel: [],
        outils: [
            { name: '🖼️ Image', url: 'image.html' }
        ],
        server: { name: '🌐 Serveur', url: 'https://serverbbgithubio-production.up.railway.app/' }
    };

    var container = document.createElement('div');
    container.id = 'nav-menu';
    container.style.cssText = 'position:fixed;top:10px;left:10px;z-index:10000;';
    container.innerHTML = '<div id="nav-menu-btn" style="background:rgba(0,0,0,0.85);border:2px solid #00f2ff;border-radius:20px;padding:6px 14px;color:#00f2ff;font-family:Courier New,monospace;font-size:12px;font-weight:bold;cursor:pointer;box-shadow:0 0 15px rgba(0,242,255,0.4);display:flex;align-items:center;gap:6px;user-select:none;">🎮 Jeux ▼</div>'
        + '<div id="nav-menu-panel" style="display:none;position:absolute;top:42px;left:0;background:rgba(10,10,20,0.95);border:2px solid #00f2ff;border-radius:12px;padding:12px;min-width:220px;box-shadow:0 0 25px rgba(0,242,255,0.3);backdrop-filter:blur(10px);">'
        + '<div id="nav-menu-content"></div>'
        + '</div>';
    document.body.appendChild(container);

    function buildMenu() {
        var content = document.getElementById('nav-menu-content');
        var html = '';

        // Jeux Auto
        html += '<div style="color:#00f2ff;font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;padding:0 4px;">Jeux Auto</div>';
        games.auto.forEach(function(g) {
            var isCurrent = currentPage === g.url;
            html += '<a href="' + g.url + '" style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;text-decoration:none;transition:all 0.15s;border:1px solid ' + (isCurrent ? '#00f2ff' : 'transparent') + ';background:' + (isCurrent ? 'rgba(0,242,255,0.1)' : 'transparent') + ';margin-bottom:2px;">'
                + '<span style="color:' + (isCurrent ? '#00f2ff' : '#ccc') + ';font-family:Courier New,monospace;font-size:12px;font-weight:' + (isCurrent ? 'bold' : 'normal') + ';">' + g.name + '</span>'
                + (isCurrent ? '<span style="margin-left:auto;font-size:10px;color:#00f2ff;">●</span>' : '')
                + '</a>';
        });

        // Jeux Manuel
        html += '<div style="height:1px;background:rgba(255,255,255,0.1);margin:8px 0;"></div>';
        html += '<div style="color:#ff8800;font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;padding:0 4px;">Jeux Manuel</div>';
        if (games.manuel.length === 0) {
            html += '<div style="color:#555;font-size:11px;padding:6px 10px;font-style:italic;">Bientôt disponible...</div>';
        } else {
            games.manuel.forEach(function(g) {
                var isCurrent = currentPage === g.url;
                html += '<a href="' + g.url + '" style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;text-decoration:none;border:1px solid ' + (isCurrent ? '#ff8800' : 'transparent') + ';background:' + (isCurrent ? 'rgba(255,136,0,0.1)' : 'transparent') + ';margin-bottom:2px;">'
                    + '<span style="color:' + (isCurrent ? '#ff8800' : '#ccc') + ';font-family:Courier New,monospace;font-size:12px;">' + g.name + '</span>'
                    + '</a>';
            });
        }

        // Outils
        html += '<div style="height:1px;background:rgba(255,255,255,0.1);margin:8px 0;"></div>';
        html += '<div style="color:#bb86fc;font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;padding:0 4px;">Outils</div>';
        games.outils.forEach(function(g) {
            var isCurrent = currentPage === g.url;
            html += '<a href="' + g.url + '" style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;text-decoration:none;border:1px solid ' + (isCurrent ? '#bb86fc' : 'transparent') + ';background:' + (isCurrent ? 'rgba(187,134,252,0.1)' : 'transparent') + ';margin-bottom:2px;">'
                + '<span style="color:' + (isCurrent ? '#bb86fc' : '#ccc') + ';font-family:Courier New,monospace;font-size:12px;font-weight:' + (isCurrent ? 'bold' : 'normal') + ';">' + g.name + '</span>'
                + (isCurrent ? '<span style="margin-left:auto;font-size:10px;color:#bb86fc;">●</span>' : '')
                + '</a>';
        });

        // Serveur
        html += '<div style="height:1px;background:rgba(255,255,255,0.1);margin:8px 0;"></div>';
        html += '<a href="' + games.server.url + '" target="_blank" style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;text-decoration:none;background:rgba(76,175,80,0.08);border:1px solid rgba(76,175,80,0.2);margin-bottom:2px;">'
            + '<span style="color:#4CAF50;font-family:Courier New,monospace;font-size:12px;font-weight:bold;">' + games.server.name + '</span>'
            + '<span style="margin-left:auto;font-size:10px;color:#888;">↗</span>'
            + '</a>';

        content.innerHTML = html;
    }

    // Toggle
    document.getElementById('nav-menu-btn').addEventListener('click', function(e) {
        e.stopPropagation();
        var panel = document.getElementById('nav-menu-panel');
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        if (panel.style.display === 'block') buildMenu();
    });
    document.addEventListener('click', function(e) {
        if (!e.target.closest('#nav-menu')) document.getElementById('nav-menu-panel').style.display = 'none';
    });
})();
