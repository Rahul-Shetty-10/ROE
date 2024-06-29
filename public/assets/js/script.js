
'use strict';

/**
 * add event listener on multiple elements
 */

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}

/**
 * NAVBAR TOGGLE FOR MOBILE
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");
const navbarLinks = document.querySelectorAll(".navbar-link"); // Added to select navbar links

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
}

addEventOnElements(navTogglers, "click", toggleNavbar);
addEventOnElements(navbarLinks, "click", toggleNavbar); // Added to close the navbar when a link is clicked

/**
 * HEADER
 * active header when window scroll down to 100px
 */

const header = document.querySelector("[data-header]");

window.addEventListener("scroll", function () {
  if (window.scrollY > 50) {
    header.classList.add("active");
  } else {
    header.classList.remove("active");
  }
});

/**
 * SLIDER
 */

const sliders = document.querySelectorAll("[data-slider]");

const initSlider = function(currentSlider) {

  const sldierContainer = currentSlider.querySelector("[data-slider-container]");
  const sliderPrevBtn = currentSlider.querySelector("[data-slider-prev]");
  const sliderNextBtn = currentSlider.querySelector("[data-slider-next]");

  let currentSlidePos = 0;

  const moveSliderItem = function () {
    sldierContainer.style.transform = `translateX(-${sldierContainer.children[currentSlidePos].offsetLeft}px)`;
  }

  /**
   * NEXT SLIDE
   */

  const slideNext = function () {
    const slideEnd = currentSlidePos >= sldierContainer.childElementCount - 1;

    if (slideEnd) {
      currentSlidePos = 0;
    } else {
      currentSlidePos++;
    }

    moveSliderItem();
  }

  sliderNextBtn.addEventListener("click", slideNext);

  /**
   * PREVIOUS SLIDE
   */

   const slidePrev = function () {

    if (currentSlidePos <= 0) {
      currentSlidePos = sldierContainer.childElementCount - 1;
    } else {
      currentSlidePos--;
    }

    moveSliderItem();
  }

  sliderPrevBtn.addEventListener("click", slidePrev);

  const dontHaveExtraItem = sldierContainer.childElementCount <= 1;
  if (dontHaveExtraItem) {
    sliderNextBtn.style.display = "none";
    sliderPrevBtn.style.display = "none";
  }

}

for (let i = 0, len = sliders.length; i < len; i++) { initSlider(sliders[i]); }

/**
 * ACCORDION
 */

const accordions = document.querySelectorAll("[data-accordion]");

let lastActiveAccordion = accordions[0];

const initAccordion = function (currentAccordion) {

  const accordionBtn = currentAccordion.querySelector("[data-accordion-btn]");

  const expandAccordion = function () {
    if (lastActiveAccordion && lastActiveAccordion !== currentAccordion) {
      lastActiveAccordion.classList.remove("expanded");
    }

    currentAccordion.classList.toggle("expanded");

    lastActiveAccordion = currentAccordion;
  }

  accordionBtn.addEventListener("click", expandAccordion);

}

for (let i = 0, len = accordions.length; i < len; i++) { initAccordion(accordions[i]); }

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
          target.scrollIntoView({
              behavior: 'smooth'
          });
      }
  });
});


document.addEventListener("DOMContentLoaded", function () {
  const openFormBtns = document.querySelectorAll("#openFormBtn");

  const modal = document.getElementById("loginSignupModal");
  const closeBtn = document.querySelector(".close");

  openFormBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
          modal.style.display = "block";
      });
  });

  closeBtn.addEventListener("click", function () {
      modal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
      if (event.target === modal) {
          modal.style.display = "none";
      }
  });
});


//---------------------------------------sidebar------------------------------------------------
    
    //-----------------------------------------------------dropdown of other will be closed--------------------------------------------------------------------------
    // function toggleSubMenunav(event) {
    //     event.preventDefault(); // Prevent the default link behavior
    
    //     const parentLi = event.target.closest('li');
    //     if (!parentLi) return;
    
    //     // Close all open submenus
    //     const openSubmenus = document.querySelectorAll('.sidebar-nav .nav-pills');
    //     openSubmenus.forEach(submenu => {
    //         if (submenu !== parentLi.querySelector('.nav-pills')) {
    //             submenu.style.display = 'none';
    //             const parent = submenu.parentElement;
    //             if (parent) parent.classList.remove('open');
    //         }
    //     });
    
    //     // Toggle active class on parent <li>
    //     parentLi.classList.toggle('open');
    
    //     // Toggle display of submenu
    //     const submenu = parentLi.querySelector('.nav-pills');
    //     if (submenu) {
    //         submenu.style.display = parentLi.classList.contains('open') ? 'block' : 'none';
    //     }
    // }
    
    
    
    function toggleSubMenu(event) {
      event.preventDefault(); // Prevent the default link behavior

      const parentLi = event.target.closest('li');
      if (!parentLi) return;

      const isActive = parentLi.classList.contains('open');

      // Toggle active class on parent <li>
      parentLi.classList.toggle('open', !isActive);

      // Toggle display of submenu
      const submenu = parentLi.querySelector('.nav-pills');
      if (submenu) {
          submenu.style.display = isActive ? 'none' : 'block';
      }
  }


  $("#menu-toggle").click(function (e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
  });
  $("#menu-toggle-2").click(function (e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled-2");
      $('#menu ul').hide();
  });

  function initMenu() {
      $('#menu ul').hide();
      $('#menu ul').children('.current').parent().show();
      //$('#menu ul:first').show();
      $('#menu li a').click(
          function () {
              var checkElement = $(this).next();
              if ((checkElement.is('ul')) && (checkElement.is(':visible'))) {
                  return false;
              }
              if ((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
                  $('#menu ul:visible').slideUp('normal');
                  checkElement.slideDown('normal');
                  return false;
              }
          }
      );
  }
  $(document).ready(function () {
      initMenu();
  });


  //-------------------------------------------tables function for admin-------------------------------------------------------

  $('#sample_data').DataTable();

// Handle delete button click
$('.delete-form').on('submit', function (event) {
event.preventDefault();
var form = $(this);
$.ajax({
    type: 'POST',
    url: form.attr('action'),
    data: form.serialize(),
    success: function (response) {
        if (response.success) {
            form.closest('tr').remove();}
    },
    error: function (xhr, status, error) {
        if (xhr.getResponseHeader('Content-Type') !== 'text/html') {
            // If the response is not HTML (i.e., not a redirect), show the error
            alert('Error deleting user.');
        }
    },
    complete: function(response) {
        if (response.status == 200) {
            window.location.href = '/total_users'; // Redirect after successful deletion
        }
    }
});
});

