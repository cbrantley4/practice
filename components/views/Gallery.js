export default st => `
${st.pictures.reduce(
  (html, pic) => html + `<img src="${pic.url}" alt="${pic.title}">`,
  ``
)}`;
