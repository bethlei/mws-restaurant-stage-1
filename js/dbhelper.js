const dbPromise = idb.open('restaurantDb', 2 , function(upgradeDB) {
  switch(upgradeDB.oldVersion) {
    case 0:
      upgradeDB.createObjectStore('restaurantStore', {keyPath : 'id'})
    case 1:
      const store = upgradeDB.createObjectStore('reviewStore', {keyPath : 'id'})
      store.createIndex('restaurant_id', 'restaurant_id')
  }
})

function saveRestaurants(restaurant, data) {
  return dbPromise
    .then(db => {
      const tx = db.transaction(restaurant, 'readwrite')
      const store = tx.objectStore(restaurant)
      store.put(data)
      return tx.complete
    })
}

function saveReviews(review, data) {
  return dbPromise
    .then(db => {
      const tx = db.transaction(review, 'readwrite')
      const store = tx.objectStore(review)
      store.put(data)
      return tx.complete
    })
}

/**
 * Common database helper functions.
 */
class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337 // Change this to your server port
    return `http://localhost:${port}/restaurants`
  }

  static get DATABASE_REVIEWS_URL() {
    const port = 1337 // Change this to your server port
    return `http://localhost:${port}/reviews`
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    return dbPromise.then(db => {
      const tx = db.transaction('restaurantStore','readonly')
      const store = tx.objectStore('restaurantStore')
      return store.getAll()
    }).then(restaurants => {
      if(restaurants && restaurants.length) {
        console.log('Data fetched from IndexedDB')
        return Promise.resolve(restaurants)
      } else {
        console.log('Data fetched from Node server')
        return fetch(DBHelper.DATABASE_URL).then(response => {
          return response.json()
        }).then(restaurants => {
            for (let key in restaurants) {
              saveRestaurants('restaurantStore', restaurants[key])
            }
            return restaurants
          })
      }
    })
    .then(restaurants => {
      callback(null, restaurants)
    })
    .catch(err => {
      callback(`Fetch Error ${err}`, null) 
    })
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id)
        if (restaurant) { // Got the restaurant
          callback(null, restaurant)
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null)
        }
      }
    })
  }

  /**
   * Fetch all reviews for a restaurant
   */
  static fetchRestaurantReviewsById(id, callback) {
    // fetch all reviews for a restaurant
    return dbPromise.then(db => {
      const tx = db.transaction('reviewStore', 'readonly')
      const store = tx.objectStore('reviewStore')
      const restaurantIndex = store.index('restaurant_id')
      return restaurantIndex.getAll(id)
    }).then(reviews => {
      if(reviews && reviews.length) {
        console.log('Reviews fetched from IndexedDB')
        return Promise.resolve(reviews)
      } else {
        console.log('Reviews fetched from Node server')
        const fetchUrl = DBHelper.DATABASE_REVIEWS_URL + "/?restaurant_id=" + id
        return fetch(fetchUrl).then(response => {
          return response.json()
        }).then(reviews => {
            for (let key in reviews) {
              saveReviews('reviewStore', reviews[key])
            }
            return reviews
          })
      }
    })
    .then(reviews => {
      callback(null, reviews)
    })
    .catch(err => {
      callback(`Fetch Error ${err}`, null) 
    })
  }

  /**
   * Update favorite restaurant toggle
   */
  static updateRestaurantFavoriteById(id, favoriteState) {
    const isFavorite = !favoriteState
    const FaveUpdateUrl = DBHelper.DATABASE_URL + "/" + id + "/?is_favorite=" + isFavorite
    return fetch(FaveUpdateUrl, { method: 'PUT' }).then(response => response.json()).then(restaurant => {
      dbPromise.then(db => {
        const tx = db.transaction('restaurantStore', 'readwrite')
        const store = tx.objectStore('restaurantStore')
        store.put(restaurant)
      })
    })
  }

  /**
   * Add a review to a restaurant
   */
  static addReview(data) {
    const reviewUrl = DBHelper.DATABASE_REVIEWS_URL
    return fetch(reviewUrl, { 
      method: 'POST',
      body: JSON.stringify(data)
    }).then(response =>
      response.json()
      ).then(review => {
        dbPromise.then(db => {
        const tx = db.transaction('reviewStore', 'readwrite')
        const store = tx.objectStore('reviewStore')
        store.put(review)
      })
      DBHelper.fetchRestaurantReviewsById(review.restaurant_id, fillReviewsHTML)
    })
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null)
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine)
        callback(null, results)
      }
    })
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null)
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood)
        callback(null, results)
      }
    })
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null)
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine)
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood)
        }
        callback(null, results)
      }
    })
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null)
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods)
      }
    })
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null)
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines)
      }
    })
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`)
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant, type) {
    if (!restaurant.photograph) {
      return (`/img/undefined`);
    }

    return (`/img/${type}/${restaurant.photograph}`)
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    )
    return marker
  }
}
