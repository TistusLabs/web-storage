import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
/**
 * Add the preloader to the DOM if the condition is true.
 */

@Directive({
  selector: '[appPreloaderLine]'
})

export class PreloaderLineDirective {
  private hasView = false;
  @Input() set appPreloaderLine(condition: boolean) {
    if (condition && this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!condition && !this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) { }

}
