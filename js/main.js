/**
 * Precision Engine Interface Script - White Mode Edition
 * Controls mobile navigation, active links, page animations, and the interactive SVG diagram step-by-step controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      menuToggle.innerHTML = isOpen ? '✕' : '☰';
    });
  }

  // Active Nav Link highlighting based on current path
  const currentPath = window.location.pathname;
  const navAnchors = document.querySelectorAll('.nav-links a');
  
  navAnchors.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      const isHome = href === 'index.html' || href === '/';
      const pathEndsWithHref = currentPath.endsWith(href);
      
      if ((isHome && (currentPath === '/' || currentPath.endsWith('index.html'))) || (!isHome && pathEndsWithHref)) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });

  // Reveal elements on scroll
  const reveals = document.querySelectorAll('.reveal');
  
  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => revealOnScroll.observe(el));

  // Dynamic Header Blur on scroll
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.style.background = 'rgba(248, 249, 255, 0.95)';
        navbar.style.borderBottom = '1px solid rgba(11, 28, 48, 0.05)';
        navbar.style.boxShadow = '0 4px 20px rgba(11, 28, 48, 0.02)';
      } else {
        navbar.style.background = 'rgba(248, 249, 255, 0.8)';
        navbar.style.borderBottom = 'none';
        navbar.style.boxShadow = 'none';
      }
    });
  }

  // Interactive SVG Diagram step-by-step player engine
  const diagramPlayers = document.querySelectorAll('.diagram-player');

  diagramPlayers.forEach(player => {
    const buttons = player.querySelectorAll('.diagram-step-btn');
    const explanationTitle = player.querySelector('.diagram-explanation h5');
    const explanationText = player.querySelector('.diagram-explanation p');
    
    // Find the SVG associated with this player container
    const wrapper = player.closest('.diagram-wrapper');
    const svg = wrapper ? wrapper.querySelector('.architecture-diagram') : null;

    if (!svg) return;

    // Active state tracker function
    function setStep(btn) {
      // Deactivate all buttons
      buttons.forEach(b => b.classList.remove('active'));
      // Activate clicked button
      btn.classList.add('active');

      // Update Explanation UI
      explanationTitle.textContent = btn.getAttribute('data-title');
      explanationText.textContent = btn.getAttribute('data-desc');

      // Clear all active classes from the SVG elements
      svg.querySelectorAll('.svg-active-node, .svg-active-text, .svg-active-path').forEach(el => {
        el.classList.remove('svg-active-node', 'svg-active-text', 'svg-active-path');
      });

      // Highlight target nodes
      const targetNodeIds = btn.getAttribute('data-nodes');
      if (targetNodeIds) {
        targetNodeIds.split(',').forEach(id => {
          const el = svg.querySelector(`#${id.trim()}`);
          if (el) {
            el.classList.add('svg-active-node');
            // If it has text inside, highlight text as well
            const textNodes = el.parentElement.querySelectorAll('text');
            textNodes.forEach(t => t.classList.add('svg-active-text'));
          }
        });
      }

      // Highlight target path flows
      const targetPathIds = btn.getAttribute('data-paths');
      if (targetPathIds) {
        targetPathIds.split(',').forEach(id => {
          const el = svg.querySelector(`#${id.trim()}`);
          if (el) {
            el.classList.add('svg-active-path');
          }
        });
      }
    }

    // Attach click events
    buttons.forEach(btn => {
      btn.addEventListener('click', () => setStep(btn));
    });

    // Initialize with the first step
    if (buttons.length > 0) {
      setStep(buttons[0]);
    }
  });
});
