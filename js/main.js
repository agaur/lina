(function(){
  var tabTemplate = _.template($('#tabTemplate').html()),
  tabContentTemplate = _.template($('#tabContent').html()),
  jTabContents = $('.tab-content'),
  jTabs = $(".nav-tabs"),
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
    },

    loadTabs: function() {
      var that = this,
      tabs = that.storageManager.get();

      _.forEach(tabs, function(obj) {
        that.addTab(obj);
      });
      
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

  function init() {
    var tabController = new TabController();
    tabController.init();
  }

  init();
})();
