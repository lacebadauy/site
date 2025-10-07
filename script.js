document.addEventListener("DOMContentLoaded", () => {
  // Año
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Swipers (con parámetros para no trabar scroll en móvil)
  if (window.Swiper) {
new Swiper(".mySwiper1", {
  loop: true,
  slidesPerView: 1,
  spaceBetween: 20,
  autoplay: { delay: 4000 },

  // más robusto en móviles
  autoHeight: true,
  centeredSlides: false,
  watchOverflow: true,
  observer: true,
  observeParents: true,
  resizeObserver: true,

  // no bloquear scroll vertical
  touchAngle: 30,
  threshold: 8,
  touchStartPreventDefault: false,
  touchReleaseOnEdges: true,
  passiveListeners: true,

  pagination: { el: ".mySwiper1 .swiper-pagination", clickable: true },
  navigation: {
    nextEl: ".mySwiper1 .swiper-button-next",
    prevEl: ".mySwiper1 .swiper-button-prev",
  },
});


    new Swiper(".mySwiper2", {
      loop: true,
      spaceBetween: 24,
      slidesPerView: 1,
      breakpoints: { 768: { slidesPerView: 2 }, 992: { slidesPerView: 3 } },
      pagination: { el: ".mySwiper2 .swiper-pagination", clickable: true },
      navigation: {
        nextEl: ".mySwiper2 .swiper-button-next",
        prevEl: ".mySwiper2 .swiper-button-prev",
      },
      touchStartPreventDefault: false,
      touchAngle: 25,
      threshold: 6
    });
  }

  // Datos bancarios
  const BANK = {
    nombre: "OCA Blue",
    cuenta: "8502869",
    tipo:   "Cuenta en pesos uruguayos",
    titular:"Gabriel Soldatti Banchero",
    ci:     "",
    wa1:    "59892353241",
    wa2:    "59891928629"
  };

  // Pinta spans del banco
  const bankIds = {
    "bank-nombre": BANK.nombre,
    "bank-cuenta": BANK.cuenta,
    "bank-tipo":   BANK.tipo,
    "bank-titular":BANK.titular,
    "bank-ci":     BANK.ci
  };
  Object.entries(bankIds).forEach(([id,val])=>{
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  });
  // Esconde fila de CI si no hay valor
  const ciSpan = document.getElementById('bank-ci');
  if (ciSpan && !ciSpan.textContent.trim()) {
    const li = ciSpan.closest('li');
    if (li) li.style.display = 'none';
  }

  // Catálogo
  const productos = {
    1: { nombre:"Mate Camionero sin Virola", precio:"$760", desc:"Hecho a mano en cuero natural, sin virola metálica. Ideal para el día a día.", imgs:["images-20251007T004913Z-1-001/images/camionero sin.jpeg"] },
    2: { nombre:"Mate Pulido", precio:"$760", desc:"Mate de calabaza pulida, estilo clásico con terminación brillante.", imgs:["images-20251007T004913Z-1-001/images/WhatsApp Image 2025-10-06 at 21.51.47.jpeg"] },
    3: { nombre:"Mate Camionero Con Virola", precio:"$830", desc:"Con virola metálica para mayor durabilidad. Cómodo y resistente.", imgs:["images-20251007T004913Z-1-001/images/p3.jpeg"] },
    4: { nombre:"Promo 1: Dos Mates sin Virola", precio:"$1540", desc:"Combo de dos mates sin virola — 100% artesanal.", imgs:["images-20251007T004913Z-1-001/images/WhatsApp Image 2025-10-06 at 21.50.49.jpeg"] },
    5: { nombre:"Promo 2: Dos Mates con Virola", precio:"$1660", desc:"Combo de dos mates con virola.", imgs:["images-20251007T004913Z-1-001/images/promo3.jpeg"] },
    6: { nombre:"Promo 3: Sin Virola + Con Virola", precio:"$1490", desc:"Combo mixto: un mate sin virola y otro con virola.", imgs:["images-20251007T004913Z-1-001/images/promo2.jpeg"] },
    7: { nombre:"Mate Torpedo con Virola", precio:"$830", desc:"Diseño torpedo con virola de acero, agarre cómodo.", imgs:["images-20251007T004913Z-1-001/images/p2.jpeg"] }
  };

  // Modal
  const modal = document.getElementById("modal-producto");
  const imgPrincipal = document.getElementById("mp-img-principal");
  const thumbs = document.getElementById("mp-thumbs");
  const mpNombre = document.getElementById("mp-nombre");
  const mpDesc = document.getElementById("mp-desc");
  const mpPrecio = document.getElementById("mp-precio");
  const btnCopiar = document.getElementById("copiar-datos");
  const waLink = document.getElementById("wa-link");
  const form = document.getElementById("form-compra");
  let productoActual = null;

  // Abrir modal
  document.querySelectorAll(".ver-producto").forEach(btn=>{
    btn.addEventListener("click", e=>{
      e.preventDefault();
      const id = btn.dataset.id || btn.closest(".product-card")?.dataset.id;
      const p = productos[id]; if(!p) return;

      productoActual = { id, ...p };
      mpNombre.textContent = p.nombre;
      mpDesc.textContent = p.desc;
      mpPrecio.textContent = p.precio;

      const lista = p.imgs && p.imgs.length ? p.imgs : [""];
      imgPrincipal.src = lista[0] || "";
      thumbs.innerHTML = "";
      lista.forEach((src,i)=>{
        const im = document.createElement("img");
        im.src = src;
        if(i===0) im.classList.add("active");
        im.addEventListener("click", ()=>{
          imgPrincipal.src = src;
          [...thumbs.children].forEach(c=>c.classList.remove("active"));
          im.classList.add("active");
        });
        thumbs.appendChild(im);
      });

      // Mensaje base por si tocan el botón sin completar formulario
      const base = `Hola, quiero comprar: ${p.nombre} (${p.precio}). Ya hice la transferencia a ${BANK.nombre} (${BANK.cuenta}).`;
      waLink.href = `https://wa.me/${BANK.wa1}?text=${encodeURIComponent(base)}`;

      modal.classList.add("show");
    
document.querySelector('.modal-dialog')?.scrollTo({ top: 0 });

      modal.setAttribute("aria-hidden","false");
      document.body.style.overflow = "hidden";
    });
  });

  // Cerrar modal
  modal.addEventListener("click", e=>{
    if (e.target.dataset.close !== undefined || e.target.classList.contains("modal-backdrop")) {
      modal.classList.remove("show");
      modal.setAttribute("aria-hidden","true");
      document.body.style.overflow = "";
    }
  });

  // Copiar datos bancarios
  if (btnCopiar) {
    btnCopiar.addEventListener("click", async ()=>{
      const texto = `Banco: ${BANK.nombre}\nN° de cuenta: ${BANK.cuenta}\nTipo: ${BANK.tipo}\nTitular: ${BANK.titular}${BANK.ci?`\nCI: ${BANK.ci}`:""}`;
      try { await navigator.clipboard.writeText(texto);
        btnCopiar.textContent = "Datos copiados ✅";
        setTimeout(()=>btnCopiar.textContent="Copiar datos bancarios",1600);
      } catch { alert("No se pudo copiar. Copiá manualmente:\n\n" + texto); }
    });
  }

  // SOLO WhatsApp (abre a dos números con los datos del formulario)
  function openWhatsAppChats(numbers, message){
    numbers.forEach((num,i)=>{
      setTimeout(()=>window.open(`https://wa.me/${num}?text=${encodeURIComponent(message)}`,"_blank"), i*300);
    });
  }
  if (waLink) {
    waLink.addEventListener("click", async (e)=>{
      e.preventDefault();
      const data = form ? new FormData(form) : null;

      const resumen = [
        `Pedido: ${productoActual?.nombre || ""} (${productoActual?.precio || ""})`,
        data ? `Nombre: ${data.get("nombre")}` : "",
        data ? `Email: ${data.get("email")}` : "",
        data ? `Teléfono: ${data.get("telefono")}` : "",
        data ? `Método: ${data.get("metodo")}` : "",
        data ? `Dirección: ${data.get("direccion") || "-"}` : "",
        data ? `Notas: ${data.get("notas") || "-"}` : ""
      ].filter(Boolean).join("\n");

      const mensaje = [
        resumen,
        "",
        `Transferencia realizada a ${BANK.nombre} - Cuenta: ${BANK.cuenta} - Titular: ${BANK.titular}`,
        "Adjunto comprobante."
      ].join("\n");

      try { await navigator.clipboard.writeText(mensaje); } catch {}
      openWhatsAppChats([BANK.wa1, BANK.wa2], mensaje);
    });
  }

  // Cerrar menú mobile al tocar un link
  document.querySelectorAll('.navbar a').forEach(a=>{
    a.addEventListener('click', ()=>{
      const m = document.getElementById('menu');
      if (m) m.checked = false;
    });
  });
});
