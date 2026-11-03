(function(){
  // Edita estos datos con tu información real
  var WHATSAPP = "56900000000";

  var notes = {
    web:  ["1440 px · escritorio", "Ejemplo: sitio para un negocio local, con catálogo y contacto."],
    app:  ["390 px · móvil", "Ejemplo: app de pedidos y agenda para el día a día."],
    dash: ["1280 px · panel interno", "Ejemplo: panel de ventas y stock con datos ficticios."]
  };
  var tabs = document.querySelectorAll('.tabs button');
  tabs.forEach(function(b){
    b.addEventListener('click', function(){
      var k = b.dataset.k;
      tabs.forEach(function(t){ t.setAttribute('aria-selected', t === b ? 'true' : 'false'); });
      document.querySelectorAll('.frame').forEach(function(f){ f.classList.toggle('on', f.id === 'f-' + k); });
      document.getElementById('dim').textContent = notes[k][0];
      document.getElementById('note').textContent = notes[k][1];
    });
  });

  var form = document.getElementById('lead');
  var out = document.getElementById('result');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var nombre = form.nombre.value.trim();
    if(!nombre){ form.nombre.focus(); out.hidden = false; out.textContent = 'Escribe tu nombre para preparar el mensaje.'; return; }
    var tipos = Array.prototype.map.call(form.querySelectorAll('input[name="tipo"]:checked'), function(i){ return i.value; });
    var txt = 'Hola, soy ' + nombre + (form.empresa.value.trim() ? ' de ' + form.empresa.value.trim() : '') +
      '. Me interesa: ' + (tipos.join(', ') || 'un proyecto digital') + '.' +
      (form.mensaje.value.trim() ? ' ' + form.mensaje.value.trim() : '');
    out.hidden = false;
    out.innerHTML = '';
    var p = document.createElement('p'); p.textContent = 'Tu mensaje está listo:'; out.appendChild(p);
    var q = document.createElement('p'); q.style.color = 'var(--muted)'; q.textContent = '“' + txt + '”'; out.appendChild(q);
    var a = document.createElement('a'); a.href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(txt);
    a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'Enviar por WhatsApp →'; out.appendChild(a);
  });
})();
