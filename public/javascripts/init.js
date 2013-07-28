require(['knockout-2.3.0', 'appViewModel', 'domReady!'], function(ko, appViewModel) {
  ko.applyBindings(new appViewModel());
});