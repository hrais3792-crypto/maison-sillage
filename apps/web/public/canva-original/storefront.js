const inspirations = [
      {id:"robe-fluide",category:"Robes",universe:"Femme",title:"Ligne en mouvement",src:"/canva-original/optimized/9563075-1280.jpg",alt:"A fashionable woman posing in an elegant flowing dress against a white backdrop, showcasing style."},
      {id:"veste-structuree",category:"Vestes",universe:"Femme",title:"Structure douce",src:"/canva-original/optimized/33401683-1280.jpg",alt:"Woman in oversized blazer and high heels posing against urban wall, striking a confident pose."},
      {id:"veste-homme",category:"Vestes",universe:"Homme",title:"Le geste du tailoring",src:"/images/homme-classique-costume.jpg",alt:"Costume bleu avec gilet et cravate : inspiration homme."},
      {id:"haut-detail",category:"Hauts",universe:"Femme",title:"Le détail léger",src:"/canva-original/optimized/7716936-1280.jpg",alt:"Close view of a person wearing an elegant white blouse with a delicate ribbon detail."},
      {id:"pantalon-urbain",category:"Pantalons",universe:"Femme",title:"Ligne urbaine",src:"/canva-original/optimized/40169081-1280.jpg",alt:"Stylish woman in a suit and sunglasses poses confidently against a textured wall in Istanbul."},
      {id:"haut-homme",category:"Hauts",universe:"Homme",title:"Superpositions",src:"/images/homme-classique-haut.jpg",alt:"T-shirt blanc uni et pantalon sombre : inspiration homme."},
      {id:"robe-sculpturale",category:"Robes",universe:"Femme",title:"Volume et silence",src:"/canva-original/optimized/33034129-1280.jpg",alt:"Artistically posed woman in a flowing beige dress on a simple background, showcasing elegance and grace."},
      {id:"pantalon-tailleur",category:"Pantalons",universe:"Femme",title:"Proportions libres",src:"/canva-original/optimized/11411290-1280.jpg",alt:"Stylish woman posing indoors with geometric ceiling, modern architecture."},
      {id:"veste-portrait",category:"Vestes",universe:"Femme",title:"L’allure affirmée",src:"/canva-original/optimized/4936952-1280.jpg",alt:"Elegant black and white portrait of a woman in a stylish suit, combining modern and classic vibes."}
    ];
    const looks=[
      {title:"Le mouvement des lignes",main:["/canva-original/optimized/29554115-1280.jpg","Striking black and white portrait of a woman in a modern urban environment, exuding elegance and style."],secondary:["/canva-original/optimized/4936952-1280.jpg","Elegant black and white portrait of a woman in a stylish suit, combining modern and classic vibes."],detail:["/canva-original/optimized/4938328-1280.jpg","A detailed view of elegant pleated beige fabric textures, ideal for backgrounds and design projects."]},
      {title:"La présence du volume",main:["/canva-original/optimized/9563075-1280.jpg","A fashionable woman posing in an elegant flowing dress against a white backdrop, showcasing style."],secondary:["/canva-original/optimized/11065063-1280.jpg","Elegant woman posing in a beige coat against a minimalist indoor backdrop."],detail:["/canva-original/optimized/7716936-1280.jpg","Close view of a person wearing an elegant white blouse with a delicate ribbon detail."]},
      {title:"Une autre perspective",main:["/images/homme-classique-chemise.jpg","Chemise blanche et cravate sombre : inspiration de style classique."],secondary:["/images/homme-classique-haut.jpg","T-shirt blanc uni et pantalon sombre : inspiration homme."],detail:["/canva-original/optimized/4938328-1280.jpg","A detailed view of elegant pleated beige fabric textures, ideal for backgrounds and design projects."]}
    ];
    const favorites=new Set();
    let favoritesStorageAvailable=true;
    try {
      const stored=JSON.parse(localStorage.getItem('maison-sillage-editorial-favorites') || '[]');
      if(Array.isArray(stored)) stored.forEach(id=>{if(inspirations.some(item=>item.id===id))favorites.add(id)});
    } catch { favoritesStorageAvailable=false; }
    let category="Tout",universe="Tout",lookIndex=0,lastFocus=null;
    const grid=document.getElementById("collection-grid");
    const selection=document.getElementById("selection-content");
    const status=document.getElementById("status");
    function escapeHTML(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
    function renderCards(){
      const visible=inspirations.filter(item=>(category==="Tout"||item.category===category)&&(universe==="Tout"||item.universe===universe));
      grid.innerHTML=visible.map(item=>`<article class="collection-card canva-card"><div class="card-image-wrap"><img id="image-${item.id}" class="canva-image" src="${item.src}" alt="${escapeHTML(item.alt)}" loading="lazy"><button class="favorite canva-button" type="button" data-favorite="${item.id}" aria-pressed="${favorites.has(item.id)}" aria-label="${favorites.has(item.id)?"Retirer":"Ajouter"} ${escapeHTML(item.title)} ${favorites.has(item.id)?"de":"à"} Ma sélection"><i data-lucide="heart" aria-hidden="true"></i></button></div><div class="card-meta"><div><span class="eyebrow canva-text">${item.category} · ${item.universe}</span><h3>${escapeHTML(item.title)}</h3></div><span class="photo-credit canva-text">Inspiration</span></div></article>`).join("");
      if(!visible.length)grid.innerHTML='<p>Aucune inspiration dans cette catégorie.</p>';
      lucide.createIcons();
      document.dispatchEvent(new CustomEvent('storefront:cards'));
    }
    function renderSelection(){
      const chosen=inspirations.filter(item=>favorites.has(item.id));
      document.getElementById("selection-count").textContent=chosen.length;
      document.getElementById("mobile-selection-count").textContent=chosen.length;
      const count=document.getElementById("selection-heading-count");
      count.textContent=`(${chosen.length})`;
      count.setAttribute("aria-label",`${chosen.length} inspiration${chosen.length>1?"s":""} sélectionnée${chosen.length>1?"s":""}`);
      if(!chosen.length){
        selection.innerHTML='<div class="empty-state"><i data-lucide="heart" aria-hidden="true"></i><p>Votre sélection attend ses premières inspirations. Parcourez la collection et touchez un cœur pour commencer.</p><a class="outline-button canva-button" href="#collection">Explorer la collection <i data-lucide="arrow-up-right" aria-hidden="true"></i></a></div>';
      }else{
        selection.innerHTML=`<div class="selection-grid">${chosen.map(item=>`<article class="selected-item canva-card"><img id="selected-${item.id}" class="canva-image" src="${item.src}" alt="${escapeHTML(item.alt)}" loading="lazy"><h3>${escapeHTML(item.title)}</h3><button class="canva-button" type="button" data-remove="${item.id}" aria-label="Retirer ${escapeHTML(item.title)} de Ma sélection">Retirer de la sélection</button></article>`).join("")}</div><button id="open-carnet" class="outline-button canva-button" type="button">Télécharger mon carnet <i data-lucide="arrow-up-right" aria-hidden="true"></i></button><p style="font-size:12px;color:#eaded9;margin:13px 0 0">Ouvre un carnet consultable, imprimable ou enregistrable en PDF depuis votre navigateur.</p>`;
      }
      lucide.createIcons();
    }
    function setLook(index){
      lookIndex=(index+looks.length)%looks.length;
      const look=looks[lookIndex];
      [["lookbook-main-image",look.main],["lookbook-secondary-image",look.secondary],["lookbook-detail-image",look.detail]].forEach(([id,data])=>{const image=document.getElementById(id);image.src=data[0];image.alt=data[1]});
      document.getElementById("lookbook-caption").innerHTML=`<small>Regard 0${lookIndex+1} / 03</small>${look.title}`;
      status.textContent=`Lookbook : ${look.title}, regard ${lookIndex+1} sur 3.`;
      document.dispatchEvent(new CustomEvent('lookbook:change',{detail:{index:lookIndex}}));
    }
    document.getElementById("filters").addEventListener("click",event=>{
      const button=event.target.closest("[data-filter]");if(!button)return;
      category=button.dataset.filter;universe="Tout";
      document.querySelectorAll("[data-filter]").forEach(el=>el.setAttribute("aria-pressed",String(el===button)));
      renderCards();status.textContent=`Filtre ${category} : ${grid.querySelectorAll(".collection-card").length} inspirations affichées.`;
    });
    document.querySelectorAll("[data-universe]").forEach(link=>link.addEventListener("click",()=>{
      universe=link.dataset.universe;category="Tout";
      document.querySelectorAll("[data-filter]").forEach(el=>el.setAttribute("aria-pressed",String(el.dataset.filter==="Tout")));
      renderCards();status.textContent=`Inspirations ${universe} affichées.`;
    }));
    grid.addEventListener("click",event=>{
      const button=event.target.closest("[data-favorite]");if(!button)return;
      toggleFavorite(button.dataset.favorite);
    });
    function toggleFavorite(id) {
      const item=inspirations.find(item=>item.id===id);if(!item)return;
      if(favorites.has(id))favorites.delete(id);else favorites.add(id);
      document.querySelectorAll('[data-favorite]').forEach(button=>{
        if(button.dataset.favorite!==id)return;
        button.setAttribute('aria-pressed',String(favorites.has(id)));
        button.setAttribute('aria-label',`${favorites.has(id)?'Retirer':'Ajouter'} ${item.title} ${favorites.has(id)?'de':'à'} Ma sélection`);
      });
      status.textContent=`${item.title} ${favorites.has(id)?'ajouté à':'retiré de'} Ma sélection.`;
      renderSelection();
      saveFavorites();
      document.dispatchEvent(new CustomEvent('storefront:selection',{detail:{id,saved:favorites.has(id)}}));
    }
    function saveFavorites() {
      try {localStorage.setItem('maison-sillage-editorial-favorites',JSON.stringify([...favorites]));favoritesStorageAvailable=true;}
      catch {favoritesStorageAvailable=false;}
    }
    selection.addEventListener("click",event=>{
      const remove=event.target.closest("[data-remove]");
      if(remove){
        const position=[...selection.querySelectorAll('[data-remove]')].indexOf(remove);
        toggleFavorite(remove.dataset.remove);
        const remaining=selection.querySelectorAll('[data-remove]');
        (remaining[Math.min(position,remaining.length-1)] || selection.querySelector('.outline-button'))?.focus({preventScroll:true});
        return;
      }
      if(event.target.closest("#open-carnet"))openCarnet();
    });
    function openCarnet(){
      lastFocus=document.activeElement;
      document.getElementById("carnet-items").innerHTML=inspirations.filter(item=>favorites.has(item.id)).map(item=>`<article class="canva-card"><img id="carnet-${item.id}" class="canva-image" src="${item.src}" alt="${escapeHTML(item.alt)}" loading="lazy"><p>${escapeHTML(item.title)}</p><span class="photo-credit">${item.category} · Inspiration</span></article>`).join("");
      document.getElementById("carnet-overlay").classList.add("open");
      document.body.style.overflow="hidden";
      document.getElementById("carnet-close").focus();
    }
    function closeCarnet(){document.getElementById("carnet-overlay").classList.remove("open");document.body.style.overflow="";if(lastFocus&&lastFocus.isConnected)lastFocus.focus()}
    document.getElementById("carnet-close").addEventListener("click",closeCarnet);
    document.getElementById("carnet-overlay").addEventListener("click",event=>{if(event.target.id==="carnet-overlay")closeCarnet()});
    document.getElementById("print-carnet").addEventListener("click",()=>window.print());
    document.addEventListener("keydown",event=>{
      const overlay=document.getElementById("carnet-overlay");
      if(!overlay.classList.contains("open"))return;
      if(event.key==="Escape")closeCarnet();
      if(event.key==="Tab"){const controls=[...overlay.querySelectorAll("button")];const first=controls[0],last=controls[controls.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}
    });
    document.getElementById("lookbook-prev").addEventListener("click",()=>setLook(lookIndex-1));
    document.getElementById("lookbook-next").addEventListener("click",()=>setLook(lookIndex+1));
    const menuToggle=document.getElementById("menu-toggle"),mobileNav=document.getElementById("mobile-nav");
    menuToggle.addEventListener("click",()=>{const open=mobileNav.classList.toggle("open");menuToggle.setAttribute("aria-expanded",String(open));menuToggle.setAttribute("aria-label",open?"Fermer le menu":"Ouvrir le menu");menuToggle.innerHTML=`<i data-lucide="${open?"x":"menu"}"></i>`;lucide.createIcons()});
    mobileNav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{mobileNav.classList.remove("open");menuToggle.setAttribute("aria-expanded","false");menuToggle.setAttribute("aria-label","Ouvrir le menu");menuToggle.innerHTML='<i data-lucide="menu"></i>';lucide.createIcons()}));
    renderCards();renderSelection();lucide.createIcons();
