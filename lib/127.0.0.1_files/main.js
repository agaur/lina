(function(){
  var tabTemplate = _.template($('#tabTemplate').html()),
  tabContentTemplate = _.template($('#tabContent').html()),
  jTabContents = $('.tab-content');


  function initActionHandler() {
    $('[data-action="addTab"]').on('click', function(e){

      var tabId = _.uniqueId('tab');
      $(this).closest('li').before(tabTemplate({tabId: tabId}));
      jTabContents.append(tabContentTemplate({tabId: tabId}));
      $('.nav-tabs [href="#'+tabId+'"]').click();

    });
  }

  function init() {
    initActionHandler();
  }

  init();
})();
