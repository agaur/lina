(function(){
  var tabTemplate = _.template($('#tabTemplate').html()),
  tabContentTemplate = _.template($('#tabContent').html()),
  jTabContents = $('.tab-content'),
  jTabs = $(".nav-tabs"),
  jModal = $('#libraryModal'),
  StorageManager,
  TabController;

  //StorageManager
  StorageManager = function (){}
  StorageManager.prototype = {
    init: function(key, initialVal){
      this.key = key;
      if(!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(initialVal || {}));
      }
    },
    reset: function() {
      localStorage.removeItem(this.key);
      this.init();
    },
    get: function() {
      return JSON.parse(localStorage.getItem(this.key));
    },
    set: function(updatedObj) {
      localStorage.setItem(this.key, JSON.stringify(updatedObj));
    },
    add: function(id, val){
      var storedItems = this.get();
      storedItems[id] = val;
      this.set(storedItems);
    },
    remove: function(id) {
      var storedItems = this.get();
      delete storedItems[id];
      this.set(storedItems);
    }
  }


  // TabController
  TabController = function () {};
  TabController.prototype = {

    addTab: function(options){
      var tabId = (options || {}).id || _.uniqueId('tab');

      $('.nav-item:last').after(tabTemplate({tabId: tabId}));
      jTabContents.append(tabContentTemplate({tabId: tabId}));
      $('.nav-tabs [href="#'+tabId+'"]').click();

      this.storageManager.add(tabId, {id: tabId});
    },

    removeTab: function(jRemove){
      var jAnchor = jRemove.closest('a'),
      jContentTab =   $(jAnchor.attr('href')),
      id = jContentTab.attr('id');

      jContentTab.remove();
      jRemove.closest('.nav-item').remove();
      $(".nav-tabs li").children('a').first().click();

      this.storageManager.remove(id);
    },

    initEvents: function () {
      var that = this;

      $('[data-action="addTab"]').on('click', function(e) {
        that.addTab($(e.target));
      });
      jTabs.on('click', '[data-action="removeTab"]', function(e){
        e.preventDefault();
        e.stopPropagation();
        that.removeTab($(e.target));
      });

      $('body').on('click', '[data-action="openLibrary"]', function() {
          //This ideally should be done by global notification because library is not part of tabs
          location.hash = "#library";
      });
    },

    loadTabs: function() {
      var that = this,
      tabs = _.toArray(that.storageManager.get()),
      noOfTabs = tabs.length;
      if(noOfTabs) {
        $.notify({
            message: 'You have ' + noOfTabs + ' unsaved searches. Please refer to the <a class="link" data-action="openLibrary">Library Page</a> for more info.'
        });
      }
    },

    init: function(options) {
      var that = this,
      storageManager;

      that.storageManager = storageManager = new StorageManager();
      storageManager.init('unsavedTabs');

      that.initEvents();
      that.loadTabs();
    }
  }

  function locationHashChanged() {
      if(location.hash === "#library"){
        jModal.modal( 'show' );
      } else {
        jModal.modal( 'hide' );
      }
  }

  function initRouterEvents() {
    window.onhashchange = locationHashChanged;
    locationHashChanged();
    jModal.on('hide.bs.modal', function() {
      location.hash = '';
    });
  }

  function init() {
    var tabController = new TabController();
    tabController.init();
    initRouterEvents();
  }

  init();
})();
