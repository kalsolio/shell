/**
 * Shell database.
 *
 * Used for storing places, visits, icons and bookmarks.
 *
 * Copyright Ben Francis 2013
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
var DB = {
    
    DB_VERSION: 1,
    DB_NAME: 'db',
    db: null,
    upgradeFrom: -1,
    
   /**
   * Initialise database.
   *
   * @param function callback Function to call once initialisation is complete.
   */   
    init: function db_init(callback) {
        this.db.open(callback);
    },

   /**
   * Open database.
   *
   * Create database and populate default data on first run.
   *
   * @param function callback Function to call once opening is complete.
   */       
    open: function db_open(callback) {
      var request = window.indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onupgradeneeded = (function db_onupgradeneeded(e) {
        console.log('Upgrading Shell database.');
        this.upgradeFrom = e.oldVersion;
        this.db = e.target.result;
        this.upgrade();
      }).bind(this);
      
      request.onsuccess = (function db_onsuccess(e) {
        this.db = e.target.result;
        callback();
        if (this.upgradeFrom != -1)
          this.populate();
      }).bind(this);
    },
    
   /**
   * Upgrade database.
   *
   * Create object stores and populate default data on first run.
   */         
    upgrade: function db_upgrade() {
      if(this.upgradeFrom < 1) {
        var placesStore = db.createObjectStore('places', { keyPath: 'uri' });
        // Index places by frecency
        placesStore.createIndex('frecency', 'frecency', { unique: false });
        var visitStore = db.createObjectStore('visits', { autoIncrement: true });
        // Index visits by timestamp
        visitStore.createIndex('timestamp', 'timestamp', { unique: false });
        db.createObjectStore('icons', { keyPath: 'uri' });
        var bookmarkStore = db.createObjectStore('bookmarks', { keyPath: 'uri' });
        // Index bookmarks by timestamp
        bookmarkStore.createIndex('timestamp', 'timestamp', { unique: false });        
      }
    },

   /**
   * Populate default data.
   *
   * @param function callback Function to call once opening is complete.
   */     
    populate: function db_populate() {
      console.log('Populating Shell database.');
    }
}