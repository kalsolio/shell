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

var Shell = {

  NEW_WINDOW_URL: "http://webian.org/shell/welcome/0.1/",
  DEFAULT_FAVICON: "images/no_favicon.ico",
  windows: [],
  currentWindow: 0,
  windowCount: 0,

  /**
   * Init
   *
   * Initialises shell by setting references to all elements, adding event
   * listeners, setting up the clock and creating the first window.
   */
  init: function shell_init() {
    this.clock = document.getElementById('clock');
    this.homeScreen = document.getElementById('home_screen');
    this.frames = document.getElementById('frames');
    this.windowToolbar = document.getElementById('window_toolbar');
    this.closeButton = document.getElementById('close_button');
    this.tabs = document.getElementById('tabs');
    this.homeButton = document.getElementById('home_button');
    this.newWindowButton = document.getElementById('new_window_button');

    window.setInterval(this.updateClock, 1000);
    this.newWindowButton.addEventListener('click', this.newWindow.bind(this));
    this.homeButton.addEventListener('click', this.showHomescreen.bind(this));
    this.closeButton.addEventListener('click', this.closeWindow.bind(this));

    this.newWindow();
    this.showFrames();
    this.updateClock();
  },

  /**
   * Update Clock
   */
  updateClock: function shell_updateClock() {
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

  /**
   *  New Window
   */
  newWindow: function shell_newWindow() {
    // Create window
    var windowId = this.windowCount++;
    var frame = document.createElement('iframe');
    frame.classList.add('frame');
    frame.src = this.NEW_WINDOW_URL;
    this.frames.appendChild(frame);

    // Create corresponding tab
    var tab = document.createElement('li');
    tab.classList.add('tab');
    var icon = document.createElement('img');
    icon.src = this.DEFAULT_FAVICON;
    tab.appendChild(icon);
    this.tabs.appendChild(tab);

    var windowListEntry = {
      frame: frame,
      tab: tab,
    };

    this.windows[windowId] = windowListEntry;
    this.selectWindow(windowId);
  },

  /**
   * Select Window
   * 
   * @param {number} ID of window to select.
   */
  selectWindow: function shell_selectWindow(windowId) {
    this.windows[this.currentWindow].frame.classList.remove('selected');
    this.windows[this.currentWindow].tab.classList.remove('selected');
    this.windows[windowId].frame.classList.add('selected');
    this.windows[windowId].tab.classList.add('selected');
    this.currentWindow = windowId;
  },


  /**
   * Close Window
   */
  closeWindow: function shell_closeWindow() {
    if (!this.currentWindow)
      return;
    this.frames.removeChild(this.windows[this.currentWindow].frame);
    this.tabs.removeChild(this.windows[this.currentWindow].tab);

    // Delete the window
    //this.windows.splice(this.currentWindow, 1);

    //if (this.windows.length == 0) {
    //  this.showHomescreen();
    //  return;
    //}

    //var windowIds = Object.keys(this.windows);
    //var currentWindowIndex = windowIds.indexOf(this.currentWindow);
    //var newCurrentWindow = currentWindowIndex - 1;
  },

  /**
   * Show Frames
   *
   * Hide the homescreen and show window frames.
   */
  showFrames: function shell_showFrames() {
    this.homeScreen.classList.remove('active');
    this.windowToolbar.classList.add('active');
    this.frames.classList.add('active');
    this.homeButton.classList.add('active');
  },

  /**
   * Show Homescreen
   *
   * Hide window frames and show homescreen
   */
  showHomescreen: function shell_showHomescreen() {
    this.frames.classList.remove('active');
    this.windowToolbar.classList.remove('active');
    this.homeButton.classList.remove('active');
    this.homeScreen.classList.add('active');
  }

};

window.addEventListener('load', function shell_onLoad(evt) {
  window.removeEventListener('load', shell_onLoad);
  Shell.init();
});


