app.factory('Records', function () {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var items = [];
  var id;

  return {
    all: function () {
      return items;
    },
    remove: function (id) {
      items.splice(items.indexOf(id), 1);
    },
    get: function (recordId) {
      for (var i = 0; i < items.length; i++) {
        if (items[i].id === parseInt(recordId)) {
          return items[i];
        }
      }
      return null;
    },
    push: function (value) {
      items.push(value);
    },
    setId: function (id_){
      id = id_;
    },
    getId : function(){
      return id;
    },
    clear : function(){
      items = [];
    }
  };
});

app.factory('RealTime', function () {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var items = {};
  var id;

  return {
    all: function () {
      return items;
    },
    setId: function (id_){
      id = id_;
    },
    get: function (recordId) {
      return items[recordId];
    },
    getId : function(){
      return id;
    },
    clear : function(){
      items = {};
    },
    update : function(value){
      items = Object.assign({},value);
    }
  };
});