  // modal window draggable dan muncul pas di klik
    (function(){
    // Back button navigation
    document.addEventListener('DOMContentLoaded', function() {
        var backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', function(e) {
                e.preventDefault();
                var loader = document.getElementById('loader');
                var bar = loader && loader.querySelector('.progress-bar');
                var txt = document.getElementById('destination-text');
                if (txt) txt.textContent = 'Loading Menu...';
                if (loader) loader.classList.add('show');
                if (bar) {
                    bar.style.background = '#ffffff';
                    bar.style.transition = 'width 900ms linear';
                    bar.getBoundingClientRect();
                    bar.style.width = '100%';
                    var done = () => window.location.href = '../menu/menu.html';
                    var onEnd = () => { bar.removeEventListener('transitionend', onEnd); done(); };
                    bar.addEventListener('transitionend', onEnd);
                    setTimeout(() => { bar.removeEventListener('transitionend', onEnd); done(); }, 1100);
                } else {
                    setTimeout(() => window.location.href = '../menu/menu.html', 300);
                }
            });
        }
    });
        const container = document.getElementById('modalsContainer');
        const nodes = document.querySelectorAll('image');
        let z = 2000;

        function makeDraggable(win){
            const hdr = win.querySelector('.modal-header');
            if(!hdr) return;
            hdr.addEventListener('mousedown', (e)=>{
                if(e.button !== 0) return;
                const rect = win.getBoundingClientRect();
                const offsetX = e.clientX - rect.left;
                const offsetY = e.clientY - rect.top;
                win.style.zIndex = ++z;
                function onMove(ev){
                    let x = ev.clientX - offsetX;
                    let y = ev.clientY - offsetY;
                    x = Math.max(0, Math.min(x, window.innerWidth - win.offsetWidth));
                    y = Math.max(0, Math.min(y, window.innerHeight - win.offsetHeight));
                    win.style.left = x + 'px';
                    win.style.top = y + 'px';
                }
                function onUp(){
                    document.removeEventListener('mousemove', onMove);
                    document.removeEventListener('mouseup', onUp);
                }
                document.addEventListener('mousemove', onMove);
                document.addEventListener('mouseup', onUp);
            });
        }
        // bikin window modal
        function createWindow(title, desc, image){
            const win = document.createElement('div');
            win.className = 'modal-content';
            win.style.position = 'fixed';
            win.style.zIndex = ++z;
            win.innerHTML = `
                <div class="modal-header"><div class="modal-title">${title||'Information'}</div><button class="modal-close" aria-label="Close">&times;</button></div>
                <div class="modal-body"><p>${image||'No image available'}${desc||'No description available'}</p></div>
            `;
            container.appendChild(win);

            // biar ga ke lay pinggir terus
            requestAnimationFrame(()=>{
                const w = win.offsetWidth, h = win.offsetHeight;
                const left = Math.max(10, (window.innerWidth - w)/2 + (Math.random()*80-40));
                const top = Math.max(10, (window.innerHeight - h)/2 + (Math.random()*80-40));
                win.style.left = left + 'px';
                win.style.top = top + 'px';
            });

            win.querySelector('.modal-close').addEventListener('click', ()=> win.remove());
            makeDraggable(win);
            win.addEventListener('mousedown', ()=> win.style.zIndex = ++z);
        }

        nodes.forEach(n=>{
            n.style.cursor = 'pointer';
            n.addEventListener('click', function(e){
                e.stopPropagation();
                createWindow(this.getAttribute('title'), this.getAttribute('data-desc'), this.getAttribute('href') ? `<img src="${this.getAttribute('href')}" style="max-width:100%;">` : this.getAttribute('data-image'));
            });
        });

        document.addEventListener('keydown', e=>{
            if(e.key === 'Escape') container.innerHTML = '';
        });
    })();