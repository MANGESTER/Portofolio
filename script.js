(function(){
  const DAY_ORDER = ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu","Minggu"];
  const STORAGE_PREFIX = "agenda-planner:";
  let state = { todo: [], jadwal: [], acara: [] };
  let todoFilter = "semua";

  // ---------- storage helpers (localStorage, jalan penuh di browser lokal / VS Code Live Server) ----------
  function loadAll(){
    for(const key of ["todo","jadwal","acara"]){
      try{
        const raw = localStorage.getItem(STORAGE_PREFIX + key);
        state[key] = raw ? JSON.parse(raw) : [];
      }catch(e){
        console.error("Gagal memuat", key, e);
        state[key] = [];
      }
    }
    renderTodo(); renderJadwal(); renderAcara();
  }
  function save(key){
    try{
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(state[key]));
    }catch(e){
      console.error("Gagal menyimpan", key, e);
      showToast("Gagal menyimpan data. Coba lagi.");
    }
  }

  function showToast(msg){
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(()=>t.classList.remove('show'), 2200);
  }
  function uid(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,7); }
  function fmtDate(iso){
    if(!iso) return "—";
    const d = new Date(iso+"T00:00:00");
    return d.toLocaleDateString('id-ID', {day:'2-digit', month:'short', year:'numeric'});
  }

  // ---------- tabs ----------
  document.querySelectorAll('.tab-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      ['todo','jadwal','acara'].forEach(t=>{
        document.getElementById('tab-'+t).style.display = (t===btn.dataset.tab) ? 'block':'none';
      });
    });
  });

  // ===================== TO-DO =====================
  function renderTodo(){
    const wrap = document.getElementById('todo-list');
    let items = state.todo.slice().sort((a,b)=>{
      if(a.done !== b.done) return a.done ? 1 : -1;
      return (a.tanggal||"9999").localeCompare(b.tanggal||"9999");
    });
    if(todoFilter === "belum") items = items.filter(i=>!i.done);
    if(todoFilter === "selesai") items = items.filter(i=>i.done);

    if(items.length===0){
      wrap.innerHTML = '<div class="empty">Belum ada tugas di kategori ini. Tambahkan tugas pertamamu di atas.</div>';
      return;
    }
    wrap.innerHTML = items.map(i=>`
      <div class="item ${i.done?'done':''}">
        <div class="checkbox ${i.done?'checked':''}" data-id="${i.id}" data-action="toggle"></div>
        <div class="item-body">
          <div class="item-title">${escapeHtml(i.judul)}</div>
          <div class="item-meta">
            <span class="badge">${escapeHtml(i.kategori)}</span>
            <span class="badge"><span class="dot ${i.prioritas.toLowerCase()}"></span>${i.prioritas}</span>
            <span class="badge">📅 ${fmtDate(i.tanggal)}</span>
          </div>
        </div>
        <button class="del-btn" data-id="${i.id}" data-action="delete-todo" title="Hapus">✕</button>
      </div>
    `).join('');
  }

  document.getElementById('todo-add').addEventListener('click', ()=>{
    const judul = document.getElementById('todo-title').value.trim();
    if(!judul){ showToast("Isi nama tugas dulu ya"); return; }
    state.todo.push({
      id: uid(),
      judul,
      kategori: document.getElementById('todo-kategori').value,
      tanggal: document.getElementById('todo-tanggal').value,
      prioritas: document.getElementById('todo-prioritas').value,
      done: false
    });
    document.getElementById('todo-title').value = '';
    document.getElementById('todo-tanggal').value = '';
    save('todo'); renderTodo();
  });

  document.getElementById('todo-list').addEventListener('click', (e)=>{
    const el = e.target.closest('[data-action]');
    if(!el) return;
    const id = el.dataset.id;
    if(el.dataset.action === 'toggle'){
      const item = state.todo.find(t=>t.id===id);
      if(item){ item.done = !item.done; save('todo'); renderTodo(); }
    }
    if(el.dataset.action === 'delete-todo'){
      state.todo = state.todo.filter(t=>t.id!==id);
      save('todo'); renderTodo();
    }
  });

  document.querySelectorAll('.filter-row button').forEach(b=>{
    b.addEventListener('click', ()=>{
      document.querySelectorAll('.filter-row button').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      todoFilter = b.dataset.filter;
      renderTodo();
    });
  });

  // ===================== JADWAL =====================
  function renderJadwal(){
    const wrap = document.getElementById('jadwal-table-wrap');
    if(state.jadwal.length===0){
      wrap.innerHTML = '<div class="empty">Jadwal kuliah masih kosong. Tambahkan mata kuliah pertamamu di atas.</div>';
      return;
    }
    const sorted = state.jadwal.slice().sort((a,b)=>{
      const da = DAY_ORDER.indexOf(a.hari), db = DAY_ORDER.indexOf(b.hari);
      if(da!==db) return da-db;
      return (a.mulai||"").localeCompare(b.mulai||"");
    });
    let rows = '';
    let lastDay = null;
    sorted.forEach(j=>{
      if(j.hari !== lastDay){
        rows += `<tr class="day-head"><td colspan="5">${j.hari}</td></tr>`;
        lastDay = j.hari;
      }
      rows += `<tr>
        <td>${j.mulai||'—'} – ${j.selesai||'—'}</td>
        <td>${escapeHtml(j.matkul)}</td>
        <td>${escapeHtml(j.dosen||'—')}</td>
        <td>${escapeHtml(j.ruang||'—')}</td>
        <td><button class="del-btn" data-id="${j.id}" data-action="delete-jadwal">✕</button></td>
      </tr>`;
    });
    wrap.innerHTML = `<table>
      <thead><tr><th>Jam</th><th>Mata Kuliah</th><th>Dosen</th><th>Ruangan</th><th></th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
  }

  document.getElementById('jadwal-add').addEventListener('click', ()=>{
    const matkul = document.getElementById('jadwal-matkul').value.trim();
    if(!matkul){ showToast("Isi nama mata kuliah dulu ya"); return; }
    state.jadwal.push({
      id: uid(),
      hari: document.getElementById('jadwal-hari').value,
      mulai: document.getElementById('jadwal-mulai').value,
      selesai: document.getElementById('jadwal-selesai').value,
      matkul,
      dosen: document.getElementById('jadwal-dosen').value.trim(),
      ruang: document.getElementById('jadwal-ruang').value.trim()
    });
    document.getElementById('jadwal-matkul').value = '';
    document.getElementById('jadwal-dosen').value = '';
    document.getElementById('jadwal-ruang').value = '';
    save('jadwal'); renderJadwal();
  });

  document.getElementById('jadwal-table-wrap').addEventListener('click', (e)=>{
    const el = e.target.closest('[data-action="delete-jadwal"]');
    if(!el) return;
    state.jadwal = state.jadwal.filter(j=>j.id!==el.dataset.id);
    save('jadwal'); renderJadwal();
  });

  // ===================== ACARA =====================
  function renderAcara(){
    const wrap = document.getElementById('acara-list');
    if(state.acara.length===0){
      wrap.innerHTML = '<div class="empty">Belum ada acara. Tambahkan agenda pertamamu di atas.</div>';
      return;
    }
    const sorted = state.acara.slice().sort((a,b)=>{
      return (a.tanggal||"9999").localeCompare(b.tanggal||"9999") || (a.waktu||"").localeCompare(b.waktu||"");
    });
    wrap.innerHTML = sorted.map(a=>`
      <div class="item">
        <div class="item-body">
          <div class="item-title">${escapeHtml(a.nama)}</div>
          <div class="item-meta">
            <span class="badge">📅 ${fmtDate(a.tanggal)}</span>
            <span class="badge">🕒 ${a.waktu||'—'}</span>
            <span class="badge">📍 ${escapeHtml(a.lokasi||'—')}</span>
          </div>
        </div>
        <button class="del-btn" data-id="${a.id}" data-action="delete-acara">✕</button>
      </div>
    `).join('');
  }

  document.getElementById('acara-add').addEventListener('click', ()=>{
    const nama = document.getElementById('acara-nama').value.trim();
    if(!nama){ showToast("Isi nama acara dulu ya"); return; }
    state.acara.push({
      id: uid(),
      nama,
      tanggal: document.getElementById('acara-tanggal').value,
      waktu: document.getElementById('acara-waktu').value,
      lokasi: document.getElementById('acara-lokasi').value.trim()
    });
    document.getElementById('acara-nama').value = '';
    document.getElementById('acara-lokasi').value = '';
    save('acara'); renderAcara();
  });

  document.getElementById('acara-list').addEventListener('click', (e)=>{
    const el = e.target.closest('[data-action="delete-acara"]');
    if(!el) return;
    state.acara = state.acara.filter(a=>a.id!==el.dataset.id);
    save('acara'); renderAcara();
  });

  // ===================== EXPORT =====================
  function escapeHtml(str){
    if(str===undefined || str===null) return '';
    return String(str).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function toCsvValue(v){
    const s = (v===undefined||v===null) ? '' : String(v);
    if(/[",\n]/.test(s)) return '"'+s.replace(/"/g,'""')+'"';
    return s;
  }
  function downloadCsv(filename, headers, rows){
    const lines = [headers.map(toCsvValue).join(',')];
    rows.forEach(r=> lines.push(r.map(toCsvValue).join(',')));
    const blob = new Blob(["\uFEFF"+lines.join('\n')], {type:'text/csv;charset=utf-8;'});
    triggerDownload(blob, filename);
  }
  function downloadXlsx(filename, sheetName, headers, rows){
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, filename);
  }
  function triggerDownload(blob, filename){
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function todoRows(){
    return state.todo.map(i=>[i.judul, i.kategori, i.prioritas, i.tanggal||'', i.done?'Selesai':'Belum Selesai']);
  }
  function jadwalRows(){
    const sorted = state.jadwal.slice().sort((a,b)=>{
      const da=DAY_ORDER.indexOf(a.hari), db=DAY_ORDER.indexOf(b.hari);
      return da!==db ? da-db : (a.mulai||'').localeCompare(b.mulai||'');
    });
    return sorted.map(j=>[j.hari, j.mulai, j.selesai, j.matkul, j.dosen||'', j.ruang||'']);
  }
  function acaraRows(){
    const sorted = state.acara.slice().sort((a,b)=> (a.tanggal||'').localeCompare(b.tanggal||''));
    return sorted.map(a=>[a.nama, a.tanggal||'', a.waktu||'', a.lokasi||'']);
  }

  document.getElementById('todo-csv').addEventListener('click', ()=>{
    downloadCsv('daftar-tugas.csv', ['Tugas','Kategori','Prioritas','Tenggat','Status'], todoRows());
  });
  document.getElementById('todo-xlsx').addEventListener('click', ()=>{
    downloadXlsx('daftar-tugas.xlsx', 'To-Do', ['Tugas','Kategori','Prioritas','Tenggat','Status'], todoRows());
  });
  document.getElementById('jadwal-csv').addEventListener('click', ()=>{
    downloadCsv('jadwal-kuliah.csv', ['Hari','Jam Mulai','Jam Selesai','Mata Kuliah','Dosen','Ruangan'], jadwalRows());
  });
  document.getElementById('jadwal-xlsx').addEventListener('click', ()=>{
    downloadXlsx('jadwal-kuliah.xlsx', 'Jadwal', ['Hari','Jam Mulai','Jam Selesai','Mata Kuliah','Dosen','Ruangan'], jadwalRows());
  });
  document.getElementById('acara-csv').addEventListener('click', ()=>{
    downloadCsv('agenda-acara.csv', ['Acara','Tanggal','Waktu','Lokasi'], acaraRows());
  });
  document.getElementById('acara-xlsx').addEventListener('click', ()=>{
    downloadXlsx('agenda-acara.xlsx', 'Acara', ['Acara','Tanggal','Waktu','Lokasi'], acaraRows());
  });

  loadAll();
})();
