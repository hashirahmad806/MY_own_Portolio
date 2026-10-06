export function initOrbitEngine(){
  "use strict";
  if (typeof window === 'undefined') return;
  if (window.__orbitEngineInitialized) return;
  window.__orbitEngineInitialized = true;

  var AUFL_HELL = 0.83;
  var AUFL_DUNKEL = 0.005;
  var auflWert = {};
  var auflWartet = {};

  function auflKanal(c){
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }
  function auflKontrast(a, b){
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  }
  function auflMessen(quelle, fertig){
    if (auflWert.hasOwnProperty(quelle)){ fertig(auflWert[quelle]); return; }
    if (auflWartet[quelle]){ auflWartet[quelle].push(fertig); return; }
    auflWartet[quelle] = [fertig];
    var melden = function(dunkel){
      auflWert[quelle] = dunkel;
      var liste = auflWartet[quelle];
      delete auflWartet[quelle];
      for (var i = 0; i < liste.length; i++) liste[i](dunkel);
    };
    var bild = new Image();

    bild.decoding = 'async';
    bild.onerror = function(){ melden(false); };
    bild.onload = function(){
      try {
        var bx = Math.max(1, Math.round(bild.naturalWidth * 0.16));
        var by = Math.max(1, Math.round(bild.naturalHeight * 0.15));
        var flaeche = document.createElement('canvas');

        flaeche.width = 24; flaeche.height = 8;
        var stift = flaeche.getContext('2d', { willReadFrequently: false });
        stift.drawImage(bild,
                        Math.round(bild.naturalWidth * 0.02),
                        Math.round(bild.naturalHeight * 0.84),
                        bx, by, 0, 0, 24, 8);
        var d = stift.getImageData(0, 0, 24, 8).data;
        var summe = 0, n = 0;
        for (var i = 0; i < d.length; i += 4){
          summe += 0.2126 * auflKanal(d[i]) +
                   0.7152 * auflKanal(d[i + 1]) +
                   0.0722 * auflKanal(d[i + 2]);
          n++;
        }
        var L = n ? summe / n : 0;
        melden(auflKontrast(AUFL_DUNKEL, L) > auflKontrast(AUFL_HELL, L) * 1.1);
      } catch (fehler){

        melden(false);
      }
    };
    bild.src = quelle;
  }

  function auflTon(el, quelle){
    if (!el) return;
    if (!quelle){ el.classList.remove('is-aufl-dunkel'); return; }
    el.omAuflQuelle = quelle;
    auflMessen(quelle, function(dunkel){
      if (el.omAuflQuelle !== quelle) return;
      el.classList.toggle('is-aufl-dunkel', dunkel);
    });
  }

  function projekteHolen(dann){
    fetch('/projekte.json', { cache: 'no-cache' })
      .then(function(a){
        if (!a.ok) throw new Error('HTTP ' + a.status);
        return a.json();
      })
      .then(function(liste){
        var geprueft = projektePruefen(liste);
        if (!geprueft.length){
          console.error('projekte.json enthaelt keinen vollstaendigen Eintrag - ' +
                        'die Galerie bleibt leer.');
          return;
        }
        dann(geprueft);
      })
      .catch(function(fehler){
        console.error('projekte.json konnte nicht geladen werden. Ueber ' +
                      'file:// ist das erwartbar - die Seite braucht einen ' +
                      'Server. Meldung:', fehler);
      });
  }

  function projektePruefen(liste){
    if (!Array.isArray(liste)){
      console.error('projekte.json muss eine Liste sein.');
      return [];
    }
    var karten = [];
    liste.forEach(function(p, i){
      var wo = 'projekte.json, Eintrag ' + (i + 1);
      var fehlt = [];
      if (!p || typeof p !== 'object'){ fehlt.push('Datensatz'); p = {}; }
      if (!text(p.projekt)) fehlt.push('projekt');
      if (!text(p.rolle))   fehlt.push('rolle');
      var bilder = Array.isArray(p.bilder) && p.bilder.length ? p.bilder : [p];
      if (!text(bilder[0] && bilder[0].datei)) fehlt.push('datei');
      if (fehlt.length){
        console.warn(wo + ' (' + (text(p.projekt) || 'ohne Namen') + '): ' +
                     fehlt.join(', ') + ' fehlt - Projekt wird nicht gezeigt.');
        return;
      }

      var satz = [];
      bilder.forEach(function(b, k){
        if (!b || typeof b !== 'object' || !text(b.datei)){
          console.warn(wo + ', Bild ' + (k + 1) + ': datei fehlt - uebersprungen.');
          return;
        }
        if (!(b.w > 0) || !(b.h > 0)){
          console.warn(wo + ', Bild ' + (k + 1) + ' (' + b.datei +
                       '): w/h fehlen - ohne die echten Bildmasse erscheint ' +
                       'die Karte quadratisch.');
        }
        satz.push({
          src: text(b.datei),
          w: b.w > 0 ? b.w : 2048,
          h: b.h > 0 ? b.h : 2048,

          ki: (b.ki === undefined ? p.ki === true : b.ki === true),

          loop: text(b.loop),
          video: text(b.video),

          bu: text(b.bu),

          ton: b.ton !== false,
          orbit: b.orbit === true
        });
      });
      if (!satz.length) return;

      var imOrbit = satz.filter(function(b){ return b.orbit; });
      if (!imOrbit.length) imOrbit = [satz[0]];

      imOrbit.forEach(function(b){
        karten.push({
          src: b.src, w: b.w, h: b.h, ki: b.ki, loop: b.loop, video: b.video,
          ton: b.ton,
          projekt: text(p.projekt),
          rolle: text(p.rolle),
          award: text(p.award),
          fotocredit: text(p.fotocredit),

          groesse: (typeof p.groesse === 'number' && p.groesse > 0) ? p.groesse : 1,

          heureka: p.heureka !== false,

          link: text(p.link),

          platzhalter: p.platzhalter === true,

          satz: satz,
          satzAb: satz.indexOf(b)
        });
      });
    });
    return karten;
  }
  function text(v){ return typeof v === 'string' ? v.trim() : ''; }

  function maskieren(s){
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  var NAMEN = /(gravity|Gorden Koschel|heureka)/g;
  function namenSetzen(s){
    return maskieren(s).replace(NAMEN, '<span class="om-marke">$1</span>');
  }
  function buBauen(p){
    var h = '<b>' + namenSetzen(p.projekt) + '</b>' +
            '<span class="om-bu-zeile">' + namenSetzen(p.rolle) + '</span>';
    if (p.award)      h += '<span class="om-bu-zeile">' + namenSetzen(p.award) + '</span>';
    if (p.fotocredit) h += '<span class="om-bu-credit">' + namenSetzen(p.fotocredit) + '</span>';
    return h;
  }

  function altText(p){ return p.projekt + '. ' + p.rolle; }

  projekteHolen(starten);

  function starten(IMAGES){
  var layerBack = document.getElementById('orbitBack');
  var layerFront = document.getElementById('orbitFront');
  var worldBack = document.getElementById('orbitWorldBack');
  var worldFront = document.getElementById('orbitWorldFront');
  var scrollWrap = document.getElementById('boldScroll');
  var maskSection = document.getElementById('boldSection');
  if (!layerBack || !layerFront || !worldBack || !worldFront || !scrollWrap) return;

  function maskeOffen(){
    var mm = /circle\(([\d.]+)px/.exec(
      maskSection ? maskSection.style.clipPath : '');
    return !!mm && parseFloat(mm[1]) <= 0.5;
  }

  function nachlaufAnhalten(){
    if (window.lenis && window.lenis.isScrolling === 'smooth') return;
    if (window.lenis && window.lenis.scrollTo){
      window.lenis.scrollTo(window.scrollY, { immediate: true, force: true });
    }
    window.scrollTo(0, window.scrollY);
  }

  var Z_KREIS = 'M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2' +
                'C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z';
  var Z_LAUTSPRECHER = 'M9.63432 4.36561L6.46863 7.5313C6.29568 7.70425 6.2092 7.79073 6.10828 7.85257' +
    'C6.01881 7.9074 5.92127 7.9478 5.81923 7.9723C5.70414 7.99993 5.58185 7.99993 5.33726 7.99993' +
    'H3.6C3.03995 7.99993 2.75992 7.99993 2.54601 8.10892C2.35785 8.20479 2.20487 8.35777 2.10899 8.54594' +
    'C2 8.75985 2 9.03987 2 9.59993V14.3999C2 14.96 2 15.24 2.10899 15.4539' +
    'C2.20487 15.6421 2.35785 15.7951 2.54601 15.8909C2.75992 15.9999 3.03995 15.9999 3.6 15.9999' +
    'H5.33726C5.58185 15.9999 5.70414 15.9999 5.81923 16.0276C5.92127 16.0521 6.01881 16.0925 6.10828 16.1473' +
    'C6.2092 16.2091 6.29568 16.2956 6.46863 16.4686L9.63431 19.6342C10.0627 20.0626 10.2769 20.2768 10.4608 20.2913' +
    'C10.6203 20.3038 10.7763 20.2392 10.8802 20.1175C11 19.9773 11 19.6744 11 19.0686V4.9313' +
    'C11 4.32548 11 4.02257 10.8802 3.88231C10.7763 3.76061 10.6203 3.69602 10.4608 3.70858' +
    'C10.2769 3.72305 10.0627 3.93724 9.63432 4.36561Z';

  var kugelFilmeLaufen = false;
  var DIA_STAND = 4200;
  var DIA_BLENDE = 800;

  function bildkarteBauen(bild, i, was){
    was = was || {};
    var figur = null;
    if (was.figurKlasse){
      figur = document.createElement('figure');
      figur.className = was.figurKlasse;
    }
    var rahmen = document.createElement('div');
    rahmen.className = (was.rahmenKlasse || 'om-bild-rahmen') +
                       (bild.ki ? ' is-ki' : '') +
                       (bild.heureka ? ' is-heureka' : '') +
                       (bild.platzhalter ? ' is-platzhalter' : '') +
                       (bild.satz && bild.satz.length > 1 ? ' hat-dia' : '');
    var img = document.createElement('img');
    img.src = bild.src;

    img.alt = altText(bild);
    img.draggable = false;
    img.loading = (was.frueh && i < was.frueh) ? 'eager' : 'lazy';
    img.decoding = 'async';
    if (was.masse){ img.width = bild.w; img.height = bild.h; }
    rahmen.appendChild(img);

    if (bild.heureka) auflTon(rahmen, bild.src);

    var schatten = null;
    if (was.schatten){
      schatten = document.createElement('div');
      schatten.className = 'orbit-shade';
      rahmen.appendChild(schatten);
    }

    var filme = was.ohneFilm ? null : filmeBauen(rahmen, bild, was.filmSammler);

    var film = filme ? (filme.eigen || filme.erster) : null;
    var leiste = was.ohneLeiste ? null : tastenBauen(rahmen, film, bild.link);

    if (figur) figur.appendChild(rahmen);
    var bu = null;
    if (was.bu){
      bu = document.createElement('figcaption');
      bu.className = 'om-bu';
      bu.innerHTML = buBauen(bild);
      (figur || rahmen).appendChild(bu);
    }
    return { figur: figur, rahmen: rahmen, img: img, schatten: schatten,
             film: film, filme: filme,
             leiste: leiste, bu: bu, daten: bild };
  }

  var filmLoops = [];
  function filmElement(quelle, schleife, sofort){
    var v = document.createElement('video');
    v.src = quelle;

    v.loop = true;
    v.muted = schleife; v.defaultMuted = schleife;
    v.controls = false;
    v.setAttribute('playsinline', '');
    v.setAttribute('disablepictureinpicture', '');
    if (schleife) v.setAttribute('muted', '');

    v.preload = (schleife && sofort) ? 'auto' : (schleife ? 'metadata' : 'none');
    return v;
  }

  function svgHuelle(inhalt){
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
      ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round"' +
      ' aria-hidden="true">' + inhalt + '</svg>';
  }

  function zeichenAbspielen(){
    return svgHuelle(
      '<g class="g-play"><path d="' + Z_KREIS + '"/>' +
      '<path d="M9.5 8.96533C9.5 8.48805 9.5 8.24941 9.59974 8.11618C9.68666 8.00007 9.81971 7.92744 9.96438 7.9171' +
      'C10.1304 7.90525 10.3311 8.03429 10.7326 8.29239L15.4532 11.3271C15.8016 11.551 15.9758 11.663 16.0359 11.8054' +
      'C16.0885 11.9298 16.0885 12.0702 16.0359 12.1946C15.9758 12.337 15.8016 12.449 15.4532 12.6729' +
      'L10.7326 15.7076C10.3311 15.9657 10.1304 16.0948 9.96438 16.0829C9.81971 16.0726 9.68666 15.9999 9.59974 15.8838' +
      'C9.5 15.7506 9.5 15.512 9.5 15.0347V8.96533Z"/></g>' +
      '<g class="g-pause"><path d="M9.5 15V9M14.5 15V9M22 12C22 17.5228 17.5228 22 12 22' +
      'C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"/></g>');
  }

  function zeichenTon(){
    return svgHuelle(
      '<g class="g-laut">' +
      '<path d="M19.7479 4.99993C21.1652 6.97016 22 9.38756 22 11.9999' +
      'C22 14.6123 21.1652 17.0297 19.7479 18.9999M15.7453 7.99993' +
      'C16.5362 9.13376 17 10.5127 17 11.9999C17 13.4872 16.5362 14.8661 15.7453 15.9999' +
      'M' + Z_LAUTSPRECHER.slice(1) + '"/></g>' +
      '<g class="g-stumm"><path d="M22 8.99993L16 14.9999M16 8.99993L22 14.9999' +
      'M' + Z_LAUTSPRECHER.slice(1) + '"/></g>');
  }

  function zeichenLink(){
    return svgHuelle('<path d="M21 9L21 3M21 3H15M21 3L13 11M10 5H7.8' +
      'C6.11984 5 5.27976 5 4.63803 5.32698C4.07354 5.6146 3.6146 6.07354 3.32698 6.63803' +
      'C3 7.27976 3 8.11984 3 9.8V16.2C3 17.8802 3 18.7202 3.32698 19.362' +
      'C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21' +
      'H14.2C15.8802 21 16.7202 21 17.362 20.673C17.9265 20.3854 18.3854 19.9265 18.673 19.362' +
      'C19 18.7202 19 17.8802 19 16.2V14"/>');
  }

  function tastenBauen(hinein, satz, link){
    if (!satz && !link) return null;
    var leiste = document.createElement('div');
    leiste.className = 'om-film-tasten';
    function taste(klasse, zeichen, tun){
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'om-film-taste ' + klasse;
      b.innerHTML = zeichen;
      b.addEventListener('click', function(e){

        e.stopPropagation();
        tun();
      });
      leiste.appendChild(b);
      return b;
    }
    if (satz){
      satz.leiste = leiste;
      satz.tasteLauf = taste('om-film-taste--film is-pause', zeichenAbspielen(),
                             function(){ filmLaufTaste(satz); });

      if (satz.ton){
        satz.tasteTon = taste('om-film-taste--film is-stumm', zeichenTon(),
                              function(){ filmTon(satz); });
      }
    }
    if (link){

      var a = document.createElement('a');
      a.className = 'om-film-taste om-film-taste--link';
      a.href = link;
      a.target = '_blank';
      a.rel = 'noopener';
      a.setAttribute('aria-label', 'Projekt online ansehen');
      a.innerHTML = zeichenLink();
      a.addEventListener('click', function(e){ e.stopPropagation(); });
      leiste.appendChild(a);
    }
    if (hinein) hinein.appendChild(leiste);
    return leiste;
  }

  function filmKasten(rahmen, quelle, sichtbar, sammler){
    var kasten = document.createElement('div');
    kasten.className = 'orbit-film';

    if (sichtbar) kasten.classList.add('is-dia');
    var loop = filmElement(quelle.loop, true, sichtbar);
    loop.className = 'film-loop';
    var voll = filmElement(quelle.video || quelle.loop, false);
    voll.className = 'film-voll';
    kasten.appendChild(loop);
    kasten.appendChild(voll);
    rahmen.appendChild(kasten);

    if (sammler && sichtbar) sammler.push(loop);
    var satz = { kasten: kasten, loop: loop, voll: voll, an: false,
                 ton: quelle.ton !== false };

    ['play', 'pause'].forEach(function(art){
      voll.addEventListener(art, function(){ filmTastenZeichnen(satz); });
      loop.addEventListener(art, function(){ filmTastenZeichnen(satz); });
    });
    return satz;
  }

  function filmeBauen(rahmen, bild, sammler){
    if (!bild) return null;
    var satz = bild.satz && bild.satz.length ? bild.satz : (bild.loop ? [bild] : null);
    if (!satz) return null;
    var proIndex = {}, eigen = null, erster = null;
    for (var i = 0; i < satz.length; i++){
      var q = satz[i];
      if (!q.loop) continue;

      var istEigener = !!bild.loop && q.loop === bild.loop;
      var s = filmKasten(rahmen, q, istEigener, sammler);
      proIndex[i] = s;
      if (!erster) erster = s;
      if (istEigener && !eigen) eigen = s;
    }
    if (!erster) return null;
    return { eigen: eigen, erster: erster, proIndex: proIndex };
  }

  function filmSpur(satz){ return satz.gross ? satz.voll : satz.loop; }

  function filmLaufTaste(satz){
    var v = filmSpur(satz);
    if (v.paused){
      var p = v.play(); if (p && p['catch']) p['catch'](function(){});
      diaFortsetzen();
    } else {
      v.pause();
      diaAnhalten();
    }
    filmTastenZeichnen(satz);
  }

  function filmTon(satz){

    satz.an = !satz.an;
    satz.voll.muted = !satz.an;
    if (satz.an){
      satz.voll.volume = 1;
      var p = satz.voll.play();
      if (p && p['catch']) p['catch'](function(){ satz.voll.muted = true; });
    }

    if (satz.an) diaAnhalten(); else diaFortsetzen();
    filmTastenZeichnen(satz);
  }

  function filmTastenZeichnen(satz){

    if (!satz || !satz.tasteLauf) return;
    var laeuft = !filmSpur(satz).paused;
    satz.tasteLauf.classList.toggle('is-pause', laeuft);
    satz.tasteLauf.classList.toggle('is-play', !laeuft);
    satz.tasteLauf.setAttribute('aria-label', laeuft ? 'Film anhalten' : 'Film abspielen');
    if (satz.tasteTon){
      satz.tasteTon.classList.toggle('is-laut', satz.an);
      satz.tasteTon.classList.toggle('is-stumm', !satz.an);
      satz.tasteTon.setAttribute('aria-label', satz.an ? 'Ton ausschalten' : 'Ton einschalten');
    }
  }

  function filmSatzLauf(satz, an, gleich){
    if (!satz) return;
    an = !!an;

    if (satz.leiste) satz.leiste.classList.toggle('is-film', an);
    satz.gross = an;

    if (!an){

      satz.an = false;

      satz.voll.pause(); satz.voll.muted = true;

      var zuruecksetzen = function(){

        if (satz.gross) return;
        satz.kasten.classList.remove('is-voll');
        try { satz.voll.currentTime = 0; } catch(err){}
        filmLauf(satz.loop, false);
        filmTastenZeichnen(satz);
      };
      if (gleich === false) window.setTimeout(zuruecksetzen, DIA_BLENDE);
      else zuruecksetzen();
      return;
    }

    var v = satz.voll;
    v.loop = true;
    v.muted = !satz.an;
    var uebernehmen = function(){
      if (!satz.gross) return;
      satz.kasten.classList.add('is-voll');
      filmLauf(satz.loop, false);
      filmTastenZeichnen(satz);
    };
    if (v.readyState >= 3){
      filmLauf(v, true);
      uebernehmen();
    } else {
      filmLauf(satz.loop, true);
      var einmal = function(){
        v.removeEventListener('canplay', einmal);
        if (!satz.gross) return;
        filmLauf(v, true);
        uebernehmen();
      };
      v.addEventListener('canplay', einmal);
      filmLauf(v, true);
    }
    filmTastenZeichnen(satz);
  }

  function filmDarf(){
    return !window.matchMedia || !matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function diaAnlegen(behaelter, daten, satz, ab, filme, auflage, bu){
    if (!behaelter || !daten || !satz || satz.length < 2) return null;

    var lagen = document.createElement('div');
    lagen.className = 'dia-lagen';
    var unten = document.createElement('img');
    unten.className = 'dia-a';
    unten.alt = ''; unten.draggable = false;
    unten.src = daten.src;
    var oben = document.createElement('img');
    oben.className = 'dia-b';
    oben.alt = '';
    oben.draggable = false;
    lagen.appendChild(unten);
    lagen.appendChild(oben);
    behaelter.appendChild(lagen);

    var uhr = diaUhrLegen(bu, null);
    return { behaelter: behaelter, kasten: lagen, unten: unten, oben: oben, satz: satz,

             filme: filme || null,

             filmAn: (filme && filme.proIndex[ab || 0]) || null,
             i: ab || 0, uhr: null, laeuft: false, gen: 0,
             linie: uhr, auflage: auflage || null,

             obenAuf: false,

             eigenKi: behaelter.classList.contains('is-ki'),

             eigenQuelle: (satz && satz[ab || 0] && satz[ab || 0].src) || null };
  }

  function diaUhrLegen(bu, eigene){
    if (!bu) return null;
    var uhr = bu.querySelector('.dia-uhr');
    if (uhr) return uhr;
    uhr = eigene;
    if (!uhr){
      uhr = document.createElement('div');
      uhr.className = 'dia-uhr';
      uhr.setAttribute('aria-hidden', 'true');
      uhr.appendChild(document.createElement('i'));
    }
    var text = bu.querySelector('.om-bu');
    bu.insertBefore(uhr, text || bu.firstChild);
    return uhr;
  }

  function diaWeiter(z){
    if (!z || !z.laeuft) return;

    var lauf = z.gen;
    var gilt = function(){ return z.laeuft && z.gen === lauf; };
    var naechster = (z.i + 1) % z.satz.length;
    var bild = z.satz[naechster];

    var derFilm = z.filme ? z.filme.proIndex[naechster] : null;
    if (bild.loop && derFilm){
      z.i = naechster;
      z.zu = null;
      punkteSetzen(z);
      z.behaelter.classList.toggle('is-ki', !!bild.ki);
      if (z.auflage) z.auflage.classList.toggle('is-ki', !!bild.ki);

      auflTon(z.behaelter, bild.src);
      if (z.auflage) auflTon(z.auflage, bild.src);
      var kb = z.behaelter.getBoundingClientRect();
      var passt = Math.abs((bild.w / bild.h) - (kb.width / kb.height)) > 0.06;

      if (z.filmAn && z.filmAn !== derFilm){
        z.filmAn.kasten.classList.remove('is-dia');
        filmSatzLauf(z.filmAn, false, false);
      }
      z.filmAn = derFilm;
      derFilm.loop.classList.toggle('dia-passend', passt);
      derFilm.voll.classList.toggle('dia-passend', passt);
      derFilm.kasten.classList.add('is-dia');
      filmSatzLauf(derFilm, true);

      var vollFilm = derFilm.voll;
      vollFilm.loop = false;

      var stellen = function(){
        if (!gilt()) return;
        var d = (vollFilm.duration > 0 && isFinite(vollFilm.duration))
                  ? vollFilm.duration * 1000
                  : DIA_STAND + DIA_BLENDE;
        diaLinie(z, d);
        if (z.uhr) window.clearTimeout(z.uhr);
        z.uhr = window.setTimeout(function(){ diaWeiter(z); }, d);
      };
      vollFilm.addEventListener('playing', stellen, { once: true });

      stellen();
      return;
    }

    var vomFilm = z.filmAn;
    if (vomFilm) z.filmAn = null;

    var ziel = vomFilm ? (z.obenAuf ? z.oben : z.unten)
                       : (z.obenAuf ? z.unten : z.oben);
    var kasten = z.behaelter.getBoundingClientRect();
    var eigen = bild.w / bild.h, kastenV = kasten.width / kasten.height;

    ziel.classList.toggle('dia-passend', Math.abs(eigen - kastenV) > 0.06);
    ziel.src = bild.src;

    z.zu = naechster;

    var zeigen = function(){
      if (!gilt()) return;

      diaFahrt(ziel, !(z.i % 2), DIA_STAND + DIA_BLENDE);
      if (vomFilm){

        vomFilm.kasten.classList.remove('is-dia');
        filmSatzLauf(vomFilm, false, false);
      } else {

        z.obenAuf = !z.obenAuf;
        z.oben.classList.toggle('is-da', z.obenAuf);
      }

      z.behaelter.classList.toggle('is-ki', !!bild.ki);
      if (z.auflage) z.auflage.classList.toggle('is-ki', !!bild.ki);

      auflTon(z.behaelter, bild.src);
      if (z.auflage) auflTon(z.auflage, bild.src);
      z.i = naechster;
      z.zu = null;
      punkteSetzen(z);
      diaLinie(z, DIA_STAND);
      z.uhr = window.setTimeout(function(){ diaWeiter(z); }, DIA_STAND);
    };
    if (ziel.decode) ziel.decode().then(zeigen, zeigen);
    else if (ziel.complete) zeigen();
    else ziel.onload = zeigen;
  }

  function diaLinie(z, dauer){
    if (!z || !z.linie) return;
    var b = z.linie.firstChild;
    b.style.transition = 'none';
    b.style.width = '0%';
    void b.offsetWidth;
    b.style.transition = 'width ' + Math.round(dauer) + 'ms linear';
    b.style.width = '100%';
  }

  var diaAktiv = null;

  function diaAnhalten(){
    var z = diaAktiv;
    if (!z || !z.uhr) return;
    window.clearTimeout(z.uhr); z.uhr = null;
    if (z.linie){
      var b = z.linie.firstChild;
      var w = b.getBoundingClientRect().width;
      b.style.transition = 'none';
      b.style.width = Math.round(w) + 'px';
    }
  }

  function diaFortsetzen(){
    var z = diaAktiv;
    if (!z || !z.laeuft || z.uhr) return;
    diaLinie(z, DIA_STAND);
    z.uhr = window.setTimeout(function(){ diaWeiter(z); }, DIA_STAND);
  }

  function diaFahrt(el, rein, dauer){
    if (!el) return;
    if (el._fahrt){ try { el._fahrt.cancel(); } catch(err){} el._fahrt = null; }
    if (!el.animate || !filmDarf()) return;
    var von = rein ? 1 : 1.06, bis = rein ? 1.06 : 1;
    el._fahrt = el.animate(
      [{ transform: 'scale(' + von + ')' }, { transform: 'scale(' + bis + ')' }],
      { duration: dauer, easing: 'linear', fill: 'forwards' });
  }
  function diaAn(z){
    if (!z || z.laeuft) return;
    if (!filmDarf()) return;
    z.laeuft = true;
    z.gen++;
    z.zu = null;
    diaAktiv = z;
    punkteSetzen(z);
    if (z.linie) z.linie.classList.add('is-lauf');

    var start = z.satz[z.i];
    if (start && start.loop && z.filme && z.filme.proIndex[z.i]){
      z.i = (z.i - 1 + z.satz.length) % z.satz.length;
      diaWeiter(z);
      return;
    }

    diaFahrt(z.obenAuf ? z.oben : z.unten, !(z.i % 2), DIA_STAND + DIA_BLENDE);

    diaLinie(z, DIA_STAND);
    if (z.uhr) window.clearTimeout(z.uhr);
    z.uhr = window.setTimeout(function(){ diaWeiter(z); }, DIA_STAND);
  }
  function diaAus(z){
    if (!z || !z.laeuft) return;
    z.laeuft = false;
    z.gen++;
    if (diaAktiv === z) diaAktiv = null;
    if (z.uhr){ window.clearTimeout(z.uhr); z.uhr = null; }

    z.oben.classList.remove('is-da');
    z.kasten.classList.remove('is-da');
    z.obenAuf = false;
    z.behaelter.classList.toggle('is-ki', z.eigenKi);
    if (z.auflage) z.auflage.classList.toggle('is-ki', z.eigenKi);

    auflTon(z.behaelter, z.eigenQuelle);
    if (z.auflage) auflTon(z.auflage, z.eigenQuelle);
    if (z.linie){
      z.linie.classList.remove('is-lauf');
      z.linie.firstChild.style.transition = 'none';
      z.linie.firstChild.style.width = '0%';
    }
    if (z.filmAn){
      z.filmAn.kasten.classList.remove('is-dia');
      filmSatzLauf(z.filmAn, false);
      z.filmAn = null;
    }

    if (z.filme && z.filme.eigen){
      z.filme.eigen.kasten.classList.add('is-dia');
      z.filmAn = z.filme.eigen;

      if (kugelFilmeLaufen) filmLauf(z.filme.eigen.loop, true);
    }
  }

  function diaStarten(traeger, behaelter, filme, auflage, bu){
    var d = traeger && traeger.daten;
    if (!d || !d.satz || d.satz.length < 2 || !behaelter) return;
    if (!traeger.dia){
      traeger.dia = diaAnlegen(behaelter, d, d.satz, d.satzAb, filme, auflage, bu);
    } else if (traeger.dia.behaelter !== behaelter){

      diaUmziehen(traeger.dia, behaelter);
    }
    if (!traeger.dia) return;
    if (bu) traeger.dia.linie = diaUhrLegen(bu, traeger.dia.linie);
    traeger.dia.kasten.classList.add('is-da');
    diaAn(traeger.dia);
  }

  function punkteSetzen(z){
    if (!z || !z.behaelter) return;
    var feld = z.behaelter.querySelector('.dia-punkte');
    if (!feld) return;
    var k = feld.children;
    for (var i = 0; i < k.length; i++){
      k[i].classList.toggle('is-da', i === z.i);
    }
  }
  function diaVonHand(traeger, richtung){
    var z = traeger && traeger.dia;
    if (!z || !z.laeuft || !z.satz || z.satz.length < 2) return false;

    if (richtung > 0 && typeof z.zu === 'number') return true;
    if (z.uhr){ window.clearTimeout(z.uhr); z.uhr = null; }
    z.gen++;
    z.zu = null;

    var n = z.satz.length;
    if (richtung < 0) z.i = (z.i - 2 + 2 * n) % n;
    diaWeiter(z);
    return true;
  }

  function diaUmziehen(z, behaelter){
    if (!z || !behaelter || z.behaelter === behaelter) return;
    behaelter.appendChild(z.kasten);
    z.behaelter = behaelter;
    z.eigenKi = behaelter.classList.contains('is-ki') || z.eigenKi;
  }

  function diaBeenden(traeger){
    if (!traeger || !traeger.dia) return;

    if (traeger.dia.unten.getAttribute('src') !== traeger.daten.src){
      traeger.dia.unten.src = traeger.daten.src;
      traeger.dia.unten.classList.remove('dia-passend');
    }
    [traeger.dia.unten, traeger.dia.oben].forEach(function(el){
      if (el._fahrt){ try { el._fahrt.cancel(); } catch(err){} el._fahrt = null; }
    });
    diaAus(traeger.dia);
    traeger.dia.i = traeger.daten.satzAb || 0;
  }

  function filmLauf(v, an){
    if (!v) return;
    if (an && filmDarf() && !document.hidden){
      var p = v.play(); if (p && p['catch']) p['catch'](function(){});
    } else if (!v.paused) v.pause();
  }

  if (window.innerWidth <= 640){
    var streifen = document.getElementById('streifen');
    if (streifen){
      var bahn = document.createElement('div');
      bahn.className = 'om-streifen-bahn';
      var streifenFilme = [];
      var streifenPosten = [];
      IMAGES.forEach(function(bild, i){

        var k = bildkarteBauen(bild, i, { figurKlasse: 'om-streifen-karte',
                                          bu: true, masse: true, frueh: 2 });
        if (k.film) streifenFilme.push({ v: k.film, karte: k.figur,
              eigeneDia: !!(bild.satz && bild.satz.length > 1) });

        streifenPosten.push({ karte: k.figur, rahmen: k.rahmen, daten: bild,
                              film: k.film, filme: k.filme,
                              leiste: k.leiste, bu: k.bu });
        bahn.appendChild(k.figur);
      });

      streifenPosten.forEach(function(p){
        if (p.daten && p.daten.satz && p.daten.satz.length > 1){
          diaUhrLegen(p.karte, null);

          var feld = document.createElement('div');
          feld.className = 'dia-punkte';
          feld.setAttribute('aria-hidden', 'true');
          for (var n = 0; n < p.daten.satz.length; n++){
            feld.appendChild(document.createElement('i'));
          }
          p.rahmen.appendChild(feld);
        }
      });

      streifen.appendChild(bahn);

      if (streifenFilme.length || streifenPosten.length){
        var streifenImBild = true;
        var streifenPruefen = function(){
          var sr = streifen.getBoundingClientRect();
          var mitte = sr.left + sr.width / 2;
          var aufDerKarte = function(karte){
            var kr = karte.getBoundingClientRect();
            return streifenImBild && mitte >= kr.left && mitte <= kr.right;
          };
          streifenFilme.forEach(function(s){
            if (s.eigeneDia) return;
            filmSatzLauf(s.v, aufDerKarte(s.karte));
          });

          streifenPosten.forEach(function(p){
            var mittig = aufDerKarte(p.karte);
            if (p.leiste) p.leiste.classList.toggle('is-da', mittig);

            var mehrere = !!(p.daten && p.daten.satz && p.daten.satz.length > 1);
            p.rahmen.classList.toggle('is-wischbar', mittig && mehrere);
            if (mittig) diaStarten(p, p.rahmen, p.filme, null, p.karte); else diaBeenden(p);
          });
        };

        streifen.addEventListener('scroll', streifenPruefen, { passive: true });

        if (window.IntersectionObserver){
          new IntersectionObserver(function(e){
            streifenImBild = e[0].isIntersecting;
            streifenPruefen();
          }, { threshold: 0 }).observe(streifen);
        }
        document.addEventListener('visibilitychange', streifenPruefen);
        window.addEventListener('resize', streifenPruefen);
        streifenPruefen();
      }

      var pfeile = document.createElement('div');
      pfeile.className = 'om-streifen-pfeile';
      var PFAD = { zurueck: 'M15 4 L7 12 L15 20', vor: 'M9 4 L17 12 L9 20' };
      function pfeilBauen(richtung, beschriftung){
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', beschriftung);
        b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
          ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round"' +
          ' aria-hidden="true"><path d="' +
          (richtung < 0 ? PFAD.zurueck : PFAD.vor) + '"></path></svg>';

        var getippt = 0;
        b.addEventListener('pointerdown', function(e){
          if (e.pointerType === 'mouse') return;
          getippt = e.timeStamp;
          blaettern(richtung);
        });
        b.addEventListener('click', function(e){

          e.stopPropagation();

          if (getippt && e.timeStamp - getippt < 1000) return;
          blaettern(richtung);
        });
        return b;
      }
      var zurueck = pfeilBauen(-1, 'Vorheriges Bild');
      var vor = pfeilBauen(1, 'Naechstes Bild');
      pfeile.appendChild(zurueck);
      pfeile.appendChild(vor);
      streifen.parentNode.insertBefore(pfeile, streifen.nextSibling);

      pfeileLegen();

      function zielFuer(richtung){
        var bilder = bahn.children;
        if (!bilder.length) return null;
        var jetzt = streifen.scrollLeft;
        var mitte = jetzt + streifen.clientWidth / 2;
        var ziel = null;
        for (var i = 0; i < bilder.length; i++){
          var m = bilder[i].offsetLeft + bilder[i].offsetWidth / 2;
          if (richtung > 0){ if (m > mitte + 8){ ziel = m; break; } }
          else if (m < mitte - 8){ ziel = m; }
        }
        if (ziel === null) return null;
        var weit = Math.max(0, streifen.scrollWidth - streifen.clientWidth);
        var links = Math.max(0, Math.min(weit, ziel - streifen.clientWidth / 2));
        return Math.abs(links - jetzt) < 2 ? null : links;
      }

      var fahrt = null;
      var FAHRT_MS = 420;
      function fahren(ziel){
        if (fahrt){ window.cancelAnimationFrame(fahrt); fahrt = null; }

        if (window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches){
          streifen.scrollLeft = ziel;
          return;
        }
        var von = streifen.scrollLeft, weg = ziel - von, t0 = 0;
        streifen.style.scrollSnapType = 'none';
        var schritt = function(t){
          if (!t0) t0 = t;
          var a = Math.min(1, (t - t0) / FAHRT_MS);

          var e = a < 0.5 ? 4 * a * a * a : 1 - Math.pow(-2 * a + 2, 3) / 2;
          streifen.scrollLeft = von + weg * e;
          if (a < 1){
            fahrt = window.requestAnimationFrame(schritt);
          } else {
            fahrt = null;
            streifen.style.scrollSnapType = '';
            pfeileStellen();
          }
        };
        fahrt = window.requestAnimationFrame(schritt);
      }

      function blaettern(richtung){
        var links = zielFuer(richtung);
        if (links === null) return;
        fahren(links);
      }

      function pfeileStellen(){
        var zl = zielFuer(-1), zr = zielFuer(1);
        zurueck.classList.toggle('is-leer', zl === null);
        vor.classList.toggle('is-leer', zr === null);

        zurueck.setAttribute('aria-disabled', zl === null ? 'true' : 'false');
        vor.setAttribute('aria-disabled', zr === null ? 'true' : 'false');
      }
      streifen.addEventListener('scroll', pfeileStellen, { passive: true });
      pfeileStellen();

      if (window.ResizeObserver){
        new ResizeObserver(function(){ pfeileLegen(); pfeileStellen(); }).observe(bahn);
      } else {

        window.addEventListener('load', function(){ pfeileLegen(); pfeileStellen(); });
      }

      function pfeileLegen(){
        if (!pfeile || !streifenPosten.length) return;
        var y = 0;
        for (var i = 0; i < streifenPosten.length; i++){
          var q = streifenPosten[i];
          var kh = q.karte.getBoundingClientRect().height;
          if (kh <= 0) continue;
          var bu = q.bu ? q.bu.getBoundingClientRect().height : 0;

          var d = kh / 2 + 14 + bu + 23 + 8;
          if (d > y) y = d;
        }
        if (!y) return;

        var hoehe = window.innerHeight;

        if (y > hoehe / 2 - 32){ y = 0; }
        var neu = Math.round(hoehe / 2 + y) + 'px';
        if (pfeile.style.getPropertyValue('--strf-pfeil-top') === neu) return;

        pfeile.style.transition = 'none';
        pfeile.style.setProperty('--strf-pfeil-top', neu);
        void pfeile.offsetWidth;
        pfeile.style.transition = '';
      }
      window.addEventListener('resize', function(){ pfeileLegen(); pfeileStellen(); });
      if (document.fonts && document.fonts.ready){
        document.fonts.ready.then(function(){ pfeileLegen(); pfeileStellen(); });
      }

      var WISCH_ENTSCHEID = 8;
      var WISCH_WEG = 26;
      var wischVon = null, wischPosten = null, wischErledigt = false;
      var wischHoch = 0;
      streifen.addEventListener('pointerdown', function(e){
        wischVon = null; wischPosten = null; wischErledigt = false;
        wischHoch = 0;
        var rahmen = e.target && e.target.closest &&
                     e.target.closest('.om-bild-rahmen.is-wischbar');
        if (!rahmen) return;
        for (var i = 0; i < streifenPosten.length; i++){
          if (streifenPosten[i].rahmen === rahmen){ wischPosten = streifenPosten[i]; break; }
        }
        if (!wischPosten) return;
        wischVon = { x: e.clientX, y: e.clientY };
      }, { passive: true });
      streifen.addEventListener('pointermove', function(e){
        if (!wischVon || wischErledigt) return;
        var dx = e.clientX - wischVon.x, dy = e.clientY - wischVon.y;

        if (!wischHoch){
          if (Math.abs(dx) < WISCH_ENTSCHEID && Math.abs(dy) < WISCH_ENTSCHEID) return;
          wischHoch = Math.abs(dy) > Math.abs(dx) ? 1 : -1;
        }
        if (wischHoch < 0) return;
        if (Math.abs(dy) < WISCH_WEG) return;

        wischErledigt = true;
        diaVonHand(wischPosten, dy < 0 ? 1 : -1);
      }, { passive: true });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(function(name){
        streifen.addEventListener(name, function(){
          wischVon = null; wischPosten = null;
        }, { passive: true });
      });

      function pfeileSetzen(an){
        var warDa = pfeile.classList.contains('is-da');
        pfeile.classList.toggle('is-da', an);

        if (an && !warDa) nachlaufAnhalten();

        pfeile.style.visibility = an ? 'visible' : 'hidden';

        if (an) pfeileStellen();
      }
      var zeigen = function(){
        var rect = scrollWrap.getBoundingClientRect();
        var vis = (rect.top <= 0 && rect.bottom > -200) ? 'visible' : 'hidden';
        if (streifen.style.visibility !== vis) streifen.style.visibility = vis;

        var pfeileAn = vis === 'visible' &&
          maskeOffen() &&
          rect.bottom > pfeile.getBoundingClientRect().top + 60;

        pfeileSetzen(pfeileAn);
      };
      window.addEventListener('scroll', zeigen, { passive: true });
      window.addEventListener('resize', zeigen);
      zeigen();
    }
    layerBack.remove();
    layerFront.remove();
    return;
  }

  var CARD_REF_PX = 2048;

  var CARD_BASE_PX = 300 * (window.innerHeight > window.innerWidth ? 0.72 : 1);
  var CARD_COUNT = IMAGES.length;

  var SPHERE_TARGET_R = 420, PERSPECTIVE = 1850;
  function updateSpokeSizing(){

    SPHERE_TARGET_R = Math.max(380, Math.min(780, window.innerWidth * 0.42));

    PERSPECTIVE = SPHERE_TARGET_R * 3.0;
    var stages = document.querySelectorAll('#orbitBack .orbit-stage, #orbitFront .orbit-stage');
    for (var s = 0; s < stages.length; s++){ stages[s].style.perspective = PERSPECTIVE + 'px'; }
  }
  updateSpokeSizing();
  window.addEventListener('resize', updateSpokeSizing);
  var SPHERE_R = SPHERE_TARGET_R;

  var cards = [];
  var goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (var i = 0; i < CARD_COUNT; i++){
    var y0n = 1 - (i / (CARD_COUNT - 1)) * 2;
    var radAtY = Math.sqrt(Math.max(0, 1 - y0n * y0n));
    var theta = goldenAngle * i;
    var dirX = Math.cos(theta) * radAtY;
    var dirY = y0n;
    var dirZ = Math.sin(theta) * radAtY;

    var daten = IMAGES[i % IMAGES.length];

    var hinten = bildkarteBauen(daten, i, { rahmenKlasse: 'orbit-card',
                    schatten: true, ohneLeiste: true, filmSammler: filmLoops });
    var vorne  = bildkarteBauen(daten, i, { rahmenKlasse: 'orbit-card',
                    schatten: true, ohneLeiste: true, ohneFilm: true });
    var elBack = hinten.rahmen, elFront = vorne.rahmen;
    var shadeBack = hinten.schatten, shadeFront = vorne.schatten;
    var filmSatz = hinten.film;
    var filmeDerKarte = hinten.filme;
    var film = filmSatz ? filmSatz.kasten : null;
    var filmVoll = filmSatz ? filmSatz.voll : null;

    var src = IMAGES[i % IMAGES.length];
    var geoMean = Math.sqrt(src.w * src.h);
    var shown = CARD_BASE_PX * (geoMean / CARD_REF_PX) * (src.groesse || 1);
    var w = shown * Math.sqrt(src.w / src.h);
    var h = shown * Math.sqrt(src.h / src.w);
    [elBack, elFront].forEach(function(el){
      el.style.width = w + 'px';
      el.style.height = h + 'px';
      el.style.marginLeft = (-w / 2) + 'px';
      el.style.marginTop = (-h / 2) + 'px';
    });

    worldBack.appendChild(elBack);

    cards.push({ dirX: dirX, dirY: dirY, dirZ: dirZ, elBack: elBack, elFront: elFront,
                 shadeBack: shadeBack, shadeFront: shadeFront, daten: daten,

                 lastBlur: -1, lastZ: -1, hoverAmt: 0,
                 film: film, filmVoll: filmVoll, filmSatz: filmSatz,

                 filme: filmeDerKarte,
                 inFront: false, w: w, h: h, z2: 0 });
  }

  var filmLaeuft = false, filmSichtbar = true;
  var filmSchmal = window.matchMedia ? matchMedia('(max-width: 640px)') : null;
  function filmeSchalten(an){

    an = !!an && filmDarf() && !document.hidden && !galerieAn &&
         !(filmSchmal && filmSchmal.matches);
    if (an === filmLaeuft) return;
    filmLaeuft = an;
    kugelFilmeLaufen = an;
    filmLoops.forEach(function(v){
      if (an){ var p = v.play(); if (p && p['catch']) p['catch'](function(){}); }
      else v.pause();
    });

    if (orbitTon && orbitTon.an){
      if (an){ var q = orbitTon.voll.play(); if (q && q['catch']) q['catch'](function(){}); }
      else orbitTon.voll.pause();
    }
  }
  if (filmLoops.length){
    if (window.IntersectionObserver){
      new IntersectionObserver(function(eintraege){
        filmSichtbar = eintraege[0].isIntersecting;
        filmeSchalten(filmSichtbar);
      }, { threshold: 0 }).observe(layerBack);
    }
    filmeSchalten(true);
    document.addEventListener('visibilitychange', function(){
      filmeSchalten(filmSichtbar);
    });
  }

  var scharfKarte = null;
  function scharfStellen(c){
    if (!c || c === scharfKarte) return;
    scharfWeg();
    var lang = Math.max(c.w, c.h);
    var ziel = Math.min(window.innerWidth, window.innerHeight) * FOCUS_FILL;
    var k = Math.max(1, Math.min(3, ziel / lang));
    if (k <= 1.02) return;
    c.ss = k;
    scharfKarte = c;
    [c.elBack, c.elFront].forEach(function(el){
      el.style.width = (c.w * k) + 'px';
      el.style.height = (c.h * k) + 'px';
      el.style.marginLeft = (-c.w * k / 2) + 'px';
      el.style.marginTop = (-c.h * k / 2) + 'px';
      el.style.borderRadius = (6 * k).toFixed(1) + 'px';
      el.style.boxShadow = '0 ' + (14 * k).toFixed(0) + 'px ' + (40 * k).toFixed(0) +
                           'px rgba(0,0,0,.45)';
    });
  }
  function scharfWeg(){
    var c = scharfKarte;
    if (!c) return;
    scharfKarte = null;
    c.ss = 1;
    [c.elBack, c.elFront].forEach(function(el){
      el.style.width = c.w + 'px';
      el.style.height = c.h + 'px';
      el.style.marginLeft = (-c.w / 2) + 'px';
      el.style.marginTop = (-c.h / 2) + 'px';
      el.style.borderRadius = '';
      el.style.boxShadow = '';
    });
  }

  function diaKarteAn(c){
    if (!c) return;
    var el = c.inFront ? c.elFront : c.elBack;
    diaStarten(c, el, c.filme, karteAufl, karteBu);

    if (c.dia && c.dia.linie && karteBu){

      var breite = parseFloat(karteBu.style.width);
      if (breite > 0){
        c.dia.linie.style.marginLeft = '-' + Math.round(breite * 0.03) + 'px';
        c.dia.linie.style.width = Math.round(breite) + 'px';
      }
    }
  }
  var karteBu = document.getElementById('karteBu');
  var karteAufl = document.getElementById('karteAufl');
  var filmTasten = document.getElementById('filmTasten');

  var orbitTon = null;
  var buKarte = null;
  var buGelegt = false;

  var buSkala = 1;
  function buSetzen(c){
    if (!karteBu || !c || !c.daten) return;
    karteBu.innerHTML = buBauen(c.daten);
  }

  function buLegen(c){
    if (!karteBu || !c) return;
    var el = c.inFront ? c.elFront : c.elBack;
    if (!el || !el.parentNode) return;
    var r = el.getBoundingClientRect();

    buSkala = c.w > 0 ? r.width / c.w : 1;
    var sx = magX * MAG_PULL_PX * buSkala, sy = magY * MAG_PULL_PX * buSkala;
    karteBu.style.width = Math.round(r.width) + 'px';

    karteBu.style.paddingLeft = Math.round(r.width * 0.03) + 'px';
    karteBu.style.left = Math.round(r.left - sx) + 'px';
    karteBu.style.top = Math.round(r.bottom - sy + 18) + 'px';

    if (karteAufl){
      karteAufl.style.left = Math.round(r.left - sx) + 'px';
      karteAufl.style.top = Math.round(r.top - sy) + 'px';
      karteAufl.style.width = Math.round(r.width) + 'px';
      karteAufl.style.height = Math.round(r.height) + 'px';
      karteAufl.classList.toggle('is-ki', !!(c.daten && c.daten.ki));
      karteAufl.classList.toggle('is-heureka', !!(c.daten && c.daten.heureka));

      if (c.daten && c.daten.heureka) auflTon(karteAufl, c.daten.src);
    }

    if (filmTasten && c.film){
      var luft = Math.max(12, Math.round(r.width * 0.03));

      filmTasten.style.left = Math.round(r.right - sx) - luft - 88 + 'px';

      filmTasten.style.top = Math.round(r.top - sy) + luft + 10 + 'px';
    }
  }

  window.addEventListener('resize', function(){ buGelegt = false; });

  var focused = null;
  var lastFocused = null;
  var focusAmt = 0;
  var FOCUS_SPEED = 1.7;
  var FOCUS_FILL = 0.62;
  var FOCUS_DIM = 0.45;
  var spinDamp = 1;
  var SPIN_EASE = 2.4;

  var MAG_PULL_PX = 14;
  var MAG_EASE = 6;

  var HOVER_SCALE = 0.12;
  var HOVER_EASE = 9;
  var hoverCard = null;
  var pointerInside = false;
  var pointerX = -1, pointerY = -1;
  var magX = 0, magY = 0;
  function easeInOutCubic(t){
    return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
  }

  function cardAt(px, py){
    var best = null;
    for (var k = 0; k < cards.length; k++){
      var c = cards[k];
      var el = c.inFront ? c.elFront : c.elBack;
      if (!el.parentNode) continue;
      var r = el.getBoundingClientRect();
      if (px >= r.left && px <= r.right && py >= r.top && py <= r.bottom){
        if (!best || c.z2 > best.z2) best = c;
      }
    }
    return best;
  }

  var dragRotY = 0, dragRotX = 12;
  var dragging = false, lastPX = 0, lastPY = 0;
  var velY = 0, velX = 0;
  var FRICTION = 0.94;
  var VEL_STOP = 0.02;
  var AUTO_SPEED = 4;

  var autoDirY = 1, autoDirX = 0;

  var AUTO_TILT_RATE = 0.25;

  var downX = 0, downY = 0, movedPx = 0;
  var CLICK_SLOP = 6;

  layerFront.addEventListener('pointerdown', function(e){
    e.preventDefault();
    downX = e.clientX; downY = e.clientY; movedPx = 0;

    dragging = (focused === null);
    lastPX = e.clientX; lastPY = e.clientY;
    velY = 0; velX = 0;
    if (dragging) { layerFront.classList.add('is-dragging'); }
    layerFront.setPointerCapture(e.pointerId);
  });
  layerFront.addEventListener('pointermove', function(e){

    pointerX = e.clientX; pointerY = e.clientY; pointerInside = true;
    movedPx = Math.max(movedPx, Math.hypot(e.clientX - downX, e.clientY - downY));
    if (!dragging) return;
    var dx = e.clientX - lastPX, dy = e.clientY - lastPY;
    lastPX = e.clientX; lastPY = e.clientY;
    velY = dx * 0.25;
    velX = -dy * 0.2;
    dragRotY += velY;
    dragRotX += velX;
  });

  layerFront.addEventListener('pointerenter', function(){ pointerInside = true; });
  layerFront.addEventListener('pointerleave', function(){ pointerInside = false; });

  var clickConsumed = false;

  function orbitTonAn(c){
    orbitTon = (c && c.filmSatz) ? c.filmSatz : null;
    if (!filmTasten) return;
    filmTasten.innerHTML = '';

    var leiste = tastenBauen(filmTasten, orbitTon, c && c.daten && c.daten.link);
    if (leiste) leiste.classList.add('is-da');
    if (orbitTon) filmSatzLauf(orbitTon, c.film.classList.contains('is-dia'));
  }
  function orbitTonAus(){
    if (orbitTon){ filmSatzLauf(orbitTon, false); orbitTon.leiste = null; }
    orbitTon = null;
    if (filmTasten) filmTasten.innerHTML = '';
  }

  var MANIFEST_DECKT_AB = 200;
  function ueberManifest(x, y){
    var el = document.querySelector('.om-bold');
    if (!el) return false;
    var r = el.getBoundingClientRect();
    if (r.bottom <= 0 || r.top >= window.innerHeight) return false;
    var cs = getComputedStyle(el);
    var m = /circle\(([\d.]+)px/.exec(cs.clipPath || cs.webkitClipPath || '');
    if (!m) return false;
    var radius = parseFloat(m[1]);
    if (!(radius > MANIFEST_DECKT_AB)) return false;
    return Math.hypot(x - (r.left + r.width / 2),
                      y - (r.top + r.height / 2)) <= radius;
  }

  layerFront.addEventListener('pointerup', function(e){
    if (movedPx > CLICK_SLOP) return;

    if (focused){ orbitTonAus(); focused = null; clickConsumed = true; return; }
    var hit = cardAt(e.clientX, e.clientY);

    if ((!hit || !hit.inFront) && ueberManifest(e.clientX, e.clientY)) return;
    var aufKnopf = aufSchalter(e.clientX, e.clientY);

    if (aufKnopf && (!hit || !hit.inFront)){
      if (!nurReihe) galerieSchalten(!galerieAn);
      clickConsumed = true;
      return;
    }
    if (hit){
      focused = hit; lastFocused = hit; velY = 0; velX = 0; clickConsumed = true;

      if (hit.daten.loop && hit.filmSatz && hit.filmSatz.ton){
        orbitTon = hit.filmSatz;
        filmTon(hit.filmSatz);
      }
    }
  });

  layerFront.addEventListener('click', function(e){
    if (clickConsumed){ clickConsumed = false; e.stopPropagation(); }
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && focused) { focused = null; }
  });

  function endDrag(){
    dragging = false;
    layerFront.classList.remove('is-dragging');
    var m = Math.hypot(velY, velX);
    if (m > 0.0001){ autoDirY = velY / m; autoDirX = velX / m; }
  }
  layerFront.addEventListener('pointerup', endDrag);
  layerFront.addEventListener('pointercancel', endDrag);
  layerFront.addEventListener('pointerleave', endDrag);

  var galerie = document.getElementById('galerie');
  var schalter = document.getElementById('galerieSchalter');
  var galerieAn = false;
  var gPosten = [];
  var gIndex = 0;
  var gPfeilZurueck = null, gPfeilVor = null;
  var G_LUECKE = 26;
  var G_GROSS = 0.62;
  var G_KLEIN = 0.20;

  function galerieBauen(){
    IMAGES.forEach(function(bild, i){

      var k = bildkarteBauen(bild, i, { figurKlasse: 'om-galerie-bild',
                                        bu: true, schatten: true, frueh: 3 });
      galerie.appendChild(k.figur);
      gPosten.push({ figur: k.figur, rahmen: k.rahmen, schatten: k.schatten,
                     film: k.film, filme: k.filme, daten: bild,
                     leiste: k.leiste, bu: k.bu,
                     w: bild.w, h: bild.h, gb: 0, gh: 0 });
    });

    var PFAD = { zurueck: 'M15 4 L7 12 L15 20', vor: 'M9 4 L17 12 L9 20' };
    [-1, 1].forEach(function(richtung){
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'om-galerie-pfeil';
      b.setAttribute('aria-label', richtung < 0 ? 'Vorheriges Bild' : 'Naechstes Bild');
      b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
        ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round"' +
        ' aria-hidden="true"><path d="' +
        (richtung < 0 ? PFAD.zurueck : PFAD.vor) + '"></path></svg>';
      b.addEventListener('click', function(e){
        e.stopPropagation();
        galerieZu(gIndex + richtung);
      });
      galerie.appendChild(b);
      if (richtung < 0) gPfeilZurueck = b; else gPfeilVor = b;
    });
    galerieMasse();
  }

  function galerieMasse(){
    var kurz = Math.min(window.innerWidth, window.innerHeight);
    gPosten.forEach(function(p){
      var f = kurz * G_GROSS / Math.max(p.w, p.h);
      p.gb = p.w * f; p.gh = p.h * f;
      p.rahmen.style.width = Math.round(p.gb) + 'px';
      p.rahmen.style.height = Math.round(p.gh) + 'px';
    });
  }

  var G_FAKTOR = G_KLEIN / G_GROSS;

  function galerieLegen(){
    if (!gPosten.length) return;

    var br = gPosten.map(function(p, i){
      return p.gb * (i === gIndex ? 1 : G_FAKTOR);
    });
    var x = [];
    x[gIndex] = 0;
    for (var i = gIndex + 1; i < br.length; i++){
      x[i] = x[i - 1] + br[i - 1] / 2 + G_LUECKE + br[i] / 2;
    }
    for (var j = gIndex - 1; j >= 0; j--){
      x[j] = x[j + 1] - br[j + 1] / 2 - G_LUECKE - br[j] / 2;
    }
    gPosten.forEach(function(p, k){

      if (p.rahmen.style.filter !== 'none'){ p.rahmen.style.filter = 'none'; }
      if (p.schatten.style.opacity !== '0'){ p.schatten.style.opacity = '0'; }
      if (p.rahmen.style.boxShadow){ p.rahmen.style.boxShadow = ''; }
      if (p.rahmen.style.borderRadius){ p.rahmen.style.borderRadius = ''; }
      p.rahmen.classList.remove('is-orbitmass');

      p.figur.style.zIndex = gPosten.length - Math.abs(k - gIndex);
      var s = (k === gIndex ? 1 : G_FAKTOR);

      p.figur.style.transform =
        'translate(-50%,-50%) translateX(' + (x[k] + zug).toFixed(1) + 'px)' +
        ' scale(' + s.toFixed(4) + ')';
      p.figur.classList.toggle('is-mitte', k === gIndex);

      var inDerMitte = galerieAn && k === gIndex;
      if (p.leiste) p.leiste.classList.toggle('is-da', inDerMitte);

      var eigeneDia = p.daten && p.daten.satz && p.daten.satz.length > 1;
      if (p.film && !eigeneDia) filmSatzLauf(p.film, inDerMitte);
      if (inDerMitte) diaStarten(p, p.rahmen, p.filme, null, p.figur); else diaBeenden(p);
    });
    if (gPfeilZurueck){

      var mp = gPosten[gIndex];
      var halbB = (mp ? mp.gb : 0) / 2, halbH = (mp ? mp.gh : 0) / 2;
      var raus = Math.min(halbB + 40, window.innerWidth / 2 - 32);
      gPfeilZurueck.style.transform =
        'translate(-50%,-50%) translate(' + (-raus).toFixed(0) + 'px,' + halbH.toFixed(0) + 'px)';
      gPfeilVor.style.transform =
        'translate(-50%,-50%) translate(' + raus.toFixed(0) + 'px,' + halbH.toFixed(0) + 'px)';
      gPfeilZurueck.disabled = gIndex === 0;
      gPfeilVor.disabled = gIndex === gPosten.length - 1;
    }
  }

  function galerieZu(i){
    var neu = Math.max(0, Math.min(gPosten.length - 1, i));
    if (neu === gIndex) return;
    gIndex = neu;
    galerieLegen();
  }

  var zug = 0, ziehtVon = null, gezogen = 0;
  var ZUG_DAEMPFUNG = 0.45;
  var ZUG_SCHWELLE = 45;

  var HOCH_BAND = 0.3;

  function hochBandGilt(){
    return !window.matchMedia || window.matchMedia('(pointer: fine)').matches;
  }
  var blaetterSeite = 0;
  function blaetternMelden(px, py){
    var seite = 0;
    if (galerieAn && gPosten.length){
      var p = gPosten[gIndex];
      var r = p.rahmen.getBoundingClientRect();
      if (px >= r.left && px <= r.right && py >= r.top && py <= r.bottom){
        var mehrere = !!(p.daten && p.daten.satz && p.daten.satz.length > 1);
        if (mehrere && hochBandGilt() && py < r.top + r.height * HOCH_BAND){
          seite = 2;
        } else {
          seite = px < r.left + r.width / 2 ? -1 : 1;

          if ((seite < 0 && gIndex === 0) ||
              (seite > 0 && gIndex === gPosten.length - 1)) seite = 0;
        }
      }
    }
    if (seite === blaetterSeite) return;
    blaetterSeite = seite;
    document.body.classList.toggle('is-blaettern', seite !== 0);
    document.body.classList.toggle('is-blaettern-links', seite === -1);
    document.body.classList.toggle('is-blaettern-hoch', seite === 2);
  }
  function blaetternAus(){
    blaetterSeite = 0;
    document.body.classList.remove('is-blaettern', 'is-blaettern-links',
                                   'is-blaettern-hoch');
  }

  function figurAn(px, py){
    for (var i = 0; i < gPosten.length; i++){
      var r = gPosten[i].rahmen.getBoundingClientRect();
      if (px >= r.left && px <= r.right && py >= r.top && py <= r.bottom) return i;
    }
    return -1;
  }
  if (galerie){
    galerie.addEventListener('pointerdown', function(e){
      if (!galerieAn) return;

      if (e.target.closest &&
          e.target.closest('.om-galerie-pfeil, .om-film-tasten')) return;
      ziehtVon = e.clientX; gezogen = 0;
      galerie.classList.add('is-zug');

      try { galerie.setPointerCapture(e.pointerId); } catch (fehler) {}
    });
    galerie.addEventListener('pointermove', function(e){
      if (ziehtVon === null){ blaetternMelden(e.clientX, e.clientY); return; }
      gezogen = e.clientX - ziehtVon;
      zug = gezogen * ZUG_DAEMPFUNG;
      galerieLegen();
    });
    galerie.addEventListener('pointerleave', function(){ blaetternAus(); });
    ['pointerup', 'pointercancel'].forEach(function(name){
      galerie.addEventListener(name, function(e){
        if (ziehtVon === null) return;
        var weg = gezogen;
        ziehtVon = null; zug = 0; gezogen = 0;
        galerie.classList.remove('is-zug');
        if (Math.abs(weg) > ZUG_SCHWELLE){

          gIndex = Math.max(0, Math.min(gPosten.length - 1,
                                        gIndex + (weg < 0 ? 1 : -1)));
        } else if (Math.abs(weg) <= 6 && name === 'pointerup'){

          var t = figurAn(e.clientX, e.clientY);
          if (t === gIndex){

            var p = gPosten[gIndex];
            var r = p.rahmen.getBoundingClientRect();
            var mehrere = !!(p.daten && p.daten.satz && p.daten.satz.length > 1);
            if (mehrere && hochBandGilt() && e.clientY < r.top + r.height * HOCH_BAND){

              diaVonHand(p, 1);
              galerieLegen();
              return;
            }
            var schritt = e.clientX < r.left + r.width / 2 ? -1 : 1;
            gIndex = Math.max(0, Math.min(gPosten.length - 1, gIndex + schritt));
          } else if (t >= 0){
            gIndex = t;
          }
        }
        galerieLegen();
      });
    });
  }

  var radStand = 0, radSperre = false;
  if (galerie){
    galerie.addEventListener('wheel', function(e){
      if (!galerieAn) return;

      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)){
        if (!nurReihe) galerieSchalten(false);
        return;
      }
      e.preventDefault();

      e.stopPropagation();
      if (radSperre) return;
      radStand += e.deltaX;
      if (Math.abs(radStand) < 48) return;
      galerieZu(gIndex + (radStand > 0 ? 1 : -1));
      radStand = 0;
      radSperre = true;
      setTimeout(function(){ radSperre = false; }, 420);
    }, { passive: false });
  }

  var galerieSeit = 0, galerieY = 0;
  window.addEventListener('scroll', function(){
    if (!galerieAn) return;

    if (nurReihe) return;
    if (performance.now() - galerieSeit < 700){ galerieY = window.scrollY; return; }
    if (Math.abs(window.scrollY - galerieY) < 6) return;
    galerieSchalten(false);
  }, { passive: true });
  document.addEventListener('keydown', function(e){
    if (!galerieAn) return;
    if (e.key === 'ArrowRight'){ galerieZu(gIndex + 1); }
    else if (e.key === 'ArrowLeft'){ galerieZu(gIndex - 1); }
  });

  function kartenUmrisse(){
    return cards.map(function(c){
      var el = c.inFront ? c.elFront : c.elBack;
      if (!el || !el.parentNode) return null;
      var r = el.getBoundingClientRect();

      return { left: r.left, top: r.top, width: r.width, height: r.height,

               css: el.offsetWidth,

               z: (c.inFront ? 1000 : 0) + (parseInt(el.style.zIndex, 10) || 0),
               filter: el.style.filter || 'none',
               schatten: (c.inFront ? c.shadeFront : c.shadeBack).style.opacity || '0' };
    });
  }

  function galerieAufKarten(sofort, umrisse){
    var r = umrisse || kartenUmrisse();
    gPosten.forEach(function(p, i){
      var k = r[i];
      if (!k || !k.width) return;
      if (sofort) p.figur.classList.add('ohne-flug');

      p.rahmen.style.filter = k.filter;
      p.schatten.style.opacity = k.schatten;

      var vf = (p.gb > 0 && k.css > 0) ? p.gb / k.css : 1;
      p.rahmen.style.boxShadow = '0 ' + (14 * vf).toFixed(1) + 'px ' +
                                 (40 * vf).toFixed(1) + 'px rgba(0,0,0,.45)';
      p.rahmen.style.borderRadius = (6 * vf).toFixed(1) + 'px';
      p.rahmen.classList.add('is-orbitmass');
      p.figur.style.zIndex = k.z;

      var s = p.gb > 0 ? k.width / p.gb : 1;
      p.figur.style.transform = 'translate(-50%,-50%) translate(' +
        Math.round(k.left + k.width / 2 - window.innerWidth / 2) + 'px,' +
        Math.round(k.top + k.height / 2 - window.innerHeight / 2) + 'px)' +
        ' scale(' + s.toFixed(4) + ')';
    });
    if (sofort){

      void galerie.offsetWidth;
      gPosten.forEach(function(p){ p.figur.classList.remove('ohne-flug'); });
    }
  }

  function naechstesZurMitte(umrisse){
    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var beste = gIndex, weite = Infinity;
    umrisse.forEach(function(k, i){
      if (!k || !k.width || i >= gPosten.length) return;
      var d = Math.hypot(k.left + k.width / 2 - mx, k.top + k.height / 2 - my);
      if (d < weite){ weite = d; beste = i; }
    });
    return beste;
  }

  var flug = false, flugUhr = 0;
  var FLUG_MS = 600;
  function flugStarten(){
    flug = true;
    clearTimeout(flugUhr);
    flugUhr = setTimeout(function(){ flug = false; checkActive(); }, FLUG_MS);
    checkActive();
  }

  function galerieSchalten(an){
    galerieAn = an;

    scharfWeg();
    if (schalter){
      schalter.setAttribute('aria-pressed', an ? 'true' : 'false');
      schalter.setAttribute('aria-label',
        an ? 'Zur Orbit-Ansicht wechseln' : 'Zur Reihenansicht wechseln');
    }
    if (an){
      if (!gPosten.length) galerieBauen();
      galerieSeit = performance.now();
      galerieY = window.scrollY;
      focused = null;
      var umrisse = kartenUmrisse();
      gIndex = naechstesZurMitte(umrisse);
      galerieAufKarten(true, umrisse);
      flugStarten();
      document.body.classList.add('is-galerie');

      filmeSchalten(filmSichtbar);

      requestAnimationFrame(function(){
        requestAnimationFrame(function(){ if (galerieAn) galerieLegen(); });
      });
    } else {

      flugStarten();
      blaetternAus();
      document.body.classList.remove('is-galerie');
      filmeSchalten(filmSichtbar);
      gPosten.forEach(function(p){
        p.figur.classList.remove('is-mitte');
        if (p.film) filmSatzLauf(p.film, false);
        if (p.leiste) p.leiste.classList.remove('is-da');
        diaBeenden(p);
      });
      galerieAufKarten(false);
    }
  }

  function aufSchalter(px, py){
    if (!schalter || !document.body.classList.contains('is-orbit-bereit')) return false;
    if (getComputedStyle(schalter).display === 'none') return false;
    var r = schalter.getBoundingClientRect();
    return px >= r.left && px <= r.right && py >= r.top && py <= r.bottom;
  }
  if (schalter){

    schalter.addEventListener('click', function(e){
      e.stopPropagation();
      galerieSchalten(!galerieAn);
    });
    layerFront.addEventListener('pointermove', function(e){
      var drauf = aufSchalter(e.clientX, e.clientY);
      layerFront.classList.toggle('is-schalter', drauf);

      schalter.classList.toggle('is-drauf', drauf);
    });
    layerFront.addEventListener('pointerleave', function(){
      layerFront.classList.remove('is-schalter');
      schalter.classList.remove('is-drauf');
    });
  }
  window.addEventListener('resize', function(){
    if (!gPosten.length) return;
    galerieMasse();
    if (galerieAn) galerieLegen();
  });

  var active = false;
  var WARM_UP = 80;
  var reiheSteht = false;

  var nurReihe = window.matchMedia &&
                 window.matchMedia('(pointer: coarse)').matches;

  function checkActive(){
    var rect = scrollWrap.getBoundingClientRect();
    var computing = rect.bottom > -200 && rect.top < WARM_UP;
    var visible = rect.top <= 0 && rect.bottom > -200;
    if (computing !== active){
      active = computing;
    }

    var vis = (visible && !galerieAn && !flug) ? 'visible' : 'hidden';
    if (layerBack.style.visibility !== vis){
      layerBack.style.visibility = vis;
      layerFront.style.visibility = vis;
    }
    if (galerie){
      var gv = (visible && (galerieAn || flug)) ? 'visible' : 'hidden';
      if (galerie.style.visibility !== gv) galerie.style.visibility = gv;

      var steht = nurReihe && galerieAn && visible && maskeOffen();
      if (steht && !reiheSteht) nachlaufAnhalten();
      reiheSteht = steht;

      if (nurReihe){
        var raus = window.innerHeight - rect.bottom;
        var t = raus > 0 ? 'translateY(' + (-Math.round(raus)) + 'px)' : '';
        if (galerie.style.transform !== t) galerie.style.transform = t;
      }
    }
  }
  window.addEventListener('scroll', checkActive, { passive: true });
  window.addEventListener('resize', checkActive);
  checkActive();

  if (nurReihe) galerieSchalten(true);

  var DEG2RAD = Math.PI / 180;

  var ENTRY_SCALE = 2.3;
  var DEPTH_BRIGHTNESS_MIN = 0.26;
  var DEPTH_BLUR_MAX = 8;
  function easeOutCubic(t){ var f = 1 - t; return 1 - f * f * f; }

  var MASK_DONE_AT_ORBIT = 0.439;
  var COLLAPSE_START_ORBIT = 0.767;
  function rawScrollProgress(){
    var rect = scrollWrap.getBoundingClientRect();
    var reserve = rect.height - window.innerHeight;
    return reserve > 0 ? Math.max(0, Math.min(1, -rect.top / reserve)) : (rect.top <= 0 ? 1 : 0);
  }
  function maskProgress(){
    return Math.max(0, Math.min(1, rawScrollProgress() / MASK_DONE_AT_ORBIT));
  }

  var COLLAPSE_BUMP_END_ORBIT = 0.20;
  var COLLAPSE_BUMP_ORBIT = 0.18;
  var COLLAPSE_SUCK_END_ORBIT = 0.74;
  var CARD_SHRINK_START = 0.22;
  function collapseFactors(){
    var col = Math.max(0, Math.min(1, (rawScrollProgress() - COLLAPSE_START_ORBIT) / (1 - COLLAPSE_START_ORBIT)));
    if (col <= 0) return { sphere: 1, card: 1, col: 0 };
    var sphere;
    if (col < COLLAPSE_BUMP_END_ORBIT){

      sphere = 1 + COLLAPSE_BUMP_ORBIT * Math.sin((col / COLLAPSE_BUMP_END_ORBIT) * Math.PI / 2);
    } else {

      var u = Math.min(1, (col - COLLAPSE_BUMP_END_ORBIT) / (COLLAPSE_SUCK_END_ORBIT - COLLAPSE_BUMP_END_ORBIT));
      sphere = (1 + COLLAPSE_BUMP_ORBIT) * Math.pow(1 - u, 3);
    }
    var cu = Math.max(0, Math.min(1, (col - CARD_SHRINK_START) / (COLLAPSE_SUCK_END_ORBIT - CARD_SHRINK_START)));
    return { sphere: Math.max(0, sphere), card: Math.pow(1 - cu, 1.8), col: col };
  }

  var lastFrameT = null;
  function frame(now){
    var dt = lastFrameT === null ? 1 / 60 : Math.min(0.05, (now - lastFrameT) / 1000);
    lastFrameT = now;

    if (active){
      var eased = easeOutCubic(maskProgress());
      var collapse = collapseFactors();
      SPHERE_R = SPHERE_TARGET_R * (ENTRY_SCALE - (ENTRY_SCALE - 1) * eased) * collapse.sphere;

      if (collapse.col > CARD_SHRINK_START && focused) { focused = null; }

      focusAmt = Math.max(0, Math.min(1, focusAmt + (focused ? 1 : -1) * dt * FOCUS_SPEED));

      if (orbitTon && !focused) orbitTonAus();
      if (focused !== buKarte){
        buKarte = focused; buGelegt = false;
        if (focused) buSetzen(focused);
      }
      if (focused && !buGelegt && focusAmt > 0.985){
        buLegen(focused);
        buGelegt = true;

        focused.elBack.classList.add('is-scharf', 'is-ohne-aufl');
        focused.elFront.classList.add('is-scharf', 'is-ohne-aufl');
        scharfStellen(focused);
        orbitTonAn(focused);

        diaKarteAn(focused);
        if (karteAufl){
          karteAufl.classList.add('is-da');

          requestAnimationFrame(function(){
            if (karteAufl.classList.contains('is-da')) karteAufl.classList.add('is-klein');
          });
        }
      }

      if (!focused && lastFocused && focusAmt < 0.999){
        lastFocused.elBack.classList.remove('is-scharf', 'is-ohne-aufl');
        lastFocused.elFront.classList.remove('is-scharf', 'is-ohne-aufl');
        scharfWeg();
        if (karteAufl) karteAufl.classList.remove('is-da', 'is-klein');
        if (filmTasten) filmTasten.innerHTML = '';
        diaBeenden(lastFocused);
      }
      if (karteBu) karteBu.classList.toggle('is-da', !!focused && buGelegt);

      var spinTarget = (focused !== null || focusAmt > 0.02 ||
                        galerieAn || flug) ? 0 : 1;
      spinDamp += (spinTarget - spinDamp) * Math.min(1, dt * SPIN_EASE);

      if (dragging){

      } else if (Math.abs(velY) > VEL_STOP || Math.abs(velX) > VEL_STOP){

        dragRotY += velY * spinDamp;
        dragRotX += velX * spinDamp;

        var frictionStep = Math.pow(FRICTION, dt * 60);
        velY *= frictionStep; velX *= frictionStep;
      } else {

        velY = 0; velX = 0;

        dragRotY += dt * AUTO_SPEED * autoDirY * spinDamp;
        dragRotX += dt * AUTO_SPEED * autoDirX * AUTO_TILT_RATE * spinDamp;
      }
      var worldRotY = dragRotY;
      var worldRotX = dragRotX;
      var worldTransform = 'rotateX(' + worldRotX + 'deg) rotateY(' + worldRotY + 'deg)';
      worldBack.style.transform = worldTransform;
      worldFront.style.transform = worldTransform;

      var ry = worldRotY * DEG2RAD, rx = worldRotX * DEG2RAD;
      var cosY = Math.cos(ry), sinY = Math.sin(ry);
      var cosX = Math.cos(rx), sinX = Math.sin(rx);
      var billboard = 'rotateY(' + (-worldRotY) + 'deg) rotateX(' + (-worldRotX) + 'deg)';

      var fe = easeInOutCubic(focusAmt);

      hoverCard = (pointerInside && !dragging && !focused && focusAmt < 0.01)
        ? cardAt(pointerX, pointerY) : null;

      if (hoverCard && !hoverCard.inFront &&
          ueberManifest(pointerX, pointerY)) hoverCard = null;
      layerFront.classList.toggle('is-hover', !!hoverCard);

      var mm = /circle\(([\d.]+)px/.exec(maskSection ? maskSection.style.clipPath : '');
      var maskR = mm ? parseFloat(mm[1]) : Infinity;

      var frontErlaubt = maskR < Math.min(window.innerWidth, window.innerHeight) / 2;

      var magCard = focused || (focusAmt > 0 ? lastFocused : null);
      var magTX = 0, magTY = 0;
      if (magCard && pointerX >= 0){
        var mr = (magCard.inFront ? magCard.elFront : magCard.elBack).getBoundingClientRect();
        if (mr.width > 0){
          magTX = Math.max(-1, Math.min(1, (pointerX - (mr.left + mr.width / 2)) / (mr.width / 2)));
          magTY = Math.max(-1, Math.min(1, (pointerY - (mr.top + mr.height / 2)) / (mr.height / 2)));
        }
      }
      var magStep = Math.min(1, dt * MAG_EASE);
      magX += (magTX - magX) * magStep;
      magY += (magTY - magY) * magStep;

      var hoverStep = Math.min(1, dt * HOVER_EASE);

      for (var j = 0; j < cards.length; j++){
        var c = cards[j];

        c.hoverAmt += ((c === hoverCard ? 1 : 0) - c.hoverAmt) * hoverStep;

        var x0 = c.dirX * SPHERE_R, y0 = c.dirY * SPHERE_R, z0 = c.dirZ * SPHERE_R;

        if (c === focused || (focusAmt > 0 && c === lastFocused)){
          var longSide = Math.max(c.w, c.h);
          var wantPx = Math.min(window.innerWidth, window.innerHeight) * FOCUS_FILL;
          var wantScale = Math.max(1.15, Math.min(4, wantPx / longSide));
          var fz = PERSPECTIVE * (1 - 1 / wantScale);
          var ty = fz * sinX;
          var tz1 = fz * cosX;
          var tx = -tz1 * sinY;
          var tz = tz1 * cosY;
          x0 += (tx - x0) * fe;
          y0 += (ty - y0) * fe;
          z0 += (tz - z0) * fe;
        }

        var x1 = x0 * cosY + z0 * sinY;
        var z1 = -x0 * sinY + z0 * cosY;
        var y1 = y0;
        var y2 = y1 * cosX - z1 * sinX;
        var z2 = y1 * sinX + z1 * cosX;
        c.z2 = z2;

        var pull = '';
        if (c === magCard && fe > 0){
          pull = ' translate(' + (magX * MAG_PULL_PX * fe).toFixed(1) + 'px,' +
                 (magY * MAG_PULL_PX * fe).toFixed(1) + 'px)';

          if (c === focused){
            var sogX = (magX * MAG_PULL_PX * fe * buSkala).toFixed(1);
            var sogY = (magY * MAG_PULL_PX * fe * buSkala).toFixed(1);
            var sog = 'translate(' + sogX + 'px,' + sogY + 'px)';
            if (karteBu) karteBu.style.transform = sog;
            if (karteAufl) karteAufl.style.transform = sog;
            if (filmTasten) filmTasten.style.transform = sog;
          }
        }

        var sc = (1 + c.hoverAmt * HOVER_SCALE) * (collapse.card < 1 ? collapse.card : 1);

        if (c.ss > 1) sc = sc / c.ss;
        var transform = 'translate3d(' + x0 + 'px,' + y0 + 'px,' + z0 + 'px) ' + billboard + pull +
          (Math.abs(sc - 1) > 0.0005 ? ' scale(' + sc.toFixed(4) + ')' : '');
        c.elBack.style.transform = transform;
        c.elFront.style.transform = transform;

        var depthNorm = Math.max(0, Math.min(1, (z2 + SPHERE_R) / (2 * SPHERE_R)));
        var brightness = DEPTH_BRIGHTNESS_MIN + (1 - DEPTH_BRIGHTNESS_MIN) * depthNorm;

        var isFocusCard = (c === focused) || (focusAmt > 0 && c === lastFocused);
        if (!isFocusCard && fe > 0){ brightness *= (1 - FOCUS_DIM * fe); }
        c.shadeBack.style.opacity = c.shadeFront.style.opacity = (1 - brightness).toFixed(3);

        var tiefe = 1 - depthNorm;
        var blurRaw = tiefe * tiefe * DEPTH_BLUR_MAX;
        var blurStep = blurRaw < 0.3 ? 0 : Math.round(blurRaw * 2) / 2;
        if (blurStep !== c.lastBlur){
          c.lastBlur = blurStep;
          var f = blurStep === 0 ? '' : 'blur(' + blurStep + 'px)';
          c.elBack.style.filter = f;
          c.elFront.style.filter = f;
        }

        var zi = isFocusCard && fe > 0 ? 5000 : Math.round(depthNorm * 100);
        if (zi !== c.lastZ){
          c.lastZ = zi;
          c.elBack.style.zIndex = zi;
          c.elFront.style.zIndex = zi;
        }

        var shouldBeFront = (z2 > 0 && frontErlaubt) || isFocusCard;

        var pf = PERSPECTIVE / (PERSPECTIVE - z2);
        var halbe = 0.5 * Math.hypot(c.w, c.h) * pf * sc;
        var freiVomKreis = Math.hypot(x1 * pf, y2 * pf) - halbe > maskR;

        if (shouldBeFront !== c.inFront &&
            (freiVomKreis || isFocusCard || c.lastBlur > 2)){
          c.inFront = shouldBeFront;
          if (shouldBeFront){
            c.elBack.remove();
            worldFront.appendChild(c.elFront);
          } else {
            c.elFront.remove();
            worldBack.appendChild(c.elBack);
          }

          var jetzt = shouldBeFront ? c.elFront : c.elBack;
          if (c.filme){
            for (var fk in c.filme.proIndex){
              jetzt.appendChild(c.filme.proIndex[fk].kasten);
            }
          } else if (c.film){
            jetzt.appendChild(c.film);
          }

          if (c.dia) diaUmziehen(c.dia, jetzt);
        }
      }
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  }
}