import { TestData } from './../../../helpers/testData';
import { ConfigConstant } from './../../../helpers/configConstant';
import { ElementType } from './../../../models/elementType';
import { FlyerLocalStorage } from './../../../helpers/flyerLocalStorage';
import { DialogService } from './../../../services/dialog.service';
import { Component, OnInit, ViewEncapsulation, OnDestroy, AfterViewInit, AfterViewChecked, ViewChild, HostListener } from '@angular/core';
import { SidebarMod } from './../../../shared/sidebar.draggable';

declare var $: any;

@Component({
   moduleId: module.id,
   templateUrl: 'home.component.html',
   styleUrls: ['home.component.css'],
   encapsulation: ViewEncapsulation.None
})

export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
   sidebar = new SidebarMod();

   // collections of dropped elements (e.g image, text, statics)
   arrDroppedElements: any[] = [];

   //***************************************
   /* Define Test data here
   //***************************************/
   public flyerLayouts: any[] = TestData.FLYER_LAYOUTS;

   constructor(private dialogsService: DialogService, private flyerLocalStorage: FlyerLocalStorage) {
   }

   ngOnInit() { }

   // TODO: set mechanism to save in localstorage
   setStorage() {
      if(this.arrDroppedElements) {
         this.flyerLocalStorage.setLocalStorage(JSON.stringify(this.arrDroppedElements));
      }
   }

   removeStorage() {
      this.flyerLocalStorage.removeStorage(ConfigConstant.FLYER_STORAGE_KEY);
   }

   generateUniqueID(len: number) {
      if (!len) {
         return;
      }
      let str = '';
      const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

      for (let i = 0; i < len; i++) {
         str += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
      }

      return str;
   }

   // This function handles dropped element
   handleDroppedElement(droppedElement: any, collections: any[]) {
      if (!droppedElement) {
         return;
      }
      if (droppedElement.id === 'undefined') {
         return;
      }
      collections.push(droppedElement);
   }

   ngAfterViewInit() {
      /*********************************************
      * Events, initialization and mapping
      /*********************************************/

      // gi map naku ang mga angular functions paad2 sa js/jquery functions
      var configConstant = ConfigConstant;
      var generateUniqueID = this.generateUniqueID;
      var handleDroppedElement = this.handleDroppedElement;
      var arrDroppedElements = this.arrDroppedElements;

      var ui_zindex = 2;
      var selected_ui: any;

      // set draggables here from left sidebar
      this.sidebar.draggable($('.drp_stills'), ConfigConstant.STILL_HTML);
      this.sidebar.draggable($('.drp_text'), ConfigConstant.TEXT_HTML);
      this.sidebar.draggable($('.drp_textarea'), ConfigConstant.TEXTAREA_HTML);
      this.sidebar.draggable($('.drp_textarea2'), ConfigConstant.TEXTAREA2_HTML);
      this.sidebar.draggable($('.drp_static'), ConfigConstant.STATIC_HTML);
      this.sidebar.draggable($('.drp_agent_pic'), ConfigConstant.AGENT_HTML);
      this.sidebar.draggable($('.drp_logo'), ConfigConstant.LOGO_HTML);
      this.sidebar.draggable($('.drp_realtor'), ConfigConstant.REALTOR_HTML);
      this.sidebar.draggable($('.drp_eho'), ConfigConstant.EHO_HTML);
      this.sidebar.draggable($('.drp_qr'), ConfigConstant.QR_HTML);
      this.sidebar.draggable($('.drp_bullet'), ConfigConstant.BULLET_HTML);

      $('#wrapper').ruler({ unit: 'px', showLabel: true, arrowStyle: 'arrow' });

      //draggable option
      var draggableOption = {
         containment: $('.rsf-ruler'),
         scrollSpeed: 25,
         scrollSensitivity: 100,
         start: function () {
            if ($(this).hasClass(configConstant.FLYER_BLANK_CLASS)) {
               $(this).css({ 'z-index': 1 });
            } else {
               $(this).css({ 'z-index': ui_zindex++ });
            }

            $('.flyer-element').each(function () {
               $(this).removeClass('selected-element');
            })

            $(this).css({ 'cursor': 'move' });

            selected_ui = $(this);
         },
         stop: function (e: any, ui: any) {
            var selected_element = $(ui)[0].helper[0];

            var uuid = $(selected_element).attr('uuid');

            var x = $('#pos-x').val();
            var y = $('#pos-y').val();

            updateArrDroppedElementsCoord(arrDroppedElements, x, y, uuid);

            $(selected_element).css({ 'position': 'relative', 'left': x + 'px', 'top': y + 'px' });
         },
         drag: function (e: any, ui: any) {
            var selected_element = $(ui)[0].helper[0];

            var x = getCoordinates(selected_element).left;
            var y = getCoordinates(selected_element).top;

            x = (x == 0 ? 1 : x);
            y = (y == 0 ? 1 : y);

            $('#pos-x').val(x);
            $('#pos-y').val(y);

            $('#input-element-height').val(getDimensions($(selected_element)).height);
            $('#input-element-width').val(getDimensions($(selected_element)).width);

            $(selected_element).addClass('selected-element');
         }
      }

      //droppable option
      var droppableOption = {
         accept: ".drp-flyer-element",
         tolerance: 'pointer',
         drop: function (ev: any, ui: any) {
            var active_element = $(ui)[0].helper[0];

            var x = ui.offset.left - $(this).offset().left;
            var y = ui.offset.top - $(this).offset().top;

            var width = getDimensions($(active_element)).width;
            var height = getDimensions($(active_element)).height;

            $('#input-element-height').val(width);
            $('#input-element-width').val(height);

            active_element = $(active_element.outerHTML);
            active_element = $(active_element).draggable(draggableOption)
                                              .resizable(resizableOption)
                                              .css({ left: x, top: y })
                                              .appendTo('.rsf-ruler .stage');

            //get positions
            $('#pos-x').val(y);
            $('#pos-y').val(x);

            $(active_element).removeClass('tilt-draggables');

            //add dropped element to the collections
            var drp_element = {};
            var element_id = generateUniqueID(15);

            //***************************************************************************************************/
            //******* TODO: Kania nga if statements dapat ma simplify tne para dili murag dili spaghetti code lantawon
            //***************************************************************************************************/
            // if the element is a still
            if ($(active_element).hasClass(configConstant.FLYER_ELEMENT_STILL)) {
               drp_element = {
                  'id': element_id,
                  'type': ElementType.image,
                  'x': x,
                  'y': y,
                  'width': width,
                  'height': height,
                  'src': configConstant.STILL_DEFAULT_IMAGE
               };
               $(active_element).attr('uuid', element_id);
            }
            // if the element is a text
            else if ($(active_element).hasClass(configConstant.FLYER_ELEMENT_TEXT)) {
               drp_element = {
                  'id': element_id,
                  'type': ElementType.text,
                  'x': x,
                  'y': y,
                  'width': width,
                  'height': height,
                  'src': '',
                  'value': 'THIS IS A SAMPLE TEXT'
               };
               $(active_element).attr('uuid', element_id);
            }
            // if the element is a static
            else if ($(active_element).hasClass(configConstant.FLYER_ELEMENT_STATIC)) {
               drp_element = {
                  'id': element_id,
                  'type': ElementType.static,
                  'x': x,
                  'y': y,
                  'width': width,
                  'height': height,
                  'src': configConstant.STATIC_DEFAULT_IMAGE,
                  'value': ''
               };
               $(active_element).attr('uuid', element_id);
            }
            // if the element is a agent
            else if ($(active_element).hasClass(configConstant.FLYER_ELEMENT_AGENT)) {
               drp_element = {
                  'id': element_id,
                  'type': ElementType.agent,
                  'x': x,
                  'y': y,
                  'width': width,
                  'height': height,
                  'src': configConstant.AGENT_DEFAULT_IMAGE,
                  'value': ''
               };
               $(active_element).attr('uuid', element_id);
            }
            // if the element is a logo
            else if ($(active_element).hasClass(configConstant.FLYER_ELEMENT_LOGO)) {
               drp_element = {
                  'id': element_id,
                  'type': ElementType.logo,
                  'x': x,
                  'y': y,
                  'width': width,
                  'height': height,
                  'src': configConstant.LOGO_DEFAULT_IMAGE,
                  'value': ''
               };
               $(active_element).attr('uuid', element_id);
            }
            // if the element is a realtor
            else if ($(active_element).hasClass(configConstant.FLYER_ELEMENT_REALTOR)) {
               drp_element = {
                  'id': element_id,
                  'type': ElementType.realtor,
                  'x': x,
                  'y': y,
                  'width': width,
                  'height': height,
                  'src': configConstant.REALTOR_DEFAULT_IMAGE,
                  'value': ''
               };
               $(active_element).attr('uuid', element_id);
            }
            // if the element is a eho
            else if ($(active_element).hasClass(configConstant.FLYER_ELEMENT_EHO)) {
               drp_element = {
                  'id': element_id,
                  'type': ElementType.eho,
                  'x': x,
                  'y': y,
                  'width': width,
                  'height': height,
                  'src': configConstant.EHO_DEFAULT_IMAGE,
                  'value': ''
               };
               $(active_element).attr('uuid', element_id);
            }
            // if the element is a qr
            else if ($(active_element).hasClass(configConstant.FLYER_ELEMENT_QR)) {
               drp_element = {
                  'id': element_id,
                  'type': ElementType.qr,
                  'x': x,
                  'y': y,
                  'width': width,
                  'height': height,
                  'src': configConstant.QR_DEFAULT_IMAGE,
                  'value': ''
               };
               $(active_element).attr('uuid', element_id);
            }
            // if the element is a bullet
            else if ($(active_element).hasClass(configConstant.FLYER_ELEMENT_BULLET)) {
               drp_element = {
                  'id': element_id,
                  'type': ElementType.bullet,
                  'x': x,
                  'y': y,
                  'width': width,
                  'height': height,
                  'src': configConstant.BULLET_DEFAULT_IMAGE,
                  'value': ''
               };
               $(active_element).attr('uuid', element_id);
            }
            // if the element is a textarea
            else if ($(active_element).hasClass(configConstant.FLYER_ELEMENT_TEXTAREA)) {
               drp_element = {
                  'id': element_id,
                  'type': ElementType.textarea,
                  'x': x,
                  'y': y,
                  'width': width,
                  'height': height,
                  'src': '',
                  'value': TestData.LOREM_IPSUM
               };
               $(active_element).attr('uuid', element_id);
            }else if ($(active_element).hasClass(configConstant.FLYER_ELEMENT_TEXTAREA2)) {
               drp_element = {
                  'id': element_id,
                  'type': ElementType.textarea2,
                  'x': x,
                  'y': y,
                  'width': width,
                  'height': height,
                  'src': '',
                  'value': TestData.LOREM_IPSUM
               };
               $(active_element).attr('uuid', element_id);
            }

            selected_ui = $(active_element);

            removeHighlight();

            handleDroppedElement(drp_element, arrDroppedElements)
         }
      }

      var resizableOption = {
         containment: $('.rsf-ruler'), handles: { se: '.segrip' },
         resize: function () {
            $('#input-element-height').val(getDimensions($(selected_ui)).height);
            $('#input-element-width').val(getDimensions($(selected_ui)).width);

            updateElementDimensions(arrDroppedElements, $(this), $(this).attr('uuid'))
         }
      }

      $('.stage').droppable(droppableOption);
      $('#drg-flyer').draggable(draggableOption).resizable(resizableOption);

      $(document).on('blur', '#flyer-element-text', function () {
         if(!arrDroppedElements && arrDroppedElements.length <= 0 ) {
            return;
         }

         updateArrDroppedElementText(arrDroppedElements, $(this).val(), $(this).parent().attr('uuid'));
      })

      $(document).on('blur', '#pos-x, #pos-y', function (e: any) {
         handleChangeCoordinate();
      })

      $(document).on('blur', '#input-element-width, #input-element-height', function (e: any) {
         handleChangeDimension();
      })

      $(document).on('dblclick', '.flyer-element', function () {
         selected_ui = $(this);

         addHighlight($(this));
      })

      $(document).on('dblclick', '.stage', function () {
         removeHighlight();
      })

      $(document).keydown(function (e: any) {
         if (!selected_ui) {
            return;
         }
         var x = parseInt($('#pos-x').val());
         var y = parseInt($('#pos-y').val());

         switch (e.which) {
            case 37: // left
               x = parseInt(selected_ui.css('left')) - 1;

               animateUI(selected_ui, x, null);
               $('#pos-x').val(x);

               break;

            case 38: // up
               y = parseInt(selected_ui.css('top')) - 1;

               animateUI(selected_ui, null, y);
               $('#pos-y').val(y);

               break;

            case 39: // right
               x = parseInt(selected_ui.css('left').slice(0, -2)) + 1;

               animateUI(selected_ui, x, null);
               $('#pos-x').val(x);

               break;
            case 40: // down
               y = parseInt(selected_ui.css('top').slice(0, -2)) + 1;

               animateUI(selected_ui, null, y);
               $('#pos-y').val(y);

               break;
            default: return;
         }

         updateArrDroppedElementsCoord(arrDroppedElements, x, y, $(selected_ui).attr('uuid'));

         return false;
      });

      /******************************************************************************************
      * functions
      /*******************************************************************************************/

      function addHighlight(el: any) {
         removeHighlight();

         if ($(el).hasClass('selected-element')) {
            $(el).addClass('selected-element');
         } else {
            $(el).removeClass('selected-element');
         }
      }

      function removeHighlight() {
         $('.flyer-element').each(function () {
            $(this).removeClass('selected-element');
         })
      }

      /**
       * search and set element dimensions
       * @param arr collection of dropped elements
       * @param id
       */
      function updateElementDimensions(arr: any, element: any, id: any) {
         if(!arrDroppedElements && arrDroppedElements.length <= 0 ) {
            return;
         }
         $.each(arrDroppedElements, function () {
            if (this.id == id) {
               this.width = getDimensions(element).width;
               this.height = getDimensions(element).height;

               return false;
            }
         });
      }

      function updateArrDroppedElementText(arr: any, textValue: any, id: any) {
         if(!arrDroppedElements && arrDroppedElements.length <= 0 ) {
            return;
         }
         $.each(arrDroppedElements, function () {
            if (this.id == id) {
               this.value = textValue;

               return false;
            }
         });
      }

      /**
       * search ang set element coordinates
       * @param arr collection of dropped elements
       * @param id
       */
      function updateArrDroppedElementsCoord(arr: any, x: any, y: any, id: any) {
         if(!arrDroppedElements && arrDroppedElements.length <= 0 ) {
            return;
         }
         $.each(arrDroppedElements, function () {
            if (this.id == id) {
               this.x = x;
               this.y = y;

               return false;
            }
         });
      }

      /**
       * change element coordinates
       */
      function handleChangeCoordinate() {
         if (!selected_ui) {
            return;
         }
         var x = parseInt($('#pos-x').val());
         var y = parseInt($('#pos-y').val());

         animateUI(selected_ui, x, y);
         animateUIDimension(selected_ui, $('#input-element-width').val(), $('#input-element-height').val());
         updateArrDroppedElementsCoord(arrDroppedElements, x, y, $(selected_ui).attr('uuid'))
      }

      function handleChangeDimension() {
         if (!selected_ui) {
            return;
         }
         if ($('#input-element-width').val().len > 0) $(selected_ui).css('width', $('#input-element-width').val());
         if ($('#input-element-height').val().len > 0) $(selected_ui).css('height', $('#input-element-height').val());

         updateElementDimensions(arrDroppedElements, $(selected_ui), $(selected_ui).attr('uuid'))
      }

      /**
       * get selected element dimensions
       * @param element
       */
      function getDimensions(element: any) {
         if (!element) {
            return;
         }
         var dimensions = {
            height: parseInt(element.height()),
            width: parseInt(element.width())
         }
         return dimensions;
      }

      /**
       * get selected element coordinates
       */
      function getCoordinates(selected_element: any) {
         if (!selected_element) {
            return;
         }
         var childPos = $(selected_element).offset();
         var parentPos = $(selected_element).parent().offset();

         var childOffset = {
            top: parseInt(childPos.top) - (parseInt(parentPos.top) + 1),
            left: parseInt(childPos.left) - (parseInt(parentPos.left) + 1)
         }

         if (childOffset.top == 1) {
            childOffset.top = 1;
         }
         if (childOffset.left == 1) {
            childOffset.left = 1;
         }

         //NOTE: set for different draggables
         if ($(selected_element).hasClass(ConfigConstant.FLYER_ELEMENT_STILL)) {
            if (childOffset.top == ConfigConstant.ruler_padding_num) childOffset.top = 1;

            if (childOffset.left == ConfigConstant.ruler_padding_num) childOffset.left = 1;
         }
         return childOffset;
      }

      function animateUI(element: any, x: number = null, y: number = null) {
         if (!element) {
            return;
         }
         if (x == 0) x = 1;
         if (y === 0) y = 1;

         if (x != null) element.css({ 'transition': 'all 0.5s ease', 'left': x + 'px' })

         if (y != null) element.css({ 'transition': 'all 0.5s ease', 'top': y + 'px' })

         setTimeout(function () {
            element.css({ 'transition': 'none' })
         }, 600);
      }

      function animateUIDimension(element: any, w: any = null, h: any = null) {
         if (!element) {
            return;
         }
         if (w != null) element.css({ 'transition': 'all 0.5s ease', width: w + 'px' })
         if (h != null) element.css({ 'transition': 'all 0.5s ease', height: h + 'px' })

         setTimeout(function () {
            element.css({ 'transition': 'none' })
         }, 600);
      }

   }

   ngOnDestroy() { }

}



