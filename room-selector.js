// Room Selector - Shared across all games
(function() {
    var currentRoom = localStorage.getItem('selectedRoom') || 'room_1';
    var urlRoom = new URLSearchParams(window.location.search).get('room');
    if (urlRoom) { currentRoom = urlRoom; localStorage.setItem('selectedRoom', urlRoom); }

    // Inject HTML
    var container = document.createElement('div');
    container.id = 'room-selector';
    container.style.cssText = 'position:fixed;top:10px;right:10px;z-index:10000;display:flex;align-items:center;gap:8px;';
    container.innerHTML = '<div id="room-badge" style="background:rgba(0,0,0,0.85);border:2px solid #a855f7;border-radius:20px;padding:6px 14px;color:#a855f7;font-family:Courier New,monospace;font-size:12px;font-weight:bold;cursor:pointer;box-shadow:0 0 15px rgba(168,85,247,0.4);display:flex;align-items:center;gap:6px;">🏠 <span id="room-current-label">' + currentRoom + '</span> ▼</div>'
        + '<div id="room-panel" style="display:none;position:absolute;top:42px;right:0;background:rgba(10,10,20,0.95);border:2px solid #a855f7;border-radius:12px;padding:12px;min-width:220px;max-height:400px;overflow-y:auto;box-shadow:0 0 25px rgba(168,85,247,0.3);backdrop-filter:blur(10px);">'
        + '<div style="color:#a855f7;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;text-align:center;">Choisir une Room</div>'
        + '<div id="room-list" style="display:flex;flex-direction:column;gap:4px;"></div>'
        + '<div style="margin-top:8px;border-top:1px solid rgba(168,85,247,0.2);padding-top:8px;"><div style="display:flex;gap:4px;">'
        + '<input type="text" id="room-custom-input" placeholder="Nom custom..." style="flex:1;padding:6px 10px;background:rgba(0,0,0,0.5);border:1px solid rgba(168,85,247,0.3);border-radius:6px;color:#fff;font-family:Courier New,monospace;font-size:11px;outline:none;">'
        + '<button id="room-custom-go" style="padding:6px 12px;background:#a855f7;border:none;border-radius:6px;color:#fff;font-weight:bold;font-size:11px;cursor:pointer;">GO</button>'
        + '</div></div></div>';
    document.body.appendChild(container);

    // Toggle panel
    document.getElementById('room-badge').addEventListener('click', function(e) {
        e.stopPropagation();
        var panel = document.getElementById('room-panel');
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        if (panel.style.display === 'block') loadRoomList();
    });
    document.addEventListener('click', function(e) {
        if (!e.target.closest('#room-selector')) document.getElementById('room-panel').style.display = 'none';
    });

    function getBaseHttpUrl() {
        var s = localStorage.getItem('wsServerUrl');
        if (s) return s.replace('wss://', 'https://').replace('ws://', 'http://');
        return 'https://serverbbgithubio-production.up.railway.app';
    }

    function loadRoomList() {
        var list = document.getElementById('room-list');
        list.innerHTML = '<div style="color:#888;font-size:11px;text-align:center;padding:8px;">Chargement...</div>';
        fetch(getBaseHttpUrl() + '/api/rooms').then(function(r) { return r.json(); }).then(function(rooms) {
            list.innerHTML = '';
            for (var i = 1; i <= 20; i++) {
                var roomId = 'room_' + i;
                var room = rooms.find(function(r) { return r.id === roomId; });
                var isActive = room && room.clients > 0;
                var isCurrent = roomId === currentRoom;
                var hasLive = room && room.username;
                var btn = document.createElement('div');
                btn.style.cssText = 'padding:8px 10px;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:8px;transition:all 0.2s;border:1px solid ' + (isCurrent ? '#a855f7' : 'rgba(255,255,255,0.05)') + ';background:' + (isCurrent ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.02)') + ';';
                btn.innerHTML = '<div style="display:flex;align-items:center;gap:6px;">'
                    + '<div style="width:8px;height:8px;border-radius:50%;background:' + (hasLive ? '#22c55e' : isActive ? '#f59e0b' : '#333') + ';box-shadow:0 0 5px ' + (hasLive ? '#22c55e' : 'transparent') + ';"></div>'
                    + '<span style="color:' + (isCurrent ? '#a855f7' : '#ccc') + ';font-family:Courier New,monospace;font-size:12px;font-weight:' + (isCurrent ? 'bold' : 'normal') + ';">' + roomId + '</span>'
                    + '</div>'
                    + '<span style="font-size:10px;color:#888;">' + (hasLive ? '🔴 @' + room.username : (isActive ? room.clients + ' co.' : '')) + '</span>';
                (function(rid) { btn.onclick = function() { switchRoom(rid); }; })(roomId);
                list.appendChild(btn);
            }
            // Custom rooms
            rooms.filter(function(r) { return !r.id.match(/^room_\d+$/); }).forEach(function(r) {
                var isCurr = r.id === currentRoom;
                var btn2 = document.createElement('div');
                btn2.style.cssText = 'padding:8px 10px;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:8px;border:1px solid ' + (isCurr ? '#a855f7' : 'rgba(255,255,255,0.05)') + ';background:' + (isCurr ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.02)') + ';';
                btn2.innerHTML = '<div style="display:flex;align-items:center;gap:6px;"><div style="width:8px;height:8px;border-radius:50%;background:' + (r.username ? '#22c55e' : '#f59e0b') + ';"></div><span style="color:' + (isCurr ? '#a855f7' : '#ccc') + ';font-size:12px;font-weight:bold;">' + r.id + '</span></div><span style="font-size:10px;color:#888;">' + (r.username ? '🔴 @' + r.username : r.clients + ' co.') + '</span>';
                btn2.onclick = function() { switchRoom(r.id); };
                list.appendChild(btn2);
            });
        }).catch(function() {
            list.innerHTML = '<div style="color:#ff6b6b;font-size:11px;text-align:center;padding:8px;">Erreur serveur</div>';
        });
    }

    function switchRoom(roomId) {
        localStorage.setItem('selectedRoom', roomId);
        window.location.reload();
    }

    document.getElementById('room-custom-go').addEventListener('click', function() {
        var n = document.getElementById('room-custom-input').value.trim();
        if (n) switchRoom(n);
    });
    document.getElementById('room-custom-input').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { var n = this.value.trim(); if (n) switchRoom(n); }
    });
})();
