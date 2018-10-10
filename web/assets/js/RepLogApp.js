(function(window, $) {
    'use strict';

    window.RepLogApp =  function ($wrapper) {
        this.$wrapper = $wrapper;
        this.helper = new Helper($wrapper);

        this.$wrapper.on(
            'click',
            '.js-delete-rep-log',
            this.handleRepLogDelete.bind(this)
        );

        this.$wrapper.on(
            'click',
            'tbody tr',
            this.handleRowClick.bind(this)
        );

        this.$wrapper.on(
            'submit',
            this._selectors.newRepForm,
            this.handleNewFormSubmit.bind(this)
        );
    };

    $.extend(window.RepLogApp.prototype, {

        _selectors: {
            newRepForm: '.js-new-rep-log-form'
        },

        updateTotalWeightLifter: function () {
            this.$wrapper.find('.js-total-weight').html(
                this.helper.calculateTotalWeight()
            );
        },

        handleRepLogDelete: function (e) {
            e.preventDefault();
            var $link = $(e.currentTarget);

            $link.addClass('text-danger');
            $link.find('.fa')
                .removeClass('fa-trash')
                .addClass('fa-spinner')
                .addClass('fa-spin');

            var deleteUrl = $link.data('url');
            var $row = $link.closest('tr');
            var self = this;

            $.ajax({
                url: deleteUrl,
                method: 'DELETE',
                success: function () {
                    $row.fadeOut('normal', function () {
                        $(this).remove();
                        self.updateTotalWeightLifter();
                    });
                }
            });
        },

        handleRowClick: function () {
            console.log('row clicked')
        },

        handleNewFormSubmit: function (e) {
            e.preventDefault();
            var $form = $(e.currentTarget);
            var formData = {};
            $.each($form.serializeArray(), function (key, fieldData) {
               formData[fieldData.name] = fieldData.value;
            });

            var self = this;
            $.ajax({
                url: $form.data('url'),
                method: 'POST',
                data: JSON.stringify(formData),
                success: function(data) {
                    //todo
                    console.log('success');
                },
                error: function (jqXHR) {
                    //todo
                    var errorData = JSON.parse(jqXHR.responseText);
                    self._mapErrorDataForForm(errorData.errors);
                }
            });
        },
        
        _mapErrorDataForForm: function (errorData) {
            var $form = this.$wrapper.find(this._selectors.newRepForm);
            $form.find('.js-field-error').remove();
            $form.find('.form-group').removeClass('has-error');

            $form.find(':input').each(function () {
               var fieldName = $(this).attr('name');
               var $wrapper = $(this).closest('.form-group');

               if(!errorData)
               {
                   return;
               }
               var $error = $('<span clas="js-field-error help-block"></span>');
               $error.html(errorData[fieldName]);
               $wrapper.append($error);
               $wrapper.addClass('has-error');
            });
        }
    });


   /**
    * a "private"
    */
   var Helper = function ($wrapper) {
       this.$wrapper = $wrapper;
   };

   $.extend(Helper.prototype, {
       calculateTotalWeight: function () {
           var totalWeight = 0;
           this.$wrapper.find('tbody tr').each(function () {
               totalWeight += $(this).data('weight');
           });

           return totalWeight;
       }
   });

})(window, jQuery);