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
        + '<div id="room-panel" style="display:none;position:absolute;top:42px;right:0;background:rgba(10,10,20,0.95);border:2px solid #a855f7;border-radius:12px;padding:12px;min-width:240px;max-height:450px;overflow-y:auto;box-shadow:0 0 25px rgba(168,85,247,0.3);backdrop-filter:blur(10px);">'
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

        var baseUrl = getBaseHttpUrl();
        console.log('[ROOM] Fetching rooms from:', baseUrl + '/api/rooms');

        fetch(baseUrl + '/api/rooms')
        .then(function(r) {
            console.log('[ROOM] Response status:', r.status);
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.json();
        })
        .then(function(data) {
            console.log('[ROOM] Data received:', JSON.stringify(data).substring(0, 200));
            // Support both formats: { rooms: [...] } or plain array
            var rooms = Array.isArray(data) ? data : (data.rooms || []);
            list.innerHTML = '';

            if (rooms.length === 0) {
                // Server returned empty - show 20 rooms anyway
                for (var i = 1; i <= 20; i++) {
                    addRoomButton(list, 'room_' + i, null);
                }
                return;
            }

            rooms.forEach(function(room) {
                addRoomButton(list, room.id, room);
            });

            // If less than 20 rooms returned, fill the rest
            if (rooms.length < 20) {
                for (var j = rooms.length + 1; j <= 20; j++) {
                    var roomId = 'room_' + j;
                    if (!rooms.find(function(r) { return r.id === roomId; })) {
                        addRoomButton(list, roomId, null);
                    }
                }
            }
        })
        .catch(function(err) {
            console.error('[ROOM] Fetch error:', err);
            // Fallback: show 20 rooms without status
            list.innerHTML = '';
            for (var i = 1; i <= 20; i++) {
                addRoomButton(list, 'room_' + i, null);
            }
            var errDiv = document.createElement('div');
            errDiv.style.cssText = 'color:#ff6b6b;font-size:10px;text-align:center;padding:4px;margin-top:4px;';
            errDiv.textContent = 'Serveur hors ligne - sélection manuelle';
            list.appendChild(errDiv);
        });
    }

    function addRoomButton(list, roomId, roomData) {
        var isCurrent = roomId === currentRoom;
        var hasLive = roomData && roomData.username;
        var isActive = roomData && roomData.clients > 0;
        var btn = document.createElement('div');
        btn.style.cssText = 'padding:8px 10px;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:8px;transition:all 0.15s;border:1px solid ' + (isCurrent ? '#a855f7' : 'rgba(255,255,255,0.05)') + ';background:' + (isCurrent ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.02)') + ';';
        btn.onmouseover = function() { if (!isCurrent) this.style.background = 'rgba(168,85,247,0.08)'; };
        btn.onmouseout = function() { if (!isCurrent) this.style.background = 'rgba(255,255,255,0.02)'; };

        var dotColor = hasLive ? '#22c55e' : isActive ? '#f59e0b' : '#333';
        var statusText = hasLive ? '🔴 @' + roomData.username : (isActive ? roomData.clients + ' co.' : '');
        var nameText = (roomData && roomData.name) ? roomData.name : roomId;

        btn.innerHTML = '<div style="display:flex;align-items:center;gap:6px;">'
            + '<div style="width:8px;height:8px;border-radius:50%;background:' + dotColor + ';box-shadow:0 0 5px ' + (hasLive ? '#22c55e' : 'transparent') + ';flex-shrink:0;"></div>'
            + '<span style="color:' + (isCurrent ? '#a855f7' : '#ccc') + ';font-family:Courier New,monospace;font-size:12px;font-weight:' + (isCurrent ? 'bold' : 'normal') + ';">' + nameText + '</span>'
            + '</div>'
            + '<span style="font-size:10px;color:#888;white-space:nowrap;">' + statusText + '</span>';

        btn.onclick = function() { switchRoom(roomId); };
        list.appendChild(btn);
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
