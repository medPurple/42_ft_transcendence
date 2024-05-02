const pageTitle = "Transcendence";

const routes = {
    404 : {
        template : "/templates/404.html",
        title : "404 | " + pageTitle,
        description: "Page not found"
    },
    "/home": {
        template: "/templates/home.html",
        title: "Home | " + pageTitle,
        description: "Welcome to the homepage"
    },
    about: {
        template: "/templates/about.html",
        title: "About | " + pageTitle,
        description: "About the company"
    },
    contact: {
        template: "/templates/contact.html",
        title: "Contact | " + pageTitle,
        description: "Contact us"
    },
    services: {
        template: "/templates/services.html",
        title: "Services | " + pageTitle,
        description: "Our services"
    }, 
}

const locationHandler = async () => {
    let location = window.location.hash.replace("#", "");
    if(location.length == 0){
        location = "/";
    }
    const route = routes[location] || routes[404];
    const html = await fetch(route.template).then((response) => 
    response.text());
    document.getElementById("content").innerHTML = html;
    document.title = route.title;
    document
        .querySelector('meta[name="description"]')
        .setAttribute("content", route.description);
};

window.addEventListener("hashchange", locationHandler);

locationHandler();