(function(){
  var tabTemplate = _.template($('#tabTemplate').html()),
  tabContentTemplate = _.template($('#tabContent').html()),
  jTabContents = $('.tab-content'),
  jTabs = $(".nav-tabs"),

  updateListOfTabs = function (tabId, tabInfo, remove){

  },

  addTab = function(){
    var tabId = _.uniqueId('tab');
    $(this).closest('li').before(tabTemplate({tabId: tabId}));
    jTabContents.append(tabContentTemplate({tabId: tabId}));
    $('.nav-tabs [href="#'+tabId+'"]').click();
  },

  removeTab = function(jRemove){
    var jAnchor = jRemove.closest('a');
    $(jAnchor.attr('href')).remove();
    jRemove.closest('.nav-item').remove();
    $(".nav-tabs li").children('a').first().click();
  },

  initActionHandler = function() {
    $('[data-action="addTab"]').on('click', addTab);
    jTabs.on('click', '[data-action="removeTab"]', function(e){
      e.preventDefault();
      e.stopPropagation();
      removeTab($(e.target));
    });
  }

  function init() {
    initActionHandler();
  }

  init();
})();
