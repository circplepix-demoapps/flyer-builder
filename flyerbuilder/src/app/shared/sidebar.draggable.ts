
declare var $: any;

export class SidebarMod {
   public draggable(element: any, htmlElement: any) {
      if (!element) return;

      var draggable = element.draggable({
         start: function (e: any, ui: any) {
            var selected_ui_html = $(ui)[0].helper[0];
            var selected_ui = $(this);

            //make sure dragged ui is on top of the ruler
            $('.ruler.left, .ruler.top, .corner').css("z-index", -1);

            $('.flyer-element').each(function () {
               selected_ui.css({ 'z-index': -1 });
            })

            //tilt dragged html
            $(selected_ui_html).addClass('tilt-draggables selected-element');

            // this.sel_ui = $(this);
            $(selected_ui_html).css('z-index', 999);

         },
         stop: function (e: any, ui: any) {
            var selected_ui_html = $(ui)[0].helper[0];

            // set z-indexes on dropped elements
            $('.flyer-element-blank').css({ 'z-index': 1 });

            //TODO: dapat i refactor ni nga mga classes
            var element_classes = '.flyer-element-stills, .flyer-element-text, .flyer-element-textarea, .flyer-element-static, ' +
                                  '.flyer-element-agent, .flyer-element-logo, .flyer-element-realtor, .flyer-element-eho,' +
                                  '.flyer-element-qr, .flyer-element-bullet';

            $(element_classes).each(function () {
               $(this).css({ 'z-index': 1 });
            })

         },
         helper: function () {
            return $(htmlElement);
         },
         drag: function (ui: any) {
            //when dragging make sure the element you drag is on top of everyone else
            $('.flyer-element').not('selected').each(function () {
               $(this).css({ 'z-index': -1 });
            })
         }
      });

      return draggable;
   }



}