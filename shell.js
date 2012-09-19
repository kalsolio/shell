/**
 * Webian Shell browser logic
 * http://webian.org
 *
 * Copyright @authors 2012
 *
 * @author Ben Francis http://tola.me.uk
 *
 * Webian Shell is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Webian Shell is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Webian Shell in the LICENSE file. If not, see
 * <http://www.gnu.org/licenses/>.
 */

NEW_WINDOW_URL = "http://webian.org/shell/welcome/0.1/";
DEFAULT_FAVICON = "images/no_favicon.ico";

var Shell = {

  init: function shellInit() {
    this.clock = document.getElementById('clock');
    this.homeScreen = document.getElementById('home_screen');
    this.windows = document.getElementById('windows');
    this.tabs = document.getElementById('tabs');
    this.homeButton = document.getElementById('home_button');
    this.newWindowButton = document.getElementById('new_window_button');

    window.setInterval(this.updateClock, 1000);
    this.newWindowButton.addEventListener('click', this.newWindow.bind(this));
    this.homeButton.addEventListener('click', this.showHomeScreen.bind(this));

    this.tabs.addEventListener('click', (function tabClick(evt) {
      var tab = evt.target.parentNode;
      if (!tab.classList.contains('tab'))
        return;
      this.selectWindow(tab.id.substring(4));
    }).bind(this));

    this.windows.addEventListener('click', (function windowClick(evt) {
      var target = evt.target;
      if (!target.classList.contains('close_button'))
        return;
      this.closeWindow(target.parentNode.parentNode);
    }).bind(this));

    //this.newWindow();
    this.showWindows();
  },

  updateClock: function shellUpdateClock() {
    var date = new Date(),
    hours = date.getHours() + '', // get hours as string
    minutes = date.getMinutes() + ''; // get minutes as string

    // pad with zero if needed
    if(hours.length < 2)
      hours = "0" + hours;

    // pad with zero if needed
    if(minutes.length < 2)
      minutes = "0" + minutes;

    Shell.clock.innerHTML = hours + ":" + minutes;
  },

  newWindow: function shellNewWindow() {
    var windowId = (Math.random() + "").substring(2);

    var window = this.windowTemplate.cloneNode(true);
    window.id = "window_" + windowId;
    window.classList.add("selected");

    var iframe = document.createElement('iframe');
    iframe.classList.add('window_iframe');
    iframe.id = "iframe_" + windowId;
    iframe.src = NEW_WINDOW_URL;
    window.appendChild(iframe);
    this.windows.appendChild(window);

    li = document.createElement('li');
    li.id = "tab_" + windowId;
    li.classList.add('tab');
    img = document.createElement('img');
    img.src = DEFAULT_FAVICON;
    
    li.appendChild(img);
    this.tabs.appendChild(li);

    this.selectWindow(windowId);
  },

  selectWindow: function shellSelectWindow(windowId) {
    this.showWindows();
    var selectedWindow = document.getElementsByClassName('selected window')[0];
    if (selectedWindow)
      selectedWindow.classList.remove('selected');
    var selectedTab = document.getElementsByClassName('selected tab')[0]
    if (selectedTab)
      selectedTab.classList.remove('selected');
    document.getElementById('window_' + windowId).classList.add('selected');
    document.getElementById('tab_' + windowId).classList.add('selected');
  },

  closeWindow: function shellCloseWindow(window) {
    if (window.nextSibling)
      this.selectWindow(window.nextSibling.id.substring(7));
    else if (window.previousSibling.classList &&
      window.previousSibling.id != 'window_template')
      this.selectWindow(window.previousSibling.id.substring(7));
    else
      this.showHomeScreen();
    this.windows.removeChild(window);
    var tab = document.getElementById('tab_' + window.id.substring(7));
    this.tabs.removeChild(tab);
  },

  showWindows: function shellShowWindows() {
    this.homeScreen.classList.remove('active');
    this.windows.classList.add('active');
    this.homeButton.classList.add('active');
  },

  showHomeScreen: function shellShowHomeScreen() {
    var selectedWindow = document.getElementsByClassName('selected window')[0];
    if (selectedWindow)
      selectedWindow.classList.remove('selected');
    var selectedTab = document.getElementsByClassName('selected tab')[0]
    if (selectedTab)
      selectedTab.classList.remove('selected');
    this.windows.classList.remove('active');
    this.homeButton.classList.remove('active');
    this.homeScreen.classList.add('active');
  }

};

window.addEventListener('load', function shellOnLoad(evt) {
  window.removeEventListener('load', shellOnLoad);
  Shell.init();
});


