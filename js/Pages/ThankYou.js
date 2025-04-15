import Page from "../classes/Page";


export default class ThankYou extends Page {
  constructor() {
	super({
		id: "thankYouPage",
		element: ".thank-you-hero",
	});



  }



  create() {
	super.create();
	console.log('thank-you-hero');
  }

  onResize() {
	super.onResize();
  }

  destroy() {
	super.destroy();
  }
}
