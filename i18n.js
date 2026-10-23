/* ==========================================================================
   ARGOV — internationalization (EN default / FR)
   Detects the visitor's browser language (or a saved choice) and swaps the
   language's text. Everything is driven by [data-i18n] attributes.
   ========================================================================== */
(function () {
  'use strict';

  var DICT = {
    en: {
      metaTitle: 'ARGOV — Make your signal impossible to miss.',
      metaDescription: 'ARGOV is a creative studio for video, social, graphic design and filmmaking.',

      'header-services': 'Services',
      'header-clients': 'Our clients',
      'header-approach': 'Our approach',
      'cta-start': 'Start a project <span>↗</span>',
      'menu-open-aria': 'Open menu',
      'menu-close-aria': 'Close menu',

      'hero-eyebrow': ' Independent creative studio · Fez / Worldwide',
      'hero-h1': 'Make your<br><em>signal</em> impossible<br>to miss<span class="accent">.</span>',
      'hero-intro': 'We turn ambitious ideas into culture-moving content, sharp identities and stories people remember.',
      'btn-tell': 'Tell us everything <span>↗</span>',
      'link-work': 'Explore our work <span>↓</span>',
      'cue-scroll': 'Scroll to explore',
      'stage-sub': 'Creative studio / 01',
      'corner': 'SCROLL / SIGNAL',

      'mq-video': 'VIDEO EDITING',
      'mq-social': 'SOCIAL STRATEGY',
      'mq-graphic': 'GRAPHIC DESIGN',
      'mq-film': 'FILMMAKING',

      'svc-eyebrow': 'What we do',
      'svc-h2': 'Built for the<br><em>bold move.</em>',
      'svc-note': 'One studio, four ways to make your brand impossible to scroll past.',
      'svc1-title': 'Video editing <span>↗</span>',
      'svc1-desc': 'From raw footage to can’t-look-away. Social cuts, brand films, campaign edits and motion that moves at the speed of culture.',
      'svc1-tag1': 'Short-form',
      'svc1-tag2': 'Brand films',
      'svc1-tag3': 'Motion',
      'svc2-title': 'Social management <span>↗</span>',
      'svc2-desc': 'We build a living presence for your brand: clear strategy, daily thinking, and content your community wants to share.',
      'svc2-tag1': 'Strategy',
      'svc2-tag2': 'Content calendars',
      'svc2-tag3': 'Community',
      'svc3-title': 'Graphic design <span>↗</span>',
      'svc3-desc': 'Identities, campaigns and visual systems with enough edge to stand apart—and enough clarity to stick around.',
      'svc3-tag1': 'Brand identity',
      'svc3-tag2': 'Art direction',
      'svc3-tag3': 'Digital',
      'svc4-title': 'Filmmaking <span>↗</span>',
      'svc4-desc': 'Big feeling, beautifully shot. We develop and produce visual stories from first frame to final grade.',
      'svc4-tag1': 'Creative direction',
      'svc4-tag2': 'Production',
      'svc4-tag3': 'Post',

      'work-eyebrow': 'Brands we’ve worked with',
      'work-h2': 'People we<br><em>move with.</em>',
      'work-cta': 'Start a project <span>↗</span>',

      'msg-eyebrow': 'The ARGOV approach',
      'msg-h2': 'Good work gets<br>attention. <em>Great work<br>keeps it.</em>',
      'msg-desc': 'We bring strategy, craft and a healthy dose of curiosity to every brief. No templates. No autopilot. Just work that feels like you, only louder.',
      'msg-btn': 'Meet the studio <span>↗</span>',

      'test-quote': 'Argov works like an in-house team with outside eyes. Six months in, our content is sharper, more consistent, and finally <em>worth stopping for.</em>',
      'test-credit': 'Dr Hiba Argoubi · Founder',

      'contact-eyebrow': 'Have a good one?',
      'contact-h2': 'Let’s make<br>something<br><em>unmissable.</em>',
      'contact-card': 'Tell us about the idea, the problem, or the dream. We’re listening.',
      'contact-detail-place': 'Fez, Maroc / Everywhere',

      'footer-love': 'Made with love.',
      'footer-top': 'Back to top ↑'
    },

    fr: {
      metaTitle: 'ARGOV — Rendez votre signal impossible à rater.',
      metaDescription: 'ARGOV est un studio créatif pour la vidéo, les réseaux sociaux, le design graphique et le cinéma.',

      'header-services': 'Services',
      'header-clients': 'Nos clients',
      'header-approach': 'Notre approche',
      'cta-start': 'Lancer un projet <span>↗</span>',
      'menu-open-aria': 'Ouvrir le menu',
      'menu-close-aria': 'Fermer le menu',

      'hero-eyebrow': ' Studio créatif indépendant · Fès / Monde entier',
      'hero-h1': 'Rendez votre<br><em>signal</em> impossible<br>à rater<span class="accent">.</span>',
      'hero-intro': 'Nous transformons des idées ambitieuses en contenus qui font bouger la culture, des identités marquantes et des histoires que l’on retient.',
      'btn-tell': 'Dites-nous tout <span>↗</span>',
      'link-work': 'Découvrir nos projets <span>↓</span>',
      'cue-scroll': 'Faites défiler pour explorer',
      'stage-sub': 'Studio créatif / 01',
      'corner': 'DÉFILEMENT / SIGNAL',

      'mq-video': 'MONTAGE VIDÉO',
      'mq-social': 'STRATÉGIE SOCIALE',
      'mq-graphic': 'GRAPHISME',
      'mq-film': 'CINÉMA',

      'svc-eyebrow': 'Ce que nous faisons',
      'svc-h2': 'Conçu pour le<br><em>mouvement audacieux.</em>',
      'svc-note': 'Un studio, quatre façons de rendre votre marque impossible à ignorer.',
      'svc1-title': 'Montage vidéo <span>↗</span>',
      'svc1-desc': 'De la matière brute au contenu captivant. Coupes réseaux sociaux, films de marque, éditions de campagne et motion à la vitesse de la culture.',
      'svc1-tag1': 'Formats courts',
      'svc1-tag2': 'Films de marque',
      'svc1-tag3': 'Motion',
      'svc2-title': 'Gestion des réseaux sociaux <span>↗</span>',
      'svc2-desc': 'Nous construisons une présence vivante pour votre marque : stratégie claire, réflexion quotidienne et contenus que votre communauté aura envie de partager.',
      'svc2-tag1': 'Stratégie',
      'svc2-tag2': 'Calendriers éditoriaux',
      'svc2-tag3': 'Communauté',
      'svc3-title': 'Design graphique <span>↗</span>',
      'svc3-desc': 'Identités, campagnes et systèmes visuels avec assez de mordant pour se démarquer—et assez de clarté pour durer.',
      'svc3-tag1': 'Identité de marque',
      'svc3-tag2': 'Direction artistique',
      'svc3-tag3': 'Digital',
      'svc4-title': 'Cinéma <span>↗</span>',
      'svc4-desc': 'Grandes émotions, belles images. Nous développons et produisons des histoires visuelles, du premier plan à l’étalonnage final.',
      'svc4-tag1': 'Direction créative',
      'svc4-tag2': 'Production',
      'svc4-tag3': 'Post-production',

      'work-eyebrow': 'Les marques avec lesquelles nous avons travaillé',
      'work-h2': 'Des gens avec<br><em>qui nous avançons.</em>',
      'work-cta': 'Lancer un projet <span>↗</span>',

      'msg-eyebrow': 'L’approche ARGOV',
      'msg-h2': 'Le bon travail attire<br>l’attention. <em>Le grand travail<br>la retient.</em>',
      'msg-desc': 'Nous apportons stratégie, savoir-faire et une bonne dose de curiosité à chaque projet. Pas de modèles. Pas de pilote automatique. Juste un travail qui vous ressemble, en plus fort.',
      'msg-btn': 'Rencontrer le studio <span>↗</span>',

      'test-quote': 'Argov travaille comme une équipe interne, avec un regard extérieur. Six mois plus tard, notre contenu est plus incisif, plus cohérent, et enfin <em>digne d’arrêter de défiler.</em>',
      'test-credit': 'Dr Hiba Argoubi · Fondatrice',

      'contact-eyebrow': 'Une bonne idée ?',
      'contact-h2': 'Créons<br>quelque chose<br><em>d’incontournable.</em>',
      'contact-card': 'Parlez-nous de l’idée, du problème ou du rêve. Nous écoutons.',
      'contact-detail-place': 'Fès, Maroc / Partout',

      'footer-love': 'Fait avec amour.',
      'footer-top': 'Retour en haut ↑'
    }
  };

  var LS_KEY = 'argov-lang';

  function savedLang() {
    try { return localStorage.getItem(LS_KEY); } catch (e) { return null; }
  }

  function detect() {
    var s = savedLang();
    if (s === 'fr' || s === 'en') return s;
    var l = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    return l.indexOf('fr') === 0 ? 'fr' : 'en';
  }

  var current = detect();

  function apply() {
    var d = DICT[current] || DICT.en;

    document.documentElement.setAttribute('lang', current);
    if (d.metaTitle) document.title = d.metaTitle;
    var meta = document.querySelector('meta[name="description"]');
    if (meta && d.metaDescription) meta.setAttribute('content', d.metaDescription);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (d[key] != null) el.innerHTML = d[key];
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria');
      if (d[key] != null) el.setAttribute('aria-label', d[key]);
    });

    var toggle = document.getElementById('lang-toggle');
    if (toggle) toggle.textContent = current === 'fr' ? 'EN' : 'FR';
  }

  window.__setLang = function (lang) {
    var next = lang === 'fr' ? 'fr' : 'en';
    if (next === current) return;
    current = next;
    try { localStorage.setItem(LS_KEY, current); } catch (e) {}
    apply();
  };

  document.addEventListener('DOMContentLoaded', function () {
    apply();
    var toggle = document.getElementById('lang-toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        window.__setLang(current === 'fr' ? 'en' : 'fr');
      });
    }
  });
})();
