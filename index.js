import Navigo from "navigo";
import { capitalize } from "lodash";
import * as state from "./store";
import { Header, Nav, Main, Footer } from "./components";
import axios from "axios";

axios
  .get("https://jsonplaceholder.typicode.com/posts")
  // handle the response from the API
  .then(response => {
    // for each post in the response Array,
    response.data.forEach(post => {
      // add it to state.Blog.posts
      state.Blog.posts.push(post);
    });
    const params = router.lastRouteResolved().params;
    if (params) {
      render(state[params.page]);
    }
  });

axios
  .get(
    "https://api.openweathermap.org/data/2.5/weather?q=st%20louis&APPID=fbb30b5d6cf8e164ed522e5082b49064"
  )
  .then(response => {
    state.Home.weather.city = response.name;
    state.Home.weather.temp = response.main.temp;
    state.Home.weather.description = response.weather.main;
  });

axios
  .get(`https://api.github.com/users/cbrantley/repos`, {
    headers: {
      Authorization: `token 83a3d94c2cd572128cf2f90dc1ccd67e5b912824`
    }
  })
  .then(response => console.log(response.data));

const router = new Navigo(window.location.origin);

function render(st = state.Home) {
  document.querySelector("#root").innerHTML = `
  ${Header(st)}
  ${Nav(state.Links)}
  ${Main(st)}
  ${Footer()}
`;
  router.updatePageLinks();

  addPicOnFormSubmit(st);
  addNavEventListeners();
}

render(state.Home);

router
  .on({
    "/": () => render(state.Home),
    ":page": params => render(state[capitalize(params.page)])
  })
  .resolve();

function addPicOnFormSubmit(st) {
  if (st.view === "Form") {
    document.querySelector("form").addEventListener("submit", event => {
      event.preventDefault();
      // convert HTML elements to Array
      let inputList = Array.from(event.target.elements);
      // remove submit button from list
      inputList.pop();
      // construct new picture object
      let newPic = inputList.reduce((pictureObject, input) => {
        pictureObject[input.name] = input.value;
        return pictureObject;
      }, {});
      // add new picture to state.Gallery.pictures
      state.Gallery.pictures.push(newPic);
      render(state.Gallery);
    });
  }
}

function addNavEventListeners() {
  // add menu toggle to bars icon in nav bar
  document
    .querySelector(".fa-bars")
    .addEventListener("click", () =>
      document.querySelector("nav > ul").classList.toggle("hidden--mobile")
    );
}
