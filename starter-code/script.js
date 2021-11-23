// The navigation

const nav = document.querySelector(".primary-navigation");
const navToggle = document.querySelector(".mobile-nav-toggle");

navToggle.addEventListener("click", () => {
    const visibility = nav.getAttribute("data-visible");
    if (visibility === "false") {
        nav.setAttribute("data-visible", true);
        navToggle.setAttribute("aria-expanded", true);
    } else {
        nav.setAttribute("data-visible", false);
        navToggle.setAttribute("aria-expanded", false);
    }
});

// When nav is opened the page will be able to listen to clicks and close nav
const pageWrapper = document.querySelector(".page-wrapper");
pageWrapper.addEventListener("click", () => {
    nav.setAttribute("data-visible", false);
    navToggle.setAttribute("aria-expanded", false);
});



// ------- Load page content ------------------------------

const body = document.querySelector('body');
const pageTitle = body.dataset.title;

// check the local storage when page loads and update view
let pageIndex = localStorage.getItem(pageTitle);
if (!pageIndex) localStorage.setItem(pageTitle, 0);
updateView(pageTitle, pageIndex);


// Keyboard navigation 
const tabList = document.getElementById("tab-list");
const tabs = document.querySelectorAll("#tab-list button");

tabList.addEventListener('keydown', (e) => {
    const keydownLeft = 37;
    const keydownRight = 39;
    
    if (e.keyCode === keydownLeft || e.keyCode === keydownRight) {
        let currentTab = localStorage.getItem(pageTitle);
        
        if (e.keyCode === keydownRight) {
            currentTab++;
            if (currentTab >= tabs.length) {
                currentTab = 0;
            }
        } else if (e.keyCode === keydownLeft) {
            currentTab--;
            if (currentTab < 0) {
                currentTab = tabs.length - 1;
            }
        }
        
        updateView(pageTitle, currentTab);
        tabs[currentTab].focus();
    }
    
})

if (pageTitle === "destinations") { 
    
    document.getElementById('button-0').onclick = () => updateView("destinations", 0);
    document.getElementById('button-1').onclick = () => updateView("destinations", 1);
    document.getElementById('button-2').onclick = () => updateView("destinations", 2);
    document.getElementById('button-3').onclick = () => updateView("destinations", 3);
}
else if (pageTitle === "crew") {
    
    document.getElementById('button-0').onclick = () => updateView("crew", 0);
    document.getElementById('button-1').onclick = () => updateView("crew", 1);
    document.getElementById('button-2').onclick = () => updateView("crew", 2);
    document.getElementById('button-3').onclick = () => updateView("crew", 3);
}
else if (pageTitle === "technology") {

    document.getElementById('button-0').onclick = () => updateView("technology", 0);
    document.getElementById('button-1').onclick = () => updateView("technology", 1);
    document.getElementById('button-2').onclick = () => updateView("technology", 2);
}



// Update storage data
function updatePageData(pageName, newIndex) {
    localStorage.setItem(pageName, newIndex);
}

// Function for updating the view
function updateView (pageName, infoIndex) {
    
    // Turn off button highlight on last page
    const prev_page_index = localStorage.getItem(pageName);
    document.getElementById(`button-${prev_page_index}`).setAttribute('aria-selected', false);

    // Turn on button highlight on new page
    document.getElementById(`button-${infoIndex}`).setAttribute('aria-selected', true);

    // Update local storage data
    updatePageData(pageName, infoIndex);

    // Load data from json file
    fetch('./data.json')
        .then(response => response.json())
        .then(function(data) {
            // Loop through data and update
            for (const [page, pageInfo] of Object.entries(data)) {
                if (page === pageName) {
                    for(const [name, value] of Object.entries(pageInfo[infoIndex])) {
                        if (name === "images") {
                            const urls = Object.values(value);
                            for (let i = 1; i <= urls.length; i++) {
                                // document.getElementById(`${pageName}-images-${i}`).setAttribute('srcset', urls[i-1]);
                                const imageElem = document.getElementById(`${pageName}-images-${i}`);
                                if (imageElem.tagName === "img") imageElem.setAttribute('src', urls[i-1]);
                                else imageElem.setAttribute('srcset', urls[i-1]);
                            }
                            continue;
                        }
                        document.getElementById(`${pageName}-${name}`).innerHTML = value;
                    }
                    break;
                }
            }
        });
}