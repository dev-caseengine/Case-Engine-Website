import Page from "../classes/Page";


export default class GeneralTempalte extends Page {
  constructor() {
	super({
		id: "general",
		element: ".general-page",
	});



  }


  create() {
	super.create();

  }

  onResize() {
	super.onResize();
  }

  destroy() {
	super.destroy();
  }


}
