import Page from "../classes/Page";

export default class Footer   {
  constructor({ template }) {

    this.onChange(template);
  }



  onChange(template) {
    if (template == "home") {
      document.body.classList.remove("dark-footer");
    } else {
      document.body.classList.add("dark-footer");
 
    }
  }
}
