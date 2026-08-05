/* Opsteady — shared nav behaviour. No framework, no build step. */
(function(){
  "use strict";
  var nav = document.querySelector(".site-nav");
  var toggle = document.querySelector(".nav-toggle");
  var close = document.querySelector(".nav-close");
  var links = document.querySelector(".nav-links");

  function openMenu(){
    links.classList.add("open");
    document.body.classList.add("nav-open");
    toggle.setAttribute("aria-expanded","true");
  }
  function closeMenu(){
    links.classList.remove("open");
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded","false");
  }
  if(toggle && links){
    toggle.addEventListener("click", openMenu);
    if(close) close.addEventListener("click", closeMenu);
    links.querySelectorAll(".nav-link, .nav-cta").forEach(function(el){
      el.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function(e){
      if(e.key === "Escape") closeMenu();
    });
  }
  if(nav){
    var onScroll = function(){
      nav.classList.toggle("scrolled", window.scrollY > 4);
    };
    document.addEventListener("scroll", onScroll, {passive:true});
    onScroll();
  }
})();
